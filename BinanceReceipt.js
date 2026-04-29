import React, { useState } from 'react';
import './BinanceReceipt.css';

export const BinanceReceipt = ({ data = {}, isDarkMode = true }) => {
  const [copied, setCopied] = useState({});

  const {
    withdrawalAmount = '',
    currency = '',
    status = 'Completed',
    network = '',
    address = '',
    remarks = '',
    fee = '',
    withdrawalAccount = '',
    timestamp = '',
  } = data;

  const handleCopy = async (value, key) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 1000);
    } catch {}
  };

  const formatTxid = (text) => {
    if (!text) return text;
    const parts = text.split(' ');
    if (parts.length < 2) return text;

    return (
      <>
        <div>{parts.slice(0, -1).join(' ')}</div>
        <div>{parts.slice(-1)}</div>
      </>
    );
  };

  return (
    <div className={`binance-modal ${isDarkMode ? 'dark' : 'light'}`}>

      {/* HEADER */}
      <div className="modal-header">
        <button className="icon-btn">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h2>Withdrawal Details</h2>

        <button className="icon-btn">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              d="M4 13v2a2 2 0 0 0 2 2h1v-6a7 7 0 0 1 14 0v6h1a2 2 0 0 0 2-2v-2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* AMOUNT */}
      <div className="amount-section">
        <h1>-{withdrawalAmount} {currency}</h1>

        <div className="status">
          <span className="status-icon">
            <svg viewBox="0 0 24 24" width="18">
              <circle cx="12" cy="12" r="10" fill="#02C076"/>
              <path
                className="check-icon"
                d="M8 12.5l2.5 2.5L16 9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </span>
          {status}
        </div>

        <p>
          Crypto transferred out of Binance. Please contact the recipient platform for your transaction receipt.
        </p>

        <span className="help">
          Why hasn't my withdrawal arrived?
        </span>
      </div>

      <div className="divider" />

      {/* DETAILS */}
      <div className="details">

        <Row label="Network" value={network} />

        <RowCopy
          label="Address"
          value={address}
          onCopy={() => handleCopy(address, 'address')}
        />

        <div className="save-address">Save Address</div>

        <RowCopy
          label="Txid"
          value={formatTxid(remarks)}
          onCopy={() => handleCopy(remarks, 'txid')}
        />

        <Row label="Amount" value={`${withdrawalAmount} ${currency}`} />
        <Row label="Network fee" value={`${fee} ${currency}`} />
        <Row label="Wallet" value={withdrawalAccount} />
        <Row label="Date" value={timestamp} last />

      </div>

      {/* SCAM */}
      <div className="scam">
        <svg viewBox="0 0 24 24" width="19" height="40" fill="none">

          <path
            d="M5 6.8C5 6.2 5.4 5.8 6 5.8h12c.6 0 1 .4 1 1v6.6c0 .6-.4 1-1 1h-4.8l-1.2 1.2-1.2-1.2H6c-.6 0-1-.4-1-1V6.8z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          <rect x="8.2" y="8.2" width="8.6" height="2" rx="0.4" fill="currentColor"/>

          <circle cx="10.3" cy="11.8" r="0.9" fill="currentColor" />
          <circle cx="13.7" cy="11.8" r="0.9" fill="currentColor" />
          <rect x="10.3" y="11.5" width="4.4" height="1.6" fill="currentColor" />

        </svg>

        <span>Scam Report</span>
      </div>

      <button className="withdraw-btn">
        Withdraw Again
      </button>

    </div>
  );
};

const Row = ({ label, value, last }) => (
  <div className={`row ${last ? 'last' : ''}`}>
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
);

const RowCopy = ({ label, value, onCopy }) => (
  <div className="row top">
    <span className="label">{label}</span>

    <div className="value copy">
      <span className="multiline">{value}</span>

      <button onClick={onCopy} className="copy-btn">
        <svg viewBox="0 0 24 24" width="16">
          <path d="M3.9 20.1h11.2V8.9H3.9v11.2z" fill="currentColor"/>
          <path d="M20.1 3.9H8.9v2h11.2v11.2h2V3.9z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  </div>
);