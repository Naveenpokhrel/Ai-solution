import React, { useState } from 'react';

export default function EventsPage({ events, gallery }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewingImagesEvent, setViewingImagesEvent] = useState(null);
  const [eventImages, setEventImages] = useState([]);
  const [activeDetailImage, setActiveDetailImage] = useState(null);

  const now = new Date();
  // Filter events based on date
  const upcomingEvents = events.filter(evt => new Date(evt.date) >= now);
  const pastEvents = events.filter(evt => new Date(evt.date) < now);

  const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  const handleViewImages = (evt) => {
    const imgs = gallery.filter(item => {
      if (!item.eventId) return false;
      const id = typeof item.eventId === 'object' ? item.eventId._id : item.eventId;
      return id === evt._id;
    });
    setEventImages(imgs);
    setViewingImagesEvent(evt);
  };

  const pad = (num) => String(num).padStart(2, '0');

  return (
    <div className="section">
      <div className="container">
        {/* Toggle tabs at top */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <div className="event-filter-container">
            <button
              className={`event-filter-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming ({upcomingEvents.length})
            </button>
            <button
              className={`event-filter-btn ${activeTab === 'past' ? 'active' : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Past Events ({pastEvents.length})
            </button>
          </div>
        </div>

        {displayedEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', fontSize: '15px' }}>
            📅 No {activeTab} events scheduled at this time.
          </div>
        ) : (
          <div className="events-grid">
            {displayedEvents.map((evt) => {
              const d = new Date(evt.date);
              const day = d.getDate();
              const month = d.toLocaleString('default', { month: 'short' });
              const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;

              // Determine event banner image (fallback if not specified in database)
              const eventImg = evt.image || (
                evt.title.toLowerCase().includes('expo') || evt.title.toLowerCase().includes('summit') || evt.isPromotional
                  ? "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600"
                  : evt.title.toLowerCase().includes('hackathon') || evt.title.toLowerCase().includes('dev')
                    ? "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600"
                    : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600"
              );

              return (
                <div key={evt._id} className="event-card">
                  <div className="event-image-container">
                    <img src={eventImg} alt={evt.title} className="event-card-img" />
                    <div className="event-date-badge-overlay">
                      <div className="event-date-badge-day">{day}</div>
                      <div className="event-date-badge-month">{month}</div>
                    </div>
                    {evt.isPromotional && (
                      <div className="event-promotional-badge">
                        ⭐ Promotional / Featured
                      </div>
                    )}
                  </div>

                  <div className="event-card-body">
                    <h3 className={`event-card-title ${evt.isPromotional ? 'promotional' : 'standard'}`}>
                      {evt.title}
                    </h3>
                    <p className="event-card-desc">{evt.description}</p>

                    <div className="event-card-actions">
                      <button className="event-action-link primary" onClick={() => setSelectedEvent(evt)}>
                        View Details →
                      </button>
                      <button className="event-action-link secondary" onClick={() => handleViewImages(evt)}>
                        View All Images
                      </button>
                    </div>
                  </div>

                  <div className="event-card-footer">
                    <div className="event-footer-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent)' }}>
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{evt.location}</span>
                    </div>
                    <div className="event-footer-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent)' }}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>Time: {time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EVENT DETAIL OVERLAY MODAL */}
      {selectedEvent && (() => {
        const relatedImages = gallery.filter(item => {
          if (!item.eventId) return false;
          const id = typeof item.eventId === 'object' ? item.eventId._id : item.eventId;
          return id === selectedEvent._id;
        });
        return (
          <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Event Details</h3>
                <button type="button" className="modal-close" onClick={() => setSelectedEvent(null)}>×</button>
              </div>
              <div className="modal-body" style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
                <div style={{ position: 'relative', height: '220px', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
                  <img
                    src={
                      selectedEvent.image || (
                        selectedEvent.title.toLowerCase().includes('expo') || selectedEvent.title.toLowerCase().includes('summit') || selectedEvent.isPromotional
                          ? "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600"
                          : selectedEvent.title.toLowerCase().includes('hackathon') || selectedEvent.title.toLowerCase().includes('dev')
                            ? "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600"
                            : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600"
                      )
                    }
                    alt={selectedEvent.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {selectedEvent.isPromotional && (
                    <div className="event-promotional-badge" style={{ top: '12px', right: '12px' }}>
                      ⭐ Promotional / Featured
                    </div>
                  )}
                </div>

                <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '16px' }}>
                  {selectedEvent.title}
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', padding: '16px', backgroundColor: 'var(--color-bg-light)', borderRadius: '8px', fontSize: '14px' }}>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Date</strong>
                    📅 {new Date(selectedEvent.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Time</strong>
                    ⏰ {`${pad(new Date(selectedEvent.date).getHours())}:${pad(new Date(selectedEvent.date).getMinutes())}`}
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <strong style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Location / Medium</strong>
                    📍 {selectedEvent.location}
                  </div>
                </div>

                <div style={{ fontSize: '15px', color: 'var(--color-text)', lineHeight: '1.6' }}>
                  <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--color-primary)' }}>About the Event</strong>
                  <p style={{ whiteSpace: 'pre-line' }}>{selectedEvent.description}</p>
                </div>

                {/* Related Event Images */}
                {relatedImages.length > 0 && (
                  <div style={{ marginTop: '24px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
                    <strong style={{ display: 'block', marginBottom: '12px', color: 'var(--color-primary)', fontSize: '15px' }}>
                      🖼️ Related Event Images ({relatedImages.length})
                    </strong>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                      {relatedImages.map((img) => (
                        <div
                          key={img._id}
                          style={{
                            borderRadius: '6px',
                            overflow: 'hidden',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-bg-light)',
                            cursor: 'pointer',
                            position: 'relative'
                          }}
                          onClick={() => setActiveDetailImage(img)}
                          className="modal-gallery-img-wrapper"
                        >
                          <div style={{ height: '90px', overflow: 'hidden' }}>
                            <img
                              src={img.imageUrl}
                              alt={img.caption}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                              }}
                              className="modal-gallery-thumbnail"
                            />
                          </div>
                          <div style={{
                            padding: '6px',
                            fontSize: '11px',
                            color: 'var(--color-text)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            textAlign: 'center',
                            fontWeight: '500'
                          }}>
                            {img.caption}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer" style={{ borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', padding: '16px 24px' }}>
                <a
                  href={`mailto:events@ai-solutions.com?subject=Registration for ${selectedEvent.title}`}
                  className="btn btn-primary"
                  style={{ textDecoration: 'none', color: '#ffffff' }}
                >
                  Register via Email
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* LIGHTBOX FOR EVENT DETAIL IMAGES */}
      {activeDetailImage && (
        <div className="modal-overlay" onClick={() => setActiveDetailImage(null)} style={{ zIndex: 1100 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
            <button className="modal-close-btn" onClick={() => setActiveDetailImage(null)}>×</button>
            <div className="modal-body" style={{ padding: '20px', textAlign: 'center' }}>
              <img src={activeDetailImage.imageUrl} alt={activeDetailImage.caption} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
              <div style={{ marginTop: '15px', fontWeight: '500', fontSize: '15px', color: 'var(--color-primary)' }}>
                {activeDetailImage.caption}
              </div>
              <div style={{ color: 'var(--color-accent)', fontSize: '12px', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Category: {activeDetailImage.category}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EVENT SPECIFIC IMAGES LIGHTBOX/MODAL */}
      {viewingImagesEvent && (
        <div className="modal-overlay" onClick={() => { setViewingImagesEvent(null); setEventImages([]); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Event Gallery: {viewingImagesEvent.title}</h3>
              <button type="button" className="modal-close" onClick={() => { setViewingImagesEvent(null); setEventImages([]); }}>×</button>
            </div>
            <div className="modal-body" style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
              {eventImages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', fontSize: '15px' }}>
                  🖼️ No images have been uploaded for this event yet.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                  {eventImages.map((img) => (
                    <div key={img._id} style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-light)' }}>
                      <div style={{ height: '160px', overflow: 'hidden' }}>
                        <img src={img.imageUrl} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: '12px', fontSize: '13px', fontWeight: '500', color: 'var(--color-text)' }}>
                        {img.caption}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
