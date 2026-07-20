import React from 'react';

export default function Toast({ toast, setToast }) {
  if (!toast.show) return null;

  return (
    <div className={`toast-alert toast-${toast.type}`}>
      <span className="toast-icon">✓</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close-btn" onClick={() => setToast({ show: false, message: '', type: 'success' })}>×</button>
    </div>
  );
}
