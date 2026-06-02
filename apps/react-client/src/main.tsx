import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { RobinhoodDashboard } from './App';
import './index.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Connect Apollo Client to your GraphQL BFF
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', 
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <RobinhoodDashboard />
    </ApolloProvider>
  </StrictMode>,
)
