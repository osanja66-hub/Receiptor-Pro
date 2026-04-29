import React from 'react';
import './BinanceReceipt.css';

export const BinanceReceipt = ({ data = {}, isDarkMode = true }) => {
  const {
    amount = '',
    currency = '',
    status = 'Completed',
    network = '',
    address = '',
    txid = '',
    fee = '',
    account = '',
    date = '',
  } = data;

  return (
    <div className={`okx-container ${isDarkMode ? 'dark' : 'light'}`}>

      {/* HEADER */}
      <div className="okx-header">
        <span className="okx-title">Withdrawal Details</span>
      </div>

      {/* AMOUNT */}
      <div className="okx-amount">
        -{amount} {currency}
      </div>

      {/* STATUS */}
      <div className="okx-status">
        <span className="dot" />
        {status}
      </div>

      {/* CARD */}
      <div className="okx-card">

        <Row label="Network" value={network} />

        <RowCopy label="Address" value={address} />

        <RowCopy label="TxID" value={txid} />

        <Row label="Amount" value={`${amount} ${currency}`} />

        <Row label="Network Fee" value={`${fee} ${currency}`} />

        <Row label="Account" value={account} />

        <Row label="Date" value={date} last />

      </div>

    </div>
  );
};

const Row = ({ label, value, last }) => (
  <div className={`okx-row ${last ? 'last' : ''}`}>
    <span className="okx-label">{label}</span>
    <span className="okx-value">{value}</span>
  </div>
);

const RowCopy = ({ label, value }) => (
  <div className="okx-row top">
    <span className="okx-label">{label}</span>

    <div className="okx-value copy">
      <span className="multiline">{value}</span>

      <button
        className="copy-btn"
        onClick={() => navigator.clipboard.writeText(value)}
      >
        ⧉
      </button>
    </div>
  </div>
);