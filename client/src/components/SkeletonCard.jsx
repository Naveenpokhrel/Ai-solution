import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image pulsing"></div>
      <div className="skeleton-body">
        <div className="skeleton-title pulsing"></div>
        <div className="skeleton-desc pulsing"></div>
        <div className="skeleton-desc pulsing" style={{ width: '80%' }}></div>
        <div className="skeleton-meta pulsing" style={{ width: '50%', marginTop: '15px' }}></div>
      </div>
    </div>
  );
}
