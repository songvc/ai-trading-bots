import { getMcpClient, extractTextFromMcpResponse, type McpResponse } from "./mcp-client.js";

export const resolvers = {
  Query: {
    getStockQuote: async (_: any, { ticker }: { ticker: string }) => {
      try {
        const mcpClient = await getMcpClient();
        const mcpResponse = await mcpClient.callTool({
          name: "get_quote",
          arguments: { ticker }
        });

        const text = extractTextFromMcpResponse(mcpResponse as McpResponse);
        const priceMatch = text.match(/\$(\d+\.\d+)/);
        const price = priceMatch ? parseFloat(priceMatch[1]) : 0.0;

        return { ticker, price };
      } catch (error: any) {
        console.error(`Error fetching quote for ${ticker}:`, error.message);
        throw new Error(`Failed to fetch quote for ${ticker}`);
      }
    }
  },

  Mutation: {
    placeTrade: async (
      _: any,
      { ticker, quantity, side }: { ticker: string; quantity: number; side: string }
    ) => {
      try {
        const mcpClient = await getMcpClient();
        const mcpResponse = await mcpClient.callTool({
          name: "execute_trade",
          arguments: {
            ticker: ticker.toUpperCase(),
            quantity,
            side: side.toLowerCase()
          }
        });

        const confirmationText = extractTextFromMcpResponse(mcpResponse as McpResponse);
        return {
          success: true,
          message: confirmationText
        };
      } catch (error: any) {
        console.error(`Error executing trade for ${ticker}:`, error.message);
        return {
          success: false,
          message: error?.message || "Failed to execute trade via Robinhood MCP server."
        };
      }
    }
  }
};
