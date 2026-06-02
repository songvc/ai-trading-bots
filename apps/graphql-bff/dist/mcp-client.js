import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mcpClient = null;
let connectionAttempts = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
async function createMcpClient() {
    const transport = new StdioClientTransport({
        command: "node",
        args: [path.resolve(__dirname, "../../mcp-server/dist/server.js")]
    });
    const client = new Client({ name: "graphql-bff-client", version: "1.0.0" });
    try {
        await client.connect(transport);
        console.log("✅ MCP Client connected to Robinhood MCP Server");
        connectionAttempts = 0; // Reset on successful connection
        return client;
    }
    catch (error) {
        connectionAttempts++;
        if (connectionAttempts < MAX_RETRIES) {
            console.warn(`⚠️  MCP connection failed (attempt ${connectionAttempts}/${MAX_RETRIES}). Retrying in ${RETRY_DELAY}ms...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return createMcpClient();
        }
        else {
            console.error("❌ MCP Client connection failed after retries. Server may not be running.");
            throw error;
        }
    }
}
export async function getMcpClient() {
    if (!mcpClient) {
        mcpClient = await createMcpClient();
    }
    return mcpClient;
}
export async function closeMcpClient() {
    if (mcpClient) {
        // The SDK client doesn't expose a close method directly,
        // but the transport will be cleaned up on garbage collection
        mcpClient = null;
    }
}
//# sourceMappingURL=mcp-client.js.map