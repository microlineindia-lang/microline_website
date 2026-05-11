// src/pages/Achievements.tsx
import React from 'react';

interface AchievementsProps {
  onNavigate: (page: string) => void;
}

const achievements = [
  'Developed RS Control Circuit (DAC 16bit) 64 channel for TCS Innovation Lab, Kolkata',
  'Microwave Lab for NIT Meera, NIT Sikkim, NIT Jamshedpur, NIT Silchar, NIT Durgapur, NIT Goa, NIT Warangal, NIT Rourkela, Tripura University',
  'Microwave Scanner for SISIR Radar',
  'Microwave Anechoic Chamber for IEM Kolkata, TCS Kolkata, NIT Jamshedpur, NIT Sikkim and more',
  'Custom made Waveguides for DRDO research and Researchers',
  'Microwave 3D Anechoic Chamber for major defence organizations',
  'Custom RF Components for space applications',
  'Antenna Measurement Systems for leading research institutions',
  'Microstrip Antenna fabrication for satellite communication projects',
  'Lab setup for 15+ National Institutes of Technology across India',
];

const clients = [
  { name: 'National Institutes of Technology', count: '15+', desc: 'NITs across India' },
  { name: 'DRDO', count: '5+', desc: 'Projects completed' },
  { name: 'TCS Innovation Labs', count: '3', desc: 'Major installations' },
  { name: 'Private R&D', count: '50+', desc: 'Industry clients' },
];

export default function Achievements({ onNavigate }: AchievementsProps) {
  return (
    <div className="pt-navbar">
      {/* Hero */}
      <div className="page-hero bg-gradient-dark">
        <div
          className="page-hero-overlay"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=1200')",
          }}
        />
        <div className="container position-relative z-1">
          <p className="fs-xs text-accent-light text-uppercase mb-2 ls-1">
            <button onClick={() => onNavigate('home')} className="breadcrumb-link">
              Home
            </button>
            {' / Achievements'}
          </p>
          <h1 className="text-white fs-2xl fw-900">Our Achievements</h1>
        </div>
      </div>

      {/* Content */}
      <div className="section py-16">
        <div className="container">
          {/* Client Stats */}
          <div className="grid grid-cols-2 lg-grid-cols-4 gap-6 mb-16">
            {clients.map((c) => (
              <div key={c.name} className="client-stat-card">
                <p className="count">{c.count}</p>
                <p className="name">{c.name}</p>
                <p className="desc">{c.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid lg-grid-cols-2 gap-12 mb-16">
            {/* Achievements List */}
            <div>
              <h2 className="section-title text-left">
                Notable <span className="text-accent">Accomplishments</span>
              </h2>
              <div className="d-flex flex-column gap-3">
                {achievements.map((a) => (
                  <div key={a} className="achievement-item">
                    <i className="fas fa-check-circle"></i>
                    <p>{a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Cards */}
            <div>
              <div className="visual-card">
                <img
                  src="https://images.pexels.com/photos/3912981/pexels-photo-3912981.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Anechoic Chamber"
                  className="visual-card-img visual-card-img-tall"
                />
                <div className="visual-card-caption">
                  <p className="title">Microwave 3D Anechoic Chamber</p>
                  <p className="subtitle">State-of-the-art facility for antenna testing</p>
                </div>
              </div>

              <div className="visual-card">
                <img
                  src="https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Lab Setup"
                  className="visual-card-img visual-card-img-short"
                />
                <div className="visual-card-caption">
                  <p className="title">Microwave Laboratory Setup</p>
                  <p className="subtitle">Complete lab setups for NIT campuses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline">
            <h2 className="section-title mb-8">
              Our <span className="text-accent">Journey</span>
            </h2>
            <div className="timeline-line" />
            {[
              { year: '1997', event: 'Microline India founded in Kolkata' },
              { year: '2002', event: 'First major project with NIT Durgapur' },
              { year: '2008', event: 'Expanded to Defence sector, first DRDO project' },
              { year: '2015', event: 'Supplied Microwave Labs to 10+ NITs' },
              { year: '2020', event: 'Launched 3D Anechoic Chamber product line' },
              { year: '2024', event: 'Serving 500+ satisfied customers across India' },
            ].map((item, i) => (
              <div
                key={item.year}
                className={`timeline-item ${i % 2 !== 0 ? 'timeline-item-reverse' : ''}`}
              >
                <div className="timeline-content">
                  <div className="timeline-card">
                    <p className="year">{item.year}</p>
                    <p className="event">{item.event}</p>
                  </div>
                </div>
                <div className="timeline-dot" />
                <div className="timeline-spacer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}