import React from 'react';

export default function Breadcrumbs({ page, navigateTo }) {
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
