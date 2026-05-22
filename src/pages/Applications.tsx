// src/pages/Applications.tsx
import defenseSecurity from '../assets/images/applications/defense-security.png';
import spaceSatellite from '../assets/images/applications/space-satellite.png';
import academicResearch from '../assets/images/applications/academic-research.png';
import industrialMicrowave from '../assets/images/applications/industrial-microwave.png';
import telecommunications from '../assets/images/applications/telecommunications.png';
import automotiveRadar from '../assets/images/applications/automotive-radar.png';
import { useTheme } from "../components/ui/ThemeProvider.tsx";
import applicationsHeroLight from '../assets/images/applications-light.png';
import applicationsHeroDark from '../assets/images/applications-dark.png';
import { Helmet } from 'react-helmet-async';

/* ========================================
   Constants
======================================== */

const SITE_URL = "https://www.microlineindia.in";

const PAGE_URL = `${SITE_URL}/applications`;

const OG_IMAGE = `${SITE_URL}/og-image.jpg`;


interface ApplicationsProps {
  onNavigate: (page: string) => void;
}

const apps = [
  {
    title: 'Defence & Security',
    img: defenseSecurity,
    desc: 'Radar systems, electronic warfare, antenna testing for defence applications.',
    items: ['Radar cross-section measurement', 'Electronic warfare systems', 'Antenna testing for missiles', 'Communication jamming analysis'],
  },
  {
    title: 'Space & Satellite',
    img: spaceSatellite,
    desc: 'Satellite communication components, antenna characterization, and RF testing for space-grade applications.',
    items: ['Satellite antenna testing', 'RF component qualification', 'Thermal vacuum compatible assemblies', 'High-frequency waveguides'],
  },
  {
    title: 'Academic Research',
    img: academicResearch,
    desc: 'Complete microwave laboratory setups, training benches, and research instruments for universities and institutes.',
    items: ['Microwave lab setup', 'Student training benches', 'Antenna measurement systems', 'Research collaboration'],
  },
  {
    title: 'Industrial Microwave',
    img: industrialMicrowave,
    desc: 'Industrial heating, material testing, and process monitoring using microwave technology.',
    items: ['Material characterization', 'Non-destructive testing', 'Process monitoring', 'Industrial heating solutions'],
  },
  {
    title: 'Telecommunications',
    img: telecommunications,
    desc: 'RF components and test equipment for 4G/5G base stations and wireless communication infrastructure.',
    items: ['5G antenna testing', 'Base station components', 'Beamforming antenna arrays', 'mmWave testing'],
  },
  {
    title: 'Automotive Radar',
    img: automotiveRadar,
    desc: 'Compact anechoic chambers and test setups for automotive radar and ADAS system validation.',
    items: ['ADAS radar testing', '77 GHz antenna measurement', 'Compact range testing', 'OTA testing solutions'],
  },
];

export default function Applications({ onNavigate }: ApplicationsProps) {
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
        name: "RF & Microwave Applications | Microline India",
        description:
          "Explore RF & Microwave applications across Defence, Space, Academic Research, Industrial, Telecommunications, and Automotive Radar sectors. Custom solutions by Microline India.",
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
            name: "Applications",
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* ========================================
         SEO
      ======================================== */}

      <Helmet prioritizeSeoTags>
        <title>
          RF & Microwave Applications | Microline India
        </title>

        <meta
          name="description"
          content="Explore RF & Microwave applications across Defence, Space, Academic Research, Industrial, Telecommunications, and Automotive Radar. Custom solutions by Microline India."
        />

        <meta
          name="keywords"
          content="RF applications India, microwave applications, defence radar testing, space antenna measurement, 5G antenna testing, automotive radar testing, academic microwave lab"
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
          content="RF & Microwave Applications | Microline India"
        />

        <meta
          property="og:description"
          content="Discover how RF & Microwave solutions are applied in Defence, Space, Academic Research, Industrial, Telecommunications, and Automotive Radar sectors."
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
          content="RF & Microwave Applications | Microline India"
        />

        <meta
          name="twitter:description"
          content="Explore RF & Microwave applications across Defence, Space, Academic Research, Industrial, Telecommunications, and Automotive Radar sectors."
        />

        <meta
          name="twitter:image"
          content={OG_IMAGE}
        />

        {/* Structured Data */}

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
    <main className="pt-navbar">
      <div className="page-hero bg-gradient-dark">
        <div
          className="page-hero-overlay"
          style={{ backgroundImage: `url(${isDarkMode ? applicationsHeroDark : applicationsHeroLight})` }}
        />
        <div className="container position-relative z-1">
          <div className="d-flex align-items-center gap-2 mb-2 text-uppercase ls-2 fw-700 fs-xs">
            <button onClick={() => onNavigate('home')} className="breadcrumb-link text-info">HOME</button>
            <span className="text-white" style={{ opacity: 0.5 }}> / </span>
            <span className="text-gold">APPLICATIONS</span>
          </div>
          <h1 className="text-white fs-2xl fw-900">Applications</h1>
          </div>
      </div>

      <div className="section py-5">
        <div className="container">
          <div className="services-intro mb-12">
            <p className="subheading">Industry Verticals</p>
            <h2 className="section-title text-center">
                Where Our <span className="text-accent">Solutions Are Applied</span>
              </h2>
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

          <div className="cta">
            <h3>Have a Specific Application?</h3>
            <p>Our engineers can design custom solutions for your unique requirements.</p>
            <button onClick={() => onNavigate('contact')} className="btn btn-primary">
              Discuss Your Application
            </button>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}