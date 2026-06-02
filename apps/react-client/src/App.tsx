import { useState } from 'react'
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

const GET_QUOTE = gql`
  query GetStockQuote($ticker: String!) {
    getStockQuote(ticker: $ticker) {
      ticker
      price
    }
  }
`;

const PLACE_TRADE = gql`
  mutation PlaceTrade($ticker: String!, $quantity: Float!, $side: String!) {
    placeTrade(ticker: $ticker, quantity: $quantity, side: $side) {
      success
      message
    }
  }
`;

export function RobinhoodDashboard() {
  const [ticker, setTicker] = useState('AAPL');
  const { loading, error, data, refetch } = useQuery(GET_QUOTE, { variables: { ticker } });
  const [executeTrade, { data: tradeData }] = useMutation(PLACE_TRADE);

  const handleBuy = async () => {
    await executeTrade({
      variables: { ticker, quantity: 1.0, side: 'buy' }
    });
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h2>Robinhood AI Agent Dashboard (MCP)</h2>
      
      <div style={{ marginBottom: '16px' }}>
        <input 
          value={ticker} 
          onChange={(e) => setTicker(e.target.value.toUpperCase())} 
          placeholder="Enter Ticker (e.g. NVDA)" 
        />
        <button onClick={() => refetch()}>Get Live MCP Quote</button>
      </div>

      {loading && <p>Fetching via MCP Client...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      
      {data && (
        <div style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px' }}>
          <h3>{data.getStockQuote.ticker}</h3>
          <p>Price: <strong>${data.getStockQuote.price}</strong></p>
          <button 
            onClick={handleBuy} 
            style={{ backgroundColor: '#00c805', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Market Buy 1 Share
          </button>
        </div>
      )}

      {tradeData && (
        <div style={{ marginTop: '16px', color: 'green' }}>
          <strong>Status:</strong> {tradeData.placeTrade.message}
        </div>
      )}
    </div>
  );
}
