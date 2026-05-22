// src/pages/Achievements.tsx
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import anechoicChamber from "../assets/images/products/anechoic-chamber.png";
import mircrowaveLab from "../assets/images/products/microwave-lab.png";
import { useTheme } from "../components/ui/ThemeProvider";
import achievementsHeroLight from "../assets/images/achievements-light.png";
import achievementsHeroDark from "../assets/images/achievements-dark.png";

/* ========================================
   Constants
======================================== */

const SITE_URL = "[microlineindia.in](https://www.microlineindia.in)";

const PAGE_URL = `${SITE_URL}/achievements`;

const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/* ========================================
   Achievements Data
======================================== */

const achievements = [
  "Developed 64-Channel 16-Bit RIS Control Circuit (DAC) for TCS Innovation Lab, Kolkata",
  "Established advanced Microwave Laboratories for BIT Mesra, NIT Sikkim, NIT Jamshedpur, NIT Silchar, NIT Durgapur, NIT Goa, NIT Warangal, NIT Rourkela, and Tripura University",
  "Designed and delivered Microwave Scanning Systems for SISIR Radar applications",
  "Developed Microwave Anechoic Chambers for IEM Kolkata, TCS Kolkata, NIT Jamshedpur, NIT Sikkim, and other premier institutions",
  "Manufactured custom Waveguides and Microwave Components for DRDO researchers and R&D organizations",
  "Provided complete PCB Laboratory setups for Calcutta University, BIT Mesra, VIT Warangal, and Jadavpur University",
  "Established advanced Electrical and Power Electronics laboratories for BIT Sindri, IIT Bhubaneswar, NIT Meghalaya, Jalpaiguri Government Engineering College, and other institutions",
  "Supplied Machine Laboratories and Technical Training Infrastructure for NITTTR Kolkata, NERIST Arunachal Pradesh, and multiple engineering colleges",
  "Collaborated with microwave researchers from IITs, NITs, DRDO, and leading research organizations across India",
  "Delivered customized Microwave, RF, and Antenna Testing solutions for academic, industrial, and defence applications",
];

const clients = [
  {
    name: "Premier Institutes",
    count: "25+",
    desc: "IITs, NITs & Universities",
  },
  {
    name: "Defence & R&D",
    count: "10+",
    desc: "DRDO & research projects",
  },
  {
    name: "Industrial Installations",
    count: "50+",
    desc: "Custom RF & microwave systems",
  },
  {
    name: "Research Collaborations",
    count: "100+",
    desc: "Academic & industrial partnerships",
  },
];

const timeline = [
  {
    year: "1997",
    event:
      "Microline India founded with a vision to advance Microwave & RF technology solutions in India",
  },
  {
    year: "2003",
    event:
      "Started supplying Microwave Test Benches and Engineering Laboratory setups to academic institutions",
  },
  {
    year: "2008",
    event:
      "Expanded into Defence and Research applications with custom RF and Waveguide solutions",
  },
  {
    year: "2014",
    event:
      "Successfully delivered Microwave Labs and RF systems to multiple NIT campuses across India",
  },
  {
    year: "2020",
    event:
      "Introduced advanced Microwave 3D Automated Anechoic Chamber and Scanner systems",
  },
  {
    year: "2024",
    event:
      "Continuing innovation in Microwave, Antenna Measurement, RIS Control Systems, and RF Technologies",
  },
];

/* ========================================
   Achievements Component
======================================== */

export default function Achievements() {
  const { isDarkMode } = useTheme();

  /* ========================================
     Structured Data
  ======================================== */

  const structuredData = {
    "@context": "[schema.org](https://schema.org)",
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
        foundingDate: "1997",
        knowsAbout: [
          "RF systems",
          "Microwave systems",
          "Antenna measurement systems",
          "Microwave laboratory setup",
          "Waveguide components",
          "Anechoic chambers",
          "Power electronics laboratories",
        ],
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
        "@type": "AboutPage",
        "@id": `${PAGE_URL}/#aboutpage`,
        url: PAGE_URL,
        name: "Achievements | Microline India",
        description:
          "Explore Microline India's achievements in RF & Microwave systems, anechoic chambers, microwave laboratories, waveguide components, RIS control systems, and research collaborations across India.",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${SITE_URL}/#organization`,
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
            name: "Achievements",
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
          Achievements in RF & Microwave Solutions | Microline India
        </title>

        <meta
          name="description"
          content="Explore Microline India's achievements in RF & Microwave systems, anechoic chambers, microwave laboratories, waveguide components, RIS control systems, and research collaborations across India."
        />

        <meta
          name="keywords"
          content="Microline India achievements, RF microwave achievements India, microwave laboratory setup India, anechoic chamber India, waveguide components India, antenna testing solutions, RIS control system, DRDO microwave components"
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
          content="Achievements in RF & Microwave Solutions | Microline India"
        />

        <meta
          property="og:description"
          content="Discover Microline India's achievements in RF & Microwave systems, anechoic chambers, microwave laboratories, RIS control systems, and research collaborations."
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
          content="Achievements in RF & Microwave Solutions | Microline India"
        />

        <meta
          name="twitter:description"
          content="Explore Microline India's achievements in RF & Microwave systems, anechoic chambers, microwave laboratories, waveguide components, and antenna testing solutions."
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
        {/* ========================================
           HERO
        ======================================== */}

        <section className="page-hero bg-gradient-dark">
          <div
            className="page-hero-overlay"
            style={{
              backgroundImage: `url(${
                isDarkMode
                  ? achievementsHeroDark
                  : achievementsHeroLight
              })`,
            }}
          />

          <div className="container position-relative z-1">
            <nav
              aria-label="Breadcrumb"
              className="d-flex align-items-center gap-2 mb-2 text-uppercase ls-2 fw-700 fs-xs"
            >
              <Link
                to="/"
                className="breadcrumb-link text-info"
              >
                HOME
              </Link>

              <span
                className="text-white"
                style={{ opacity: 0.5 }}
              >
                /
              </span>

              <span className="text-gold">
                ACHIEVEMENTS
              </span>
            </nav>

            <h1 className="text-white fs-2xl fw-900">
              Our Achievements
            </h1>
          </div>
        </section>

        {/* ========================================
           ACHIEVEMENTS CONTENT
        ======================================== */}

        <section className="section py-16">
          <div className="container">
            {/* ========================================
               CLIENT STATS
            ======================================== */}

            <div className="grid grid-cols-2 lg-grid-cols-4 gap-6 mb-16">
              {clients.map((client) => (
                <article
                  key={client.name}
                  className="client-stat-card"
                >
                  <p className="count">
                    {client.count}
                  </p>

                  <h2 className="name">
                    {client.name}
                  </h2>

                  <p className="desc">
                    {client.desc}
                  </p>
                </article>
              ))}
            </div>

            <h2 className="section-title text-center">
              Notable{" "}
              <span className="text-accent">
                Accomplishments
              </span>
            </h2>

            <div className="row mb-16">
              {/* ========================================
                 ACHIEVEMENTS LIST
              ======================================== */}

              <div className="col-12 col-lg-7">
                <div className="d-flex flex-column gap-3">
                  {achievements.map((achievement) => (
                    <article
                      key={achievement}
                      className="achievement-item"
                    >
                      <i
                        className="fas fa-medal"
                        aria-hidden="true"
                      />

                      <p>
                        {achievement}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              {/* ========================================
                 VISUAL CARDS
              ======================================== */}

              <div className="col-12 col-lg-5">
                <article className="visual-card">
                  <img
                    src={anechoicChamber}
                    alt="Microwave 3D anechoic chamber for antenna testing"
                    className="visual-card-img visual-card-img-tall"
                    loading="lazy"
                  />

                  <div className="visual-card-caption">
                    <h3 className="title">
                      Microwave 3D Anechoic Chamber
                    </h3>

                    <p className="subtitle">
                      State-of-the-art facility for antenna testing
                    </p>
                  </div>
                </article>

                <article className="visual-card">
                  <img
                    src={mircrowaveLab}
                    alt="Microwave laboratory setup for academic institutions"
                    className="visual-card-img visual-card-img-short"
                    loading="lazy"
                  />

                  <div className="visual-card-caption">
                    <h3 className="title">
                      Microwave Laboratory Setup
                    </h3>

                    <p className="subtitle">
                      Complete lab setups for NIT campuses
                    </p>
                  </div>
                </article>
              </div>
            </div>

            {/* ========================================
               TIMELINE
            ======================================== */}

            <section className="timeline">
              <h2 className="section-title mb-8">
                Our{" "}
                <span className="text-accent">
                  Journey
                </span>
              </h2>

              <div className="timeline-line" />

              {timeline.map((item, index) => (
                <article
                  key={item.year}
                  className={`timeline-item ${
                    index % 2 !== 0
                      ? "timeline-item-reverse"
                      : ""
                  }`}
                >
                  <div className="timeline-content">
                    <div className="timeline-card">
                      <h3 className="year">
                        {item.year}
                      </h3>

                      <p className="event">
                        {item.event}
                      </p>
                    </div>
                  </div>

                  <div className="timeline-dot" />

                  <div className="timeline-spacer" />
                </article>
              ))}
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
