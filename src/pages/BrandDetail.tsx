import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ui/ThemeProvider';
import { Helmet } from 'react-helmet-async';
import { datoClient } from '../lib/datocms';
import { BRAND_DETAIL_QUERY } from '../lib/queries';
import AOS from 'aos';
import 'aos/dist/aos.css';

/* ========================================
   Constants
======================================== */
const SITE_URL = 'https://www.microlineindia.in';

interface ProductImage {
  responsiveImage: {
    src: string;
    srcSet: string;
    alt?: string;
    width: number;
    height: number;
  };
}

interface Product {
  productId: number;
  productName: string;
  shortDescription?: string;
  productOverview?: string;
  officialUrl?: string;
  resource?: string;
  productImages: ProductImage[];
}

interface BrandDetailData {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  order?: number;
  logo: { url: string; alt?: string; title?: string };
  logoDark?: { url: string; alt?: string; title?: string };
  seo?: Array<{ attributes: any; content: string; tag: string }>;
  products: Product[];
}

export default function BrandDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [brand, setBrand] = useState<BrandDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // ─── Initialize AOS ───
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 120,
      easing: 'ease-in-out',
    });
    // Refresh AOS after content loads
    if (!loading) AOS.refresh();
  }, [loading]);

  // ─── Fetch brand data ───
  useEffect(() => {
    if (!slug) return;
    const fetchBrand = async () => {
      try {
        const data = await datoClient.request(BRAND_DETAIL_QUERY, { slug });
        if (data.brand) {
          setBrand(data.brand);
        } else {
          setError('Brand not found');
        }
      } catch (err) {
        console.error('Failed to load brand details:', err);
        setError('Unable to load brand details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBrand();
  }, [slug]);

  // ─── SEO helpers ───
  const getMetaTag = (tagName: string) => {
    if (!brand?.seo) return null;
    const tag = brand.seo.find((t) => t.tag === tagName);
    return tag?.content || null;
  };
  const getMetaAttribute = (attr: string, value: string) => {
    if (!brand?.seo) return null;
    const tag = brand.seo.find((t) => t.attributes?.[attr] === value);
    return tag?.content || null;
  };

  const pageTitle = getMetaTag('title') || brand?.name || 'Brand Details';
  const metaDescription =
    getMetaAttribute('name', 'description') || brand?.shortDescription || '';
  const ogImage =
    getMetaAttribute('property', 'og:image') || brand?.logo?.url || '';
  const pageUrl = `${SITE_URL}/brands/${slug}`;

  // ─── Structured Data ───
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Microline India',
        url: SITE_URL,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Microline India',
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}/#webpage`,
        url: pageUrl,
        name: pageTitle,
        description: metaDescription,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${pageUrl}/#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Brands',
            item: `${SITE_URL}/brands`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: brand?.name || '',
            item: pageUrl,
          },
        ],
      },
      ...(brand
        ? [
            {
              '@type': 'Brand',
              name: brand.name,
              description: brand.shortDescription || brand.description || '',
              logo: brand.logo.url,
              url: pageUrl,
            },
            ...(brand.products?.map((p) => ({
              '@type': 'Product',
              name: p.productName,
              description: p.shortDescription || '',
              image: p.productImages?.[0]?.responsiveImage?.src || '',
              brand: { '@type': 'Brand', name: brand.name },
              url: p.officialUrl || `${pageUrl}#product-${p.productId}`,
            })) || []),
          ]
        : []),
    ],
  };

  // ─── Loading ───
  if (loading) {
    return (
      <div className="pt-navbar">
        <div className="loading-overlay" role="status" aria-live="polite">
          <div className="loading-container">
            <div className="loading-ring" aria-hidden="true" />
            <div className="loading-content">
              <h3 className="loading-title">Loading brand details</h3>
              <p className="loading-message">
                Please wait while we fetch the information
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error ───
  if (error || !brand) {
    return (
      <div className="pt-navbar">
        <div className="error-container" role="alert">
          <div className="error-card">
            <div className="error-icon" aria-hidden="true">
              <i className="fas fa-exclamation-triangle" />
            </div>
            <h3 className="error-title">Unable to load brand details</h3>
            <p className="error-message">
              {error || 'Brand not found'}
            </p>
            <button
              className="btn btn-primary error-retry-btn"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-sync-alt me-2" aria-hidden="true" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const logoUrl =
    isDarkMode && brand.logoDark ? brand.logoDark.url : brand.logo.url;
  const logoAlt =
    isDarkMode && brand.logoDark ? brand.logoDark.alt : brand.logo.alt;

  const scrollToProduct = (productId: number) => {
    const el = document.getElementById(`product-${productId}`);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Helmet prioritizeSeoTags>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Microline India" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="pt-navbar">
        {/* ─── HERO ─── */}
        <div className="page-hero bg-gradient-dark brand-hero">
          <div
            className="page-hero-overlay brand-hero-overlay"
            style={{
              backgroundImage: `url(${logoUrl})`,
            }}
          />
          <div className="container position-relative z-1">
            <div className="d-flex align-items-center gap-2 mb-2 text-uppercase ls-2 fw-700 fs-xs">
              <button
                onClick={() => navigate('/')}
                className="breadcrumb-link text-info"
              >
                HOME
              </button>
              <span className="text-white" style={{ opacity: 0.5 }}> / </span>
              <button
                onClick={() => navigate('/brands')}
                className="breadcrumb-link text-info"
              >
                BRANDS
              </button>
              <span className="text-white" style={{ opacity: 0.5 }}> / </span>
              <span className="text-gold">{brand.name}</span>
            </div>
            <h1 className="text-white fs-2xl fw-900">{brand.name}</h1>
          </div>
        </div>

        {/* ─── BRAND INFO ─── */}
        <section className="section py-5">
          <div className="container">
            <div className="row align-items-center mb-5">
              <div className="col-md-3 text-center">
                <div className="brand-logo-wrapper">
                  <img
                    src={logoUrl}
                    alt={logoAlt || brand.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              </div>
              <div className="col-md-9">
                <h2 className="fw-800 text-primary mb-3">{brand.name}</h2>
                {brand.description && (
                  <div
                    className="text-secondary"
                    style={{ fontSize: '1.05rem', lineHeight: '1.7' }}
                    dangerouslySetInnerHTML={{ __html: brand.description }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── PRODUCTS ─── */}
        {brand.products && brand.products.length > 0 && (
          <section className="section py-5 bg-light" id="products-section">
            <div className="container">
              <div className="text-center mb-4">
                <h2 className="section-title">
                  {brand.name} <span className="text-accent">Products</span>
                </h2>
                <p>
                  Explore the innovative products we distribute from{' '}
                  {brand.name}.
                </p>
              </div>
            </div>

            {/* ─── NAVIGATION RIBBON (sticky, container‑width) ─── */}
            <div className="product-nav-ribbon bg-elevated">
              <div className="container">
                <div className="ribbon-scroll">
                  {brand.products.map((p) => (
                    <button
                      key={p.productId}
                      className="ribbon-link"
                      onClick={() => scrollToProduct(p.productId)}
                    >
                      {p.productName}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── PRODUCT CARDS WITH AOS ─── */}
            <div className="container">
              <div className="full-width-products">
                {brand.products.map((product, index) => (
                  <div
                    key={product.productId}
                    id={`product-${product.productId}`}
                    className="product-card-full"
                    data-aos="fade-up"
                    data-aos-delay={index * 150} // stagger effect
                    data-aos-duration="700"
                  >
                    {/* Gallery + Actions – floated right */}
                    <div className="product-float-right">
                      {product.productImages && product.productImages.length > 0 && (
                        <ProductGallery
                          images={product.productImages}
                          productName={product.productName}
                          setLightboxImage={setLightboxImage}
                        />
                      )}
                      <div className="product-actions-under-gallery">
                        {product.officialUrl && (
                          <a
                            href={product.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm"
                          >
                            <i className="fas fa-external-link-alt me-2" />
                            Official Page
                          </a>
                        )}
                        {product.resource && (
                          <a
                            href={product.resource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm"
                          >
                            <i className="fas fa-file-pdf me-2" />
                            Brochure
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Details – flows around the float */}
                    <div className="product-details-flow">
                      <h3 className="product-title">{product.productName}</h3>
                      {product.shortDescription && (
                        <div
                          className="product-desc"
                          dangerouslySetInnerHTML={{
                            __html: product.shortDescription,
                          }}
                        />
                      )}
                      {product.productOverview && (
                        <div
                          className="product-overview-left"
                          dangerouslySetInnerHTML={{
                            __html: product.productOverview,
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── DISCLAIMER ─── */}
          <div className="disclaimer-wrapper mt-4 pt-3 border-top border-light">
            <p className="disclaimer-text text-muted">
              <i className="fas fa-info-circle me-2" />
              For the most accurate, up‑to‑date product information, specifications, and availability, please refer to the official brand website.
            </p>
          </div>

            {/* ─── BACK TO BRANDS ─── */}
            <div className="container mt-5">
              <div className="text-center">
                <button
                  onClick={() => navigate('/brands')}
                  className="btn btn-primary btn-lg about-cta"
                >
                  <i className="fas fa-arrow-left me-2" /> Back to All Brands
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ─── LIGHTBOX ─── */}
        {lightboxImage && (
          <div
            className="image-modal-overlay"
            onClick={() => setLightboxImage(null)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="image-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="image-modal-close"
                onClick={() => setLightboxImage(null)}
                aria-label="Close image"
              >
                <i className="fas fa-times" />
              </button>
              <img src={lightboxImage} alt="Product image" />
            </div>
          </div>
        )}
      </main>
    </>
  );
}

/* ========================================
   Product Gallery Component
======================================== */
function ProductGallery({
  images,
  productName,
  setLightboxImage,
}: {
  images: ProductImage[];
  productName: string;
  setLightboxImage: (src: string | null) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImg = images[selectedIndex] || images[0];

  return (
    <div className="product-gallery-ecommerce">
      <div className="gallery-main">
        <button
          className="gallery-main-image"
          onClick={() => setLightboxImage(mainImg.responsiveImage.src)}
          aria-label="View larger image"
        >
          <img
            src={mainImg.responsiveImage.src}
            alt={mainImg.responsiveImage.alt || productName}
            loading="lazy"
          />
        </button>
      </div>
      {images.length > 1 && (
        <div className="gallery-thumb-strip">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`gallery-thumb ${idx === selectedIndex ? 'active' : ''}`}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`View ${productName} image ${idx + 1}`}
            >
              <img
                src={img.responsiveImage.src}
                alt={img.responsiveImage.alt || `${productName} thumbnail`}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}