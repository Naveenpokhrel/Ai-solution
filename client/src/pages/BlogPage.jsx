import React, { useState, useEffect } from 'react';
import SkeletonCard from '../components/SkeletonCard.jsx';

export default function BlogPage({ articles, loading }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [readingArticle, setReadingArticle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 3;

  const categories = ['All', 'Artificial Intelligence', 'Cybersecurity', 'DevOps'];

  // Filter Articles
  const filteredArticles = articles.filter((art) => {
    const matchesSearch = art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.description.toLowerCase().includes(search.toLowerCase()) ||
      art.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Reset page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const totalPages = Math.ceil(filteredArticles.length / limit);
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * limit, currentPage * limit);

  const featuredArticle = articles.find(art => art.featured) || articles[0];

  return (
    <div className="section">
      <div className="container">
        <div className="section-title-wrapper">
          <h1 className="section-title">Articles & Engineering Blogs</h1>
          <p className="section-subtitle">Deep dives, technical roadmaps, and software development practices.</p>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search articles..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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
        ) : filteredArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', fontSize: '15px' }}>
            ✍ No articles match your search or category selection. Try a different query.
          </div>
        ) : (
          <>
            {/* FEATURED ARTICLE (Show only if category is 'All' and search is empty and page is 1) */}
            {featuredArticle && !search && selectedCategory === 'All' && currentPage === 1 && (
              <div className="featured-blog">
                <img src={featuredArticle.imageUrl} alt={featuredArticle.title} className="featured-blog-img" />
                <div className="featured-blog-body">
                  <span className="blog-category">Featured // {featuredArticle.category}</span>
                  <h2 className="blog-title">{featuredArticle.title}</h2>
                  <p className="blog-desc">{featuredArticle.description}</p>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '15px', display: 'flex', gap: '15px' }}>
                    <span>⏱ {Math.ceil(featuredArticle.content.split(' ').length / 200)} min read</span>
                  </div>
                  <div className="blog-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>By {featuredArticle.author}</span>
                    <button className="btn btn-primary" onClick={() => setReadingArticle(featuredArticle)}>Read Full Post</button>
                  </div>
                </div>
              </div>
            )}

            {/* ARTICLES LIST GRID */}
            <div className="card-grid">
              {paginatedArticles.map((art) => {
                const readTime = Math.ceil(art.content.split(' ').length / 200);
                return (
                  <div key={art._id} className="card" style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={() => setReadingArticle(art)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <span className="blog-category" style={{ margin: 0 }}>{art.category}</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: '600' }}>⏱ {readTime} min read</span>
                    </div>
                    <h3 className="card-title" style={{ fontSize: '18px' }}>{art.title}</h3>
                    <p className="card-desc" style={{ flexGrow: 1 }}>{art.description}</p>
                    <div className="blog-meta" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span>By {art.author.split(' (')[0]}</span>
                      <span>{new Date(art.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
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

      {/* READING ARTICLE MODAL */}
      {readingArticle && (
        <div className="modal-overlay" onClick={() => setReadingArticle(null)}>
          <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setReadingArticle(null)}>×</button>
            <div className="modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <span className="blog-category" style={{ display: 'block', marginBottom: '8px' }}>{readingArticle.category}</span>
              <h2 className="blog-title" style={{ fontSize: '26px', lineHeight: '1.3' }}>{readingArticle.title}</h2>
              <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px', display: 'flex', gap: '20px' }}>
                <span>Author: <strong>{readingArticle.author}</strong></span>
                <span>Date: {new Date(readingArticle.date).toLocaleDateString()}</span>
                <span>⏱ Read Time: <strong>{Math.ceil(readingArticle.content.split(' ').length / 200)} min read</strong></span>
              </div>
              <img src={readingArticle.imageUrl} alt={readingArticle.title} style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', borderRadius: '4px', marginBottom: '25px', border: '1px solid var(--color-border)' }} />
              <div style={{ fontSize: '15px', color: 'var(--color-text)', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {readingArticle.content}
              </div>
              <div style={{ marginTop: '40px', borderTop: '1px solid var(--color-border)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setReadingArticle(null)}>Back to Articles</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
