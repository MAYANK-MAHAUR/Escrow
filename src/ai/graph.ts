import { StateGraph } from "@langchain/langgraph";
import { BaseMessage, AIMessage, HumanMessage } from "@langchain/core/messages";
import { START, END } from "@langchain/langgraph";
import { fireworksClient, FireworksMessage } from "@/lib/fireworks";
import { systemPrompt } from "./contractTemplate";
import { fetchboxPrompt } from "./fetchbox";
import { contractsArray } from "@/lib/contractCompile";
import fs from 'fs/promises';
import path from 'path';

/**
 * Dobby-powered LangChain Model Wrapper
 */
class DobbyModel {
  async invoke(input: { input?: string; chat_history?: BaseMessage[]; context?: string }) {
    const messages: FireworksMessage[] = [];
    
    // Add system message if context exists
    if (input.context) {
      messages.push({
        role: 'system',
        content: input.context
      });
    }
    
    // Add chat history
    if (input.chat_history) {
      for (const msg of input.chat_history) {
        if (msg instanceof HumanMessage) {
          messages.push({ role: 'user', content: msg.content as string });
        } else if (msg instanceof AIMessage) {
          messages.push({ role: 'assistant', content: msg.content as string });
        }
      }
    }
    
    // Add current input
    if (input.input) {
      messages.push({ role: 'user', content: input.input });
    }
    
    const response = await fireworksClient.chat(messages);
    return { content: response.choices[0].message.content };
  }
}

const model = new DobbyModel();

type guildState = {
  input: string;
  contractData?: string | null;
  chatHistory?: BaseMessage[];
  messages?: any[] | null;
  operation?: string;
  result?: string;
}

export default function nodegraph() {
  const graph = new StateGraph<guildState>({
    channels: {
      messages: { value: (x: any[], y: any[]) => x.concat(y) },
      input: { value: null },
      result: { value: null },
      contractData: { value: null },
      chatHistory: { value: null },
      operation: { value: null }
    }
  });

  // Initial Node: Routes user requests
  graph.addNode("initial_node", async (state: guildState) => {
    const SYSTEM_TEMPLATE = `You are an AI agent representing EscrowGuild, a platform specializing in secure and efficient escrow services within the Web3 ecosystem. Your task is to analyze user messages and route them to the appropriate node.

Based on the user's input, respond with ONLY ONE of the following words:
- "contribute_node" if the user wants to report errors or contribute to the project
- "escrow_Node" if the request is related to creating escrow smart contracts
- "unknown" if the request doesn't fit into any of the above categories

Respond strictly with ONLY ONE word: "contribute_node", "escrow_Node", or "unknown".`;

    const response = await model.invoke({
      context: SYSTEM_TEMPLATE,
      input: state.input,
      chat_history: state.chatHistory
    });

    console.log(response.content, "Initial Message");

    const content = response.content as string;
    const trimmedContent = content.trim().toLowerCase();
    
    if (trimmedContent.includes("contribute_node") || trimmedContent.includes("contribute")) {
      return { messages: [response.content], operation: "contribute_node" };
    } else if (trimmedContent.includes("escrow_node") || trimmedContent.includes("escrow")) {
      return { messages: [response.content], operation: "escrow_Node" };
    } else {
      // Unknown - provide conversational response
      const CONVERSATIONAL_TEMPLATE = `You are an AI assistant for Escrow, a Web3 escrow platform. 

EscrowGuild helps users create secure smart contracts for:
- ETH ↔ ERC20 token swaps
- NFT ↔ ETH/ERC20 exchanges  
- NFT ↔ NFT trades
- ERC20 ↔ ERC20 token swaps

If the user's request is unrelated, politely explain what EscrowGuild does and suggest how you can help. Keep responses concise and friendly.`;

      const conversationalResponse = await model.invoke({
        context: CONVERSATIONAL_TEMPLATE,
        input: state.input,
        chat_history: state.chatHistory
      });

      return { 
        result: conversationalResponse.content as string, 
        messages: [conversationalResponse.content],
        operation: "conversational"
      };
    }
  });

  // @ts-ignore
  graph.addEdge(START, "initial_node");
  
  // @ts-ignore
  graph.addConditionalEdges("initial_node",
    async (state) => {
      console.log("Routing decision:", { 
        operation: state.operation, 
        hasResult: !!state.result 
      });

      if (state.operation === "contribute_node") {
        console.log("→ Route to contribute_node");
        return "contribute_node";
      } else if (state.operation === "escrow_Node") {
        console.log("→ Route to escrow_node");
        return "escrow_node";
      } else {
        console.log("→ Route to END (conversational)");
        return "end";
      }
    },
    {
      contribute_node: "contribute_node",
      escrow_node: "escrow_node",
      end: END,
    }
  );

  // Contribute Node
  graph.addNode("contribute_node", async (state: guildState) => {
    console.log("📝 Processing contribution or error report");

    const CONTRIBUTE_TEMPLATE = `You are an AI assistant for EscrowGuild. Analyze the user's input and create a JSON response:

{
  "type": "error_report" or "code_contribution",
  "description": "brief summary",
  "details": "detailed information",
  "impact": "potential impact or benefit",
  "priority": "low/medium/high"
}

Be concise and structured.`;

    try {
      const response = await model.invoke({
        context: CONTRIBUTE_TEMPLATE,
        input: state.input,
        chat_history: state.chatHistory
      });

      let contributionData;
      try {
        const content = response.content as string;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        contributionData = jsonMatch ? JSON.parse(jsonMatch[0]) : {
          type: "contribution",
          description: state.input,
          details: response.content,
          impact: "User feedback",
          priority: "medium"
        };
      } catch (parseError) {
        contributionData = {
          type: "contribution",
          description: state.input,
          details: response.content as string,
          impact: "User feedback",
          priority: "medium"
        };
      }

      // Save contribution
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const fileName = `contribution_${timestamp}.json`;
      const filePath = path.join(process.cwd(), 'contributions', fileName);

      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(contributionData, null, 2));

      return { 
        result: "✅ Thank you for your contribution! Your feedback has been recorded and will be reviewed by our team.",
        messages: [response.content]
      };
    } catch (error) {
      console.error("Error in contribute_node:", error);
      return { 
        result: "✅ Your feedback has been received and will be reviewed by our team.",
        messages: ["Contribution recorded"]
      };
    }
  });

  // Escrow Node
  graph.addNode("escrow_node", async (state: guildState) => {
    console.log("🔨 Generating Escrow contract");

    // Step 1: Determine contract type
    const fetchboxResponse = await model.invoke({
      context: fetchboxPrompt,
      input: state.input
    });
    
    let index: number | string;
    let context: any;
    
    const responseContent = (fetchboxResponse.content as string).trim();
    console.log("Contract type detection:", responseContent);
    
    if (!isNaN(Number(responseContent))) {
      index = parseInt(responseContent, 10);
    } else {
      index = 0; // Default to ETH-ERC20
    }
    
    if (typeof index === 'number' && !isNaN(index) && index >= 0 && index < contractsArray.length) {
      context = contractsArray[index].contractCode;
      console.log(`Using contract template: ${contractsArray[index].name}`);
    } else {
      context = contractsArray[0].contractCode; // Fallback
      console.log("Using default contract template");
    }

    // Step 2: Generate contract
    try {
      const response = await model.invoke({
        context: systemPrompt.replace('{context}', context),
        input: state.input,
        chat_history: state.chatHistory
      });

      const content = response.content as string;
      const match = content.match(/```solidity[\s\S]*?```/);
      
      let contractData = null;
      let resultData = content;

      if (match) {
        contractData = match[0].replace(/```solidity\s?|\s?```/g, '').trim();
        resultData = content.replace(match[0], '').trim();
      }

      console.log("✅ Contract generated successfully");

      return { 
        contractData: contractData,
        result: resultData || "Contract generated successfully! Check the code block below.",
        messages: [content] 
      };
    } catch (error) {
      console.error("❌ Error in escrow_node:", error);
      return { 
        result: "I apologize, but I encountered an error generating the escrow contract. Please try again with more specific details about your requirements.", 
        messages: ["Error generating contract"]
      };
    }
  });

  // @ts-ignore    
  graph.addEdge("contribute_node", END);
  // @ts-ignore
  graph.addEdge("escrow_node", END);

  const data = graph.compile();
  return data;
}