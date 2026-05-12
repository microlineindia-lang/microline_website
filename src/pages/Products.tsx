// src/pages/Products.tsx
import { useState } from 'react';

interface ProductsProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export const productData = [
  {
    id: 'anechoic-chamber',
    category: 'Microwave Test Systems',
    name: 'Microwave 3D Anechoic Chamber',
    img: 'https://images.pexels.com/photos/4116714/pexels-photo-4116714.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'Microline India provides state of the art 3D Anechoic Chambers for accurate testing of antennas, radomes and microwave components in a controlled environment.',
    features: ['Fully automated system', 'Low reflection & high absorption', 'Wide frequency range', 'Precision positioning', 'User-friendly software'],
    specs: {
      'Frequency Range': '400 MHz – 40 GHz',
      'Quiet Zone': 'Up to 2m / 3m',
      'Positioner Type': 'Azimuth, Elevation, Polarization',
      'Control System': 'PC Based Automation',
      'Absorber Type': 'Pyramidal / Hybrid',
    },
  },
  {
    id: 'microwave-scanner',
    category: 'Microwave Test Systems',
    name: 'Microwave 3D Scanner',
    img: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'High-precision 3D scanning system for characterizing antenna patterns and near-field measurements.',
    features: ['3-axis movement', 'High precision stepper motors', 'PC controlled automation', 'Custom scan path support'],
    specs: {
      'Frequency Range': '1 GHz – 40 GHz',
      'Scan Volume': 'Up to 2m x 2m x 2m',
      'Positioning Accuracy': '±0.1mm',
      'Control System': 'PC Based',
    },
  },
  {
    id: 'microstrip-antenna',
    category: 'Antennas',
    name: 'Microstrip Planar Antenna',
    img: 'https://images.pexels.com/photos/1167355/pexels-photo-1167355.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'Custom microstrip planar and non-planar antennas designed and fabricated for research and industry applications.',
    features: ['Custom frequency bands', 'High gain variants', 'Compact form factor', 'VSWR < 2'],
    specs: {
      'Frequency Range': '1 GHz – 18 GHz',
      'Gain': 'Up to 20 dBi',
      'Polarization': 'Linear / Circular',
      'Substrate': 'Rogers / FR4',
    },
  },
  {
    id: 'pyramidal-horn',
    category: 'Antennas',
    name: 'Microwave Pyramidal Horn Antennas',
    img: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'Standard gain pyramidal horn antennas across multiple frequency bands for antenna testing and calibration.',
    features: ['Standard gain reference', 'Low side lobes', 'Rugged construction', 'Wide band coverage'],
    specs: {
      'Frequency Range': '1 GHz – 40 GHz',
      'Gain': '10 – 25 dBi',
      'Polarization': 'Linear',
      'Material': 'Aluminium / Brass',
    },
  },
  {
    id: 'waveguide',
    category: 'Waveguides & Accessories',
    name: 'Custom Waveguides',
    img: 'https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'Precision machined waveguides in standard and custom dimensions for microwave signal transmission.',
    features: ['Custom dimensions', 'Low loss', 'Precision flanges', 'Multiple band options'],
    specs: {
      'Frequency Range': '1 GHz – 110 GHz',
      'Material': 'Aluminium / Brass / Copper',
      'Flange': 'Standard / Custom',
      'Finish': 'Silver / Gold Plated',
    },
  },
  {
    id: 'test-bench',
    category: 'Microwave Test Systems',
    name: 'Microwave Test Bench & Antenna Trainer',
    img: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600',
    desc: 'Complete microwave test benches and antenna training setups for educational institutions and R&D labs.',
    features: ['Complete lab setup', 'Student-friendly interface', 'Multiple experiments', 'Technical manual included'],
    specs: {
      'Frequency Range': '2.4 GHz / 9.4 GHz',
      'Applications': 'Education / Research',
      'Setup': 'Table-top',
      'Manual': 'Included',
    },
  },
];

const categories = ['All', 'Microwave Test Systems', 'Antennas', 'Waveguides & Accessories'];

export default function Products({ onNavigate }: ProductsProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? productData
      : productData.filter((p) => p.category === activeCategory);

 return (
    <div className="pt-navbar">
      <div className="page-hero bg-gradient-dark">
        <div
          className="page-hero-overlay"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1200')" }}
        />
        <div className="container position-relative z-1">
          <div className="d-flex align-items-center gap-2 mb-2 text-uppercase ls-2 fw-700 fs-xs">
            <button onClick={() => onNavigate('home')} className="breadcrumb-link text-info">HOME</button>
            <span className="text-white" style={{ opacity: 0.5 }}> / </span>
            <span className="text-gold">PRODUCTS</span>
          </div>
          <h1 className="text-white fs-2xl fw-900">Our Products</h1>
        </div>
      </div>

      <div className="section py-5">
        <div className="container">
          <div className="category-filters">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`filter-btn${cat === activeCategory ? ' active' : ''}`}>{cat}</button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {filtered.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-card-img">
                  <img src={product.img} alt={product.name} />
                  <span className="product-badge">{product.category}</span>
                </div>
                <div className="product-card-body">
                  <h3>{product.name}</h3>
                  <p className="desc">{product.desc}</p>
                  <button onClick={() => onNavigate('product-detail', product)} className="view-details-btn d-flex align-items-center gap-2">
                    <i className="fas fa-eye"></i> View Details <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}