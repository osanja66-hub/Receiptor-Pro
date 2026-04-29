import React from 'react';
import './RevolutReceipt.css';

/**
 * RevolutReceipt - Improved visual fidelity to your reference
 *
 * Props: data = {
 *  toName, initials, amount, currency, date,
 *  steps: [{ label, time, done }],
 *  txHash, walletAddress, network,
 *  withdrawnAmount, withdrawnFiat, fees, feesFiat, total, totalFiat
 * }
 *
 * This component focuses on pixel-aligned spacing and a visible green connector line.
 */

const EyeIcon = ({ className = '' }) => (
  <svg className={className} width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M1 6s3-4 8-4 8 4 8 4-3 4-8 4S1 6 1 6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="6" r="2.5" fill="currentColor"/>
  </svg>
);

const InfoIcon = ({ className = '' }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M12 8v.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M11.8 11.5h.4v4.5h-.4z" fill="currentColor"/>
  </svg>
);

const DownloadIcon = ({ className = '' }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="3" y="17" width="18" height="3" rx="1" fill="currentColor"/>
  </svg>
);

const TronIcon = ({ className = '' }) => (
  <svg className={className} width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7.5 12 22l10-14.5L12 2z" stroke="currentColor" strokeWidth="4.2" strokeLinejoin="round" fill="none"/>
    <path d="M12 2l3.5 8L12 13 8.5 10 12 2z" fill="currentColor" />
  </svg>
);

const truncateMiddle = (s = '', head = 6, tail = 6) => {
  if (!s) return '';
  if (s.length <= head + tail + 3) return s;
  return `${s.slice(0, head)}...${s.slice(-tail)}`;
};

const formatNumber = (n, decimals = 6) => {
  if (n === undefined || n === null || n === '') return '-';
  const num = Number(n);
  if (Number.isNaN(num)) return n;
  return num.toFixed(decimals).replace(/\.?0+$/, '');
};

const formatDateHuman = (iso) => {
  if (!iso) return 'Moments ago';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const now = new Date();
  const diff = Math.abs(now - d);
  if (diff < 90 * 1000) return 'Moments ago';
  if (now.toDateString() === d.toDateString()) {
    return `Today ${d.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}`;
  }
  const month = d.toLocaleString(undefined, { month: 'short' });
  const day = d.getDate();
  const year = d.getFullYear();
  const time = d.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
  return `${month} ${day}, ${year} at ${time}`;
};

export default function RevolutReceipt({ data = {} }) {
  const {
    toName = 'Recipient',
    initials = 'RY',
    amount = '-53.19',
    currency = 'USDT',
    date = '',
    steps = [
      { label: 'Request processed', time: '', done: true },
      { label: "Received by recipient’s address", time: '', done: true }
    ],
    txHash = '',
    walletAddress = '',
    network = 'Tron',
    withdrawnAmount,
    withdrawnFiat,
    fees,
    feesFiat,
    total,
    totalFiat
  } = data;

  return (
    <div className="revolut-screen">
      {/* We add a small wrapper that mimics the phone notch area and ensures the avatar overlaps like the real app */}
      <div className="revolut-phone-inner">
        <div className="rev-top">
          <button className="rev-back" aria-label="Back">‹</button>
          <div className="rev-spacer" />
          <div className="rev-icons" aria-hidden>☉</div>
        </div>

        <div className="rev-header notch-push">
          <div className="rev-avatar">{initials}</div>
          <div className="rev-">
            <span className="rev-to-pre">To </span>
            <span className="rev-to-name">{toName}</span>
          </div>
        </div>

        <div className="rev-amount">
          <div className="rev-amount-main">
            {amount} <span className="rev-currency">{currency}</span>
          </div>
          <div className="rev-subtitle">{formatDateHuman(date)}</div>
        </div>

        <div className="rev-card rev-steps">
          <div className="rev-card-title">Completed</div>

          <div className="rev-steps-list">
            {steps.map((s, i) => (
              <div key={i} className="rev-step-row">
                <div className="rev-step-indicator">
                  <span className={`dot ${s.done ? 'done' : ''}`} />
                </div>

                <div className="rev-step-body">
                  <div className="rev-step-label">{s.label}</div>
                  <div className="rev-step-time">{formatDateHuman(s.time)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rev-card rev-details">
          <div className="rev-row">
            <div className="rev-row-label">Transaction hash</div>
            <div className="rev-row-value">
              <EyeIcon className="rev-eye" />
              <button className="rev-link" type="button">{truncateMiddle(txHash)}</button>
            </div>
          </div>

          <div className="rev-row">
            <div className="rev-row-label">Wallet address</div>
            <div className="rev-row-value">
              <EyeIcon className="rev-eye" />
              <button className="rev-link" type="button">{truncateMiddle(walletAddress)}</button>
            </div>
          </div>

          <div className="rev-row last">
            <div className="rev-row-label">Network</div>
            <div className="rev-row-value network-val">
              <div className="network-icon-wrap"><TronIcon /></div>
              <div className="network-name">{network}</div>
            </div>
          </div>
        </div>

        <div className="rev-card rev-amounts">
          <div className="rev-amount-row">
            <div className="rev-amount-label">Amount withdrawn</div>
            <div className="rev-amount-value">
              <div className="big">{withdrawnAmount ? formatNumber(withdrawnAmount, 6) + ' ' + (currency || '') : '-'}</div>
              <div className="fiat">{withdrawnFiat || ''}</div>
            </div>
          </div>

          <div className="rev-amount-row">
            <div className="rev-amount-label">Fees</div>
            <div className="rev-amount-value">
              <div className="link-with-icon"><InfoIcon className="info" /> <span className="blue">{fees ? formatNumber(fees, 6) + ' ' + (currency || '') : '-'}</span></div>
              <div className="fiat">{feesFiat || ''}</div>
            </div>
          </div>

          <div className="rev-amount-row">
            <div className="rev-amount-label">Total</div>
            <div className="rev-amount-value">
              <div className="big">{total ? formatNumber(total, 6) + ' ' + (currency || '') : '-'}</div>
              <div className="fiat">{totalFiat || ''}</div>
            </div>
          </div>

          <div className="rev-amount-row last">
            <div className="rev-amount-label">Statement</div>
            <div className="rev-amount-value">
              <button className="rev-download" type="button"><DownloadIcon /> <span className="blue">Download</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}