import React, { useState } from 'react';
import { API_URL } from '../config/config.js';

export default function TestimonialsPage({ testimonials, setTestimonials, setToast }) {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 4;

  // Testimonial Form State
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    reviewText: '',
    rating: 5
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.companyName || !formData.reviewText) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newTest = await res.json();
        setTestimonials((prev) => [newTest, ...prev]);
        setError('');
        setFormData({ customerName: '', companyName: '', reviewText: '', rating: 5 });
        setToast({ show: true, message: "Thank you for sharing your experience!", type: 'success' });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
      } else {
        setError("Error submitting testimonial.");
      }
    } catch (err) {
      // Offline fallback push
      const mockTest = {
        _id: Math.random().toString(),
        customerName: formData.customerName,
        companyName: formData.companyName,
        reviewText: formData.reviewText,
        rating: Number(formData.rating),
        createdAt: new Date().toISOString()
      };
      setTestimonials((prev) => [mockTest, ...prev]);
      setError('');
      setFormData({ customerName: '', companyName: '', reviewText: '', rating: 5 });
      setToast({ show: true, message: "Review posted in demo offline mode!", type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    }
  };

  const totalRating = testimonials.reduce((sum, t) => sum + t.rating, 0);
  const average = testimonials.length > 0 ? (totalRating / testimonials.length).toFixed(1) : "0.0";
  const numReviews = testimonials.length;

  const totalPages = Math.ceil(testimonials.length / limit);
  const paginatedTestimonials = testimonials.slice((currentPage - 1) * limit, currentPage * limit);

  return (
    <div className="section">
      <div className="container">
        <div className="section-title-wrapper">
          <h1 className="section-title">Client Endorsements & Ratings</h1>
          <p className="section-subtitle">Reviews from enterprise executives and operations managers.</p>
        </div>

        {/* Rating Summary Card */}
        <div className="testimonials-rating-summary">
          <div className="testimonials-rating-score">{average}</div>
          <div>
            <div className="testimonials-rating-stars">{"★".repeat(Math.round(Number(average)))}</div>
            <div className="testimonials-rating-label">Partner Rating Average ({numReviews} Reviews)</div>
          </div>
        </div>

        <div className="testimonials-grid" style={{ marginBottom: '60px' }}>
          {paginatedTestimonials.map((test) => (
            <div key={test._id} className="testimonial-item">
              <div className="stars" style={{ marginBottom: '10px' }}>{"★".repeat(test.rating)}</div>
              <p style={{ fontSize: '14px', fontStyle: 'italic', marginBottom: '15px', color: 'var(--color-primary)' }}>"{test.reviewText}"</p>
              <div style={{ fontSize: '13px', fontWeight: '600' }}>{test.customerName}</div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{test.companyName}</div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-bar" style={{ marginBottom: '60px' }}>
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

        {/* Form to submit review */}
        <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid var(--color-border)', padding: '40px', borderRadius: '6px', backgroundColor: 'var(--color-bg-white)' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--color-primary)' }}>Submit Your Partner Feedback</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>We value your feedback. Let other businesses know about your development experience.</p>

          {error && <div className="form-error" style={{ marginBottom: '15px' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Job Title / Company Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. VP of IT, Acme Corp"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Feedback Review Text</label>
              <textarea
                className="form-input"
                style={{ height: '100px', resize: 'vertical' }}
                value={formData.reviewText}
                onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Star Rating</label>
              <select
                className="form-input"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★</option>
                <option value={3}>3 Stars ★★★</option>
                <option value={2}>2 Stars ★★</option>
                <option value={1}>1 Star ★</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Post Feedback</button>
          </form>
        </div>
      </div>
    </div>
  );
}
