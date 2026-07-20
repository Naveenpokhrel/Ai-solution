import React, { useState, useEffect } from 'react';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("adminToken") || null,
  );
  const [page, setPage] = useState("dashboard");
  const [adminUser, setAdminUser] = useState(null);
  //
  // Database collections lists
  const [inquiries, setInquiries] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [metrics, setMetrics] = useState({
    totalInquiries: 0,
    totalServices: 0,
    totalProjects: 0,
    totalArticles: 0,
    totalEvents: 0,
    totalTestimonials: 0,
  });

  // Chart data state
  const [chartMonthly, setChartMonthly] = useState([]);
  const [chartCountries, setChartCountries] = useState([]);

  // Fetch admin profile and dashboard data
  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
      fetchAdminProfile();
      fetchDashboardData();
      fetchAllCollections();
    } else {
      localStorage.removeItem("adminToken");
    }
  }, [token]);

  const fetchAdminProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUser(data);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
        setChartMonthly(data.charts.monthlyInquiries);
        setChartCountries(data.charts.countryStats);
      }
    } catch (err) {
      console.error("Using offline stats fallback:", err);
      // Fallback
      setMetrics({
        totalInquiries: inquiries.length || 3,
        totalServices: solutions.length || 4,
        totalProjects: projects.length || 3,
        totalArticles: articles.length || 3,
        totalEvents: events.length || 3,
        totalTestimonials: testimonials.length || 3,
      });
      setChartMonthly([
        { month: "Jan", count: 2 },
        { month: "Feb", count: 4 },
        { month: "Mar", count: 3 },
        { month: "Apr", count: 7 },
        { month: "May", count: 5 },
        { month: "Jun", count: 8 },
      ]);
      setChartCountries([
        { name: "USA", value: 5 },
        { name: "Canada", value: 3 },
        { name: "UK", value: 2 },
      ]);
    }
  };

  const fetchAllCollections = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [resInq, resSol, resProj, resArt, resEvt, resGal, resTest] =
        await Promise.all([
          fetch(`${API_URL}/inquiries`, { headers }),
          fetch(`${API_URL}/solutions`),
          fetch(`${API_URL}/projects`),
          fetch(`${API_URL}/articles`),
          fetch(`${API_URL}/events`),
          fetch(`${API_URL}/gallery`),
          fetch(`${API_URL}/testimonials`),
        ]);

      if (resInq.ok) setInquiries(await resInq.json());
      if (resSol.ok) setSolutions(await resSol.json());
      if (resProj.ok) setProjects(await resProj.json());
      if (resArt.ok) setArticles(await resArt.json());
      if (resEvt.ok) setEvents(await resEvt.json());
      if (resGal.ok) setGallery(await resGal.json());
      if (resTest.ok) setTestimonials(await resTest.json());
    } catch (err) {
      console.error("CRUD fetch error:", err);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem("adminToken");
    setPage("dashboard");
  };

  if (!token) {
    return <AdminLogin setToken={setToken} />;
  }

  return (
    <div className="admin-layout">
      {/* SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          AI-<span>Solutions</span> Panel
        </div>
        <div className="sidebar-menu">
          <div
            className={`sidebar-item ${page === "dashboard" ? "active" : ""}`}
            onClick={() => setPage("dashboard")}
          >
            📊 <span>Dashboard</span>
          </div>
          <div
            className={`sidebar-item ${page === "inquiries" ? "active" : ""}`}
            onClick={() => setPage("inquiries")}
          >
            ✉ <span>Inquiries ({inquiries.length})</span>
          </div>
          <div
            className={`sidebar-item ${page === "solutions" ? "active" : ""}`}
            onClick={() => setPage("solutions")}
          >
            💻 <span>Solutions </span>
          </div>
          <div
            className={`sidebar-item ${page === "projects" ? "active" : ""}`}
            onClick={() => setPage("projects")}
          >
            📂 <span>Projects </span>
          </div>
          <div
            className={`sidebar-item ${page === "articles" ? "active" : ""}`}
            onClick={() => setPage("articles")}
          >
            ✍ <span>Articles </span>
          </div>
          <div
            className={`sidebar-item ${page === "events" ? "active" : ""}`}
            onClick={() => setPage("events")}
          >
            📅 <span>Events </span>
          </div>
          <div
            className={`sidebar-item ${page === "gallery" ? "active" : ""}`}
            onClick={() => setPage("gallery")}
          >
            🖼 <span>Gallery </span>
          </div>
          <div
            className={`sidebar-item ${page === "testimonials" ? "active" : ""}`}
            onClick={() => setPage("testimonials")}
          >
            ★ <span>Testimonials </span>
          </div>
          <div
            className={`sidebar-item ${page === "analytics" ? "active" : ""}`}
            onClick={() => setPage("analytics")}
          >
            📈 <span>Analytics Reports</span>
          </div>
          <div
            className={`sidebar-item ${page === "settings" ? "active" : ""}`}
            onClick={() => setPage("settings")}
          >
            ⚙ <span>Settings & Profile</span>
          </div>
        </div>
        <div className="sidebar-footer">
          Logged in:{" "}
          <strong style={{ color: "#fff" }}>
            {adminUser?.username || "Admin"}
          </strong>
        </div>
      </aside>

      {/* MAIN VIEW CONTROLLER */}
      <main className="admin-main">
        {page === "dashboard" && (
          <DashboardView
            metrics={metrics}
            inquiries={inquiries}
            setPage={setPage}
            chartMonthly={chartMonthly}
            chartCountries={chartCountries}
            token={token}
            refreshData={fetchDashboardData}
          />
        )}
        {page === "inquiries" && (
          <InquiriesView
            inquiries={inquiries}
            setInquiries={setInquiries}
            token={token}
          />
        )}
        {page === "solutions" && (
          <SolutionsCrud
            solutions={solutions}
            setSolutions={setSolutions}
            token={token}
          />
        )}
        {page === "projects" && (
          <ProjectsCrud
            projects={projects}
            setProjects={setProjects}
            solutions={solutions}
            token={token}
          />
        )}
        {page === "articles" && (
          <ArticlesCrud
            articles={articles}
            setArticles={setArticles}
            token={token}
          />
        )}
        {page === "events" && (
          <EventsCrud events={events} setEvents={setEvents} token={token} />
        )}
        {page === "gallery" && (
          <GalleryCrud
            gallery={gallery}
            setGallery={setGallery}
            events={events}
            token={token}
          />
        )}
        {page === "testimonials" && (
          <TestimonialsCrud
            testimonials={testimonials}
            setTestimonials={setTestimonials}
            token={token}
          />
        )}
        {page === "analytics" && (
          <AnalyticsView
            chartMonthly={chartMonthly}
            chartCountries={chartCountries}
            metrics={metrics}
          />
        )}
        {page === "settings" && (
          <SettingsView
            adminUser={adminUser}
            setAdminUser={setAdminUser}
            token={token}
            handleLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}

// ==========================================
// A. ADMIN LOGIN COMPONENT
// ==========================================
function AdminLogin({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState({ q: "", ans: 0 });

  const [error, setError] = useState("");
  const [forgotOpen, setForgotOpen] = useState(false);

  // Generate arithmetic challenge
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 9) + 2;
    const num2 = Math.floor(Math.random() * 8) + 2;
    setCaptchaQuestion({
      q: `Verify: What is ${num1} + ${num2}?`,
      ans: num1 + num2,
    });
    setCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Check Captcha
    if (Number(captchaInput) !== captchaQuestion.ans) {
      setError("Incorrect CAPTCHA response.");
      generateCaptcha();
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
      } else {
        const errData = await res.json();
        setError(errData.message || "Invalid credentials.");
        generateCaptcha();
      }
    } catch (err) {
      console.error(err);
      // Offline fallback login for prototyping if connection is lost
      if (username === "admin" && password === "password123") {
        setToken("mock_jwt_token_for_prototype_mode");
      } else {
        setError(
          "Network error. Standard mock login requires admin/password123.",
        );
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">AI-Solutions</h2>
        <p className="login-subtitle">Dashboard Administrative Access</p>

        {error && (
          <div
            style={{
              color: "var(--admin-danger)",
              backgroundColor: "#fee2e2",
              padding: "10px",
              borderRadius: "4px",
              fontSize: "13px",
              marginBottom: "20px",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                style={{ width: "100%", paddingRight: "40px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  color: "var(--admin-text-muted)",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--admin-primary)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--admin-text-muted)"}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Captcha Box */}
          <div className="form-group">
            <label className="form-label">CAPTCHA Security Guard</label>
            <div className="captcha-box">{captchaQuestion.q}</div>
            <input
              type="number"
              className="form-input"
              placeholder="Enter answer"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: "10px" }}
          >
            Log In
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <span
            style={{
              color: "var(--admin-primary)",
              fontSize: "13px",
              cursor: "pointer",
            }}
            onClick={() => setForgotOpen(true)}
          >
            Forgot Password?
          </span>
        </div>
      </div>

      {forgotOpen && (
        <div className="modal-overlay" onClick={() => setForgotOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Forgot Password</h3>
              <button
                className="modal-close"
                onClick={() => setForgotOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: "14px", marginBottom: "15px" }}>
                For secure compliance, password resets are processed manually by
                the system administration network.
              </p>
              <p style={{ fontSize: "14px", fontWeight: "550" }}>
                Default Seeded Credentials:
              </p>
              <code
                style={{
                  display: "block",
                  backgroundColor: "#f1f5f9",
                  padding: "10px",
                  borderRadius: "4px",
                  marginTop: "8px",
                  fontSize: "13px",
                }}
              >
                Username: admin
                <br />
                Password: password123
              </code>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setForgotOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// B. DASHBOARD SUMMARY VIEW
// ==========================================
function DashboardView({
  metrics,
  inquiries,
  setPage,
  chartMonthly,
  chartCountries,
  token,
  refreshData,
}) {
  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Executive Dashboard</h1>
        <button className="btn btn-primary" onClick={refreshData}>
          🔄 Refresh Metrics
        </button>
      </div>

      {/* METRIC COUNTER ROW */}
      <div className="metrics-grid">
        <div
          className="metric-card"
          style={{ borderLeft: "4px solid #3b82f6" }}
          onClick={() => setPage("inquiries")}
        >
          <span className="metric-title">Total Inquiries</span>
          <span className="metric-value">{metrics.totalInquiries}</span>
        </div>
        <div
          className="metric-card"
          style={{ borderLeft: "4px solid #10b981" }}
          onClick={() => setPage("solutions")}
        >
          <span className="metric-title">Total Services</span>
          <span className="metric-value">{metrics.totalServices}</span>
        </div>
        <div
          className="metric-card"
          style={{ borderLeft: "4px solid #f59e0b" }}
          onClick={() => setPage("projects")}
        >
          <span className="metric-title">Total Projects</span>
          <span className="metric-value">{metrics.totalProjects}</span>
        </div>
        <div
          className="metric-card"
          style={{ borderLeft: "4px solid #8b5cf6" }}
          onClick={() => setPage("articles")}
        >
          <span className="metric-title">Articles</span>
          <span className="metric-value">{metrics.totalArticles}</span>
        </div>
        <div
          className="metric-card"
          style={{ borderLeft: "4px solid #ec4899" }}
          onClick={() => setPage("events")}
        >
          <span className="metric-title">Events</span>
          <span className="metric-value">{metrics.totalEvents}</span>
        </div>
        <div
          className="metric-card"
          style={{ borderLeft: "4px solid #06b6d4" }}
          onClick={() => setPage("testimonials")}
        >
          <span className="metric-title">Testimonials</span>
          <span className="metric-value">{metrics.totalTestimonials}</span>
        </div>
      </div>

      {/* CHARTS OVERVIEW */}
      <AnalyticsView
        chartMonthly={chartMonthly}
        chartCountries={chartCountries}
        metrics={metrics}
      />

      {/* RECENT INQUIRIES VIEW LIST */}
      <div className="table-card" style={{ marginTop: "40px" }}>
        <div
          className="table-search-bar"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: "600" }}>
            Recent Inquiries
          </h3>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setPage("inquiries")}
          >
            View All
          </button>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Company</th>
              <th>Country</th>
              <th>Job Title</th>
              <th>Date Submitted</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.slice(0, 5).map((inq) => (
              <tr key={inq._id}>
                <td>
                  <strong>{inq.name}</strong>
                </td>
                <td>{inq.companyName || "—"}</td>
                <td>{inq.country}</td>
                <td>{inq.jobTitle || "—"}</td>
                <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textGrid: "center",
                    padding: "20px",
                    color: "#94a3b8",
                  }}
                >
                  No inquiries submitted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SYSTEM AUDIT TRAIL / LOGS */}
      <div
        className="audit-trail-container"
        style={{ marginTop: "40px", marginBottom: "30px" }}
      >
        <h3
          style={{ fontSize: "16px", fontWeight: "600", marginBottom: "15px" }}
        >
          System Audit Logs & Activities
        </h3>
        <div
          className="audit-logs-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            className="audit-log-card"
            style={{
              padding: "16px",
              backgroundColor: "#f8fafc",
              border: "1px solid var(--admin-border)",
              borderRadius: "6px",
            }}
          >
            <h4
              style={{
                fontSize: "13px",
                color: "var(--admin-text-muted)",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Recent activities
            </h4>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: "12.5px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <li>📝 Event data associated with Gallery</li>
              <li>🖼 Gallery item associated with "Tech Expo 2026"</li>
              <li>📈 Analytics reports refreshed manually</li>
            </ul>
          </div>
          <div
            className="audit-log-card"
            style={{
              padding: "16px",
              backgroundColor: "#f8fafc",
              border: "1px solid var(--admin-border)",
              borderRadius: "6px",
            }}
          >
            <h4
              style={{
                fontSize: "13px",
                color: "var(--admin-text-muted)",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Security & logins
            </h4>
            <div style={{ fontSize: "12.5px" }}>
              <div>
                👤 User: <strong>admin</strong>
              </div>
              <div style={{ marginTop: "4px", color: "#10b981" }}>
                🟢 Status: Active Session
              </div>
              <div
                style={{ marginTop: "4px", color: "var(--admin-text-muted)" }}
              >
                📅 Recent Login: {new Date().toLocaleString()}
              </div>
            </div>
          </div>
          <div
            className="audit-log-card"
            style={{
              padding: "16px",
              backgroundColor: "#f8fafc",
              border: "1px solid var(--admin-border)",
              borderRadius: "6px",
            }}
          >
            <h4
              style={{
                fontSize: "13px",
                color: "var(--admin-text-muted)",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              System Updates
            </h4>
            <div style={{ fontSize: "12.5px" }}>
              <div>
                📦 Database: <strong>MongoDB Connected</strong>
              </div>
              <div style={{ marginTop: "4px" }}>
                ⚙ API Layer: <strong>v1.5.0-stable</strong>
              </div>
              <div
                style={{ marginTop: "4px", color: "var(--admin-text-muted)" }}
              >
                🔄 Last Seeded: 1 hour ago
              </div>
            </div>
          </div>
          <div
            className="audit-log-card"
            style={{
              padding: "16px",
              backgroundColor: "#f8fafc",
              border: "1px solid var(--admin-border)",
              borderRadius: "6px",
            }}
          >
            <h4
              style={{
                fontSize: "13px",
                color: "var(--admin-text-muted)",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Latest Inquiry
            </h4>
            <div style={{ fontSize: "12.5px" }}>
              {inquiries && inquiries.length > 0 ? (
                <>
                  <div>
                    👤 Client: <strong>{inquiries[0].name}</strong>
                  </div>
                  <div style={{ marginTop: "4px" }}>
                    🏢 Co: {inquiries[0].companyName || "N/A"}
                  </div>
                  <div
                    style={{
                      marginTop: "4px",
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    🕒 Received:{" "}
                    {new Date(inquiries[0].createdAt).toLocaleDateString()}
                  </div>
                </>
              ) : (
                <div style={{ color: "var(--admin-text-muted)" }}>
                  No inquiries recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// C. INQUIRIES VIEWER COMPONENT
// ==========================================
function InquiriesView({ inquiries, setInquiries, token }) {
  const [search, setSearch] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setSearch(val);
    try {
      const res = await fetch(`${API_URL}/inquiries?search=${val}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setInquiries(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm("Delete this inquiry permanently?")) return;
    try {
      const res = await fetch(`${API_URL}/inquiries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item._id !== id));
        setSelectedInquiry(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Inquiry Messages</h1>
      </div>

      <div className="table-card">
        <div className="table-search-bar">
          <input
            type="text"
            placeholder="Search inquiries by name, company, country, details..."
            className="form-input"
            style={{ width: "100%", maxWidth: "400px" }}
            value={search}
            onChange={handleSearch}
          />
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Company</th>
              <th>Country</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq._id}>
                <td>
                  <strong>{inq.name}</strong>
                </td>
                <td>{inq.companyName || "—"}</td>
                <td>{inq.country}</td>
                <td>{inq.email}</td>
                <td>{inq.phone}</td>
                <td>
                  <div className="action-btns">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedInquiry(inq)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteInquiry(inq._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#94a3b8",
                  }}
                >
                  No inquiries matching query found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Inquiry details Modal */}
      {selectedInquiry && (
        <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Inquiry Detail Report</h3>
              <button
                className="modal-close"
                onClick={() => setSelectedInquiry(null)}
              >
                ×
              </button>
            </div>
            <div
              className="modal-body"
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <strong>Client:</strong> {selectedInquiry.name}
              </div>
              <div>
                <strong>Company:</strong>{" "}
                {selectedInquiry.companyName || "None specified"}
              </div>
              <div>
                <strong>Location:</strong> {selectedInquiry.country}
              </div>
              <div>
                <strong>Email Address:</strong> {selectedInquiry.email}
              </div>
              <div>
                <strong>Phone Number:</strong> {selectedInquiry.phone}
              </div>
              <div>
                <strong>Job/Position Title:</strong>{" "}
                {selectedInquiry.jobTitle || "None specified"}
              </div>
              <div
                style={{
                  marginTop: "10px",
                  borderTop: "1px solid var(--admin-border)",
                  paddingTop: "15px",
                }}
              >
                <strong>Project Consultation Specifications:</strong>
                <p
                  style={{
                    marginTop: "6px",
                    whiteSpace: "pre-line",
                    fontSize: "13.5px",
                    color: "#334155",
                    lineHeight: "1.6",
                  }}
                >
                  {selectedInquiry.jobDetails}
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-danger"
                onClick={() => deleteInquiry(selectedInquiry._id)}
              >
                Delete Inquiry
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedInquiry(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// D. SOLUTIONS CRUD VIEW
// ==========================================
function SolutionsCrud({ solutions, setSolutions, token }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSolution, setCurrentSolution] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "code",
    details: "",
  });

  const openAdd = () => {
    setCurrentSolution(null);
    setForm({ title: "", description: "", icon: "code", details: "" });
    setModalOpen(true);
  };

  const openEdit = (sol) => {
    setCurrentSolution(sol);
    setForm({
      title: sol.title,
      description: sol.description,
      icon: sol.icon || "code",
      details: Array.isArray(sol.details) ? sol.details.join(", ") : "",
    });
    setModalOpen(true);
  };

  const saveSolution = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      icon: form.icon,
      details: form.details
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      const url = currentSolution
        ? `${API_URL}/solutions/${currentSolution._id}`
        : `${API_URL}/solutions`;
      const method = currentSolution ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        if (currentSolution) {
          setSolutions((prev) =>
            prev.map((item) => (item._id === saved._id ? saved : item)),
          );
        } else {
          setSolutions((prev) => [saved, ...prev]);
        }
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSolution = async (id) => {
    if (!window.confirm("Delete this solution permanently?")) return;
    try {
      const res = await fetch(`${API_URL}/solutions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSolutions((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Solutions Catalog</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          Add Solution
        </button>
      </div>

      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Solution Title</th>
              <th>Description</th>
              <th>Icon Tag</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {solutions.map((sol) => (
              <tr key={sol._id}>
                <td>
                  <strong>{sol.title}</strong>
                </td>
                <td style={{ maxWidth: "400px", fontSize: "13px" }}>
                  {sol.description}
                </td>
                <td>
                  <code
                    style={{
                      backgroundColor: "#f1f5f9",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {sol.icon}
                  </code>
                </td>
                <td>
                  <div className="action-btns">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEdit(sol)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteSolution(sol._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={saveSolution}>
              <div className="modal-header">
                <h3>
                  {currentSolution
                    ? "Edit Software Solution"
                    : "Add New Software Solution"}
                </h3>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Solution Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Brief Description</label>
                  <textarea
                    className="form-input"
                    style={{ height: "80px" }}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Icon Identifier Class</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Feature Details List (Comma separated values)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sales analysis, CRM Sync, PDF Report Exports"
                    value={form.details}
                    onChange={(e) =>
                      setForm({ ...form, details: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// E. PROJECTS CRUD VIEW
// ==========================================
function ProjectsCrud({ projects, setProjects, solutions, token }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [form, setForm] = useState({
    title: "",
    service_id: "",
    industry: "General",
    description: "",
    imageUrl: "",
    clientName: "",
    date: "",
    completion_date: "",
    details: "",
  });

  const openAdd = () => {
    setCurrentProject(null);
    setForm({
      title: "",
      service_id: "",
      industry: "General",
      description: "",
      imageUrl: "",
      clientName: "",
      date: "",
      completion_date: "",
      details: "",
    });
    setModalOpen(true);
  };

  const openEdit = (proj) => {
    setCurrentProject(proj);

    let formattedCompDate = "";
    if (proj.completion_date) {
      formattedCompDate = new Date(proj.completion_date)
        .toISOString()
        .split("T")[0];
    }

    setForm({
      title: proj.title,
      service_id: proj.service_id?._id || proj.service_id || "",
      industry: proj.industry || "General",
      description: proj.description,
      imageUrl: proj.imageUrl,
      clientName: proj.clientName || "",
      date: proj.date || "",
      completion_date: formattedCompDate,
      details: proj.details || "",
    });
    setModalOpen(true);
  };

  const saveProject = async (e) => {
    e.preventDefault();
    try {
      const url = currentProject
        ? `${API_URL}/projects/${currentProject._id}`
        : `${API_URL}/projects`;
      const method = currentProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const saved = await res.json();
        if (currentProject) {
          setProjects((prev) =>
            prev.map((item) => (item._id === saved._id ? saved : item)),
          );
        } else {
          setProjects((prev) => [saved, ...prev]);
        }
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project case study permanently?")) return;
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Case Studies & Projects</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          Add Project
        </button>
      </div>

      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Project Title</th>
              <th>Timeline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((proj) => (
              <tr key={proj._id}>
                <td>
                  <strong>{proj.clientName || "—"}</strong>
                </td>
                <td>{proj.title}</td>
                <td>{proj.date || "—"}</td>
                <td>
                  <div className="action-btns">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEdit(proj)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteProject(proj._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={saveProject}>
              <div className="modal-header">
                <h3>{currentProject ? "Edit Project" : "Add New Project"}</h3>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Project Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Related Solution</label>
                  <select
                    className="form-input"
                    value={form.service_id}
                    onChange={(e) =>
                      setForm({ ...form, service_id: e.target.value || "" })
                    }
                  >
                    <option value="">Select a Solution</option>
                    {solutions.map((sol) => (
                      <option key={sol._id} value={sol._id}>
                        {sol.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Industry</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.industry}
                    onChange={(e) =>
                      setForm({ ...form, industry: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    style={{ height: "70px" }}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm({ ...form, imageUrl: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Client Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.clientName}
                    onChange={(e) =>
                      setForm({ ...form, clientName: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Q3 2025"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Completion Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.completion_date}
                    onChange={(e) =>
                      setForm({ ...form, completion_date: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Details</label>
                  <textarea
                    className="form-input"
                    style={{ height: "100px" }}
                    value={form.details}
                    onChange={(e) =>
                      setForm({ ...form, details: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// F. ARTICLES CRUD VIEW
// ==========================================
function ArticlesCrud({ articles, setArticles, token }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    author: "",
    category: "Artificial Intelligence",
    featured: false,
  });

  const openAdd = () => {
    setCurrentArticle(null);
    setForm({
      title: "",
      description: "",
      content: "",
      imageUrl: "",
      author: "",
      category: "Artificial Intelligence",
      featured: false,
    });
    setModalOpen(true);
  };

  const openEdit = (art) => {
    setCurrentArticle(art);
    setForm({
      title: art.title,
      description: art.description,
      content: art.content,
      imageUrl: art.imageUrl,
      author: art.author,
      category: art.category,
      featured: art.featured || false,
    });
    setModalOpen(true);
  };

  const saveArticle = async (e) => {
    e.preventDefault();
    try {
      const url = currentArticle
        ? `${API_URL}/articles/${currentArticle._id}`
        : `${API_URL}/articles`;
      const method = currentArticle ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const saved = await res.json();
        if (currentArticle) {
          setArticles((prev) =>
            prev.map((item) => (item._id === saved._id ? saved : item)),
          );
        } else {
          setArticles((prev) => [saved, ...prev]);
        }
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteArticle = async (id) => {
    if (!window.confirm("Delete this article permanently?")) return;
    try {
      const res = await fetch(`${API_URL}/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setArticles((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Articles & Blog Posts</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          Add Article
        </button>
      </div>

      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((art) => (
              <tr key={art._id}>
                <td>
                  <strong>{art.title}</strong>
                </td>
                <td>{art.author.split(" (")[0]}</td>
                <td>{art.category}</td>
                <td>{art.featured ? "⭐️ Yes" : "No"}</td>
                <td>
                  <div className="action-btns">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEdit(art)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteArticle(art._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: "700px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={saveArticle}>
              <div className="modal-header">
                <h3>
                  {currentArticle ? "Edit Blog Article" : "Create Blog Article"}
                </h3>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Article Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Author Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.author}
                    onChange={(e) =>
                      setForm({ ...form, author: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option value="Artificial Intelligence">
                      Artificial Intelligence
                    </option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Image Unsplash URL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm({ ...form, imageUrl: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Short Summary (Description)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Blog Content Text</label>
                  <textarea
                    className="form-input"
                    style={{ height: "180px" }}
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    required
                  />
                </div>
                <div
                  className="form-group"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "10px",
                  }}
                >
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) =>
                        setForm({ ...form, featured: e.target.checked })
                      }
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="form-label" style={{ margin: 0 }}>
                    Mark as Featured Article
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// G. EVENTS CRUD VIEW
// ==========================================
function EventsCrud({ events, setEvents, token }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    isPromotional: false,
  });

  const openAdd = () => {
    setCurrentEvent(null);
    setForm({
      title: "",
      description: "",
      date: "",
      location: "",
      isPromotional: false,
    });
    setModalOpen(true);
  };

  const openEdit = (evt) => {
    setCurrentEvent(evt);
    setForm({
      title: evt.title,
      description: evt.description,
      date: evt.date ? evt.date.split("T")[0] : "",
      location: evt.location,
      isPromotional: evt.isPromotional || false,
    });
    setModalOpen(true);
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    try {
      const url = currentEvent
        ? `${API_URL}/events/${currentEvent._id}`
        : `${API_URL}/events`;
      const method = currentEvent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const saved = await res.json();
        setEvents((prev) => {
          let updatedList;
          if (currentEvent) {
            updatedList = prev.map((item) =>
              item._id === saved._id ? saved : item,
            );
          } else {
            updatedList = [saved, ...prev];
          }
          if (saved.isPromotional) {
            updatedList = updatedList.map((item) =>
              item._id === saved._id
                ? saved
                : { ...item, isPromotional: false },
            );
          }
          return updatedList;
        });
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event permanently?")) return;
    try {
      const res = await fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Company Events</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          Add Event
        </button>
      </div>

      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Location</th>
              <th>Scheduled Date</th>
              <th>Promo Event</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt) => (
              <tr key={evt._id}>
                <td>
                  <strong>{evt.title}</strong>
                </td>
                <td>{evt.location}</td>
                <td>{new Date(evt.date).toLocaleDateString()}</td>
                <td>{evt.isPromotional ? "🌟 True" : "False"}</td>
                <td>
                  <div className="action-btns">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEdit(evt)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteEvent(evt._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={saveEvent}>
              <div className="modal-header">
                <h3>
                  {currentEvent ? "Edit Event Schedule" : "Schedule New Event"}
                </h3>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Event Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location / Medium</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Austin HQ / Zoom Link"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Scheduled Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Details / RSVP Instructions
                  </label>
                  <textarea
                    className="form-input"
                    style={{ height: "70px" }}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    required
                  />
                </div>
                <div
                  className="form-group"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "10px",
                  }}
                >
                  {/* Promotional Event Boolean Switch */}
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={form.isPromotional}
                      onChange={(e) =>
                        setForm({ ...form, isPromotional: e.target.checked })
                      }
                    />
                    <span className="slider"></span>
                  </label>
                  <span className="form-label" style={{ margin: 0 }}>
                    Mark as Promotional Event (isPromotional)
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// H. GALLERY CRUD VIEW
// ==========================================
function GalleryCrud({ gallery, setGallery, events, token }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    imageUrl: "",
    caption: "",
    category: "Events",
    eventId: "",
  });

  const saveImage = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/gallery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl: form.imageUrl,
          caption: form.caption,
          category: form.category,
          eventId: form.eventId || null,
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        setGallery((prev) => [saved, ...prev]);
        setModalOpen(false);
        setForm({ imageUrl: "", caption: "", category: "Events", eventId: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Remove this image from gallery?")) return;
    try {
      const res = await fetch(`${API_URL}/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setGallery((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Event Gallery</h1>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          Upload Image
        </button>
      </div>

      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Caption</th>
              <th>Category</th>
              <th>Linked Event</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gallery.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    src={item.imageUrl}
                    alt={item.caption}
                    style={{
                      width: "60px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      border: "1px solid var(--admin-border)",
                    }}
                  />
                </td>
                <td>{item.caption}</td>
                <td>{item.category}</td>
                <td>
                  <strong>
                    {item.eventId ? item.eventId.title : "None (General)"}
                  </strong>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteImage(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={saveImage}>
              <div className="modal-header">
                <h3>Add Photo to Gallery</h3>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Image Unsplash URL</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm({ ...form, imageUrl: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Caption</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.caption}
                    onChange={(e) =>
                      setForm({ ...form, caption: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option value="Events">Events</option>
                    <option value="Office">Office</option>
                    <option value="Projects">Projects</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Link to Corporate Event</label>
                  <select
                    className="form-input"
                    value={form.eventId}
                    onChange={(e) =>
                      setForm({ ...form, eventId: e.target.value })
                    }
                  >
                    <option value="">-- No Linked Event --</option>
                    {events.map((evt) => (
                      <option key={evt._id} value={evt._id}>
                        {evt.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// I. TESTIMONIALS CRUD VIEW
// ==========================================
function TestimonialsCrud({ testimonials, setTestimonials, token }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [form, setForm] = useState({
    customerName: "",
    companyName: "",
    reviewText: "",
    rating: 5,
  });

  const openAdd = () => {
    setCurrentTest(null);
    setForm({ customerName: "", companyName: "", reviewText: "", rating: 5 });
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setCurrentTest(t);
    setForm({
      customerName: t.customerName,
      companyName: t.companyName,
      reviewText: t.reviewText,
      rating: t.rating,
    });
    setModalOpen(true);
  };

  const saveTestimonial = async (e) => {
    e.preventDefault();
    try {
      const url = currentTest
        ? `${API_URL}/testimonials/${currentTest._id}`
        : `${API_URL}/testimonials`;
      const method = currentTest ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const saved = await res.json();
        if (currentTest) {
          setTestimonials((prev) =>
            prev.map((item) => (item._id === saved._id ? saved : item)),
          );
        } else {
          setTestimonials((prev) => [saved, ...prev]);
        }
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTestimonial = async (id) => {
    if (!window.confirm("Delete this testimonial permanently?")) return;
    try {
      const res = await fetch(`${API_URL}/testimonials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Client Testimonials</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          Add Testimonial
        </button>
      </div>

      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Company</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((test) => (
              <tr key={test._id}>
                <td>
                  <strong>{test.customerName}</strong>
                </td>
                <td>{test.companyName}</td>
                <td>
                  <span style={{ color: "#fbbf24" }}>
                    {"★".repeat(test.rating)}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEdit(test)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteTestimonial(test._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={saveTestimonial}>
              <div className="modal-header">
                <h3>
                  {currentTest ? "Edit Review Details" : "Add Testimonial"}
                </h3>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Client Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.customerName}
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Role & Company</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. VP, Global Logistics"
                    value={form.companyName}
                    onChange={(e) =>
                      setForm({ ...form, companyName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rating Score</label>
                  <select
                    className="form-input"
                    value={form.rating}
                    onChange={(e) =>
                      setForm({ ...form, rating: Number(e.target.value) })
                    }
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★</option>
                    <option value={3}>3 Stars ★★★</option>
                    <option value={2}>2 Stars ★★</option>
                    <option value={1}>1 Star ★</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Review Text</label>
                  <textarea
                    className="form-input"
                    style={{ height: "80px" }}
                    value={form.reviewText}
                    onChange={(e) =>
                      setForm({ ...form, reviewText: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// J. ANALYTICS CHART REPORTS (CUSTOM SVG CHARTS)
// ==========================================
function SvgLineChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>
        No data to display
      </div>
    );
  }

  const width = 600;
  const height = 240;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const counts = data.map((d) => d.count);
  const maxCount = Math.max(...counts, 4);

  // Calculate coordinates for points
  const points = data.map((item, index) => {
    const x =
      paddingLeft +
      index * (chartWidth / (data.length > 1 ? data.length - 1 : 1));
    const y = height - paddingBottom - (item.count / maxCount) * chartHeight;
    return { x, y, label: item.month, count: item.count };
  });

  // Construct path string
  let linePath = "";
  let areaPath = "";
  if (points.length > 0) {
    linePath = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
    areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;
  }

  // Grid lines
  const gridLines = [];
  const gridCount = 4;
  for (let i = 0; i <= gridCount; i++) {
    const val = Math.round((maxCount / gridCount) * i);
    const y = height - paddingBottom - (i / gridCount) * chartHeight;
    gridLines.push({ y, val });
  }

  return (
    <div style={{ width: "100%" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid Lines */}
        {gridLines.map((line, idx) => (
          <g key={idx}>
            <line
              x1={paddingLeft}
              y1={line.y}
              x2={width - paddingRight}
              y2={line.y}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={paddingLeft - 10}
              y={line.y + 4}
              fill="#94a3b8"
              fontSize="10px"
              textAnchor="end"
              fontWeight="550"
            >
              {line.val}
            </text>
          </g>
        ))}

        {/* Area Path */}
        {points.length > 0 && <path d={areaPath} fill="url(#areaGrad)" />}

        {/* Line Path */}
        {points.length > 0 && (
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* X Axis Line */}
        <line
          x1={paddingLeft}
          y1={height - paddingBottom}
          x2={width - paddingRight}
          y2={height - paddingBottom}
          stroke="#cbd5e1"
          strokeWidth="1"
        />

        {/* Dots & Labels */}
        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="7" fill="#2563eb" opacity="0.15" />
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#ffffff"
              stroke="#2563eb"
              strokeWidth="2.5"
            />
            <text
              x={p.x}
              y={p.y - 10}
              fill="#0f172a"
              fontSize="11px"
              fontWeight="700"
              textAnchor="middle"
            >
              {p.count}
            </text>
            <text
              x={p.x}
              y={height - paddingBottom + 18}
              fill="#64748b"
              fontSize="10px"
              fontWeight="600"
              textAnchor="middle"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function SvgBarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>
        No data to display
      </div>
    );
  }

  const width = 500;
  const height = 240;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const counts = data.map((d) => d.count);
  const maxCount = Math.max(...counts, 4);

  const barWidth = Math.min(40, (chartWidth / data.length) * 0.55);
  const xStep = chartWidth / data.length;

  // Grid lines
  const gridLines = [];
  const gridCount = 4;
  for (let i = 0; i <= gridCount; i++) {
    const val = Math.round((maxCount / gridCount) * i);
    const y = height - paddingBottom - (i / gridCount) * chartHeight;
    gridLines.push({ y, val });
  }

  return (
    <div style={{ width: "100%" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid Lines */}
        {gridLines.map((line, idx) => (
          <g key={idx}>
            <line
              x1={paddingLeft}
              y1={line.y}
              x2={width - paddingRight}
              y2={line.y}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x={paddingLeft - 10}
              y={line.y + 4}
              fill="#94a3b8"
              fontSize="10px"
              textAnchor="end"
              fontWeight="550"
            >
              {line.val}
            </text>
          </g>
        ))}

        {/* X Axis Line */}
        <line
          x1={paddingLeft}
          y1={height - paddingBottom}
          x2={width - paddingRight}
          y2={height - paddingBottom}
          stroke="#cbd5e1"
          strokeWidth="1"
        />

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.count / maxCount) * chartHeight;
          const x = paddingLeft + index * xStep + (xStep - barWidth) / 2;
          const y = height - paddingBottom - barHeight;

          return (
            <g key={index}>
              {/* Rounded top corner bar path */}
              <path
                d={`
                  M ${x} ${y + 4}
                  Q ${x} ${y} ${x + 4} ${y}
                  L ${x + barWidth - 4} ${y}
                  Q ${x + barWidth} ${y} ${x + barWidth} ${y + 4}
                  L ${x + barWidth} ${height - paddingBottom}
                  L ${x} ${height - paddingBottom}
                  Z
                `}
                fill="url(#barGrad)"
              />
              <text
                x={x + barWidth / 2}
                y={y - 8}
                fill="#0f172a"
                fontSize="11px"
                fontWeight="700"
                textAnchor="middle"
              >
                {item.count}
              </text>
              <text
                x={x + barWidth / 2}
                y={height - paddingBottom + 18}
                fill="#64748b"
                fontSize="10px"
                fontWeight="600"
                textAnchor="middle"
              >
                {item.month}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function GeographicDistribution({ chartCountries, metrics }) {
  const totalInq = metrics?.totalInquiries || 0;

  return (
    <div className="dist-list" style={{ marginTop: "10px" }}>
      {chartCountries.map((c, idx) => {
        const percentage = totalInq > 0 ? (c.value / totalInq) * 100 : 0;
        return (
          <div key={idx} className="dist-item">
            <div className="dist-info">
              <span>📍 {c.name || "Unknown"}</span>
              <span>
                {c.value} ({percentage.toFixed(0)}%)
              </span>
            </div>
            <div className="dist-bar-bg">
              <div
                className="dist-bar-fill"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
      {chartCountries.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          No geographic statistics available.
        </div>
      )}
    </div>
  );
}

function AnalyticsView({ chartMonthly, chartCountries, metrics }) {
  return (
    <div className="charts-grid-layout">
      {/* 1. Inquiry Trend (Line/Area Chart) - Full Width */}
      <div className="chart-card chart-full-width">
        <h3 className="chart-title">Inquiry Trend (Line Analytics)</h3>
        <div className="chart-body-wrapper">
          <SvgLineChart data={chartMonthly} />
        </div>
      </div>

      {/* 2. Monthly Inquiries (Bar Chart) */}
      <div className="chart-card">
        <h3 className="chart-title">Monthly Inquiries (Volume Comparison)</h3>
        <div className="chart-body-wrapper">
          <SvgBarChart data={chartMonthly} />
        </div>
      </div>

      {/* 3. Geographic Origin Distribution */}
      <div className="chart-card">
        <h3 className="chart-title">Geographic Origin Distribution</h3>
        <div className="chart-body-wrapper">
          <GeographicDistribution
            chartCountries={chartCountries}
            metrics={metrics}
          />
        </div>
      </div>
    </div>
  );
}

// ==========================================
// K. SETTINGS & PROFILE VIEW
// ==========================================
function SettingsView({ adminUser, setAdminUser, token, handleLogout }) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (adminUser) {
      setForm({ username: adminUser.username, email: adminUser.email, password: '' });
    }
  }, [adminUser]);

  const updateProfile = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUser(data.admin);
        setSuccess(true);
      } else {
        const errData = await res.json();
        setError(errData.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setError("Network connection issue.");
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <h1 className="page-title">Profile & Security Settings</h1>
      </div>

      <div style={{ backgroundColor: 'var(--admin-bg-white)', border: '1px solid var(--admin-border)', padding: '40px', borderRadius: '6px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Edit Admin Credentials</h3>

        {success && <div style={{ color: 'var(--admin-success)', backgroundColor: '#d1fae5', border: '1px solid #10b981', padding: '12px', borderRadius: '4px', fontSize: '13.5px', marginBottom: '20px', fontWeight: '500' }}>Admin credentials updated successfully!</div>}
        {error && <div style={{ color: 'var(--admin-danger)', backgroundColor: '#fee2e2', padding: '12px', borderRadius: '4px', fontSize: '13.5px', marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" className="form-input" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Update Password (Leave blank to keep current)</label>
            <input type="password" className="form-input" placeholder="Enter new password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Profile Settings</button>
            <button type="button" className="btn btn-danger" style={{ flex: 1 }} onClick={handleLogout}>Log Out Panel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
