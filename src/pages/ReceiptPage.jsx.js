// src/pages/ReceiptPage.jsx
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MobileFrame } from '../components/MobileFrame';
import { ThemeContext } from '../context/ThemeContext';
import { BinanceReceipt } from '../components/BinanceReceipt';
import KrakenReceipt from '../components/KrakenReceipt';
import CoinbaseReceipt from '../components/CoinbaseReceipt';
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

  // Build a simple text fallback for copying
  const makeReceiptText = () => {
    const r = data || {};
    return [
      'Receipt',
      `Platform: ${r.platform || ''}`,
      `Amount: ${r.withdrawalAmount ?? r.amount ?? ''} ${r.currency ?? ''}`,
      `Network: ${r.network ?? ''}`,
      `Address: ${r.address ?? r.withdrawalAddress ?? ''}`,
      `Txid / Remarks: ${r.remarks ?? r.txid ?? r.txHash ?? ''}`,
      `Wallet: ${r.withdrawalAccount ?? r.wallet ?? ''}`,
      `Date: ${r.timestamp ?? r.date ?? r.time ?? ''}`,
      `Status: ${r.status ?? ''}`,
    ].join('\n');
  };

  // Copy receipt: try clipboard image first, then fallback to text
  const handleCopy = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2 });

      // Try to copy image to clipboard (modern browsers)
      if (navigator.clipboard && navigator.clipboard.write) {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
          try {
            await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]);
            alert('Receipt image copied to clipboard');
            return;
          } catch (err) {
            console.warn('Clipboard image write failed, falling back to text', err);
            // fall through to text fallback
          }
        }
      }

      // Fallback: copy plain text
      const text = makeReceiptText();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        alert('Receipt text copied to clipboard');
      } else {
        // Last resort prompt
        window.prompt('Copy receipt text (Cmd/Ctrl+C, Enter):', text);
      }
    } catch (err) {
      console.error('Copy failed', err);
      alert('Copy failed: ' + (err && err.message ? err.message : err));
    }
  };

  // Download as PNG
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

  // Download as PDF
  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2 });
      const dataUrl = canvas.toDataURL('image/png');
      // Use jsPDF - scale image to page width
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

  // Render the appropriate receipt inside a wrapper div with ref so we can capture it
  const renderedReceipt = (
    <div ref={receiptRef} style={{ display: 'inline-block' }}>
      {platform === 'kraken' ? (
        <KrakenReceipt data={krakenData} isDarkMode={isDarkMode} />
      ) : platform === 'coinbase' ? (
        <CoinbaseReceipt data={coinbaseData} isDarkMode={isDarkMode} />
      ) : (
        <BinanceReceipt data={binanceData} isDarkMode={isDarkMode} />
      )}
    </div>
  );

  return (
    <div style={{ padding: 16 }}>
      <MobileFrame deviceType={data.deviceType || 'android'} isDarkMode={isDarkMode}>
        {renderedReceipt}
      </MobileFrame>

      {/* Action buttons below the preview */}
      <div style={{ marginTop: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          onClick={handleCopy}
          style={{
            padding: '10px 16px',
            background: '#111827',
            color: '#fff',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer'
          }}
        >
          Copy Receipt
        </button>

        <button
          onClick={handleDownloadImage}
          style={{
            padding: '10px 16px',
            background: '#111827',
            color: '#fff',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer'
          }}
        >
          Download PNG
        </button>

        <button
          onClick={handleDownloadPDF}
          style={{
            padding: '10px 16px',
            background: '#111827',
            color: '#fff',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'pointer'
          }}
        >
          Download PDF
        </button>

        <div style={{ marginLeft: 'auto', color: '#888', fontSize: 13 }}>
          Tip: For best quality use Chrome/Edge and click Download PNG or PDF.
        </div>
      </div>
    </div>
  );
}
