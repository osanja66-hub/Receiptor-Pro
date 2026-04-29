import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { MobileFrame } from '../MobileFrame';
import { BinanceReceipt } from '../BinanceReceipt'; // named export in your repo
import { saveAndNavigate, generateReceiptId } from '../../utils/receiptUtils';
import '../../components/ReceiptForm.css';

export default function BinanceForm() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const platform = 'binance';
  const [deviceType, setDeviceType] = useState('android');
  const [statusState, setStatusState] = useState('idle');

  const [formData, setFormData] = useState({
    withdrawalAmount: '71',
    currency: 'USDT',
    fee: '0',
    network: 'TRX',
    address: 'TBWPAANQsmzCSXv8eoPmXi5L4ncnhAzhYE',
    txHash: '', // or put a tx hash here
    remarks: 'Off-chain Transfer 358295850674',
    withdrawalAccount: 'Spot Wallet',
    timestamp: new Date().toISOString(),
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

  // IMPORTANT: map preview keys to what BinanceReceipt expects:
  // - withdrawalAccount (wallet)
  // - timestamp (date)
  // - remarks (used by the receipt for Txid)
  const previewData = useMemo(() => ({
    withdrawalAmount: formData.withdrawalAmount,
    currency: formData.currency,
    status: formData.status,
    network: formData.network,
    address: formData.address,
    remarks: formData.remarks || formData.txHash || '', // BinanceReceipt expects `remarks`
    fee: formData.fee,
    withdrawalAccount: formData.withdrawalAccount, // wallet field expected by BinanceReceipt
    timestamp: formData.timestamp, // timestamp expected by BinanceReceipt
    receiptId: `preview_${Math.random().toString(36).slice(2,8)}`
  }), [formData]);

  return (
    <div className={`form-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="form-section">
        <div className="content">
          <div className="form-header">
            <h2>Binance Receipt</h2>
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
            <div className="input-group"><label>Amount</label><input name="withdrawalAmount" value={formData.withdrawalAmount} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Currency</label><input name="currency" value={formData.currency} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Network</label><input name="network" value={formData.network} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Network Fee</label><input name="fee" value={formData.fee} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Address</label><input name="address" value={formData.address} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Tx Hash / Remarks</label><input name="remarks" value={formData.remarks} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Wallet</label><input name="withdrawalAccount" value={formData.withdrawalAccount} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Date & Time</label><input name="timestamp" value={formData.timestamp} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange}><option>Completed</option><option>Pending</option><option>Failed</option></select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className={`generate-btn ${statusState}`} onClick={handleGenerate}>
            {statusState === 'loading' ? 'Generating…' : 'Generate Receipt'}
          </button>
        </div>
      </div>

      <div className="preview-section">
        <div className="content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MobileFrame deviceType={deviceType} isDarkMode={isDarkMode}>
            <BinanceReceipt data={previewData} isDarkMode={isDarkMode} />
          </MobileFrame>
        </div>
      </div>
    </div>
  );
}