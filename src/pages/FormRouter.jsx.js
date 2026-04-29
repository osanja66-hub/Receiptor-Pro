// src/pages/FormRouter.jsx
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

// Per-wallet forms (explicit .jsx imports to avoid resolver ambiguity)
import BinanceForm from '../components/forms/BinanceForm.jsx';
import KrakenForm from '../components/forms/KrakenForm.jsx';
import CoinbaseForm from '../components/forms/CoinbaseForm.jsx';
import RevolutForm from '../components/forms/RevolutForm.jsx'; // <-- added

const FORM_MAP = {
  binance: BinanceForm,
  kraken: KrakenForm,
  coinbase: CoinbaseForm,
  revolut: RevolutForm, // <-- added
  // add more: okx, etc.
};

export default function FormRouter() {
  const { platform } = useParams();
  const key = (platform || '').toString().toLowerCase().trim();

  // If /form was opened without :platform, redirect to generic form
  if (!key) return <Navigate to="/form" replace />;

  const Component = FORM_MAP[key];

  if (!Component) {
    // Unknown platform — redirect to generic form
    return <Navigate to="/form" replace />;
  }

  return <Component />;
}