// src/utils/receiptUtils.js
export function generateReceiptId() {
  return `rcpt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
}

/**
 * Save receipt to localStorage and navigate to /receipt with state.
 * Ensures platform + receiptId are present.
 */
export function saveAndNavigate({ data, navigate, storageKey = 'latestReceiptData' }) {
  if (!data.platform) {
    console.warn('saveAndNavigate: platform missing on data', data);
  }
  if (!data.receiptId) data.receiptId = generateReceiptId();
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save receipt to localStorage', e);
  }
  navigate('/receipt', { state: { receiptData: data } });
}