import { useState, useEffect } from 'react';
import { useTheme } from '../components/ui/ThemeProvider';
import { Helmet } from 'react-helmet-async';
import { datoClient } from '../lib/datocms';
import { BRANDS_QUERY } from '../lib/queries';
import brandsHeroLight from '../assets/images/distributorship-light.png';
import brandsHeroDark from '../assets/images/distributorship-dark.png';

/* ========================================
   Constants
======================================== */
const SITE_URL = 'https://www.microlineindia.in';
const PAGE_URL = `${SITE_URL}/brands`;
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface Brand {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;   // Rich text field
  logo: {
    url: string;
    alt?: string;
    title?: string;
  };
  logoDark?: {
    url: string;
    alt?: string;
    title?: string;
  };
}

interface BrandsProps {
  onNavigate: (page: string, data?: any) => void;
}

// Helper: strip HTML tags for safe plain-text rendering
const stripHtml = (html: string) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export default function Brands({ onNavigate }: BrandsProps) {
  const { isDarkMode } = useTheme();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await datoClient.request(BRANDS_QUERY);
        setBrands(data.allBrands);
      } catch (err) {
        console.error('Failed to load brands:', err);
        setError('Unable to load brands. Please refresh the page or try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  /* ========================================
     Structured Data
  ======================================== */
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Microline India',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/favicon-96x96.png`,
        },
        description:
          'Microline India – distributor of RF, Microwave and Neuromorphic AI solutions.',
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Microline India',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'CollectionPage',
        '@id': `${PAGE_URL}/#collectionpage`,
        url: PAGE_URL,
        name: 'Distributed Brands | Microline India',
        description:
          'Explore the portfolio of brands distributed by Microline India – SynSense, iniVation, and more.',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${PAGE_URL}/#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${PAGE_URL}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Brands', item: PAGE_URL },
        ],
      },
      ...brands.map((brand) => ({
        '@type': 'Product',
        name: brand.name,
        description: brand.shortDescription
          ? stripHtml(brand.shortDescription)
          : `Distributor of ${brand.name} in India.`,
        image: brand.logo.url,
        brand: {
          '@type': 'Brand',
          name: brand.name,
        },
        url: `${SITE_URL}/brands/${brand.slug}`,
      })),
    ],
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="pt-navbar">
        <div className="loading-overlay" role="status" aria-live="polite">
          <div className="loading-container">
            <div className="loading-ring" aria-hidden="true" />
            <div className="loading-content">
              <h3 className="loading-title">Loading brands</h3>
              <p className="loading-message">Please wait while we fetch our distributed brands</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="pt-navbar">
        <div className="error-container" role="alert">
          <div className="error-card">
            <div className="error-icon" aria-hidden="true">
              <i className="fas fa-exclamation-triangle" />
            </div>
            <h3 className="error-title">Unable to load brands</h3>
            <p className="error-message">{error}</p>
            <button
              className="btn btn-primary error-retry-btn"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-sync-alt me-2" aria-hidden="true" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ========================================
          SEO
      ======================================== */}
      <Helmet prioritizeSeoTags>
        <title>Distributed Brands | Microline India</title>
        <meta
          name="description"
          content="Microline India distributes SynSense, iniVation, and other leading RF, microwave, and neuromorphic AI brands."
        />
        <meta name="keywords" content="Distributed Brands, SynSense, iniVation, RF Distributor India, Neuromorphic AI" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={PAGE_URL} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Microline India" />
        <meta property="og:title" content="Distributed Brands | Microline India" />
        <meta
          property="og:description"
          content="Explore our portfolio of distributed brands – SynSense, iniVation, and more – for RF, microwave, and neuromorphic AI solutions."
        />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content={OG_IMAGE} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Distributed Brands | Microline India" />
        <meta name="twitter:image" content={OG_IMAGE} />

        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <main className="pt-navbar">
        {/* ─── HERO ─── */}
        <div className="page-hero bg-gradient-dark">
          <div
            className="page-hero-overlay"
            style={{
              backgroundImage: `url(${isDarkMode ? brandsHeroDark : brandsHeroLight})`,
            }}
          />
          <div className="container position-relative z-1">
            <div className="d-flex align-items-center gap-2 mb-2 text-uppercase ls-2 fw-700 fs-xs">
              <button onClick={() => onNavigate('home')} className="breadcrumb-link text-info">
                HOME
              </button>
              <span className="text-white" style={{ opacity: 0.5 }}> / </span>
              <span className="text-gold">AUTHORIZED BRANDS</span>
            </div>
            <h1 className="text-white fs-2xl fw-900">Distributed Brands</h1>
          </div>
        </div>

        {/* ─── BRAND GRID ─── */}
        <section className="section py-5">
          <div className="container">
            <div className="services-intro">
              <p className="subheading">Our Distribution Network</p>
              <div className="text-center">
                <h2 className="section-title">
                  Trusted Link to <span className="text-accent">Global Technology Leaders</span>
                </h2>
                <p>
                  We partner with industry-leading manufacturers to deliver genuine, high-reliability RF, microwave,
                  and neuromorphic AI solutions directly to your project.
                </p>
              </div>
            </div>

            {brands.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fas fa-building fs-2 mb-3 d-block" />
                <p>No brands available at the moment.</p>
              </div>
            ) : (
              <div className="brands-grid">
                {brands.map((brand) => {
                  // Choose logo based on theme; fallback to light logo
                  const logoUrl = isDarkMode && brand.logoDark ? brand.logoDark.url : brand.logo.url;
                  const logoAlt = isDarkMode && brand.logoDark ? brand.logoDark.alt : brand.logo.alt;
                  // Strip HTML for description
                  const description = brand.shortDescription ? stripHtml(brand.shortDescription) : '';

                  return (
                    <div
                      key={brand.id}
                      className="brand-card"
                      onClick={() => onNavigate(`brands/${brand.slug}`, brand)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="brand-card-inner">
                        {/* Logo + Name row */}
                        <div className="brand-header">
                          <div className="brand-logo-wrapper">
                            <img
                              src={logoUrl}
                              alt={logoAlt || brand.name}
                              loading="lazy"
                            />
                          </div>
                          <h3 className="brand-name">{brand.name}</h3>
                        </div>

                        {/* Description */}
                        {description && (
                          <p className="brand-desc">{description}</p>
                        )}

                        {/* Learn More CTA */}
                        <span className="brand-cta">
                          Learn More <i className="fas fa-arrow-right" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}