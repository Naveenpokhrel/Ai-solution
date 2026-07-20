import React, { useState } from 'react';

export default function HomePage({ solutions, projects, testimonials, articles, events, gallery, navigateTo }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    if (testimonials.length > 0) {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }
  };

  const prevTestimonial = () => {
    if (testimonials.length > 0) {
      setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  const activeTest = testimonials[activeTestimonial];

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title">Empowering Enterprises Through AI & Custom Software</h1>
          <p className="hero-tagline">We build robust, secure, and intelligent software architectures that streamline operations and accelerate digital growth.</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navigateTo('contact')}>Initiate Consultation</button>
            <button className="btn btn-outline-white" onClick={() => navigateTo('services')}>Explore Solutions</button>
          </div>
        </div>
      </section>

      {/* FEATURED SOLUTIONS */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Featured Solutions</h2>
            <p className="section-subtitle">We design and integrate standard-compliant tools to support your core operations.</p>
          </div>
          <div className="card-grid">
            {solutions.slice(0, 3).map((sol) => (
              <div key={sol._id} className="card">
                <div className="card-icon">⚡</div>
                <h3 className="card-title">{sol.title}</h3>
                <p className="card-desc">{sol.description}</p>
                <button className="btn btn-secondary" onClick={() => navigateTo('services')}>Learn More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Case Studies & Projects</h2>
            <p className="section-subtitle">A look at some of the key systems we have built for our industry clients.</p>
          </div>
          <div className="card-grid">
            {projects.slice(0, 3).map((proj) => (
              <div key={proj._id} className="project-card">
                <img src={proj.imageUrl} alt={proj.title} className="project-img" />
                <div className="project-body">
                  <div className="project-meta">
                    <span>Client: {proj.clientName}</span>
                    <span>{proj.date}</span>
                  </div>
                  <h3 className="project-title">{proj.title}</h3>
                  <p className="project-desc">{proj.description}</p>
                  <span style={{ color: 'var(--color-accent)', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }} onClick={() => navigateTo('projects')}>Read Case Study →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title-wrapper">
              <h2 className="section-title">Client Feedback</h2>
              <p className="section-subtitle">What corporate leaders say about partnering with AI-Solutions.</p>
            </div>
            <div className="testimonials-slider">
              <div className="stars">{"★".repeat(activeTest?.rating || 5)}</div>
              <p className="testimonial-quote">"{activeTest?.reviewText}"</p>
              <p className="testimonial-author">{activeTest?.customerName}</p>
              <p className="testimonial-company">{activeTest?.companyName}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
                <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={prevTestimonial}>◀</button>
                <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={nextTestimonial}>▶</button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LATEST ARTICLES */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Latest Articles</h2>
            <p className="section-subtitle">Insights from our principal developers and cybersecurity analysts.</p>
          </div>
          <div className="card-grid">
            {articles.slice(0, 3).map((art) => (
              <div key={art._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <span className="blog-category">{art.category}</span>
                <h3 className="card-title" style={{ fontSize: '18px' }}>{art.title}</h3>
                <p className="card-desc" style={{ flexGrow: 1 }}>{art.description}</p>
                <span style={{ color: 'var(--color-accent)', fontWeight: '600', cursor: 'pointer', fontSize: '13px', marginTop: '15px' }} onClick={() => navigateTo('blog')}>Read Article →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="section">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">Register to join our conferences, webinars, and technical workshops.</p>
          </div>
          <div className="events-list">
            {events.slice(0, 2).map((evt) => {
              const d = new Date(evt.date);
              const day = d.getDate();
              const month = d.toLocaleString('default', { month: 'short' });
              return (
                <div key={evt._id} className="event-card">
                  <div className="event-date-badge">
                    <div className="event-date-day">{day}</div>
                    <div className="event-date-month">{month}</div>
                  </div>
                  <div>
                    <h3 className="event-content-title">
                      {evt.title}
                      {evt.isPromotional && <span className="badge badge-promotional">Promotional</span>}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>{evt.description}</p>
                    <div className="event-location">📍 {evt.location}</div>
                  </div>
                  <button className="btn btn-primary" onClick={() => navigateTo('contact')}>RSVP Now</button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="section section-bg">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Gallery Highlights</h2>
            <p className="section-subtitle">Snapshots from our events, conferences, and design studios.</p>
          </div>
          <div className="gallery-grid" style={{ marginBottom: '30px' }}>
            {gallery.slice(0, 4).map((item) => (
              <div key={item._id} className="gallery-item" onClick={() => navigateTo('gallery')}>
                <img src={item.imageUrl} alt={item.caption} className="gallery-item-img" />
                <div className="gallery-caption">{item.caption}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <button className="btn btn-secondary" onClick={() => navigateTo('gallery')}>View Full Gallery</button>
          </div>
        </div>
      </section>

      {/* CONTACT BANNER */}
      <section className="section" style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '15px' }}>Ready to optimize your software workflow?</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '25px' }}>Talk to an automation and cloud security expert today. We offer detailed architecture consultations.</p>
          <button className="btn btn-primary" onClick={() => navigateTo('contact')}>Contact Our Team</button>
        </div>
      </section>
    </div>
  );
}
