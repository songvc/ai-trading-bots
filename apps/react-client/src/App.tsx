import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';

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


interface StockQuote {
  getStockQuote: {
    ticker: string;
    price: number;
  };
}

interface TradeResult {
  placeTrade: {
    success: boolean;
    message: string;
  };
}


export default function RobinhoodDashboard() {

  const [ticker, setTicker] = useState('AAPL');
  const { loading, error, data, refetch } = useQuery<StockQuote>(GET_QUOTE, { variables: { ticker } });
  const [executeTrade, { data: tradeData }] = useMutation<TradeResult>(PLACE_TRADE);

  const handleBuy = async () => {
    await executeTrade({
      variables: { ticker, quantity: 1.0, side: 'buy' }
    });
  };

  return (
    <div style={{ padding: '32px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ color: '#00c805', margin: 0 }}>Robinhood AI Dashboard</h1>
        <p style={{ color: '#666', margin: '4px 0 0 0' }}>Model Context Protocol (MCP) Interface</p>
      </header>
      
      <main>
        <div style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
          <input 
            value={ticker} 
            onChange={(e) => setTicker(e.target.value.toUpperCase())} 
            placeholder="Ticker (e.g. TSLA)" 
            style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', flex: 1 }}
          />
          <button 
            onClick={() => refetch()}
            style={{ padding: '10px 20px', fontSize: '16px', borderRadius: '6px', border: 'none', backgroundColor: '#111', color: '#fff', cursor: 'pointer' }}
          >
            Fetch Quote
          </button>
        </div>

        {loading && <p>Fetching via MCP...</p>}
        {error && <p style={{ color: '#ff3b30' }}>Error: {error.message}</p>}
        
        {data && (
          <div style={{ border: '1px solid #eaeaea', padding: '24px', borderRadius: '12px', backgroundColor: '#fafafa' }}>
            <h2 style={{ margin: '0 0 8px 0' }}>{data.getStockQuote.ticker}</h2>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 20px 0' }}>
              ${data.getStockQuote.price.toFixed(2)}
            </p>
            
            <button 
              onClick={handleBuy} 
              style={{ 
                backgroundColor: '#00c805', color: '#fff', border: 'none', padding: '12px 24px', 
                fontSize: '16px', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer', width: '100%'
              }}
            >
            </button>
          </div>
        )}

        {tradeData && (
          <div style={{ marginTop: '20px', padding: '14px', borderRadius: '6px', backgroundColor: '#e6f9e6', color: '#008003' }}>
            <strong>Status:</strong> {tradeData.placeTrade.message}
          </div>
        )}
      </main>
    </div>
  );
}
