import React from 'react';

export default function Error500Page({ navigateTo }) {
  return (
    <div className="section error-page">
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 className="error-code" style={{ color: '#6b7280' }}>500</h1>
        <h2 className="error-title">Internal Server Error</h2>
        <p className="error-desc">Critical socket exception. The central backend server encountered an unexpected error. Our system engineers are responding.</p>
        <button className="btn btn-primary" onClick={() => navigateTo('home')}>Return to System Home</button>
      </div>
    </div>
  );
}
