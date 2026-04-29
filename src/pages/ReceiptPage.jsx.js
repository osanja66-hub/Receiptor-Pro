// src/pages/ReceiptPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileFrame } from '../components/MobileFrame';
import { ThemeContext } from '../context/ThemeContext';
import { BinanceReceipt } from '../components/BinanceReceipt';
import KrakenReceipt from '../components/KrakenReceipt';
import CoinbaseReceipt from '../components/CoinbaseReceipt';

export default function ReceiptPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Prefer navigation state
    if (location.state && location.state.receiptData) {
      setData(location.state.receiptData);
      try { localStorage.setItem('latestReceiptData', JSON.stringify(location.state.receiptData)); } catch {}
      return;
    }

    // Fallback to localStorage
    try {
      const stored = localStorage.getItem('latestReceiptData');
      if (stored) {
        setData(JSON.parse(stored));
        return;
      }
    } catch (e) {
      console.warn(e);
    }

    navigate('/', { replace: true });
  }, [location.state, navigate]);

  if (!data) return null;

  const platform = (data.platform || '').toString().toLowerCase().trim();

  // Kraken normalization
  const krakenData = {
    withdrawalAmount: data.withdrawalAmount,
    currency: data.currency,
    fee: data.fee,
    total: data.total || `${data.withdrawalAmount} ${data.currency}`,
    status: data.status,
    network: data.network,
    onchainTxId: data.onchainTxId || data.txid || data.txHash,
    withdrawalAddress: data.withdrawalAddress || data.address,
    date: data.date || data.timestamp,
    refId: data.refId,
    transactionId: data.transactionId,
    fiat: data.fiat || '≈£261.67',
    receiptId: data.receiptId || '',
  };

  // Coinbase normalization
  const coinbaseData = {
    amount: data.amount || data.withdrawalAmount || '',
    currency: data.currency || 'ETH',
    fiatAmount: data.fiatAmount || data.fiat || '',
    price: data.price || '',
    toAddress: data.toAddress || data.withdrawalAddress || data.address || '',
    network: data.network || 'Ethereum',
    networkIcon: data.networkIcon || null,
    networkFeeFiat: data.networkFeeFiat || data.networkFee || data.fee || '',
    confirmations: data.confirmationsCount || data.confirmations || '',
    date: data.date || data.timestamp,
    txHash: data.txHash || data.onchainTxId || data.txid || '',
    note: data.note || '',
    receiptId: data.receiptId || ''
  };

  // For Binance, pass the exact keys BinanceReceipt expects:
  // - remarks (txid/remarks)
  // - withdrawalAccount (wallet)
  // - timestamp (date)
  const binanceData = {
    withdrawalAmount: data.withdrawalAmount,
    currency: data.currency,
    status: data.status,
    network: data.network,
    address: data.address,
    remarks: data.remarks || data.txid || data.txHash || '',
    fee: data.fee,
    withdrawalAccount: data.withdrawalAccount || data.withdrawalAccount || data.wallet || '',
    timestamp: data.timestamp || data.date || data.time || '',
    receiptId: data.receiptId || ''
  };

  return (
    <div style={{ padding: 16 }}>
      <MobileFrame deviceType={data.deviceType || 'android'} isDarkMode={isDarkMode}>
        {platform === 'kraken' ? (
          <KrakenReceipt data={krakenData} isDarkMode={isDarkMode} />
        ) : platform === 'coinbase' ? (
          <CoinbaseReceipt data={coinbaseData} isDarkMode={isDarkMode} />
        ) : platform === 'binance' ? (
          <BinanceReceipt data={binanceData} isDarkMode={isDarkMode} />
        ) : (
          <div style={{ padding: 20 }}>
            <h3>Unsupported or missing platform</h3>
            <p>Platform: <strong>{data.platform || '(none)'}</strong></p>
            <button onClick={() => navigate(-1)}>Go back</button>
          </div>
        )}
      </MobileFrame>
    </div>
  );
}