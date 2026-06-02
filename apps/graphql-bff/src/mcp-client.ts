import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mcpClient: Client | null = null;
let connectionAttempts = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Type definitions for MCP responses
export interface McpTextContent {
  type: string;
  text: string;
}

export interface McpResponse {
  content: McpTextContent[];
}


async function createMcpClient(): Promise<Client> {
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
  } catch (error) {
    connectionAttempts++;
    if (connectionAttempts < MAX_RETRIES) {
      console.warn(`⚠️  MCP connection failed (attempt ${connectionAttempts}/${MAX_RETRIES}). Retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return createMcpClient();
    } else {
      console.error("❌ MCP Client connection failed after retries. Server may not be running.");
      throw error;
    }
  }
}

export async function getMcpClient(): Promise<Client> {
  if (!mcpClient) {
    mcpClient = await createMcpClient();
  }
  return mcpClient;
}

export async function closeMcpClient(): Promise<void> {
  if (mcpClient) {
    // The SDK client doesn't expose a close method directly,
    // but the transport will be cleaned up on garbage collection
    mcpClient = null;
  }
}


/**
 * Type guard to safely extract text from MCP response
 * @param response - The raw MCP response
 * @returns The extracted text string
 * @throws Error if response format is invalid
 */
export function extractTextFromMcpResponse(response: McpResponse): string {
  if (
    Array.isArray(response.content) &&
    response.content.length > 0 &&
    typeof response.content[0] === "object" &&
    response.content[0] !== null &&
    "text" in response.content[0] &&
    typeof response.content[0].text === "string"
  ) {
    return response.content[0].text;
  }
  throw new Error("Invalid MCP response: expected content[0].text to be a string");
}

