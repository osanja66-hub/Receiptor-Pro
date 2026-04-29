import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { MobileFrame } from '../MobileFrame';
import CoinbaseReceipt from '../CoinbaseReceipt';
import { saveAndNavigate, generateReceiptId } from '../../utils/receiptUtils';
import '../../components/ReceiptForm.css';

export default function CoinbaseForm() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const platform = 'coinbase';
  const [deviceType, setDeviceType] = useState('iphone');
  const [statusState, setStatusState] = useState('idle');

  const [formData, setFormData] = useState({
    amount: '0.1525829282',
    currency: 'ETH',
    fiatAmount: '≈£261.67',
    price: '',
    toAddress: '0xa24d57...398c1580',
    network: 'Ethereum',
    networkFeeFiat: '£0.05',
    confirmationsCount: '12',
    date: new Date().toISOString(),
    txHash: '0xba50...02a4be0',
    note: '',
    status: 'Completed',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = () => {
    if (statusState === 'loading') return;
    setStatusState('loading');

    setTimeout(() => {
      const receiptId = generateReceiptId();
      const saved = { ...formData, deviceType, platform, receiptId };
      saveAndNavigate({ data: saved, navigate });
      setStatusState('done');
      setTimeout(() => setStatusState('idle'), 700);
    }, 600);
  };

  const previewData = useMemo(() => ({
    amount: formData.amount,
    currency: formData.currency,
    fiatAmount: formData.fiatAmount,
    price: formData.price,
    toAddress: formData.toAddress,
    network: formData.network,
    networkIcon: null,
    networkFeeFiat: formData.networkFeeFiat,
    confirmations: formData.confirmationsCount,
    date: formData.date,
    txHash: formData.txHash,
    note: formData.note,
    status: formData.status,
    receiptId: `preview_${Math.random().toString(36).slice(2,8)}`
  }), [formData]);

  return (
    <div className={`form-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="form-section">
        <div className="content">
          <div className="form-header">
            <h2>Coinbase Receipt</h2>
            <button className="theme-toggle-btn" onClick={toggleTheme}>{isDarkMode ? 'Light' : 'Dark'}</button>
          </div>

          <div className="control-group">
            <label>Device Type</label>
            <div className="button-group">
              <button className={`btn ${deviceType === 'iphone' ? 'active' : ''}`} onClick={() => setDeviceType('iphone')} type="button">iPhone</button>
              <button className={`btn ${deviceType === 'android' ? 'active' : ''}`} onClick={() => setDeviceType('android')} type="button">Android</button>
            </div>
          </div>

          <div className="inputs-grid">
            <div className="input-group"><label>Amount</label><input name="amount" value={formData.amount} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Currency</label><input name="currency" value={formData.currency} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Fiat amount (estimate)</label><input name="fiatAmount" value={formData.fiatAmount} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Price</label><input name="price" value={formData.price} onChange={handleInputChange} /></div>
            <div className="input-group"><label>To address</label><input name="toAddress" value={formData.toAddress} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Network</label><input name="network" value={formData.network} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Network fee (fiat)</label><input name="networkFeeFiat" value={formData.networkFeeFiat} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Confirmations</label><input name="confirmationsCount" value={formData.confirmationsCount} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Date & Time</label><input name="date" value={formData.date} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Tx Hash</label><input name="txHash" value={formData.txHash} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Note</label><input name="note" value={formData.note} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange}><option>Completed</option><option>Pending</option><option>Failed</option></select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className={`generate-btn ${statusState}`} onClick={handleGenerate}>
            {statusState === 'loading' ? 'Generating…' : 'Generate Coinbase Receipt'}
          </button>
        </div>
      </div>

      <div className="preview-section">
        <div className="content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MobileFrame deviceType={deviceType} isDarkMode={isDarkMode}>
            <CoinbaseReceipt data={previewData} isDarkMode={isDarkMode} />
          </MobileFrame>
        </div>
      </div>
    </div>
  );
}