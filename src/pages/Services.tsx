// src/pages/Services.tsx
import React from 'react';

interface ServicesProps {
  onNavigate: (page: string) => void;
}

const services = [
  {
    icon: 'fa-broadcast-tower',
    title: 'Microstrip Antenna Fabrication',
    desc: 'High-precision microstrip antenna design and fabrication. Custom designs for specific frequency bands, gain requirements, and polarization specifications.',
    highlights: ['Custom frequency bands', 'Prototype to production', 'PCB-based and cavity-backed designs'],
  },
  {
    icon: 'fa-microchip',
    title: 'Microwave Planar & Non-Planar Fabrication',
    desc: 'Custom microwave circuits and components. Design and fabrication of complex microwave circuits on various substrates including Rogers and PTFE materials.',
    highlights: ['Rogers, PTFE, FR4 substrates', 'Multilayer PCB capability', 'Tight tolerance machining'],
  },
  {
    icon: 'fa-cogs',
    title: 'Microwave Related Projects',
    desc: 'End-to-end project support for researchers & industries. Complete turnkey solutions from design to delivery for microwave and RF related research projects.',
    highlights: ['Research collaboration', 'Industry partnerships', 'DRDO/ISRO project support'],
  },
  {
    icon: 'fa-flask',
    title: 'Laboratory Setup & Installation',
    desc: 'Complete lab setup for educational institutions and R&D labs. Comprehensive microwave laboratory setup including instruments, test benches, and training materials.',
    highlights: ['Full lab design', 'Equipment supply & installation', 'Training & documentation'],
  },
  {
    icon: 'fa-headset',
    title: 'Consultation & Technical Support',
    desc: 'Expert guidance from conception to product development. Our experienced team provides technical consultation for microwave and RF technology projects.',
    highlights: ['Design consultation', 'Technology transfer', 'Troubleshooting support'],
  },
];

export default function Services({ onNavigate }: ServicesProps) {
  return (
    <div className="pt-navbar">
      <div className="page-hero bg-gradient-dark">
        <div
          className="page-hero-overlay"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1200')" }}
        />
        <div className="container position-relative z-1">
          <p className="fs-xs text-accent-light text-uppercase mb-2 ls-1">
            <button onClick={() => onNavigate('home')} className="breadcrumb-link">Home</button>
            {' / Services'}
          </p>
          <h1 className="text-white fs-2xl fw-900">Our Services</h1>
        </div>
      </div>

      <div className="section py-5">
        <div className="container">
          <div className="services-intro">
            <p className="subheading">What We Do</p>
            <h2>Comprehensive <span className="highlight">RF & Microwave Services</span></h2>
            <p>From design and fabrication to lab setup and technical consultation...</p>
          </div>

          <div className="service-list">
            {services.map((service, i) => (
              <div key={service.title} className="service-card">
                <div className="service-icon-circle">
                  <i className={`fas ${service.icon}`}></i>
                </div>
                <div className="service-body">
                  <div className="service-header">
                    <div>
                      <h3 className="service-title">{service.title}</h3>
                      <p className="service-desc">{service.desc}</p>
                    </div>
                    <span className="service-number">{String(i+1).padStart(2,'0')}</span>
                  </div>
                  <div className="service-tags">
                    {service.highlights.map(h => (
                      <span key={h} className="service-tag">
                        <i className="fas fa-chevron-right"></i> {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cta-dark">
            <h3>Need a Custom Solution?</h3>
            <p>Talk to our experts today and let us help you achieve your goals.</p>
            <button onClick={() => onNavigate('contact')} className="btn btn-primary">Contact Us</button>
          </div>
        </div>
      </div>
    </div>
  );
}