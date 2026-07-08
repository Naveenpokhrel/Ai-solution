import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// API Base URL
const API_URL = 'http://localhost:5000/api';

function App() {
  const [page, setPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Data State
  const [solutions, setSolutions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all database collections on startup
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Parallel fetching
        const [resSol, resProj, resArt, resEvt, resGal, resTest] = await Promise.all([
          fetch(`${API_URL}/solutions`),
          fetch(`${API_URL}/projects`),
          fetch(`${API_URL}/articles`),
          fetch(`${API_URL}/events`),
          fetch(`${API_URL}/gallery`),
          fetch(`${API_URL}/testimonials`)
        ]);

        const sols = await resSol.json();
        const projs = await resProj.json();
        const arts = await resArt.json();
        const evts = await resEvt.json();
        const gals = await resGal.json();
        const tests = await resTest.json();

        setSolutions(Array.isArray(sols) ? sols : []);
        setProjects(Array.isArray(projs) ? projs : []);
        setArticles(Array.isArray(arts) ? arts : []);
        setEvents(Array.isArray(evts) ? evts : []);
        setGallery(Array.isArray(gals) ? gals : []);
        setTestimonials(Array.isArray(tests) ? tests : []);

        setError(null);
      } catch (err) {
        console.error("Error loading data, utilizing fallback demo values:", err);
        setError("Could not connect to backend server. Operating in offline demo mode.");
        loadFallbackData();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Offline/Fallback Data in case server is not running
  const loadFallbackData = () => {
    setSolutions([
      { _id: '1', title: "AI-Powered Predictive Analytics", description: "Transform business data into actionable forecasts.", icon: "chart-line", details: ["Customer churn prediction", "Sales forecasting"] },
      { _id: '2', title: "Custom Enterprise Software", description: "Scalable apps designed to streamline productivity.", icon: "code", details: ["Cloud-native design", "Legacy systems migration"] },
      { _id: '3', title: "Cybersecurity & Compliance", description: "Protect your intellectual property and user data.", icon: "shield-halved", details: ["SOC 2 Audit Prep", "Penetration testing"] }
    ]);
    setProjects([
      { _id: '1', title: "AI-Driven Smart Logistics Engine", description: "Route optimization reducing delivery time by 18%.", imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400", clientName: "Global Express", date: "Q3 2025" },
      { _id: '2', title: "Decentralized Payment API", description: "Low-latency processing middleware for high-stress loads.", imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400", clientName: "NestaPay", date: "Q1 2026" }
    ]);
    setArticles([
      { _id: '1', title: "Maximizing ROI: Implementing Predictive AI in Retail", description: "How mid-sized retail operations can integrate AI.", content: "Enterprise AI is no longer a luxury. This post outlines how mid-sized retailers use sales forecasting...", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400", author: "Sarah Jenkins", category: "Artificial Intelligence", date: new Date().toISOString(), featured: true }
    ]);
    setEvents([
      { _id: '1', title: "Global Tech Summit 2026", description: "Explore the future of generative AI, serverless systems, and cloud infrastructure. Networking events and live workshops led by industry leaders.", date: new Date('2026-09-10T05:45:00').toISOString(), location: "Silicon Valley Convention Center, CA", isPromotional: true },
      { _id: '2', title: "Interactive Frontend Hackathon", description: "A 48-hour competitive hacking marathon where developers build outstanding, highly-accessible CSS/React designs with Framer Motion.", date: new Date('2026-11-05T05:45:00').toISOString(), location: "Virtual Event Online", isPromotional: false },
      { _id: '3', title: "AI-Solutions Annual Tech Expo 2025", description: "Our previous annual technology showcase of emerging AI frameworks.", date: new Date('2025-09-12T09:00:00').toISOString(), location: "Silicon Valley & Online", isPromotional: false }
    ]);
    setGallery([
      { _id: '1', imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400", caption: "2025 AI-Solutions Keynote Summit", category: "Events" },
      { _id: '2', imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400", caption: "Our Collaborative Design Studio", category: "Office" }
    ]);
    setTestimonials([
      { _id: '1', customerName: "Eleanor Vance", companyName: "VP of Logistics, Global Express", reviewText: "AI-Solutions delivered exactly what was promised. Our fleet has never run smoother.", rating: 5 },
      { _id: '2', customerName: "David Kross", companyName: "CTO, NestaPay", reviewText: "Their payment middleware operates flawlessly. Outstanding support team.", rating: 5 }
    ]);
  };

  // Navigation Handler
  const navigateTo = (pageName) => {
    setPage(pageName);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-wrapper">
      {/* Offline Alert */}
      {error && (
        <div style={{ backgroundColor: '#fee2e2', borderBottom: '1px solid #fca5a5', color: '#b91c1c', padding: '8px 24px', fontSize: '13px', textAlign: 'center', fontWeight: '500' }}>
          {error}
        </div>
      )}

      {/* HEADER / NAVIGATION */}
      <header className="header">
        <div className="container header-container">
          <div className="logo" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
            AI-<span>Solutions</span>
          </div>

          <nav>
            <ul className={`nav-list ${mobileMenuOpen ? 'mobile-active' : ''}`} style={mobileMenuOpen ? { display: 'flex', flexDirection: 'column', position: 'absolute', top: '80px', left: 0, width: '100%', backgroundColor: '#ffffff', padding: '20px', borderBottom: '1px solid var(--color-border)', gap: '16px', zIndex: 99 } : {}}>
              <li><span className={`nav-link ${page === 'home' ? 'active' : ''}`} onClick={() => navigateTo('home')}>Home</span></li>
              <li><span className={`nav-link ${page === 'about' ? 'active' : ''}`} onClick={() => navigateTo('about')}>About Us</span></li>
              <li><span className={`nav-link ${page === 'services' ? 'active' : ''}`} onClick={() => navigateTo('services')}>Solutions</span></li>
              <li><span className={`nav-link ${page === 'projects' ? 'active' : ''}`} onClick={() => navigateTo('projects')}>Projects</span></li>
              <li><span className={`nav-link ${page === 'blog' ? 'active' : ''}`} onClick={() => navigateTo('blog')}>Article</span></li>
              <li><span className={`nav-link ${page === 'events' ? 'active' : ''}`} onClick={() => navigateTo('events')}>Events</span></li>
              <li><span className={`nav-link ${page === 'gallery' ? 'active' : ''}`} onClick={() => navigateTo('gallery')}>Gallery</span></li>
              <li><span className={`nav-link ${page === 'testimonials' ? 'active' : ''}`} onClick={() => navigateTo('testimonials')}>Testimonials</span></li>
              <li><span className={`nav-link ${page === 'contact' ? 'active' : ''}`} onClick={() => navigateTo('contact')}>Inquiry</span></li>
            </ul>
          </nav>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰
          </button>
        </div>
      </header>

      {/* Toast Alert overlay */}
      <Toast toast={toast} setToast={setToast} />

      {/* Breadcrumbs Navigation */}
      <Breadcrumbs page={page} navigateTo={navigateTo} />

      {/* PAGE CONTENT ROUTER */}
      <main className="main-content">
        {page === 'home' && (
          <HomePage 
            solutions={solutions} 
            projects={projects} 
            testimonials={testimonials} 
            articles={articles} 
            events={events} 
            gallery={gallery} 
            navigateTo={navigateTo} 
          />
        )}
        {page === 'about' && <AboutPage />}
        {page === 'services' && <ServicesPage solutions={solutions} loading={loading} navigateTo={navigateTo} />}
        {page === 'projects' && <ProjectsPage projects={projects} loading={loading} />}
        {page === 'blog' && <BlogPage articles={articles} loading={loading} />}
        {page === 'events' && <EventsPage events={events} gallery={gallery} />}
        {page === 'gallery' && <GalleryPage gallery={gallery} />}
        {page === 'testimonials' && <TestimonialsPage testimonials={testimonials} setTestimonials={setTestimonials} setToast={setToast} />}
        {page === 'contact' && <ContactPage setToast={setToast} />}
        {page === '404' && <Error404Page navigateTo={navigateTo} />}
        {page === '403' && <Error403Page navigateTo={navigateTo} />}
        {page === '500' && <Error500Page navigateTo={navigateTo} />}
      </main>

      {/* FLOATING AI CHATBOT WIDGET */}
      <ChatbotWidget solutions={solutions} navigateTo={navigateTo} />

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <div className="logo" style={{ color: '#ffffff', marginBottom: '16px' }}>
                AI-<span style={{ color: 'var(--color-accent)' }}>Solutions</span>
              </div>
              <p>Engineering premium digital architectures, enterprise automation systems, and state-of-the-art software solutions tailored to power scaling organizations.</p>
            </div>
            <div>
              <h3 className="footer-col-title">Quick Links</h3>
              <ul className="footer-links">
                <li><span style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>Home</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => navigateTo('about')}>About Us</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => navigateTo('services')}>Solutions</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => navigateTo('contact')}>Contact</span></li>
              </ul>
            </div>
            <div>
              <h3 className="footer-col-title">System Status</h3>
              <ul className="footer-links">
                <li><span style={{ cursor: 'pointer' }} onClick={() => navigateTo('404')}>404 Error Page</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => navigateTo('403')}>403 Forbidden Page</span></li>
                <li><span style={{ cursor: 'pointer' }} onClick={() => navigateTo('500')}>500 Internal Error</span></li>
              </ul>
            </div>
            <div>
              <h3 className="footer-col-title">Contact Office</h3>
              <ul className="footer-contact">
                <li>📍 100 Technology Way, Silicon Valley, CA</li>
                <li>✉ info@ai-solutions.com</li>
                <li>📞 +1 (555) 019-2831</li>
                <li>⌚ Mon - Fri: 9:00 AM - 6:00 PM PST</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} AI-Solutions. All Rights Reserved. | <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => alert("Privacy Policy: All client consultation data is encrypted.")}>Privacy Policy</span> | <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => alert("Terms of Service: Development deliverables comply with standard specifications.")}>Terms of Service</span></p>
            <p>Designed in flat, modern corporate style.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// 1. HOME PAGE
// ==========================================
function HomePage({ solutions, projects, testimonials, articles, events, gallery, navigateTo }) {
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

// ==========================================
// 2. ABOUT US PAGE
// ==========================================
function AboutPage() {
  const team = [
    { name: "Sarah Jenkins", role: "Chief Executive Officer & Principal Consultant", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300" },
    { name: "Marcus Chen", role: "Chief Information Security Officer", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300" },
    { name: "Liam O'Connor", role: "Head of Infrastructure & DevOps", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300" }
  ];

  return (
    <div className="section">
      <div className="container">
        <div className="about-grid" style={{ marginBottom: '80px' }}>
          <div>
            <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '20px' }}>Who We Are</h1>
            <p style={{ marginBottom: '20px', fontSize: '15px' }}>AI-Solutions is a premium technology consulting and development firm founded in 2021. We specialize in engineering cloud-native backend systems, zero-trust cybersecurity architectures, and machine-learning forecasting frameworks for modern enterprises.</p>
            <p style={{ fontSize: '15px' }}>Our engineers bring standard-compliant development methodologies, rigorous code testing pipelines, and agile delivery frameworks to every client engagement, ensuring smooth deployments and high reliability.</p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600" alt="Office Collaboration" style={{ borderRadius: '6px', border: '1px solid var(--color-border)' }} />
          </div>
        </div>

        <div className="mission-vision" style={{ marginBottom: '80px' }}>
          <div className="mv-card">
            <h3 className="mv-title">🎯 Our Mission</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>To equip enterprises with resilient, secure, and automation-first software systems that eliminate operational waste, protect user privacy, and catalyze digital scaling.</p>
          </div>
          <div className="mv-card">
            <h3 className="mv-title">👁 Our Vision</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>To remain a global benchmark for engineering quality, known for resolving the most complex computational bottlenecks with clean, simple, and scalable software architecture.</p>
          </div>
        </div>

        <div>
          <div className="section-title-wrapper">
            <h2 className="section-title">Meet Our Leadership Team</h2>
            <p className="section-subtitle">Experienced engineers and consultants driving digital innovation.</p>
          </div>
          <div className="team-grid">
            {team.map((member, i) => (
              <div key={i} className="team-card">
                <img src={member.image} alt={member.name} className="team-img" />
                <div className="team-info">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. SERVICES PAGE
// ==========================================
function ServicesPage({ solutions, loading, navigateTo }) {
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

// ==========================================
// 4. PROJECTS / CASE STUDIES PAGE
// ==========================================
function ProjectsPage({ projects, loading }) {
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

// ==========================================
// 5. ARTICLES & BLOGS PAGE
// ==========================================
// ==========================================
// 5. ARTICLES & BLOGS PAGE
// ==========================================
function BlogPage({ articles, loading }) {
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

// ==========================================
// 6. EVENTS PAGE
// ==========================================
function EventsPage({ events, gallery }) {
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

// ==========================================
// 7. GALLERY PAGE
// ==========================================
// ==========================================
// 7. GALLERY PAGE
// ==========================================
function GalleryPage({ gallery, loading }) {
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

// ==========================================
// 8. TESTIMONIALS PAGE
// ==========================================
// ==========================================
// 8. TESTIMONIALS PAGE
// ==========================================
function TestimonialsPage({ testimonials, setTestimonials, setToast }) {
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

// ==========================================
// 9. CONTACT US PAGE
// ==========================================
function ContactPage({ setToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    country: '',
    jobTitle: '',
    jobDetails: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) errors.phone = "Phone number is required.";
    if (!formData.country.trim()) errors.country = "Country is required.";
    if (!formData.jobDetails.trim()) errors.jobDetails = "Project or consultation details are required.";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          companyName: '',
          country: '',
          jobTitle: '',
          jobDetails: ''
        });
        setToast({ show: true, message: "Consultation request submitted successfully!", type: 'success' });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to submit inquiry.");
      }
    } catch (err) {
      console.error(err);
      // Offline fallback indicator
      setToast({ show: true, message: "Consultation request submitted in demo offline mode!", type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-title-wrapper">
          <h1 className="section-title">Initiate Project Consultation</h1>
          <p className="section-subtitle">Let our engineering consultants know your requirements to start building.</p>
        </div>

        <div className="contact-grid">
          {/* Info Column */}
          <div className="contact-info">
            <h3 className="contact-info-title">Headquarters Info</h3>
            <p className="contact-info-text">Have a project blueprint or RFP? Drop by or call us. We sign standard corporate NDA agreements within 24 hours.</p>
            <ul className="contact-info-list">
              <li>📞 Phone: +1 (555) 019-2831</li>
              <li>✉ Email: support@ai-solutions.com</li>
              <li>📍 Address: 100 Technology Way, Silicon Valley, CA</li>
              <li>🕒 Working Hours: Mon-Fri 09:00 - 18:00 PST</li>
            </ul>
          </div>

          {/* Form Column */}
          <div className="contact-form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {formErrors.name && <span className="form-error">{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Corporate Email *</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {formErrors.email && <span className="form-error">{formErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  {formErrors.phone && <span className="form-error">{formErrors.phone}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Country *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                  {formErrors.country && <span className="form-error">{formErrors.country}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Job Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  />
                </div>

                <div className="form-group form-group-full">
                  <label className="form-label">Project Details / Job Specifications *</label>
                  <textarea 
                    className="form-input" 
                    style={{ height: '120px', resize: 'vertical' }}
                    placeholder="Briefly describe your computational bottlenecks, user volume, or software scope..."
                    value={formData.jobDetails}
                    onChange={(e) => setFormData({ ...formData, jobDetails: e.target.value })}
                  />
                  {formErrors.jobDetails && <span className="form-error">{formErrors.jobDetails}</span>}
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ marginTop: '24px', width: '100%' }}
                disabled={submitting}
              >
                {submitting ? 'Transmitting details...' : 'Submit Consultation Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 10. AI CHATBOT WIDGET COMPONENT
// ==========================================
function ChatbotWidget({ solutions, navigateTo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! Welcome to AI-Solutions. I am your virtual FAQ and service recommendation helper.", isBot: true },
    { id: 2, text: "Please click on one of the quick options below, or type your custom questions.", isBot: true, isOptions: true }
  ]);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSendText = async (textToSend) => {
    const userMsg = { id: Date.now(), text: textToSend, isBot: false };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);
    
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });
      
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      
      const botMsg = { id: Date.now() + 1, text: data.reply, isBot: true };
      
      const replyLower = data.reply.toLowerCase();
      if (replyLower.includes('contact') || replyLower.includes('consultation') || replyLower.includes('inquiry')) {
        botMsg.hasNavAction = true;
        botMsg.navTarget = "contact";
        botMsg.navText = "Go to Contact Us Page";
      } else if (replyLower.includes('services') || replyLower.includes('solutions') || replyLower.includes('pricing')) {
        botMsg.hasNavAction = true;
        botMsg.navTarget = "services";
        botMsg.navText = "Go to Services Page";
      } else if (replyLower.includes('projects') || replyLower.includes('case studies') || replyLower.includes('portfolio')) {
        botMsg.hasNavAction = true;
        botMsg.navTarget = "projects";
        botMsg.navText = "Go to Projects Page";
      }
      
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot API failed, using fallback:", err);
      let reply = "I'm having trouble connecting to the AI brain right now. For technical discussions, please contact our team via the Contact Us page!";
      const textLower = textToSend.toLowerCase();
      if (textLower.includes('faq') || textLower.includes('hours') || textLower.includes('location')) {
        reply = "AI-Solutions is open Monday - Friday, 9:00 AM - 6:00 PM PST. Our office is located in Silicon Valley, CA.";
      } else if (textLower.includes('service') || textLower.includes('solutions')) {
        reply = "We offer cloud infrastructure setup, custom enterprise software, and predictive analytics. You can learn more on our Services page.";
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleOptionClick = (opt) => {
    handleSendText(opt);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');
    handleSendText(userText);
  };

  return (
    <div className="chatbot-widget">
      {/* Bubble button */}
      <div 
        className={`chatbot-bubble ${hasUnread ? 'chatbot-bubble-unread' : ''}`} 
        onClick={() => { setIsOpen(!isOpen); setHasUnread(false); }}
      >
        {isOpen ? '💬' : '🤖'}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-status-indicator"></span>
              AI-Solutions Support
            </div>
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-msg ${msg.isBot ? 'chat-msg-bot' : 'chat-msg-user'}`}>
                {msg.text}

                {/* Render quick options */}
                {msg.isOptions && (
                  <div className="chatbot-options">
                    <button className="chat-opt-btn" onClick={() => handleOptionClick("View Business FAQs")}>🕒 View Business FAQs</button>
                    <button className="chat-opt-btn" onClick={() => handleOptionClick("Recommend Services")}>💻 Recommend Services</button>
                    <button className="chat-opt-btn" onClick={() => handleOptionClick("How to Contact an Engineer")}>✉ How to Contact</button>
                  </div>
                )}

                {/* Render dynamic page switcher link */}
                {msg.hasNavAction && (
                  <div style={{ marginTop: '10px' }}>
                    <button 
                      className="btn btn-primary" 
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                      onClick={() => { navigateTo(msg.navTarget); setIsOpen(false); }}
                    >
                      {msg.navText}
                    </button>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg chat-msg-typing">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="chatbot-input-area">
            <input 
              type="text" 
              placeholder="Ask a question..." 
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="chatbot-send-btn">➔</button>
          </form>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 11. BREADCRUMBS COMPONENT
// ==========================================
function Breadcrumbs({ page, navigateTo }) {
  if (page === 'home' || page === '404' || page === '403' || page === '500') return null;

  const getLabel = () => {
    switch (page) {
      case 'about': return 'About Us';
      case 'services': return 'Solutions & Services';
      case 'projects': return 'Case Studies';
      case 'blog': return 'Tech Articles';
      case 'events': return 'Scheduled Events';
      case 'gallery': return 'Event Gallery';
      case 'testimonials': return 'Client Endorsements';
      case 'contact': return 'Contact Us';
      default: return page;
    }
  };

  return (
    <div className="breadcrumbs-container">
      <div className="container">
        <span className="breadcrumb-link" onClick={() => navigateTo('home')}>Home</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{getLabel()}</span>
      </div>
    </div>
  );
}

// ==========================================
// 12. TOAST ALERT COMPONENT
// ==========================================
function Toast({ toast, setToast }) {
  if (!toast.show) return null;

  return (
    <div className={`toast-alert toast-${toast.type}`}>
      <span className="toast-icon">✓</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close-btn" onClick={() => setToast({ show: false, message: '', type: 'success' })}>×</button>
    </div>
  );
}

// ==========================================
// 13. SKELETON CARD COMPONENT
// ==========================================
function SkeletonCard() {
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

// ==========================================
// 14. ERROR PAGES
// ==========================================
function Error404Page({ navigateTo }) {
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

function Error403Page({ navigateTo }) {
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

function Error500Page({ navigateTo }) {
  return (
    <div className="section error-page">
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 className="error-code" style={{ color: '#6b7280' }}>500</h1>
        <h2 className="error-title">Internal Server Error</h2>
        <p className="error-desc">Critical socket exception. The central backend server encountered an unexpected error. Our system engineers are responding.</p>
        <button className="btn btn-primary" onClick={() => navigateTo('home')}>Return to System Home</button>
      </div>
    </div>
  );
}

export default App;
