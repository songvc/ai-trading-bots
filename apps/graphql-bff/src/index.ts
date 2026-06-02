import { createServer } from "node:http";
import { createYoga, createSchema } from "graphql-yoga";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import { getMcpClient, closeMcpClient } from "./mcp-client.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;

async function startServer() {
  try {
    // Initialize MCP client before starting the server
    console.log("🚀 Initializing MCP Client...");
    await getMcpClient();

    // Create GraphQL schema and Yoga server
    const yoga = createYoga({
      schema: createSchema({ typeDefs, resolvers })
    });

    const server = createServer(yoga);

    server.listen(PORT, () => {
      console.log(`✅ GraphQL Gateway ready at http://localhost:${PORT}/graphql`);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("\n📵 SIGTERM received. Shutting down gracefully...");
      server.close(async () => {
        await closeMcpClient();
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      console.log("\n📵 SIGINT received. Shutting down gracefully...");
      server.close(async () => {
        await closeMcpClient();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

