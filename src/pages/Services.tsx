// src/pages/Services.tsx
import { useTheme } from "../components/ui/ThemeProvider.tsx";
import servicesHeroLight from '../assets/images/services-light.png';
import servicesHeroDark from '../assets/images/services-dark.png';
import { Helmet } from "react-helmet-async";

/* ========================================
   Constants
======================================== */

const SITE_URL = "https://www.microlineindia.in";

const PAGE_URL = `${SITE_URL}/services`;

const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

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
  const { isDarkMode } = useTheme();

    /* ========================================
     Structured Data
  ======================================== */

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Microline India",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/favicon-96x96.png`,
        },
        description:
          "Leading Indian manufacturer of RF & Microwave systems, antenna measurement systems, microwave laboratory setups, and waveguide components.",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Microline India",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
      {
        "@type": "CollectionPage",
        "@id": `${PAGE_URL}/#collectionpage`,
        url: PAGE_URL,
        name: "RF & Microwave Engineering Services | Microline India",
        description:
          "Comprehensive RF & Microwave services including microstrip antenna fabrication, planar circuits, laboratory setup, consultation, and project support by Microline India.",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        breadcrumb: {
          "@id": `${PAGE_URL}/#breadcrumb`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PAGE_URL}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: PAGE_URL,
          },
        ],
      },
      ...services.map((service) => ({
        "@type": "Service",
        name: service.title,
        description: service.desc,
        provider: {
          "@id": `${SITE_URL}/#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "India",
        },
        ...(service.highlights.length > 0 && {
          offers: {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.title,
            },
          },
        }),
      })),
    ],
  };

  const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Microline India",
  "alternateName": "Microline",
  "url": SITE_URL,
};

  return (
    <>
      {/* ========================================
         SEO
      ======================================== */}

      <Helmet prioritizeSeoTags>
        <title>
          RF & Microwave Engineering Services | Microline India
        </title>

        <meta
          name="description"
          content="Explore comprehensive RF & Microwave engineering services by Microline India: microstrip antenna fabrication, planar circuits, laboratory setup, consultation, and project support."
        />

        <meta
          name="keywords"
          content="RF services India, microwave services, microstrip antenna fabrication, microwave lab setup, microwave PCB fabrication, RF consultation India"
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <link
          rel="canonical"
          href={PAGE_URL}
        />

        {/* Open Graph */}

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:site_name"
          content="Microline India"
        />

        <meta
          property="og:title"
          content="RF & Microwave Engineering Services | Microline India"
        />

        <meta
          property="og:description"
          content="Comprehensive RF & Microwave services including microstrip antenna fabrication, planar circuits, laboratory setup, consultation, and project support."
        />

        <meta
          property="og:url"
          content={PAGE_URL}
        />

        <meta
          property="og:image"
          content={OG_IMAGE}
        />

        <meta
          property="og:image:width"
          content="1200"
        />

        <meta
          property="og:image:height"
          content="630"
        />

        {/* Twitter */}

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="RF & Microwave Engineering Services | Microline India"
        />

        <meta
          name="twitter:description"
          content="Explore advanced RF & Microwave services including microstrip antenna fabrication, planar circuits, laboratory setup, and technical consultation."
        />

        <meta
          name="twitter:image"
          content={OG_IMAGE}
        />

        {/* Structured Data */}

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(websiteStructuredData)}
        </script>
      </Helmet>

    <main className="pt-navbar">
      <div className="page-hero bg-gradient-dark">
        <div
          className="page-hero-overlay"
          style={{ backgroundImage: `url(${isDarkMode ? servicesHeroDark : servicesHeroLight})` }}
        />
        <div className="container position-relative z-1">
          <div className="d-flex align-items-center gap-2 mb-2 text-uppercase ls-2 fw-700 fs-xs">
            <button onClick={() => onNavigate('home')} className="breadcrumb-link text-info">HOME</button>
            <span className="text-white" style={{ opacity: 0.5 }}> / </span>
            <span className="text-gold">SERVICES</span>
          </div>
          <h1 className="text-white fs-2xl fw-900">Our Services</h1>
          </div>
        </div>

      <div className="section py-5">
        <div className="container">
          <div className="services-intro">
            <p className="subheading">What We Do</p>
              <div className="text-center">
                <h2 className="section-title">
                  Comprehensive <span className="text-accent">RF & Microwave Services</span>
                </h2>
                <p>From design and fabrication to lab setup and technical consultation...</p>
              </div>            
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
                        <i className="fas fa-hand-point-right"></i> {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cta">
            <h3>Need a Custom Solution?</h3>
            <p>Talk to our experts today and let us help you achieve your goals.</p>
            <button onClick={() => onNavigate('contact')} className="btn btn-primary">Contact Us</button>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}