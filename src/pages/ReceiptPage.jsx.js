// src/pages/ReceiptPage.jsx
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileFrame } from '../components/MobileFrame';
import { ThemeContext } from '../context/ThemeContext';
import { BinanceReceipt } from '../components/BinanceReceipt';
import KrakenReceipt from '../components/KrakenReceipt';
import CoinbaseReceipt from '../components/CoinbaseReceipt';
import RevolutReceipt from '../components/RevolutReceipt';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ReceiptPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [data, setData] = useState(null);
  const receiptRef = useRef(null);

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

  // Platform detection: prefer explicit data.platform, then URL path segment
  const pathPlatform = (location.pathname || '').split('/').filter(Boolean).pop() || '';
  const platform = (data.platform || pathPlatform || '').toString().toLowerCase().trim();

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

  // Binance normalization
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

  // Revolut normalization (maps your generator fields to the RevolutReceipt props)
  const revolutData = {
    toName: data.toName || data.to || data.recipient || '',
    initials: data.initials || (data.toName ? data.toName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'RY'),
    amount: (data.amount !== undefined && data.amount !== null) ? String(data.amount) : (data.withdrawalAmount ? String(data.withdrawalAmount * -1) : ''),
    currency: data.currency || 'USDT',
    date: data.timestamp || data.date || data.time || '',
    steps: [
      { label: 'Request processed', time: data.timestamp || data.date || '', done: true },
      { label: "Received by recipient’s address", time: data.onchainTxId || data.txHash || data.timestamp || data.date || '', done: !!(data.onchainTxId || data.txHash) }
    ],
    txHash: data.txHash || data.onchainTxId || data.txid || data.remarks || '',
    walletAddress: data.withdrawalAddress || data.address || '',
    network: data.network || data.networkName || 'Tron',
    withdrawnAmount: data.withdrawnAmount || data.withdrawalAmount || data.amount || '',
    withdrawnFiat: data.withdrawnFiat || data.fiat || '',
    fees: data.fees || data.fee || '',
    feesFiat: data.feesFiat || data.feeFiat || '',
    total: data.total || '',
    totalFiat: data.totalFiat || ''
  };

  // Helper for copy/download (same as previous)
  const makeReceiptText = () => {
    const r = data || {};
    return [
      'Receipt',
      `Platform: ${r.platform || pathPlatform || ''}`,
      `Amount: ${r.withdrawalAmount ?? r.amount ?? ''} ${r.currency ?? ''}`,
      `Network: ${r.network ?? ''}`,
      `Address: ${r.address ?? r.withdrawalAddress ?? ''}`,
      `Txid / Remarks: ${r.remarks ?? r.txid ?? r.txHash ?? ''}`,
      `Wallet: ${r.withdrawalAccount ?? r.wallet ?? ''}`,
      `Date: ${r.timestamp ?? r.date ?? r.time ?? ''}`,
      `Status: ${r.status ?? ''}`,
    ].join('\n');
  };

  const handleCopy = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2 });
      if (navigator.clipboard && navigator.clipboard.write) {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
          try {
            await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]);
            alert('Receipt image copied to clipboard');
            return;
          } catch (err) {
            console.warn('Clipboard image write failed, falling back to text', err);
          }
        }
      }
      const text = makeReceiptText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        alert('Receipt text copied to clipboard');
      } else {
        window.prompt('Copy receipt text (Cmd/Ctrl+C, Enter):', text);
      }
    } catch (err) {
      console.error('Copy failed', err);
      alert('Copy failed: ' + (err && err.message ? err.message : err));
    }
  };

  const handleDownloadImage = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2 });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'receipt.png';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to capture receipt image', err);
      alert('Could not generate image: ' + (err && err.message ? err.message : err));
    }
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2 });
      const dataUrl = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('receipt.pdf');
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert('Could not generate PDF: ' + (err && err.message ? err.message : err));
    }
  };

  // Choose which receipt component to render
  const receiptComponent = (() => {
    switch (platform) {
      case 'kraken':
        return <KrakenReceipt data={krakenData} isDarkMode={isDarkMode} />;
      case 'coinbase':
        return <CoinbaseReceipt data={coinbaseData} isDarkMode={isDarkMode} />;
      case 'binance':
        return <BinanceReceipt data={binanceData} isDarkMode={isDarkMode} />;
      case 'revolut':
        return <RevolutReceipt data={revolutData} />;
      default:
        return (
          <div style={{ padding: 20 }}>
            <h3>Unsupported or missing platform</h3>
            <p>Platform: <strong>{platform || '(none)'}</strong></p>
            <button onClick={() => navigate(-1)}>Go back</button>
          </div>
        );
    }
  })();

  return (
    <div style={{ padding: 16 }}>
      <MobileFrame deviceType={data.deviceType || 'android'} isDarkMode={isDarkMode}>
        <div ref={receiptRef} style={{ display: 'inline-block' }}>
          {receiptComponent}
        </div>
      </MobileFrame>

      <div style={{ marginTop: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={handleCopy} style={buttonStyle}>Copy Receipt</button>
        <button onClick={handleDownloadImage} style={buttonStyle}>Download PNG</button>
        <button onClick={handleDownloadPDF} style={buttonStyle}>Download PDF</button>
        <div style={{ marginLeft: 'auto', color: '#888', fontSize: 13 }}>
          Tip: For best quality use Chrome/Edge and click Download PNG or PDF.
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 16px',
  background: '#111827',
  color: '#fff',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.06)',
  cursor: 'pointer'
};
