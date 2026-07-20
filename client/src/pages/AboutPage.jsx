import React from 'react';

export default function AboutPage() {
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
