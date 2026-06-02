import { createServer } from "node:http";
import { createYoga, createSchema } from "graphql-yoga";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Establish Stdio link targeting the built MCP server
const transport = new StdioClientTransport({
  command: "node",
  // Targets the compiled dist folder of the sister mcp-server package
  args: [path.resolve(__dirname, "../../mcp-server/dist/server.js")]
});

const mcpClient = new Client({ name: "graphql-bff-client", version: "1.0.0" });
await mcpClient.connect(transport);

// 2. Define standard GraphQL Type Definitions (Queries + Mutations)
const typeDefs = `
  type StockQuote {
    ticker: String!
    price: Float!
  }

  type TradeResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    getStockQuote(ticker: String!): StockQuote!
  }

  type Mutation {
    placeTrade(ticker: String!, quantity: Float!, side: String!): TradeResponse!
  }
`;

// 3. Implement Resolvers that bridge GraphQL to MCP Tools
const resolvers = {
  Query: {
    getStockQuote: async (_: any, { ticker }: { ticker: string }) => {
      // Call 'get_quote' tool on the spawned MCP sub-process
      const mcpResponse = await mcpClient.callTool({
        name: "get_quote",
        arguments: { ticker }
      });

      const text = mcpResponse.content[0].text;
      const priceMatch = text.match(/\$(\d+\.\d+)/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : 0.0;

      return { ticker, price };
    }
  },

  Mutation: {
    placeTrade: async (_: any, { ticker, quantity, side }: { ticker: string; quantity: number; side: string }) => {
      try {
        // Call 'execute_trade' tool on the spawned MCP sub-process
        const mcpResponse = await mcpClient.callTool({
          name: "execute_trade",
          arguments: { 
            ticker: ticker.toUpperCase(), 
            quantity, 
            side: side.toLowerCase() 
          }
        });

        // The text output returned from the MCP tool
        const confirmationText = mcpResponse.content[0].text;

        return {
          success: true,
          message: confirmationText
        };
      } catch (error: any) {
        return {
          success: false,
          message: error?.message || "Failed to execute trade via Robinhood MCP server."
        };
      }
    }
  }
};

// 4. Mount GraphQL Yoga Engine
const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers })
});

const server = createServer(yoga);
server.listen(4000, () => {
  console.log("🚀 GraphQL Gateway ready at http://localhost:4000/graphql");
});
