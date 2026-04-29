import React from "react";
import "./CoinbaseReceipt.css";
import ethIcon from "../assets/eth-icon-removebg.png"; // replace with your project asset if different

// helper to break a long address into multiple lines similar to the Coinbase screenshot
function wrapAddress(addr = "", chunk = 24) {
  if (!addr) return "";
  const parts = [];
  for (let i = 0; i < addr.length; i += chunk) parts.push(addr.slice(i, i + chunk));
  return parts.join("\n");
}

function truncateMiddle(s = "", start = 8, end = 6) {
  if (!s) return "";
  if (s.length <= start + end + 3) return s;
  return `${s.slice(0, start)}...${s.slice(-end)}`;
}

function prettyDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * CoinbaseReceipt
 * - Renders a Coinbase-style "Sent ETH" receipt (no copy buttons, matches screenshot layout).
 * - All values are provided via the `data` prop; nothing is hardcoded.
 * - Props:
 *    data: { amount, currency, fiatAmount, price, toAddress, network, networkIcon, networkFeeFiat,
 *            confirmations, date, txHash, note, receiptId }
 *    isDarkMode: boolean (optional) -- toggles dark color tokens
 */
export default function CoinbaseReceipt({ data = {}, isDarkMode = false }) {
  const {
    amount = "",
    currency = "ETH",
    fiatAmount = "",
    price = "",
    toAddress = "",
    network = "Ethereum",
    networkIcon = null,
    networkFeeFiat = "",
    confirmations = "",
    date = "",
    txHash = "",
    note = "",
    receiptId = "",
  } = data;

  const explorerUrl = txHash ? `https://etherscan.io/tx/${txHash}` : null;

  return (
    <div className={`coinbase-receipt-root ${isDarkMode ? "dark" : "light"}`}>
      <div className="cb-card">
        <div className="cb-topbar">
          <button className="cb-back" onClick={() => window.history.back()} aria-label="Back">
            ←
          </button>
          <div className="cb-title">Sent {currency}</div>
          <div style={{ width: 34 }} />
        </div>

        <div className="cb-warning" role="note">
          <div className="cb-warning-text">
            Don’t invest unless you’re prepared to lose all the money you invest. This is a high-risk investment and you should not expect to be protected if something goes wrong. <u>Take 2 mins to learn more</u>
          </div>
        </div>

        <div className="cb-amounts" aria-label="Amounts">
          <div className="cb-crypto-amount">{amount ? `${amount} ${currency}` : ""}</div>
          <div className="cb-fiat-amount">{fiatAmount}</div>
        </div>

        <div className="cb-divider" />

        <div className="cb-rows">
          <div className="cb-row">
            <div className="cb-row-left">To</div>
            <div className="cb-row-right address-cell">
              <div className="cb-address-multiline">{wrapAddress(toAddress)}</div>
            </div>
          </div>

          <div className="cb-row">
            <div className="cb-row-left">Price</div>
            <div className="cb-row-right">{price}</div>
          </div>

          <div className="cb-row">
            <div className="cb-row-left">Network</div>
            <div className="cb-row-right network-cell">
              <img src={networkIcon || ethIcon} alt={network} className="cb-net-icon" />
              <span className="cb-net-name">{network}</span>
            </div>
          </div>

          <div className="cb-row">
            <div className="cb-row-left">Network fee</div>
            <div className="cb-row-right">{networkFeeFiat}</div>
          </div>

          <div className="cb-row">
            <div className="cb-row-left">Confirmations</div>
            <div className="cb-row-right">{confirmations}</div>
          </div>

          <div className="cb-row dashed">
            <div className="cb-row-left">On-chain transaction</div>
            <div className="cb-row-right tx-cell">
              <div className="cb-mono">{truncateMiddle(txHash, 8, 6)}</div>
            </div>
          </div>

          <div className="cb-row">
            <div className="cb-row-left">Date</div>
            <div className="cb-row-right">{prettyDate(date)}</div>
          </div>

          {note ? (
            <div className="cb-row">
              <div className="cb-row-left">Note</div>
              <div className="cb-row-right">{note}</div>
            </div>
          ) : null}

          {receiptId ? (
            <div className="cb-row">
              <div className="cb-row-left">Receipt</div>
              <div className="cb-row-right cb-mono">{receiptId}</div>
            </div>
          ) : null}
        </div>

        <div className="cb-footer">
          <button
            className="cb-explorer"
            onClick={() => {
              if (explorerUrl) window.open(explorerUrl, "_blank", "noopener noreferrer");
            }}
            aria-label="View on blockchain explorer"
          >
            View on blockchain explorer ↗
          </button>
        </div>
      </div>
    </div>
  );
}