// src/pages/ProductDetail.tsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productData } from './Products';

interface ProductDetailProps {
  onNavigate: (page: string, data?: unknown) => void;
}

export default function ProductDetail({ onNavigate }: ProductDetailProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Get product from router state (passed via navigate from Products page)
  const productFromState = location.state?.product as typeof productData[0] | undefined;

  // 2. Fallback: extract id from URL param and find matching product
  const productId = location.pathname.split('/').pop();
  const productFromId = productData.find(p => p.id === productId);

  // 3. Final product – state first, then URL match, then first product as default
  const p = productFromState || productFromId || productData[0];

  const [activeTab, setActiveTab] = useState<'specs' | 'apps'>('specs');

  // Helper to navigate using both onNavigate (for other pages) and direct navigate for product links
  const handleNavigate = (page: string, data?: unknown) => {
    if (data && page === 'product-detail') {
      navigate(`/product/${(data as typeof productData[0]).id}`, { state: { product: data } });
    } else {
      onNavigate(page, data);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

return (
    <div className="pt-navbar">
      <div className="product-detail-hero bg-gradient-dark">
        <div
          className="product-detail-hero-overlay"
          style={{ backgroundImage: `url('${p.img}')` }}
        />
        <div className="container position-relative z-1">
          <p className="fs-xs text-accent-light text-uppercase mb-2 ls-1">
            <button onClick={() => handleNavigate('home')} className="breadcrumb-link">Home</button>
            {' / '}
            <button onClick={() => handleNavigate('products')} className="breadcrumb-link">Products</button>
            {` / ${p.name}`}
          </p>
          <h1 className="text-white fs-2xl fw-900">{p.name}</h1>
        </div>
      </div>

      <div className="section py-5">
        <div className="container">
          <div className="grid grid-cols-2 gap-5 mb-20">
            <div className="product-detail-image">
              <img src={p.img} alt={p.name} />
            </div>

            <div>
              <span className="product-badge badge-inline">{p.category}</span>
              <h2 className="fs-2xl fw-900 mb-3 text-primary">{p.name}</h2>
              <p className="text-secondary mb-4">{p.desc}</p>

              <h3 className="fw-700 mb-3 text-primary">Key Features</h3>
              <ul className="feature-list">
                {p.features.map((f) => (
                  <li key={f}><i className="fas fa-check-circle"></i>{f}</li>
                ))}
              </ul>

              <div className="btn-group">
                <button onClick={() => handleNavigate('contact')} className="btn btn-primary">Request Quote</button>
                <button className="btn btn-outline">
                  <i className="fas fa-download mr-2"></i> Download Brochure
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <div className="tab-header">
              <button onClick={() => setActiveTab('specs')} className={`tab-btn${activeTab === 'specs' ? ' active' : ''}`}>Specifications</button>
              <button onClick={() => setActiveTab('apps')} className={`tab-btn${activeTab === 'apps' ? ' active' : ''}`}>Applications</button>
            </div>
            <div className="tab-panel">
              {activeTab === 'specs' ? (
                <div>
                  {Object.entries(p.specs).map(([key, val]) => (
                    <div key={key} className="spec-row">
                      <span className="spec-key">{key}</span>
                      <span className="spec-value">{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="application-list">
                  {[
                    'Antenna pattern measurement',
                    'RCS measurement',
                    'Radome testing',
                    'EMC testing',
                    'Research & development',
                  ].map((app) => (
                    <li key={app}>
                      <i className="fas fa-chevron-right"></i> {app}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Related Products */}
          <h3 className="section-title text-left mb-4">Related Products</h3>
          <div className="related-products-grid grid grid-cols-3 gap-4">
            {productData.filter(x => x.id !== p.id).slice(0,3).map(rel => (
              <div key={rel.id} className="related-card" onClick={() => handleNavigate('product-detail', rel)}>
                <div className="related-card-img"><img src={rel.img} alt={rel.name} /></div>
                <div className="related-card-body">
                  <p className="category">{rel.category}</p>
                  <h4>{rel.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}