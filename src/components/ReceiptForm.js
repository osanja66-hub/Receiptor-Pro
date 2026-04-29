import React, { useState, useContext, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { MobileFrame } from './MobileFrame';
import { BinanceReceipt } from './BinanceReceipt';
import KrakenReceipt from './KrakenReceipt';
import CoinbaseReceipt from './CoinbaseReceipt'; // <-- added import
import './ReceiptForm.css';

export const ReceiptForm = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { platform: platformParam } = useParams();

  const [deviceType, setDeviceType] = useState('android');
  const [platform, setPlatform] = useState(platformParam || 'binance');
  const [statusState, setStatusState] = useState('idle'); // idle | loading | done

  const [formData, setFormData] = useState({
    withdrawalAmount: '71',
    currency: 'USDT',
    status: 'Completed',
    fee: '0',
    timestamp: '2026-03-25 09:03:29',
    network: 'TRX',
    withdrawalAccount: 'Spot Wallet',
    orderNumber: '699cb36bf26b7a0007ce81c3',
    address: 'TBWPAANQsmzCSXv8eoPmXi5L4ncnhAzhYE',
    txHash: '5245e6963e10ed364bd495c82f93eb54a8cad1cc544a46965cdcc7d64c0e2101',
    remarks: 'Off-chain Transfer 358295850674',
    confirmations: '10 / 1',
    // Kraken fields
    refId: 'FTfQp7T-yAVoQF...7ImvqpOYZfoBmf',
    transactionId: 'TXF2WR6-TI5E6-PGW7T5',
    onchainTxId: '0xba50...02a4be0',
    // Coinbase-specific example fields (optional)
    fiatAmount: '≈£261.67',
    price: '',
    toAddress: '',
    networkFeeFiat: '',
    confirmationsCount: '',
    note: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = () => {
    if (statusState === 'loading') return;
    setStatusState('loading');

    setTimeout(() => {
      setStatusState('done');

      const receiptId = `rcpt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
      const savedData = { ...formData, deviceType, platform, receiptId };

      try {
        localStorage.setItem('latestReceiptData', JSON.stringify(savedData));
      } catch (e) { console.warn(e); }

      navigate('/receipt', { state: { receiptData: savedData } });

      setTimeout(() => setStatusState('idle'), 800);
    }, 900);
  };

  const getButtonText = () => {
    if (statusState === 'loading') return '⏳ Generating...';
    if (statusState === 'done') return '✅ Completed';
    return '🔄 Generate Receipt';
  };

  // Build preview data for each platform
  const previewData = useMemo(() => {
    const base = {
      withdrawalAmount: formData.withdrawalAmount,
      currency: formData.currency,
      fee: formData.fee,
      status: formData.status,
      network: formData.network,
      onchainTxId: formData.onchainTxId || formData.txHash || '',
      address: formData.address,
      withdrawalAddress: formData.address,
      txHash: formData.txHash,
      timestamp: formData.timestamp,
      date: formData.timestamp,
      withdrawalAccount: formData.withdrawalAccount,
      refId: formData.refId,
      transactionId: formData.transactionId,
      remarks: formData.remarks,
      receiptId: `rcpt_preview_${Math.random().toString(36).slice(2,8)}`,
      // coinbase extras
      fiatAmount: formData.fiatAmount,
      price: formData.price,
      toAddress: formData.toAddress || formData.address,
      networkFeeFiat: formData.networkFeeFiat,
      confirmationsCount: formData.confirmationsCount,
      note: formData.note,
    };

    if ((platform || '').toLowerCase() === 'binance') {
      return {
        withdrawalAmount: base.withdrawalAmount,
        amount: base.withdrawalAmount,
        currency: base.currency,
        status: base.status,
        network: base.network,
        address: base.address,
        txid: base.onchainTxId || base.txHash || base.remarks,
        fee: base.fee,
        withdrawalAccount: base.withdrawalAccount,
        date: base.date,
        receiptId: base.receiptId,
      };
    }

    if ((platform || '').toLowerCase() === 'kraken') {
      return {
        withdrawalAmount: base.withdrawalAmount,
        currency: base.currency,
        fee: base.fee,
        total: `${base.withdrawalAmount} ${base.currency}`,
        status: base.status,
        network: base.network || 'Ethereum',
        onchainTxId: base.onchainTxId,
        withdrawalAddress: base.withdrawalAddress,
        date: base.date,
        refId: base.refId,
        transactionId: base.transactionId,
        receiptId: base.receiptId,
        fiat: base.fiatAmount || '≈£261.67',
      };
    }

    if ((platform || '').toLowerCase() === 'coinbase') {
      return {
        amount: base.withdrawalAmount,
        currency: base.currency || 'ETH',
        fiatAmount: base.fiatAmount || '≈£261.67',
        price: base.price || '',
        toAddress: base.toAddress,
        network: base.network || 'Ethereum',
        networkIcon: null,
        networkFeeFiat: base.networkFeeFiat || base.fee,
        confirmations: base.confirmationsCount || '',
        date: base.date,
        txHash: base.txHash || base.onchainTxId || base.transactionId || '',
        note: base.note || '',
        receiptId: base.receiptId,
      };
    }

    // fallback (binance-shaped)
    return {
      withdrawalAmount: base.withdrawalAmount,
      currency: base.currency,
      status: base.status,
      network: base.network,
      address: base.address,
      txid: base.onchainTxId || base.txHash || base.remarks,
      fee: base.fee,
      withdrawalAccount: base.withdrawalAccount,
      date: base.date,
      receiptId: base.receiptId,
    };
  }, [formData, platform]);

  return (
    <div className={`form-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="form-section">
        <div className="content">
          <div className="form-header">
            <h2>{platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Crypto'} Receipt Generator</h2>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          <div className="control-group">
            <label>Device Type</label>
            <div className="button-group">
              <button
                className={`btn ${deviceType === 'iphone' ? 'active' : ''}`}
                onClick={() => setDeviceType('iphone')}
                type="button"
              >
                📱 iPhone
              </button>
              <button
                className={`btn ${deviceType === 'android' ? 'active' : ''}`}
                onClick={() => setDeviceType('android')}
                type="button"
              >
                🤖 Android
              </button>
            </div>
          </div>

          {!platformParam && (
            <div className="control-group">
              <label>Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                <option value="binance">Binance</option>
                <option value="kraken">Kraken</option>
                <option value="coinbase">Coinbase</option>
                <option value="revolut">Revolut</option>
                <option value="okx">OKX</option>
              </select>
            </div>
          )}

          <div className="inputs-grid">
            <div className="input-group">
              <label>Amount</label>
              <input type="text" name="withdrawalAmount" value={formData.withdrawalAmount} onChange={handleInputChange} />
            </div>

            <div className="input-group">
              <label>Currency</label>
              <input type="text" name="currency" value={formData.currency} onChange={handleInputChange} />
            </div>

            <div className="input-group">
              <label>Network</label>
              <input type="text" name="network" value={formData.network} onChange={handleInputChange} />
            </div>

            <div className="input-group">
              <label>Network Fee</label>
              <input type="text" name="fee" value={formData.fee} onChange={handleInputChange} />
            </div>

            <div className="input-group">
              <label>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
            </div>

            <div className="input-group">
              <label>Txid / Remarks</label>
              <input type="text" name="remarks" value={formData.remarks} onChange={handleInputChange} />
            </div>

            <div className="input-group">
              <label>Wallet</label>
              <input type="text" name="withdrawalAccount" value={formData.withdrawalAccount} onChange={handleInputChange} />
            </div>

            <div className="input-group">
              <label>Date & Time</label>
              <input type="text" name="timestamp" value={formData.timestamp} onChange={handleInputChange} />
            </div>

            <div className="input-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange}>
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
                <option>Success</option>
              </select>
            </div>

            {platform === 'kraken' && (
              <>
                <div className="input-group">
                  <label>Ref ID</label>
                  <input type="text" name="refId" value={formData.refId} onChange={handleInputChange} />
                </div>

                <div className="input-group">
                  <label>Transaction ID</label>
                  <input type="text" name="transactionId" value={formData.transactionId} onChange={handleInputChange} />
                </div>

                <div className="input-group">
                  <label>On-chain Tx ID</label>
                  <input type="text" name="onchainTxId" value={formData.onchainTxId} onChange={handleInputChange} />
                </div>
              </>
            )}

            {platform === 'coinbase' && (
              <>
                <div className="input-group">
                  <label>Fiat amount</label>
                  <input type="text" name="fiatAmount" value={formData.fiatAmount} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Price</label>
                  <input type="text" name="price" value={formData.price} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>To Address</label>
                  <input type="text" name="toAddress" value={formData.toAddress} onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Note</label>
                  <input type="text" name="note" value={formData.note} onChange={handleInputChange} />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className={`generate-btn ${statusState}`} onClick={handleGenerate} type="button">
            {getButtonText()}
          </button>
        </div>
      </div>

      <div className="preview-section">
        <div className="content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MobileFrame deviceType={deviceType} isDarkMode={isDarkMode}>
            {platform === 'kraken' ? (
              <KrakenReceipt data={previewData} isDarkMode={isDarkMode} />
            ) : platform === 'coinbase' ? (
              <CoinbaseReceipt data={previewData} isDarkMode={isDarkMode} />
            ) : (
              <BinanceReceipt data={{
                amount: previewData.withdrawalAmount,
                withdrawalAmount: previewData.withdrawalAmount,
                currency: previewData.currency,
                status: previewData.status,
                network: previewData.network,
                address: previewData.address,
                txid: previewData.txid,
                fee: previewData.fee,
                account: previewData.withdrawalAccount,
                date: previewData.date,
                receiptId: previewData.receiptId
              }} isDarkMode={isDarkMode} />
            )}
          </MobileFrame>
        </div>
      </div>
    </div>
  );
};