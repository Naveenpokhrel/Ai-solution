import React, { useState } from 'react';
import { API_URL } from '../config/config.js';

export default function ContactPage({ setToast }) {
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
