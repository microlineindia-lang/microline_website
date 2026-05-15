// src/pages/ProductDetail.tsx
import React, { useRef, useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDatoProducts, type CMSProduct } from "../hooks/useDatoProducts";
import { useMatchHeight } from "../hooks/useMatchHeight";
import { useMediaQuery } from "../hooks/useMediaQuery";

import { motion, AnimatePresence } from "framer-motion";

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
  const p = productFromState || productFromSlug || allProducts[0] || null;

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

  // Mobile accordion helper states
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

  // =========================================================
  // ✅ ENTERPRISE IMAGE MODAL ZOOM + PAN STATE
  // =========================================================
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef({ x: 0, y: 0 });
  const translateStart = useRef({ x: 0, y: 0 });

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const lastTapRef = useRef(0);
  const isTouchDevice = useMediaQuery("(pointer: coarse)");

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setImageModalOpen(false);
    };
    if (imageModalOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [imageModalOpen]);

  // Reset zoom when modal closes
  useEffect(() => {
    if (!imageModalOpen) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
      setIsDragging(false);
    }
  }, [imageModalOpen]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (imageModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [imageModalOpen]);

  // Zoom in towards cursor
  const zoomIn = (clientX?: number, clientY?: number) => {
    setScale((prev) => {
      const newScale = Math.min(prev + 0.5, 2);

      if (
        clientX !== undefined &&
        clientY !== undefined &&
        imageContainerRef.current
      ) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        setTranslate((prevTrans) => ({
          x: x - (x - prevTrans.x) * (newScale / prev),
          y: y - (y - prevTrans.y) * (newScale / prev),
        }));
      }

      return newScale;
    });
  };

  // Zoom out towards cursor
  const zoomOut = (clientX?: number, clientY?: number) => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1);

      if (
        clientX !== undefined &&
        clientY !== undefined &&
        imageContainerRef.current
      ) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        setTranslate((prevTrans) => ({
          x: x - (x - prevTrans.x) * (newScale / prev),
          y: y - (y - prevTrans.y) * (newScale / prev),
        }));
      }

      return newScale;
    });
  };

  const resetZoom = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  // Desktop: left click zoom in, right click zoom out + drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    // Zoom action
    if (e.button === 0) {
      zoomIn(e.clientX, e.clientY);
    } else if (e.button === 2) {
      zoomOut(e.clientX, e.clientY);
    }

    // Start dragging only if zoomed
    if (scale > 1) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      translateStart.current = { ...translate };
    }
  };

  // Mobile: double tap toggle 1x <-> 2x + drag start
  const handleTouchStart = (e: React.TouchEvent) => {
    const now = Date.now();
    const touch = e.touches[0];

    // Double tap
    if (now - lastTapRef.current < 300) {
      e.preventDefault();

      if (scale === 1) {
        setScale(2);
        setTranslate({ x: 0, y: 0 });
      } else {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
      }

      lastTapRef.current = 0;
      return;
    }

    lastTapRef.current = now;

    if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      dragStart.current = { x: touch.clientX, y: touch.clientY };
      translateStart.current = { ...translate };
    }
  };

  // Drag move handlers (window level)
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    setTranslate({
      x: translateStart.current.x + dx,
      y: translateStart.current.y + dy,
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;

    e.preventDefault();
    const touch = e.touches[0];

    const dx = touch.clientX - dragStart.current.x;
    const dy = touch.clientY - dragStart.current.y;

    setTranslate({
      x: translateStart.current.x + dx,
      y: translateStart.current.y + dy,
    });
  };

  const stopDragging = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", stopDragging);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);

      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [isDragging, scale]);

  // =========================================================
  // ✅ MINIMAP VIEWPORT RECT CALCULATION
  // =========================================================
  const [viewportRect, setViewportRect] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!imageContainerRef.current || !imageRef.current) return;

    const container = imageContainerRef.current;
    const img = imageRef.current;

    const containerRect = container.getBoundingClientRect();
    const cw = containerRect.width;
    const ch = containerRect.height;

    const imgRect = img.getBoundingClientRect();
    const imgDisplayW = imgRect.width;
    const imgDisplayH = imgRect.height;

    const tx = translate.x;
    const ty = translate.y;

    // visible image region
    const ix_min = (0 - tx) / scale;
    const iy_min = (0 - ty) / scale;
    const ix_max = (cw - tx) / scale;
    const iy_max = (ch - ty) / scale;

    const left = Math.max(ix_min / imgDisplayW, 0);
    const top = Math.max(iy_min / imgDisplayH, 0);
    const right = Math.min(ix_max / imgDisplayW, 1);
    const bottom = Math.min(iy_max / imgDisplayH, 1);

    setViewportRect({
      left: left * 100,
      top: top * 100,
      width: Math.max((right - left) * 100, 5),
      height: Math.max((bottom - top) * 100, 5),
    });
  }, [scale, translate, imageModalOpen]);

  const minimapThumbSrc = p?.image?.url || "";

  // =========================================================

    const features = p ? getFeatures(p) : [];
    const brochureUrl = p?.brochure?.url;

    const activeTab = tabs[activeTabIndex];
    const activeSection = activeTab && p
      ? p.sections.find((s) => s.id === activeTab.id)
      : null;

  // Sync accordion with selected tab when mobile
  useEffect(() => {
    if (isMobile && activeTab) {
      setOpenAccordionId(activeTab.id);
    }
  }, [isMobile, activeTab?.id]);


// Loading state
if (loading) {
  return (
    <div className="pt-navbar">
      <div className="loading-overlay" role="status" aria-live="polite">
        <div className="loading-container">
          <div className="loading-ring" aria-hidden="true"></div>

          <div className="loading-content">
            <h3 className="loading-title">Loading product details</h3>
            <p className="loading-message">
              Please wait while we fetch the information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error state (with retry)
if (error) {
  return (
    <div className="pt-navbar">
      <div className="error-container">
        <div className="error-card">
          <div className="error-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 className="error-title">Unable to load product</h2>
          <p className="error-message">
            Something went wrong while fetching the product data. Please try
            again.
          </p>
          <button
            className="btn btn-primary error-retry-btn"
            onClick={() => window.location.reload()}
          >
            <i className="fas fa-redo-alt me-2"></i> Retry
          </button>
        </div>
      </div>
    </div>
  );
}

// Not found state (with navigation back to products)
if (!p) {
  return (
    <div className="pt-navbar">
      <div className="error-container">
        <div className="error-card">
          <div className="error-icon">
            <i className="fas fa-box-open"></i>
          </div>
          <h2 className="error-title">Product not found</h2>
          <p className="error-message">
            The product you are looking for does not exist or may have been
            removed.
          </p>
          <button className="btn btn-outline" onClick={() => onNavigate("products")}>
            <i className="fas fa-arrow-left me-2"></i> Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}


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
            <button
              onClick={() => onNavigate("home")}
              className="breadcrumb-link text-info"
            >
              Home
            </button>
            <span className="text-white" style={{ opacity: 0.5 }}>
              {" "}
              /{" "}
            </span>
            <button
              onClick={() => onNavigate("products")}
              className="breadcrumb-link text-info"
            >
              Products
            </button>
            <span className="text-gold">{` / ${p.name}`}</span>
          </p>
          <h1 className="text-white fs-2xl fw-900">{p.name}</h1>
        </div>
      </div>

      <div className="section py-5">
        <div className="container">
          <div className="product-detail-layout">
            <div className="product-detail-image" ref={leftColumnRef}>
              <button
                onClick={() => setImageModalOpen(true)}
                className="image-trigger-btn"
                aria-label="View full size image"
              >
                <img src={p.image.url} alt={p.name} />
              </button>
            </div>

            <div ref={rightColumnRef}>
              <span className="product-badge badge-inline">
                {p.category.name}
              </span>

              <h2 className="fs-2xl fw-900 mb-3 text-primary">{p.name}</h2>
              <p className="text-secondary mb-4">{p.description}</p>

              {p.model && (
                <p className="text-muted mb-2" style={{ fontSize: "0.9rem" }}>
                  Model: <strong>{p.model}</strong>
                </p>
              )}

              {features.length > 0 && (
                <>
                  <h3 className="fw-700 mb-3 text-primary">Key Features</h3>
                  <ul className="feature-list">
                    {features.map((f) => (
                      <li key={f}>
                        <i className="fas fa-check-circle"></i> {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="btn-group">
                <button
                  onClick={() => handleNavigate("contact")}
                  className="btn btn-primary"
                >
                  Request Quote
                </button>

                {brochureUrl && (
                  <a
                    href={brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    <i className="fas fa-download mr-2"></i> Download Brochure
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Tabs / Accordion */}
          {tabs.length > 0 && (
            <div className="tabs">
              {!isMobile && (
                <>
                  <div className="tab-header">
                    {tabs.map((tab, index) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTabIndex(index)}
                        className={`tab-btn${
                          index === activeTabIndex ? " active" : ""
                        }`}
                      >
                        {tab.title}
                      </button>
                    ))}
                  </div>

                  <div className="tab-panel">
                    {activeSection ? (
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
                        activeSection.items.length > 5 ? (
                          <div className="list-grid">
                            {activeSection.items.map((item) => (
                              <div key={item} className="list-grid-item">
                                <i className="fas fa-circle-chevron-right"></i>{" "}
                                {item}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="list-column">
                            {activeSection.items.map((item) => (
                              <div key={item} className="list-grid-item">
                                <i className="fas fa-circle-chevron-right"></i>{" "}
                                {item}
                              </div>
                            ))}
                          </div>
                        )
                      ) : null
                    ) : (
                      <p>No data available.</p>
                    )}
                  </div>
                </>
              )}

{isMobile && (
  <div className="accordion">
    {tabs.map((tab) => {
      const section = p.sections.find((s) => s.id === tab.id);
      const isOpen = openAccordionId === tab.id;

      return (
        <div key={tab.id} className="accordion-item">
          <button
            className={`accordion-trigger${isOpen ? " open" : ""}`}
            onClick={() => setOpenAccordionId(isOpen ? null : tab.id)}
            aria-expanded={isOpen}
          >
            <span>{tab.title}</span>
            <i
              className={`fas fa-chevron-${
                isOpen ? "up" : "down"
              } accordion-icon`}
            />
          </button>

          <div className={`accordion-panel${isOpen ? " open" : ""}`}>
            <div className="accordion-content">
              {section && isSpecificationSection(section) ? (
                <div>
                  {section.specifications.map((spec) => (
                    <div key={spec.id} className="spec-row">
                      <span className="spec-key">{spec.label}</span>
                      <span className="spec-value">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ) : section && isProductListSection(section) ? (
                section.items.length > 5 ? (
                  <div className="list-grid">
                    {section.items.map((item) => (
                      <div key={item} className="list-grid-item">
                        <i className="fas fa-circle-chevron-right"></i>{" "}
                        {item}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="list-column">
                    {section.items.map((item) => (
                      <div key={item} className="list-grid-item">
                        <i className="fas fa-circle-chevron-right"></i>{" "}
                        {item}
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <p className="text-muted">No content available.</p>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
)}

            </div>
          )}

            {/* Related Products (category‑based) */}
            {(() => {
              const relatedProducts = allProducts
                .filter(
                  (rel) => rel.category.name === p.category.name && rel.slug !== p.slug                     
                )
                .slice(0, 3); // limit to 3

              if (relatedProducts.length === 0) return null;

              return (
                <>
                  <h2 className="section-title text-center">
                            Related <span className="text-accent">Products</span>
                  </h2>
                  <div className="product-grid">
                    {relatedProducts.map((rel) => (
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
                </>
              );
            })()}

        </div>
      </div>

      {/* ✅ IMAGE MODAL (ENTERPRISE ZOOM + PAN + MINIMAP) */}
      <AnimatePresence>
        {imageModalOpen && (
          <motion.div
            className="image-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setImageModalOpen(false)}
          >
            <motion.div
              className="image-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="image-modal-close"
                onClick={() => setImageModalOpen(false)}
                aria-label="Close modal"
              >
                <i className="fas fa-times" />
              </button>

              <div
                ref={imageContainerRef}
                className="image-zoom-container"
                style={{
                  transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                  cursor:
                    scale > 1
                      ? isDragging
                        ? "grabbing"
                        : "grab"
                      : isTouchDevice
                      ? "pointer"
                      : "zoom-in",
                }}
                onMouseDown={isTouchDevice ? undefined : handleMouseDown}
                onTouchStart={isTouchDevice ? handleTouchStart : undefined}
                onContextMenu={(e) => e.preventDefault()}
              >
                <img
                  ref={imageRef}
                  src={p.image.url}
                  alt={p.name}
                  className="image-modal-img"
                  draggable={false}
                />
              </div>

              {/* Zoom indicator */}
              {scale > 1 && (
                <div className="zoom-indicator">
                  <button
                    className="zoom-reset-btn"
                    onClick={resetZoom}
                    title="Reset zoom"
                  >
                    <i className="fas fa-undo-alt" /> {scale}x
                  </button>
                </div>
              )}

              {/* Minimap */}
              <div className="image-minimap">
                <img
                  src={minimapThumbSrc}
                  alt="Full image reference"
                  className="minimap-thumb"
                />
                <div
                  className="minimap-viewport"
                  style={{
                    left: `${viewportRect.left}%`,
                    top: `${viewportRect.top}%`,
                    width: `${viewportRect.width}%`,
                    height: `${viewportRect.height}%`,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}