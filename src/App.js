// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ReceiptForm } from './components/ReceiptForm'; // named export in your file
import FormRouter from './pages/FormRouter.jsx'; // ensure this file exists
import ReceiptPage from './pages/ReceiptPage.jsx'; // explicit .jsx path
import WalletsPage from './pages/WalletsPage.jsx'; // explicit .jsx path
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<WalletsPage />} />

        {/* Per-wallet route: /form/:platform -> FormRouter chooses the correct form component */}
        <Route path="/form/:platform" element={<FormRouter />} />

        {/* Generic fallback form (shows fields for a selected wallet or the generic picker) */}
        <Route path="/form" element={<ReceiptForm />} />

        <Route path="/receipt" element={<ReceiptPage />} />

        {/* Unknown route -> home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
