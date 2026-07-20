import React, { useState, useEffect } from 'react';
import SkeletonCard from '../components/SkeletonCard.jsx';

export default function ProjectsPage({ projects, loading }) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 3;

  const filtered = projects.filter(proj =>
    proj.title.toLowerCase().includes(search.toLowerCase()) ||
    proj.description.toLowerCase().includes(search.toLowerCase()) ||
    proj.clientName.toLowerCase().includes(search.toLowerCase())
  );

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filtered.length / limit);
  const paginatedProjects = filtered.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <div className="section">
      <div className="container">
        <div className="section-title-wrapper">
          <h1 className="section-title">Industry Projects & Case Studies</h1>
          <p className="section-subtitle">Discover how we help organizations overcome technical hurdles and optimize resources.</p>
        </div>

        {/* Search filter */}
        <div className="search-bar" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="Search case studies..."
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
            📂 No case studies match your query. Try searching for "logistics" or "payment".
          </div>
        ) : (
          <>
            <div className="card-grid">
              {paginatedProjects.map((proj) => (
                <div key={proj._id} className="project-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <img src={proj.imageUrl} alt={proj.title} className="project-img" />
                  <div className="project-body" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div className="project-meta">
                      <span>Client: <strong>{proj.clientName}</strong></span>
                      <span>{proj.date}</span>
                    </div>
                    <h3 className="project-title" style={{ fontSize: '18px' }}>{proj.title}</h3>
                    <p className="project-desc" style={{ flexGrow: 1 }}>{proj.description}</p>

                    {proj.details && (
                      <div style={{ marginTop: '15px', padding: '12px', backgroundColor: 'var(--color-bg-light)', borderLeft: '3px solid var(--color-accent)', fontSize: '13px', fontStyle: 'italic', marginBottom: '15px' }}>
                        {proj.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="pagination-bar">
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  ◀ Prev
                </button>
                <span className="pagination-info">Page {currentPage} of {totalPages}</span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                >
                  Next ▶
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
