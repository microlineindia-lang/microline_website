// src/pages/ProductDetail.tsx
import { useRef, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDatoProducts, type CMSProduct } from "../hooks/useDatoProducts";
import { useMatchHeight } from "../hooks/useMatchHeight";

interface ProductDetailProps {
  onNavigate: (page: string, data?: unknown) => void;
}

// Type guards
function isProductListSection(
  section: CMSProduct["sections"][number]
): section is {
  __typename: "ProductListSectionRecord";
  id: string;
  sectionTitle: string;
  items: string[];
} {
  return section.__typename === "ProductListSectionRecord";
}

function isSpecificationSection(
  section: CMSProduct["sections"][number]
): section is {
  __typename: "SpecificationSectionRecord";
  id: string;
  sectionTitle: string;
  specifications: { id: string; label: string; value: string }[];
} {
  return section.__typename === "SpecificationSectionRecord";
}

function getFeatures(product: CMSProduct): string[] {
  for (const section of product.sections) {
    if (
      isProductListSection(section) &&
      section.sectionTitle.toLowerCase() === "features"
    ) {
      return section.items;
    }
  }
  return [];
}

export default function ProductDetail({ onNavigate }: ProductDetailProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { products: allProducts, loading, error } = useDatoProducts();

  const productFromState = location.state?.product as CMSProduct | undefined;
  const slug = location.pathname.split("/").pop();
  const productFromSlug = allProducts.find((p) => p.slug === slug);
  const p = productFromState || productFromSlug || allProducts[0];

  // Dynamic tabs (excluding "Features")
  const tabs = useMemo(() => {
    if (!p) return [];
    return p.sections
      .filter((section) => {
        if (section.sectionTitle.toLowerCase() === "features") return false;
        if (isProductListSection(section)) return section.items.length > 0;
        if (isSpecificationSection(section))
          return section.specifications.length > 0;
        return false;
      })
      .map((section) => ({
        id: section.id,
        title: section.sectionTitle,
        __typename: section.__typename,
      }));
  }, [p]);

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleNavigate = (page: string, data?: unknown) => {
    if (data && page === "product-detail") {
      const product = data as CMSProduct;
      navigate(`/product/${product.slug}`, { state: { product } });
    } else {
      onNavigate(page, data);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  useMatchHeight(leftColumnRef, rightColumnRef, 768);

  if (loading)
    return (
      <div className="pt-navbar flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="pt-navbar flex justify-center items-center h-screen text-red-500">
        Error loading product.
      </div>
    );
  if (!p)
    return (
      <div className="pt-navbar flex justify-center items-center h-screen">
        Product not found.
      </div>
    );

  const features = getFeatures(p);
  const brochureUrl = p.brochure?.url;
  const activeTab = tabs[activeTabIndex];
  const activeSection = activeTab
    ? p.sections.find((s) => s.id === activeTab.id)
    : null;

  return (
    <div className="pt-navbar">
      {/* Hero */}
      <div className="product-detail-hero bg-gradient-dark">
        <div
          className="product-detail-hero-overlay"
          style={{ backgroundImage: `url('${p.image.url}')` }}
        />
        <div className="container position-relative z-1">
          <p className="d-flex align-items-center gap-2 mb-2 text-uppercase ls-2 fw-700 fs-xs">
            <button onClick={() => onNavigate("home")} className="breadcrumb-link text-info">Home</button>
            <span className="text-white" style={{ opacity: 0.5 }}> / </span>
            <button onClick={() => onNavigate("products")} className="breadcrumb-link text-info">Products</button>
            <span className="text-gold">{` / ${p.name}`}</span>
          </p>
          <h1 className="text-white fs-2xl fw-900">{p.name}</h1>
        </div>
      </div>

      <div className="section py-5">
        <div className="container">
          <div className="product-detail-layout">
            <div className="product-detail-image" ref={leftColumnRef}>
              <img src={p.image.url} alt={p.name} />
            </div>
            <div ref={rightColumnRef}>
              <span className="product-badge badge-inline">{p.category.name}</span>
              <h2 className="fs-2xl fw-900 mb-3 text-primary">{p.name}</h2>
              <p className="text-secondary mb-4">{p.description}</p>

              {features.length > 0 && (
                <>
                  <h3 className="fw-700 mb-3 text-primary">Key Features</h3>
                  <ul className="feature-list">
                    {features.map((f) => (
                      <li key={f}><i className="fas fa-check-circle"></i> {f}</li>
                    ))}
                  </ul>
                </>
              )}

              <div className="btn-group">
                <button onClick={() => handleNavigate("contact")} className="btn btn-primary">
                  Request Quote
                </button>
                {brochureUrl && (
                  <a href={brochureUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                    <i className="fas fa-download mr-2"></i> Download Brochure
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Tabs */}
          {tabs.length > 0 && (
            <div className="tabs">
              <div className="tab-header">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabIndex(index)}
                    className={`tab-btn${index === activeTabIndex ? " active" : ""}`}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
              <div className="tab-panel">
                {activeSection ? (
                  // Specification tab – always single column
                  isSpecificationSection(activeSection) ? (
                    <div>
                      {activeSection.specifications.map((spec) => (
                        <div key={spec.id} className="spec-row">
                          <span className="spec-key">{spec.label}</span>
                          <span className="spec-value">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : isProductListSection(activeSection) ? (
                      activeSection.items.length > 6 ? (
                        /* Multi‑column grid (≥7 items) */
                        <div className="list-grid">
                          {activeSection.items.map((item) => (
                            <div key={item} className="list-grid-item">
                              <i className="fas fa-caret-right"></i> {item}
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Single column – same card style */
                        <div className="list-column">
                          {activeSection.items.map((item) => (
                            <div key={item} className="list-grid-item">
                              <i className="fas fa-caret-right"></i> {item}
                            </div>
                          ))}
                        </div>
                      )
                    ) : null
                ) : (
                  <p>No data available.</p>
                )}
              </div>
            </div>
          )}

          {/* Related Products */}
          <h3 className="section-title text-center">
                Related <span className="text-accent">Products</span>
              </h3>
          <div className="related-products-grid grid grid-cols-3 gap-4">
            {allProducts
              .filter((rel) => rel.slug !== p.slug)
              .slice(0, 3)
              .map((rel) => (
                <div
                  key={rel.slug}
                  className="related-card"
                  onClick={() => handleNavigate("product-detail", rel)}
                >
                  <div className="related-card-img">
                    <img src={rel.image.url} alt={rel.name} />
                  </div>
                  <div className="related-card-body">
                    <p className="category">{rel.category.name}</p>
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