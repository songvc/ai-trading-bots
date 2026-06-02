import { getMcpClient, extractTextFromMcpResponse } from "./mcp-client.js";
export const resolvers = {
    Query: {
        getStockQuote: async (_, { ticker }) => {
            try {
                const mcpClient = await getMcpClient();
                const mcpResponse = await mcpClient.callTool({
                    name: "get_quote",
                    arguments: { ticker }
                });
                const text = extractTextFromMcpResponse(mcpResponse);
                const priceMatch = text.match(/\$(\d+\.\d+)/);
                const price = priceMatch ? parseFloat(priceMatch[1]) : 0.0;
                return { ticker, price };
            }
            catch (error) {
                console.error(`Error fetching quote for ${ticker}:`, error.message);
                throw new Error(`Failed to fetch quote for ${ticker}`);
            }
        }
    },
    Mutation: {
        placeTrade: async (_, { ticker, quantity, side }) => {
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
                const confirmationText = extractTextFromMcpResponse(mcpResponse);
                return {
                    success: true,
                    message: confirmationText
                };
            }
            catch (error) {
                console.error(`Error executing trade for ${ticker}:`, error.message);
                return {
                    success: false,
                    message: error?.message || "Failed to execute trade via Robinhood MCP server."
                };
            }
        }
    }
};
//# sourceMappingURL=resolvers.js.map