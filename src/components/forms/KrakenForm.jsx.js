import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { MobileFrame } from '../MobileFrame';
import KrakenReceipt from '../KrakenReceipt';
import { saveAndNavigate, generateReceiptId } from '../../utils/receiptUtils';
import '../../components/ReceiptForm.css';

export default function KrakenForm() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const platform = 'kraken';
  const [deviceType, setDeviceType] = useState('iphone');
  const [statusState, setStatusState] = useState('idle');

  const [formData, setFormData] = useState({
    withdrawalAmount: '0.1525829282',
    currency: 'ETH',
    fee: '0.00015',
    total: '0.1525829282',
    network: 'Ethereum',
    onchainTxId: '0xba50...02a4be0',
    withdrawalAddress: '0xa24d57...398c1580',
    timestamp: new Date().toISOString(),
    status: 'Success',
    refId: 'FTfQp7T-yAVoQF...7ImvqpOYZfoBmf',
    transactionId: 'TXF2WR6-TI5E6-PGW7T5',
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
    withdrawalAmount: formData.withdrawalAmount,
    currency: formData.currency,
    fee: formData.fee,
    total: formData.total,
    status: formData.status,
    network: formData.network,
    onchainTxId: formData.onchainTxId,
    withdrawalAddress: formData.withdrawalAddress,
    date: formData.timestamp,
    refId: formData.refId,
    transactionId: formData.transactionId,
    receiptId: `preview_${Math.random().toString(36).slice(2,8)}`
  }), [formData]);

  return (
    <div className={`form-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="form-section">
        <div className="content">
          <div className="form-header">
            <h2>Kraken Receipt</h2>
            <button className="theme-toggle-btn" onClick={toggleTheme}>{isDarkMode ? 'Light' : 'Dark'}</button>
          </div>

          <div className="control-group">
            <label>Device Type</label>
            <div className="button-group">
              <button className={`btn ${deviceType === 'iphone' ? 'active' : ''}`} onClick={() => setDeviceType('iphone')}>iPhone</button>
              <button className={`btn ${deviceType === 'android' ? 'active' : ''}`} onClick={() => setDeviceType('android')}>Android</button>
            </div>
          </div>

          <div className="inputs-grid">
            <div className="input-group"><label>Amount</label><input name="withdrawalAmount" value={formData.withdrawalAmount} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Currency</label><input name="currency" value={formData.currency} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Fee</label><input name="fee" value={formData.fee} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Network</label><input name="network" value={formData.network} onChange={handleInputChange} /></div>
            <div className="input-group"><label>On-chain Tx ID</label><input name="onchainTxId" value={formData.onchainTxId} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Withdrawal address</label><input name="withdrawalAddress" value={formData.withdrawalAddress} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Date & Time</label><input name="timestamp" value={formData.timestamp} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange}><option>Success</option><option>Pending</option><option>Failed</option></select>
            </div>
            <div className="input-group"><label>Ref ID</label><input name="refId" value={formData.refId} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Transaction ID</label><input name="transactionId" value={formData.transactionId} onChange={handleInputChange} /></div>
          </div>
        </div>

        <div className="form-actions">
          <button className={`generate-btn ${statusState}`} onClick={handleGenerate}>
            {statusState === 'loading' ? 'Generating…' : 'Generate Kraken Receipt'}
          </button>
        </div>
      </div>

      <div className="preview-section">
        <div className="content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MobileFrame deviceType={deviceType} isDarkMode={isDarkMode}>
            <KrakenReceipt data={previewData} isDarkMode={isDarkMode} />
          </MobileFrame>
        </div>
      </div>
    </div>
  );
}