// src/pages/Applications.tsx
import React from 'react';

interface ApplicationsProps {
  onNavigate: (page: string) => void;
}

const apps = [
  {
    title: 'Defence & Security',
    img: 'https://images.pexels.com/photos/4116714/pexels-photo-4116714.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'Radar systems, electronic warfare, antenna testing for defence applications.',
    items: ['Radar cross-section measurement', 'Electronic warfare systems', 'Antenna testing for missiles', 'Communication jamming analysis'],
  },
  {
    title: 'Space & Satellite',
    img: 'https://images.pexels.com/photos/1167355/pexels-photo-1167355.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'Satellite communication components, antenna characterization, and RF testing for space-grade applications.',
    items: ['Satellite antenna testing', 'RF component qualification', 'Thermal vacuum compatible assemblies', 'High-frequency waveguides'],
  },
  {
    title: 'Academic Research',
    img: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'Complete microwave laboratory setups, training benches, and research instruments for universities and institutes.',
    items: ['Microwave lab setup', 'Student training benches', 'Antenna measurement systems', 'Research collaboration'],
  },
  {
    title: 'Industrial Microwave',
    img: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'Industrial heating, material testing, and process monitoring using microwave technology.',
    items: ['Material characterization', 'Non-destructive testing', 'Process monitoring', 'Industrial heating solutions'],
  },
  {
    title: 'Telecommunications',
    img: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'RF components and test equipment for 4G/5G base stations and wireless communication infrastructure.',
    items: ['5G antenna testing', 'Base station components', 'Beamforming antenna arrays', 'mmWave testing'],
  },
  {
    title: 'Automotive Radar',
    img: 'https://images.pexels.com/photos/3912981/pexels-photo-3912981.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'Compact anechoic chambers and test setups for automotive radar and ADAS system validation.',
    items: ['ADAS radar testing', '77 GHz antenna measurement', 'Compact range testing', 'OTA testing solutions'],
  },
];

export default function Applications({ onNavigate }: ApplicationsProps) {
  return (
    <div className="pt-navbar">
      <div className="page-hero bg-gradient-dark">
        <div
          className="page-hero-overlay"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1262304/pexels-photo-1262304.jpeg?auto=compress&cs=tinysrgb&w=1200')" }}
        />
        <div className="container position-relative z-1">
          <p className="fs-xs text-accent-light text-uppercase mb-2 ls-1">
            <button onClick={() => onNavigate('home')} className="breadcrumb-link">Home</button>
            {' / Applications'}
          </p>
          <h1 className="text-white fs-2xl fw-900">Applications</h1>
        </div>
      </div>

      <div className="section py-5">
        <div className="container">
          <div className="services-intro mb-12">
            <p className="subheading">Industry Verticals</p>
            <h2>Where Our <span className="highlight">Solutions Are Applied</span></h2>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-20">
            {apps.map((app) => (
              <div key={app.title} className="application-card">
                <div className="application-card-img">
                  <img src={app.img} alt={app.title} />
                </div>
                <div className="application-card-body">
                  <h3>{app.title}</h3>
                  <p className="desc">{app.desc}</p>
                  <ul className="application-list">
                    {app.items.map((item) => (
                      <li key={item}>
                        <i className="fas fa-chevron-right"></i> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="cta-dark">
            <h3>Have a Specific Application?</h3>
            <p>Our engineers can design custom solutions for your unique requirements.</p>
            <button onClick={() => onNavigate('contact')} className="btn btn-primary">
              Discuss Your Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}