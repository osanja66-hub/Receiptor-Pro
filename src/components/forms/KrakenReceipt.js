import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './KrakenReceipt.css';
import ethIcon from '../assets/eth-icon-removebg.png';

const KrakenReceipt = ({ data = {}, isDarkMode = false }) => {
  const navigate = useNavigate();

  const {
    withdrawalAmount = '',
    currency = '',
    fee = '',
    total = '',
    status = 'Success',
    network = 'Ethereum',
    onchainTxId = '',
    withdrawalAddress = '',
    date = '',
    refId = '',
    transactionId = '',
    fiat = ''
  } = data;

  const [copied, setCopied] = useState({});

  const copy = async (value, key) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 1000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const truncate = (s = '', start = 6, end = 6) => {
    if (!s) return '';
    return s.length > start + end ? `${s.slice(0, start)}...${s.slice(-end)}` : s;
  };

  const formatDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return d;
    return dt.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className={`kraken-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="kr-header">
        <div className="kr-icon">
          <img src={ethIcon} alt="" className="kr-icon-img" />
        </div>
        <div>
          <div className="kr-sub">Withdrew</div>
          <div className="kr-amount">
            {withdrawalAmount} {currency}
          </div>
        </div>
      </div>

      <div className="kr-row">
        <div className="kr-label">Fee</div>
        <div className="kr-value">{fee} {currency}</div>
      </div>

      <div className="kr-row">
        <div className="kr-label">Total</div>
        <div className="kr-value total">
          <div className="total-main">{total}</div>
          <div className="kr-fiat">{fiat ? `≈${fiat}` : ''}</div>
        </div>
      </div>

      <div className="kr-row">
        <div className="kr-label">Status</div>
        <div className="kr-value">
          <span className="kr-badge">{status}</span>
        </div>
      </div>

      <div className="kr-row">
        <div className="kr-label">Network</div>
        <div className="kr-value network">
          <div className="network-icon">
            <img src={ethIcon} alt="" className="network-icon-img" />
          </div>
          <div className="network-name">{network}</div>
        </div>
      </div>

      <div className="kr-row dashed">
        <div className="kr-label">On-chain transaction ID</div>
        <div className="kr-value">
          <span className="muted-underline">{truncate(onchainTxId)}</span>
          <div className="copy-btn copy" onClick={() => copy(onchainTxId, 'tx')} />
        </div>
      </div>

      <div className="kr-row">
        <div className="kr-label">Withdrawal address</div>
        <div className="kr-value">
          <span>{truncate(withdrawalAddress)}</span>
          <div className="copy-btn arrow" onClick={() => copy(withdrawalAddress, 'addr')} />
        </div>
      </div>

      <div className="kr-row">
        <div className="kr-label">Date</div>
        <div className="kr-value date-value">{formatDate(date)}</div>
      </div>

      <div className="kr-row">
        <div className="kr-label">Ref ID</div>
        <div className="kr-value">
          <span className="strong">{truncate(refId, 8, 8)}</span>
          <div className="copy-btn copy" onClick={() => copy(refId, 'ref')} />
        </div>
      </div>

      <div className="kr-row">
        <div className="kr-label">Transaction ID</div>
        <div className="kr-value">
          <span className="strong">{transactionId}</span>
          <div className="copy-btn copy" onClick={() => copy(transactionId, 'id')} />
        </div>
      </div>

      <button className="kr-explorer-btn">View on blockchain explorer ↗</button>

      <div className="kr-note">
        Total amount displayed in your preferred currency is an estimate based on the exchange rate from the date of the transaction.
      </div>
    </div>
  );
};

export default KrakenReceipt;