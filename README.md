# Escrow

**Turn every transaction into a smart contract** – AI-verified Escrows for anything digital, powered by Arbitrum.

Escrow allows users to create trust-minimized, automated Escrow contracts using Ethereum on Arbitrum. Users can Escrow ETH and ERC20 tokens against verifiable actions—like domain leasing, game key rentals, micro-loans, or API metering—using off-chain verification by AI agents.

---

## 🚀 Features

- **🔐 Native ETH & ERC20 Escrows** - Secure transactions on Arbitrum Sepolia
- **🤖 AI-Powered Contract Generation** - Dobby AI model generates custom Escrow contracts from natural language
- **🧠 5 Pre-Built Templates** - ETH↔ERC20, ETH↔NFT, NFT↔ERC20, NFT↔NFT, ERC20↔ERC20
- **💰 Micro-Escrows** - Starting from 0.001 ETH
- **📊 Live Dashboard** - Real-time Escrow vault status tracking
- **🔗 Smart Contract Deployment** - One-click deployment to Arbitrum Sepolia
- **🛡️ Security Audits** - Integrated SolidityScan security analysis
- **🎨 Modern UI** - Clean, responsive interface with WalletConnect integration

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│              (Next.js + TailwindCSS)                     │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                 AI Agent Layer                           │
│         (LangGraph + Fireworks Dobby Model)             │
│  ┌──────────────┬──────────────┬──────────────────┐    │
│  │ Initial Node │ Escrow Node  │ Contribute Node  │    │
│  │  (Router)    │  (Generator) │   (Feedback)     │    │
│  └──────────────┴──────────────┴──────────────────┘    │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│            Smart Contract Layer                          │
│         (Solidity 0.8.27 + OpenZeppelin)               │
│  ┌──────────────────────────────────────────────────┐  │
│  │ • ETH2ERC20Escrow  • NFT2NFTEscrow              │  │
│  │ • ETH2NFTEscrow    • ERC20ToERC20Escrow         │  │
│  │ • NFT20Escrow                                    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                Arbitrum Sepolia                          │
│         (L2 Blockchain Infrastructure)                   │
└──────────────────────────────────────────────────────────┘
```

---

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- Yarn or npm
- MetaMask or compatible Web3 wallet
- Arbitrum Sepolia testnet ETH ([Get testnet ETH](https://faucet.quicknode.com/arbitrum/sepolia))

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/MAYANK-MAHAUR/escrow.git
   cd escrow
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # NextAuth Secret (generate with: openssl rand -base64 32)
   NEXTAUTH_SECRET='your-secret-key-here'
   
   # WalletConnect Project ID (get from https://cloud.walletconnect.com)
   NEXT_PUBLIC_PROJECT_ID='your-project-id'
   
   # Fireworks AI API Key (for Dobby model)
   FIREWORKS_API_KEY='your-fireworks-api-key'
   ```

4. **Start the development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🧪 How It Works

Escrow converts natural-language agreements into verifiable smart contracts in six steps:

### 1. **Chat → Contract Specification**
Users describe their Escrow needs in natural language. The AI agent (powered by Dobby) analyzes the request and determines the appropriate contract type.

### 2. **AI Contract Generation**
LangGraph routing system:
- **Initial Node**: Routes user requests (Escrow creation, contributions, general queries)
- **Escrow Node**: Generates custom Solidity contracts based on templates
- **Contribute Node**: Handles user feedback and error reports

### 3. **Contract Review & Customization**
- View generated Solidity code
- See pre-deployment security scores from SolidityScan
- Customize parameters before deployment

### 4. **Deploy to Arbitrum Sepolia**
One-click deployment using Wagmi + Viem:
```typescript
const hash = await walletClient.deployContract({
  abi,
  bytecode,
  account: walletAddress,
  args: [],
});
```

### 5. **Contract Interaction**
- Deposit assets (ETH, ERC20, or NFTs)
- Execute transactions when conditions are met
- Cancel and refund if needed

### 6. **Dashboard Monitoring**
Track all Escrow contracts with:
- Real-time status updates
- Asset balances
- Transaction history
- Security audit reports

---

## 🌐 Escrow Use Cases

| Template | Asset Types | Example Use Case |
|----------|-------------|------------------|
| **ETH ↔ ERC20** | ETH + Tokens | Swap ETH for USDC in a trustless manner |
| **ETH ↔ NFT** | ETH + NFT | Purchase unique digital art with ETH |
| **NFT ↔ ERC20** | NFT + Tokens | Trade NFT for stablecoin payment |
| **NFT ↔ NFT** | NFT + NFT | Swap collectibles between collectors |
| **ERC20 ↔ ERC20** | Token + Token | Exchange DAI for USDT peer-to-peer |

### Real-World Applications
- **Game-Key Rentals**: Temporary access to gaming licenses
- **Domain Leasing**: Short-term control of DNS records
- **SaaS Pay-As-You-Go**: Usage-based API quota payments
- **Gift-Card Flips**: Secure retail code exchanges
- **Micro-Loans**: Collateralized ETH lending
- **NFT Swaps**: Direct peer-to-peer collectible trades

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** - Accessible component library
- **[WalletConnect](https://walletconnect.com/)** - Web3 wallet integration

### AI & Backend
- **[LangGraph](https://github.com/langchain-ai/langgraph)** - Agent orchestration framework
- **[Fireworks AI](https://fireworks.ai/)** - Dobby Mini Unhinged Plus (Llama 3.1 8B)
- **[Next-Auth](https://next-auth.js.org/)** - SIWE authentication

### Blockchain
- **[Wagmi](https://wagmi.sh/)** - React Hooks for Ethereum
- **[Viem](https://viem.sh/)** - TypeScript Ethereum library
- **[Arbitrum Sepolia](https://arbitrum.io/)** - L2 scaling solution
- **[Solidity 0.8.27](https://soliditylang.org/)** - Smart contract language
- **[OpenZeppelin](https://openzeppelin.com/)** - Secure contract libraries

### Development Tools
- **[solc](https://docs.soliditylang.org/en/latest/installing-solidity.html)** - Solidity compiler
- **[SolidityScan](https://solidityscan.com/)** - Security audit platform

---

## 📁 Project Structure

```
Escrow/
├── src/
│   ├── ai/
│   │   ├── client.tsx          # React context for AI actions
│   │   ├── server.tsx          # Server-side AI streaming
│   │   ├── graph.ts            # LangGraph state machine
│   │   ├── contractTemplate.ts # System prompts for contract generation
│   │   └── fetchbox.ts         # Contract type classification
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # SIWE authentication
│   │   │   └── compile/             # Solidity compilation endpoint
│   │   ├── agent.tsx           # Agent endpoint exports
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── page.tsx            # Main application page
│   ├── components/
│   │   ├── ui/
│   │   │   ├── ContractUI.tsx      # Contract display & deployment
│   │   │   ├── message.tsx         # Chat message components
│   │   │   ├── portfolioWallet.tsx # Wallet balance display
│   │   │   └── walletButton.tsx    # WalletConnect button
│   │   └── AgentsGuild.tsx     # Main interface component
│   ├── lib/
│   │   ├── contractCompile.ts  # Pre-compiled contract artifacts
│   │   ├── contractIndex.ts    # Contract templates library
│   │   ├── fireworks.ts        # Fireworks AI client
│   │   └── utils.ts            # Utility functions
│   └── walletConnect/
│       ├── siwe.ts             # SIWE configuration
│       └── WalletConnect.tsx   # Web3Modal provider
├── public/
│   └── guild.png               # Logo assets
├── .env.local                  # Environment variables (create this)
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## 🎯 Key Components

### AI Agent System (`src/ai/graph.ts`)

The LangGraph-based agent system with three main nodes:

```typescript
// Node 1: Initial Router
"initial_node" → Routes to Escrow_Node, contribute_node, or conversational

// Node 2: Escrow Generator
"Escrow_Node" → Generates custom Solidity contracts

// Node 3: Contribution Handler  
"contribute_node" → Saves user feedback as JSON
```

### Smart Contract Templates

All contracts include:
- ✅ **ReentrancyGuard** protection
- ✅ **Access control** modifiers
- ✅ **Event emissions** for tracking
- ✅ **Cancellation** mechanisms
- ✅ **OpenZeppelin** standards

### Deployment Flow

```typescript
// 1. Find matching template
const contract = contractsArray[closestIndex];

// 2. Deploy to Arbitrum Sepolia
const hash = await walletClient.deployContract({
  abi: contract.abi,
  bytecode: contract.bytecode,
  account: userAddress,
});

// 3. Wait for confirmation
const receipt = await publicClient.waitForTransactionReceipt({ hash });

// 4. Return contract address
return receipt.contractAddress;
```

---

## 🔒 Security Features

### Smart Contract Security
- **Reentrancy Protection**: All state-changing functions use `nonReentrant` modifier
- **Access Control**: `onlyParties` modifier restricts function access
- **Safe Transfers**: Uses OpenZeppelin's secure transfer methods
- **Execution Locks**: Prevents double-spending with `executed` flag

### SolidityScan Integration
Each deployed contract includes:
- **Security Score**: 84-87% (GREAT rating)
- **Threat Score**: 100 (Low Risk)
- **Automated Analysis**: Check for vulnerabilities
- **Quick Scan Link**: Direct access to full audit reports

### Frontend Security
- **SIWE Authentication**: Secure wallet-based login
- **CSRF Protection**: NextAuth session management
- **Input Validation**: Sanitized user inputs
- **Rate Limiting**: Protected API endpoints

---

## 🌟 Usage Examples

### Example 1: ETH ↔ USDC Swap

```typescript
// User: "I want to swap 0.1 ETH for 200 USDC with Bob"

// AI generates contract:
createEscrowOrder(
  bobAddress,           // Party B
  usdcContract,         // ERC20 token address
  200000000,            // 200 USDC (6 decimals)
  100000000000000000    // 0.1 ETH in wei
);

// Alice deposits ETH
depositETHByPartyA(orderId) { value: 0.1 ETH }

// Bob approves & deposits USDC
approve(EscrowContract, 200 USDC);
depositERC20ByPartyB(orderId);

// Either party executes
executeTransaction(orderId);
```

### Example 2: NFT ↔ NFT Trade

```typescript
// User: "Trade my Bored Ape #1234 for CryptoPunk #5678"

createEscrowOrder(
  counterpartyAddress,
  boredApeContract,
  1234,
  cryptoPunkContract,
  5678
);

// Both parties deposit NFTs
depositNFTByPartyA(orderId);
depositNFTByPartyB(orderId);

// Execute atomic swap
executeTransaction(orderId);
```

---

## 📊 API Reference

### AI Agent Endpoints

#### `POST /api/agent`
Stream AI responses for Escrow contract generation.

**Request:**
```typescript
{
  chat_history: [["human", "Hello"], ["ai", "Hi!"]],
  input: "Create ETH to USDC Escrow"
}
```

**Response:** Server-Sent Events (SSE) stream

### Contract Compilation

#### `POST /api/compile`
Compile Solidity source code.

**Request:**
```typescript
{
  sourceCode: "pragma solidity ^0.8.0; ..."
}
```

**Response:**
```typescript
{
  abi: [...],
  bytecode: "0x..."
}
```

---

## 🎨 UI Components

### Contract Display Component
- **Syntax-highlighted** Solidity code
- **Copy to clipboard** functionality
- **Deploy button** with loading states
- **Security scores** visualization
- **Blockscout** integration for verification

### Portfolio Widget
- Real-time **ETH balance** tracking
- **USD conversion** via CoinGecko API
- **Net worth** calculation
- Arbitrum Sepolia network display

### Chat Interface
- **Markdown rendering** for AI responses
- **Streaming messages** with real-time updates
- **Code blocks** with syntax highlighting
- **Wallet connection** requirement enforcement

---

## 🚦 Deployment

### Production Build

```bash
# Build for production
yarn build

# Start production server
yarn start
```

### Environment Variables (Production)

```env
# Required
NEXTAUTH_SECRET=production-secret-key
NEXT_PUBLIC_PROJECT_ID=walletconnect-prod-id
FIREWORKS_API_KEY=fireworks-prod-key

# Optional
NEXT_PUBLIC_ETH_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
```
---

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Test on Arbitrum Sepolia before submitting

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Arbitrum](https://arbitrum.io/)** - L2 scaling infrastructure
- **[Fireworks AI](https://fireworks.ai/)** - Dobby model hosting
- **[OpenZeppelin](https://openzeppelin.com/)** - Secure contract libraries
- **[WalletConnect](https://walletconnect.com/)** - Web3 wallet connectivity
- **[SolidityScan](https://solidityscan.com/)** - Security audit platform
- **[Sentient Foundation](https://sentient.foundation/)** - Dobby AI model creators
