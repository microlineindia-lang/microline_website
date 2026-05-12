// src/pages/About.tsx
import React from 'react';
import collage from '../assets/images/product-collage.png';

interface AboutProps { onNavigate: (page: string) => void; }

export default function About({ onNavigate }: AboutProps) {
  return (
    <div className="pt-navbar">
      {/* Hero */}
      <div className="page-hero bg-gradient-dark">
        <div
          className="page-hero-overlay"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=1200')" }}
        />
        <div className="container position-relative z-1">
          <div className="d-flex align-items-center gap-2 mb-2 text-uppercase ls-2 fw-700 fs-xs">
            <button
              onClick={() => onNavigate('home')}
              className="breadcrumb-link text-info"
            >
              HOME
            </button>
            <span className="text-white" style={{ opacity: 0.5 }}> / </span>
            <span className="text-gold">ABOUT US</span>
          </div>
          <h1 className="text-white fs-2xl fw-900">
            About Microline India
          </h1>
        </div>
      </div>

      <div className="section py-5">
        <div className="container">
          {/* Who We Are */}
          <div className="grid grid-cols-2 gap-5 mb-20">
            <div>
              <div className="text-center">
                <h2 className="section-title">
                  Who <span className="text-accent">We Are</span>
                </h2>
              </div>
              <p className="text-secondary mb-3">
                 Microline India, a name resonant with innovation in microwave technology, offers a cutting-edge technology in visualization of electromagnetic waves. Since 1997 we are providing innovative Microwave and RF solutions, advancing the technology to global reach with new heights.
              </p>
              <p className="text-secondary mb-3">
                With the designing experience and innovations ideas backed by skilled manpower, Microline produces finest quality products designed in-house assuring the products to be versatile and rugged in trend with modern technologies.
              </p>
              <p className="text-secondary">
                Our distinction is our satisfied customers; we take all efforts to serve them with best of our expertise.
              </p>
            </div>
            <div className="mt-5">
              <img
                src={collage}
                alt="Microline India Office"
                className="about-image"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-20">
            <div className="stats-card">
              <i className="fas fa-award text-glow-light"></i>
              <span className="stats-value">Since 1997</span>
              <span className="stats-label">Delivering Innovation</span>
            </div>
            <div className="stats-card">
              <i className="fas fa-microchip text-glow-light"></i>
              <span className="stats-value">In-house</span>
              <span className="stats-label">Design & Development</span>
            </div>
            <div className="stats-card">
              <i className="fas fa-check-circle text-glow-light"></i>
              <span className="stats-value">Custom Solutions</span>
              <span className="stats-label">As Per Requirement</span>
            </div>
            <div className="stats-card">
              <i className="fas fa-globe text-glow-light"></i>
              <span className="stats-value">Pan India</span>
              <span className="stats-label">Support</span>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-2 gap-4 mb-20">
            <div className="mission-card bg-mesh-3 ">
              <h3 className="fs-lg fw-800 text-gradient-ocean">
                <i className="fas fa-bullseye mr-2"></i> Our Mission
              </h3>
              <p className="text-stone">
                To deliver world-class microwave and RF solutions that empower research institutions, defence organizations, and industries across India and beyond, through relentless innovation and unwavering commitment to quality.
              </p>
            </div>
            <div className="vision-card bg-secondary-3-reverse">
              <h3 className="fs-lg fw-800 text-platinum">
                <i className="fas fa-eye mr-2"></i> Our Vision
              </h3>
              <p className="text-charcoal">
                To become the leading indigenous manufacturer of microwave and RF instruments in India, recognized globally for precision engineering, customer satisfaction, and technological excellence.
              </p>
            </div>
          </div>

          {/* Core Strengths */}
          <div className="text-center mb-12">
            <h2 className="section-title">
              Our <span className="text-accent">Core Strengths</span>
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-20">
            <div className="strength-card">
              <h3>In-House Design</h3>
              <p>End-to-end product design from concept to prototype, ensuring optimal performance.</p>
            </div>
            <div className="strength-card">
              <h3>Advanced Manufacturing</h3>
              <p>State-of-the-art fabrication facilities for precision microwave components.</p>
            </div>
            <div className="strength-card">
              <h3>Quality Testing</h3>
              <p>Rigorous testing protocols to ensure every product meets the highest standards.</p>
            </div>
            <div className="strength-card">
              <h3>Custom Solutions</h3>
              <p>Tailored microwave and RF solutions designed to meet specific client requirements.</p>
            </div>
            <div className="strength-card">
              <h3>Technical Support</h3>
              <p>Expert guidance and after-sales support from our skilled engineering team.</p>
            </div>
            <div className="strength-card">
              <h3>R&D Capabilities</h3>
              <p>Continuous research and development to stay at the forefront of RF technology.</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button onClick={() => onNavigate('contact')} className="btn btn-primary">
              Get In Touch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}