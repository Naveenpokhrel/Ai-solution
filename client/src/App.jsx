import React, { useState, useEffect } from 'react';
import './App.css';

// Config
import { API_URL } from './config/config.js';

// Components
import Toast from './components/Toast.jsx';
import Breadcrumbs from './components/Breadcrumbs.jsx';
import ChatbotWidget from './components/ChatbotWidget.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import TestimonialsPage from './pages/TestimonialsPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import Error404Page from './pages/Error404Page.jsx';
import Error403Page from './pages/Error403Page.jsx';
import Error500Page from './pages/Error500Page.jsx';

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
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} AI-Solutions Consulting Group. All security protocols operational.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
