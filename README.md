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
