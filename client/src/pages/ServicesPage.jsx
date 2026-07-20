import React, { useState } from 'react';
import SkeletonCard from '../components/SkeletonCard.jsx';

export default function ServicesPage({ solutions, loading, navigateTo }) {
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = solutions.filter(sol =>
    sol.title.toLowerCase().includes(search.toLowerCase()) ||
    sol.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="section">
      <div className="container">
        <div className="section-title-wrapper">
          <h1 className="section-title">Software Solutions & Services</h1>
          <p className="section-subtitle">We design, build, and deploy systems following strict engineering standards.</p>
        </div>

        {/* Search bar */}
        <div className="search-bar" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="Search our solutions..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: '400px' }}
          />
        </div>

        {loading ? (
          <div className="card-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', fontSize: '15px' }}>
            🔍 No solutions match your query. Try searching for other terms like "analytics" or "custom".
          </div>
        ) : (
          <div className="card-grid">
            {filtered.map((sol) => (
              <div key={sol._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-icon">💻</div>
                <h3 className="card-title">{sol.title}</h3>
                <p className="card-desc" style={{ flexGrow: 1 }}>{sol.description}</p>
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedSolution(sol)}>Learn More</button>
                  <button className="btn btn-primary" onClick={() => navigateTo('contact')}>Inquire</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SERVICE DETAILS DIALOG / MODAL */}
      {selectedSolution && (
        <div className="modal-overlay" onClick={() => setSelectedSolution(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedSolution(null)}>×</button>
            <div className="modal-body">
              <h2 className="section-title" style={{ textAlign: 'left', fontSize: '24px', marginBottom: '15px' }}>{selectedSolution.title}</h2>
              <p style={{ marginBottom: '25px', color: 'var(--color-text-muted)' }}>{selectedSolution.description}</p>

              <h4 style={{ marginBottom: '12px', fontSize: '15px', color: 'var(--color-primary)' }}>Key Features Included:</h4>
              <ul className="card-features" style={{ listStyle: 'none', padding: 0 }}>
                {selectedSolution.details && selectedSolution.details.map((detail, idx) => (
                  <li key={idx} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                    <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span> {detail}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '30px', display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary" onClick={() => { setSelectedSolution(null); navigateTo('contact'); }}>Request Quote</button>
                <button className="btn btn-secondary" onClick={() => setSelectedSolution(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
