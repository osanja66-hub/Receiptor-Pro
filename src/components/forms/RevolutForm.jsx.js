// src/components/forms/RevolutForm.jsx
import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { MobileFrame } from '../MobileFrame';
import RevolutReceipt from '../RevolutReceipt'; // default export provided earlier
import { saveAndNavigate, generateReceiptId } from '../../utils/receiptUtils';
import '../../components/ReceiptForm.css';

export default function RevolutForm() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const platform = 'revolut';
  const [deviceType, setDeviceType] = useState('iphone');
  const [statusState, setStatusState] = useState('idle');

  const [formData, setFormData] = useState({
    toName: 'Rimsha Yousuf',
    initials: 'RY',
    amount: '-53.19',
    currency: 'USDT',
    date: new Date().toISOString(),
    steps: [
      { label: 'Request processed', time: new Date().toISOString(), done: true },
      { label: "Received by recipient’s address", time: new Date().toISOString(), done: true }
    ],
    txHash: '44a457...4bc7a9',
    walletAddress: 'TZ7HtF...LSBUGS',
    network: 'Tron',
    withdrawnAmount: 46.825311,
    withdrawnFiat: '€39.48',
    fees: 6.373564,
    feesFiat: '€5.37',
    total: 53.198875,
    totalFiat: '€44.85'
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
    toName: formData.toName,
    initials: formData.initials,
    amount: formData.amount,
    currency: formData.currency,
    date: formData.date,
    steps: formData.steps,
    txHash: formData.txHash,
    walletAddress: formData.walletAddress,
    network: formData.network,
    withdrawnAmount: formData.withdrawnAmount,
    withdrawnFiat: formData.withdrawnFiat,
    fees: formData.fees,
    feesFiat: formData.feesFiat,
    total: formData.total,
    totalFiat: formData.totalFiat
  }), [formData]);

  return (
    <div className={`form-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="form-section">
        <div className="content">
          <div className="form-header">
            <h2>Revolut Receipt</h2>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          <div className="control-group">
            <label>Device Type</label>
            <div className="button-group">
              <button className={`btn ${deviceType === 'iphone' ? 'active' : ''}`} onClick={() => setDeviceType('iphone')} type="button">iPhone</button>
              <button className={`btn ${deviceType === 'android' ? 'active' : ''}`} onClick={() => setDeviceType('android')} type="button">Android</button>
            </div>
          </div>

          <div className="inputs-grid">
            <div className="input-group"><label>To name</label><input name="toName" value={formData.toName} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Initials</label><input name="initials" value={formData.initials} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Amount (display)</label><input name="amount" value={formData.amount} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Currency</label><input name="currency" value={formData.currency} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Date & Time</label><input name="date" value={formData.date} onChange={handleInputChange} /></div>

            <div className="input-group"><label>Tx Hash</label><input name="txHash" value={formData.txHash} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Wallet address</label><input name="walletAddress" value={formData.walletAddress} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Network</label><input name="network" value={formData.network} onChange={handleInputChange} /></div>

            <div className="input-group"><label>Amount withdrawn</label><input name="withdrawnAmount" value={formData.withdrawnAmount} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Withdrawn fiat</label><input name="withdrawnFiat" value={formData.withdrawnFiat} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Fees</label><input name="fees" value={formData.fees} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Fees fiat</label><input name="feesFiat" value={formData.feesFiat} onChange={handleInputChange} /></div>

            <div className="input-group"><label>Total</label><input name="total" value={formData.total} onChange={handleInputChange} /></div>
            <div className="input-group"><label>Total fiat</label><input name="totalFiat" value={formData.totalFiat} onChange={handleInputChange} /></div>
          </div>
        </div>

        <div className="form-actions">
          <button className={`generate-btn ${statusState}`} onClick={handleGenerate} type="button">
            {statusState === 'loading' ? 'Generating…' : 'Generate Revolut Receipt'}
          </button>
        </div>
      </div>

      <div className="preview-section">
        <div className="content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MobileFrame deviceType={deviceType} isDarkMode={isDarkMode}>
            <RevolutReceipt data={previewData} isDarkMode={isDarkMode} />
          </MobileFrame>
        </div>
      </div>
    </div>
  );
}