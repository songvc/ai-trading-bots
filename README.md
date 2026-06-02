# ai-trading-bots

Here is a complete, production-ready README.md file tailored for an AI-Trading Bot system. It implements a decoupled architecture utilizing a React frontend, a GraphQL API layer, an Model Context Protocol (MCP) Server for executing actions, and an MCP Client for orchestrating the AI agent logic.
# AI-Trading Bot with React, GraphQL, and Robinhood MCP

An autonomous, AI-driven trading assistant and dashboard built on top of the Model Context Protocol (MCP). This system decouples the AI Agent orchestrator from execution environments, utilizing a React frontend for data visualization, a GraphQL layer for real-time state streaming, and an MCP architecture to securely interact with the Robinhood API for portfolio monitoring and algorithmic trade execution.
## Architecture Overview

The system is separated into four core layers designed to provide asynchronous, safe, and highly observable algorithmic trading:

┌────────────────────────────────────────────────────────┐
│                   React Frontend                       │
│  (Real-time Dashboard, Charts, Trade Confirmation)    │
└───────────────────────────┬────────────────────────────┘
                            │  GraphQL (Queries/Mutations & WebSockets)
                            ▼
┌────────────────────────────────────────────────────────┐
│               GraphQL Gateway API Server               │
│     (State persistence, User auth, Session Cache)      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   MCP Client Wrapper                   │
│ (LLM Orchestration, Strategy Logic, Context Assembly)  │
└───────────────────────────┬────────────────────────────┘
                            │  MCP Protocol (JSON-RPC over stdio/SSE)
                            ▼
┌────────────────────────────────────────────────────────┐
│             Robinhood MCP Execution Server             │
│   (Stateful Execution, MFA Handling, API Protections) │
└────────────────────────────────────────────────────────┘

    React Frontend: A componentized, responsive dashboard utilizing TailwindCSS and Recharts to view portfolio performance, token balances, and live trade signals emitted by the bot.

    GraphQL Gateway: An Apollo Server instance that acts as the data broker. It handles client subscriptions for execution streams and pipes mutations down to the MCP ecosystem.

    MCP Client: The core cognitive engine (e.g., powered by Claude/Gemini via an LLM Orchestration SDK) that processes financial market data, reads strategy rules, and constructs tools requests.

    Robinhood MCP Server: A specialized execution server using tools like fastmcp or robinhood-for-agents to securely perform actions (fetching positions, streaming option chains, executing equity orders).

## Core Features

    Decoupled Intelligence: The AI agent logic remains entirely isolated from raw API credentials via standardized MCP tool structures.

    Real-time Streaming: Subscriptions via GraphQL WebSockets for live portfolio valuations, position changes, and agent reasoning logs.

    Secure Authentication: Native integration with Robinhood's multi-factor authentication (MFA/TOTP) handled statefully by the MCP Server layer.

    Safety Guardrails: Restricted endpoints by design (e.g., automated blocking of outbound wire transfers or accidental bulk-option liquidations).

## Tech Stack

    Frontend: React 19, TypeScript, Apollo Client, TailwindCSS, Recharts

    API Gateway: Node.js, GraphQL (Apollo Server), GraphQL Subscriptions

    AI Engine (MCP Client): TypeScript/Python MCP SDK, OpenAI/Anthropic/Gemini SDKs

    Execution (MCP Server): Python (fastmcp + robin_stocks) or Bun (robinhood-for-agents via Playwright token interception)

