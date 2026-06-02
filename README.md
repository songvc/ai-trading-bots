# AI Trading Bots 🤖📈

An autonomous, AI-driven trading assistant and dashboard built on the **Model Context Protocol (MCP)**. This system decouples AI agent orchestration from trading execution, providing a secure, observable, and scalable platform for algorithmic trading via Robinhood.

> ⚠️ **Disclaimer**: This repository is for educational and research purposes only. Algorithmic trading carries substantial financial risk. Past performance does not guarantee future results. Do not risk money you cannot afford to lose.

---

## 🏗️ Architecture Overview

The system uses a **four-layer decoupled architecture** that separates concerns between intelligence, orchestration, and execution:

### Architecture Layers

| Layer | Component | Purpose |
|-------|-----------|---------|
| **Presentation** | React Dashboard (`apps/react-client`) | Real-time visualization of portfolio, positions, and trade execution |
| **API Gateway** | GraphQL BFF (`apps/graphql-bff`) | GraphQL API bridging frontend to AI execution layer |
| **Orchestration** | LLM Client (MCP) | AI-powered strategy engine, decision-making logic |
| **Execution** | Robinhood MCP Server (`apps/mcp-server`) | Secure Robinhood API integration with MFA support |

---

## ✨ Core Features

### 🔐 **Decoupled Intelligence**
- AI agent logic completely isolated from API credentials
- Uses standardized MCP tool structures for secure execution
- No direct credential exposure to LLM orchestration layer

### 🔄 **Real-Time Streaming**
- GraphQL WebSocket subscriptions for live portfolio updates
- Bidirectional communication for position changes and execution logs
- Low-latency market data integration

### 🛡️ **Security & Authentication**
- Native Robinhood MFA/TOTP support
- Stateful session management in execution layer
- Protected API endpoints with validation

### ⚡ **Safety Guardrails**
- Automated blocking of risky operations (bulk liquidations, wire transfers)
- Position size limits and risk controls
- Configurable trade execution approval workflows

### 📊 **Observable Execution**
- Detailed logging of all agent decisions
- Trade execution history with reasoning trails
- Performance metrics and analytics

---

## 🛠️ Tech Stack

### Frontend
- **React** 19.2 – Modern UI library with hooks
- **TypeScript** – Type-safe JavaScript
- **Vite** – Fast development server and build tool
- **Apollo Client** – GraphQL client with caching
- **TailwindCSS** – Utility-first CSS framework
- **Recharts** – React charting library

### Backend (GraphQL BFF)
- **Node.js** – JavaScript runtime
- **TypeScript** – Type-safe backend logic
- **Apollo Server** 5.5 – Production GraphQL server
- **GraphQL Yoga** 5.0 – GraphQL execution layer
- **MCP SDK** – Model Context Protocol integration

### Trading Execution (MCP Server)
- **Node.js** – JavaScript runtime
- **TypeScript** – Type-safe trading logic
- **Axios** – HTTP client for API calls
- **MCP SDK** – Tool definitions and execution
- **Robinhood API** – Brokerage integration

---


## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ or higher
- **npm** or **yarn**
- Robinhood account with API credentials
- (Optional) LLM API keys (Claude, Gemini, etc.)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/songvc/ai-trading-bots.git
cd ai-trading-bots

    Install dependencies

bash

npm install

    Configure environment variables

Create .env files in each app directory:

apps/mcp-server/.env:
env

ROBINHOOD_USERNAME=your_robinhood_username
ROBINHOOD_PASSWORD=your_robinhood_password
ROBINHOOD_MFA_SECRET=your_totp_secret

apps/graphql-bff/.env:
env

PORT=4000
MCP_SERVER_PATH=../mcp-server/dist/server.js

    Build the project

bash

npm run build

📖 Running the Application
Development Mode

Start all services in development with hot-reload:
bash

# Terminal 1: MCP Server
cd apps/mcp-server
npm run dev

# Terminal 2: GraphQL BFF
cd apps/graphql-bff
npm run dev

# Terminal 3: React Frontend
cd apps/react-client
npm run dev

Production Deployment
bash

# Build all apps
npm run build

# Start MCP Server
cd apps/mcp-server && npm start &

# Start GraphQL BFF (port 4000)
cd apps/graphql-bff && npm start &

# Start React Frontend
cd apps/react-client && npm start &

📡 API Usage
GraphQL Queries
GraphQL

query GetStockQuote {
  getStockQuote(ticker: "AAPL") {
    ticker
    price
  }
}

GraphQL Mutations
GraphQL

mutation PlaceTrade {
  placeTrade(
    ticker: "AAPL"
    quantity: 10
    side: "BUY"
  ) {
    success
    message
  }
}

WebSocket Subscriptions
GraphQL

subscription OnTradeExecution {
  tradeExecuted {
    ticker
    quantity
    price
    timestamp
  }
}

🧪 Testing
bash

# Unit tests
npm test

# Integration tests
npm run test:integration

# Type checking
npm run type-check

📊 Features Roadmap

    Multi-strategy support (LSTM, RL, ensemble models)
    Backtesting engine for historical validation
    Advanced technical indicators (RSI, MACD, Bollinger Bands)
    Portfolio rebalancing automation
    Risk metrics dashboard (Sharpe, Sortino ratios)
    Integration with additional brokerages (Alpaca, Interactive Brokers)
    Machine learning model inference layer
    Mobile app support

🤝 Contributing

Contributions are welcome! Please:

    Fork the repository
    Create a feature branch (git checkout -b feature/AmazingFeature)
    Commit changes (git commit -m 'Add AmazingFeature')
    Push to branch (git push origin feature/AmazingFeature)
    Open a Pull Request

📝 License

This project is licensed under the MIT License – see the LICENSE file for details.
⚖️ Legal Notice

Educational Use Only: This software is provided for educational and research purposes. The developers are not responsible for:

    Financial losses from trading decisions
    Data breaches or security incidents
    Violations of brokerage terms of service

Always use paper trading to test strategies before deploying with real capital.
📞 Support & Contact

    Issues: GitHub Issues
    Discussions: GitHub Discussions
    Author: @songvc

🙏 Acknowledgments

    Model Context Protocol (MCP) – For the standardized tool framework
    Robinhood for Agents – Inspiration for MCP integration
    React, GraphQL, and Node.js communities

Last Updated: June 2, 2026

Made with ❤️ by @songvc
