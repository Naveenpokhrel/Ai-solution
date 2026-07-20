import React from 'react';

export default function Error404Page({ navigateTo }) {
  return (
    <div className="section error-page">
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-desc">We apologize, but the digital blueprint or URL pathway you are seeking does not exist in our system router.</p>
        <button className="btn btn-primary" onClick={() => navigateTo('home')}>Return to System Home</button>
      </div>
    </div>
  );
}
