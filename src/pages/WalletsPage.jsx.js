import React from 'react';
import { Link } from 'react-router-dom';
import './WalletsPage.css';

const wallets = [
  { id: 'binance', label: 'Binance' },
  { id: 'kraken', label: 'Kraken' },
  { id: 'okx', label: 'OKX' },
  { id: 'revolut', label: 'Revolut' },
  { id: 'coinbase', label: 'Coinbase' }, // <-- added Coinbase
];

const WalletsPage = () => {
  return (
    <div style={{ padding: 30 }}>
      <h1>Choose a Wallet</h1>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 18 }}>
        {wallets.map(w => (
          <Link
            key={w.id}
            to={`/form/${w.id}`}
            style={{
              display: 'inline-block',
              padding: '12px 18px',
              borderRadius: 10,
              background: '#111',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 600,
              minWidth: 140,
              textAlign: 'center'
            }}
          >
            {w.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WalletsPage;