# EscrowGuild

Turn every transaction into a smart contract – AI-verified escrows for anything digital, powered by Arbitrum.

EscrowGuild allows users to create trust-minimized, automated escrow contracts using Ethereum on Arbitrum. Users can escrow ETH and ERC20 tokens against verifiable actions—like domain leasing, game key rentals, micro-loans, or API metering—using off-chain verification by AI agents.

🚀 Features
🔐 Native ETH & ERC20 escrows on Arbitrum
🤖 AI agents (LangGraph) verify off-chain outcomes via API & browser automation
🧠 JSON-based contract templates (e.g. SaaS usage, game-key loans, bounty splits)
💰 Micro-escrows starting from 0.001 ETH
📸 Verifiable data proofing (screenshots, signed CID uploads)
📊 Live dashboard with escrow vault statuses
🧩 Extendable verifier nodes (one per use case)

📦 Installation

Clone the repo
```bash
git clone https://github.com/your-username/escrowguild.git
cd escrowguild
```

Install dependencies
```bash
yarn
```

Configure environment variables
Create a .env file in the root directory with the following content:
```
NEXTAUTH_SECRET=''
NEXT_PUBLIC_PROJECT_ID=''
NEXT_PUBLIC_GROQ_API_KEY=""
TOGETHER_AI_API_KEY=''
```

🧠 You can obtain your WalletConnect PROJECT_ID by visiting https://cloud.walletconnect.com

Start the dev server
```bash
yarn dev
```

🧪 How It Works

EscrowGuild converts natural-language agreements into verifiable smart contracts, in six steps:

1. **Chat → JSON Terms** - LangGraph parses conversation into JSON escrow specs.
2. **Deploy Vault on Arbitrum** - EscrowFactory.sol emits on-chain contract, hashing the JSON terms.
3. **Event Listener → Verifier Node** - A verifier (e.g. headless browser/API module) fetches off-chain data for resolution.
4. **Oracle Data Pinned & Signed** - Data (numeric or screenshot) is uploaded to IPFS and signed by the verifier.
5. **AI Agent Executes Contract** - Based on rules, funds are released, partially refunded, or default to timeout logic.
6. **Dashboard & Logs** - React front-end shows vault states streamed via blockchain events.

🌐 Escrow Use Cases

| Template | Asset | Verification Method |
|----------|-------|--------------------|
| Game-key rental | Steam licence | Headless login checks |
| Domain weekend lease | DNS record | Cloudflare API + screenshot |
| SaaS pay-as-you-go | API quota | Meter polling endpoint |
| Gift-card flip | Retail code | Balance API + browser screenshot |
| Influencer bounty | Social metrics | X/TikTok API |
| Micro-loan | ETH vs USDT | Price feed LTV checks |
| Hackathon prize split | Submission proofs | GitHub API |
| Sports bet | Game score | Pull oracle |
| Licence rental | Software entitlement | RDP scrape |

🔮 Vision: Escrows for the Real World

Ethereum holders today mostly store wealth—but EscrowGuild lets them use ETH:

- Use unused ETH as collateral in micro-loans
- Lock ETH as temporary deposits for service usage
- Create dynamic pay-per-use agreements for digital subscriptions
- Participate in global P2P rentals and trades without relying on trust

With LangGraph, every verifier is just another node. Each new use case = a 200-line AI agent + 1 transaction. Simple. Modular. Scalable.

🛠️ Tech Stack

- **Next.js + Tailwind CSS** – Front-end UI
- **LangGraph + Groq** – AI agent logic & task routing
- **IPFS** – Oracle feeds & data storage
- **Arbitrum + Safe Wallet** – Ethereum L2 contracts
- **WalletConnect** – User auth & wallet interactions

📅 Next Milestones

- **Template UI Generator** – auto-build escrow specs
- **Risk Engine** – fraud/anomaly detection
- **Insurance Pool** – optional ETH fund safety net
- **Group Vaults** – community escrows with yield split
- **Privacy Mode** – Zero-knowledge commitments for blind bids

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## AI Models

EscrowGuild utilizes advanced AI models:

- **Llama-3.3-70b-versatile**: A powerful model used for smart contract generation and user interactions.
- **ChatGroq**: Efficient processing for query handling and contract customization.

These models ensure fast and reliable performance for all escrow operations.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Arbitrum](https://arbitrum.io/) - explore Arbitrum's Layer 2 scaling solution.

## Contributing

We welcome contributions! Please see our [Contribution Guidelines](CONTRIBUTING.md) for more information on how to get involved.
