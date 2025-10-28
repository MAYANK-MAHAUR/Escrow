

const FIREWORKS_API_URL = 'https://api.fireworks.ai/inference/v1/chat/completions';
const DOBBY_MODEL = 'accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new';

export interface FireworksMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface FireworksResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class FireworksClient {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.FIREWORKS_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('FIREWORKS_API_KEY is required');
    }
  }

  async chat(
    messages: FireworksMessage[],
    options?: {
      temperature?: number;
      max_tokens?: number;
      top_p?: number;
    }
  ): Promise<FireworksResponse> {
    try {
      const response = await fetch(FIREWORKS_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: DOBBY_MODEL,
          messages,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.max_tokens ?? 3000,
          top_p: options?.top_p ?? 0.95,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Fireworks API error: ${response.status} - ${error}`);
      }

      return response.json();
    } catch (error) {
      console.error('Fireworks API error:', error);
      throw error;
    }
  }

  async invoke(messages: FireworksMessage[]): Promise<{ content: string }> {
    const response = await this.chat(messages);
    return { content: response.choices[0].message.content };
  }
}

// Export singleton instance
export const fireworksClient = new FireworksClient();