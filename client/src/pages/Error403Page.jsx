import React from 'react';

export default function Error403Page({ navigateTo }) {
  return (
    <div className="section error-page">
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 className="error-code" style={{ color: '#ef4444' }}>403</h1>
        <h2 className="error-title">Access Forbidden</h2>
        <p className="error-desc">Authorization required. Your security credentials do not grant read/write access to this restricted folder.</p>
        <button className="btn btn-primary" onClick={() => navigateTo('home')}>Return to System Home</button>
      </div>
    </div>
  );
}
