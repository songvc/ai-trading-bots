import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js'; // Your resolvers are just a piece of the puzzle

const server = new ApolloServer({ typeDefs, resolvers });

// This is the part that actually starts the process and keeps it alive
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`🚀 Server ready at ${url}`);
