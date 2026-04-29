import React from 'react';
import './KrakenReceipt.css';

export const KrakenReceipt = ({ data = {}, isDarkMode = true }) => {
  const {
    withdrawalAmount = '',
    currency = '',
    fee = '',
    total = '',
    status = 'Success',
    network = '',
    onchainTxId = '',
    withdrawalAddress = '',
    date = '',
    refId = '',
    transactionId = '',
    receiptId = '',
  } = data;

  const copy = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className={`kraken-container ${isDarkMode ? 'dark' : 'light'}`}>

      <div className="kraken-header">
        <div className="kraken-icon">⟡</div>
        <div className="kraken-title">
          <div className="kraken-subtitle">Withdrew</div>
          <div className="kraken-amount">{withdrawalAmount} {currency}</div>
        </div>
      </div>

      <div className="kraken-card">
        <Row label="Fee" value={`${fee} ${currency}`} />
        <Row label="Total" value={`${total || `${withdrawalAmount} ${currency}`}`} />
        <Row label="Status" value={status} />
        <Row label="Network" value={network} />

        <RowCopy label="On-chain transaction ID" value={onchainTxId} onCopy={() => copy(onchainTxId)} />

        <RowCopy label="Withdrawal address" value={withdrawalAddress} onCopy={() => copy(withdrawalAddress)} />

        <Row label="Date" value={date} />
        <RowCopy label="Ref ID" value={refId} onCopy={() => copy(refId)} />
        <RowCopy label="Transaction ID" value={transactionId} onCopy={() => copy(transactionId)} />

        {receiptId && <Row label="Receipt ID" value={receiptId} />}
      </div>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <button className="kraken-explorer-btn" onClick={() => {
          if (onchainTxId) window.open(`https://etherscan.io/tx/${onchainTxId}`, '_blank');
        }}>
          View on blockchain explorer ↗
        </button>
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="kraken-row">
    <div className="kraken-label">{label}</div>
    <div className="kraken-value">{value}</div>
  </div>
);

const RowCopy = ({ label, value, onCopy }) => (
  <div className="kraken-row top">
    <div className="kraken-label">{label}</div>
    <div className="kraken-value copy">
      <div className="kraken-multiline">{value}</div>
      <button className="kraken-copy-btn" onClick={onCopy} type="button">⧉</button>
    </div>
  </div>
);

export default KrakenReceipt;