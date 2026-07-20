import React, { useState, useEffect } from 'react';
import SkeletonCard from '../components/SkeletonCard.jsx';

export default function GalleryPage({ gallery, loading }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeImage, setActiveImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 4;

  const categories = ['All', 'Events', 'Office', 'Projects'];

  const filteredGallery = gallery.filter(item => selectedCategory === 'All' || item.category === selectedCategory);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const totalPages = Math.ceil(filteredGallery.length / limit);
  const paginatedGallery = filteredGallery.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <div className="section">
      <div className="container">
        <div className="section-title-wrapper">
          <h1 className="section-title">Event Gallery</h1>
          <p className="section-subtitle">Insights into our hackathons, summit keynotes, and physical workstations.</p>
        </div>

        {/* Filters */}
        <div className="gallery-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="card-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredGallery.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', fontSize: '15px' }}>
            🖼 No event gallery items found.
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="gallery-grid">
              {paginatedGallery.map((item) => (
                <div key={item._id} className="gallery-item" onClick={() => setActiveImage(item)}>
                  <img src={item.imageUrl} alt={item.caption} className="gallery-item-img" />
                  <div className="gallery-caption">
                    <span className="gallery-caption-text">{item.caption}</span>
                    {item.eventId && (
                      <span className="gallery-event-link" style={{ display: 'block', fontSize: '11px', color: 'var(--color-accent)', marginTop: '4px', fontWeight: '600' }}>
                        📅 {item.eventId.title}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-bar" style={{ marginTop: '40px' }}>
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

      {/* Lightbox Overlay */}
      {activeImage && (
        <div className="modal-overlay" onClick={() => setActiveImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveImage(null)}>×</button>
            <div className="modal-body" style={{ padding: '20px' }}>
              <img src={activeImage.imageUrl} alt={activeImage.caption} style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              <div style={{ marginTop: '15px', textAlign: 'center', fontWeight: '500', fontSize: '15px' }}>
                {activeImage.caption}
              </div>
              {activeImage.eventId && (
                <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-primary)', marginTop: '6px', fontWeight: '600' }}>
                  Linked Event: 📅 {activeImage.eventId.title}
                </div>
              )}
              <div style={{ textAlign: 'center', color: 'var(--color-accent)', fontSize: '12px', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Category: {activeImage.category}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
