import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

/* ========================================
   Assets
======================================== */

import testSystems from "../assets/images/microwave-test-systems-placeholder.png";
import antenna from "../assets/images/monopole-antenna-on-chip-placeholder.jpg";
import components from "../assets/images/RF-Microwave-Components-placeholder.png";
import waveguides from "../assets/images/waveguides-placeholder.png";
import labSetup from "../assets/images/products/microwave-lab.png";
import pcbLab from "../assets/images/pcb-fabrication-placeholder.png";

/* ========================================
   Types
======================================== */

interface ProductCategory {
  title: string;
  description: string;
  img: string;
  slug: string;
}

interface Client {
  name: string;
  abbr: string;
}

interface WhyChoose {
  icon: string;
  title: string;
  desc: string;
}

/* ========================================
   Constants
======================================== */

const SITE_URL = "https://www.microlineindia.in";

const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/* ========================================
   Product Categories
======================================== */

const productCategories: ProductCategory[] = [
  {
    title: "Microwave Test Systems",
    description:
      "Advanced RF and microwave measurement systems for research, development, and industrial testing.",
    img: testSystems,
    slug: "microwave-test-systems",
  },
  {
    title: "Antennas",
    description:
      "High-performance RF and microwave antennas for communication, radar, and laboratory applications.",
    img: antenna,
    slug: "antennas",
  },
  {
    title: "RF & Microwave Components",
    description:
      "Precision RF and microwave components engineered for reliability and performance.",
    img: components,
    slug: "rf-microwave-components",
  },
  {
    title: "Waveguides & Accessories",
    description:
      "Waveguide systems and accessories designed for microwave transmission applications.",
    img: waveguides,
    slug: "waveguides-accessories",
  },
  {
    title: "Laboratory Setups",
    description:
      "Complete microwave engineering laboratory setups for institutions and research centers.",
    img: labSetup,
    slug: "laboratory-setups",
  },
  {
    title: "PCB & Fabrication Facilities",
    description:
      "PCB prototyping and RF fabrication solutions for advanced engineering applications.",
    img: pcbLab,
    slug: "pcb-fabrication-facilities",
  },
];

/* ========================================
   Clients
======================================== */

const clients: Client[] = [
  { name: "DRDO", abbr: "DRDO" },
  { name: "NIT Durgapur", abbr: "NIT DURGAPUR" },
  { name: "TATA Consultancy Services", abbr: "TCS" },
  { name: "Sisir Radar", abbr: "SISIR RADAR" },
  { name: "IIT Kharagpur", abbr: "IIT KHARAGPUR" },
  { name: "IEM", abbr: "IEM" },
  { name: "NIT Goa", abbr: "NIT GOA" },
  { name: "NIT Jamshedpur", abbr: "NIT JAMSHEDPUR" },
  { name: "NIT Rourkela", abbr: "NIT ROURKELA" },
  { name: "NIT Silchar", abbr: "NIT SILCHAR" },
  { name: "NIT Warangal", abbr: "NIT WARANGAL" },
  { name: "IIT Bhubaneswar", abbr: "IIT BHUBANESWAR" },
  { name: "Tripura University", abbr: "TRIPURA UNIVERSITY" },
  { name: "Calcutta University", abbr: "CALCUTTA UNIVERSITY" },
  { name: "BIT Mesra", abbr: "BIT MESRA" },
];

/* ========================================
   Why Choose
======================================== */

const whyChoose: WhyChoose[] = [
  {
    icon: "fa-microchip",
    title: "Advanced RF Technology",
    desc: "State-of-the-art RF & Microwave engineering solutions designed for research, academia, and industrial applications.",
  },
  {
    icon: "fa-clipboard-check",
    title: "Quality & Reliability",
    desc: "Precision-engineered systems with rigorous quality assurance and testing standards.",
  },
  {
    icon: "fa-users",
    title: "Experienced Engineering Team",
    desc: "Highly experienced professionals with deep expertise in microwave and RF system design.",
  },
  {
    icon: "fa-globe",
    title: "Pan-India Support",
    desc: "End-to-end technical consultation, deployment, and support services across India.",
  },
];

/* ========================================
   Animated Counter
======================================== */

function AnimatedCounter({
  targetValue,
  suffix = "",
  prefix = "",
}: {
  targetValue: string | number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);

  const [hasAnimated, setHasAnimated] = useState(false);

  const counterRef = useRef<HTMLDivElement>(null);

  const numericValue = useMemo(() => {
    if (typeof targetValue === "number") {
      return targetValue;
    }

    const match = targetValue.toString().match(/\d+/);

    return match ? parseInt(match[0], 10) : 0;
  }, [targetValue]);

  const displaySuffix = useMemo(() => {
    if (typeof targetValue === "string") {
      const match = targetValue.match(/[^0-9]+$/);

      return match ? match[0] : suffix;
    }

    return suffix;
  }, [targetValue, suffix]);

  useEffect(() => {
    if (!counterRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated) return;

        setHasAnimated(true);

        let startTimestamp: number | null = null;

        const duration = 1800;

        const step = (timestamp: number) => {
          if (!startTimestamp) {
            startTimestamp = timestamp;
          }

          const progress = Math.min(
            (timestamp - startTimestamp) / duration,
            1,
          );

          setCount(Math.floor(progress * numericValue));

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };

        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(counterRef.current);

    return () => observer.disconnect();
  }, [numericValue, hasAnimated]);

  return (
    <div
      ref={counterRef}
      className="counter-value"
      aria-label={`${numericValue}${displaySuffix}`}
    >
      {prefix}
      {count}
      {displaySuffix}
    </div>
  );
}

/* ========================================
   Home Component
======================================== */

export default function Home() {
  const statsRef = useRef<HTMLDivElement>(null);

  /* ========================================
     Dynamic Stats Height
  ======================================== */

  useEffect(() => {
    const updateStatsHeight = () => {
      if (!statsRef.current) return;

      const height = statsRef.current.getBoundingClientRect().height;

      document.documentElement.style.setProperty(
        "--stats-height",
        `${height}px`,
      );
    };

    updateStatsHeight();

    const resizeObserver = new ResizeObserver(updateStatsHeight);

    if (statsRef.current) {
      resizeObserver.observe(statsRef.current);
    }

    window.addEventListener("resize", updateStatsHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateStatsHeight);
    };
  }, []);

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
        foundingDate: "1997",
        areaServed: "India",
        description:
          "Manufacturer of RF & Microwave systems, antenna measurement systems, waveguide components, RF absorbers, and engineering laboratory solutions.",
        knowsAbout: [
          "RF Systems",
          "Microwave Engineering",
          "Waveguide Components",
          "Microwave Test Systems",
          "Antenna Measurement Systems",
          "RF Components",
        ],
        sameAs: [
          "https://www.linkedin.com/company/microlineindia",
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
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: "RF & Microwave Systems Manufacturer in India | Microline India",
        description:
          "Advanced RF & Microwave engineering solutions, antenna systems, waveguide components, microwave labs, and engineering technologies since 1997.",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${SITE_URL}/#organization`,
        },
      },

      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/#breadcrumb`,
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
            name: "Products",
            item: `${SITE_URL}/products`,
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
        <html lang="en" />

        <title>
          RF & Microwave Systems Manufacturer in India | Microline India
        </title>

        <meta
          name="description"
          content="Microline India is a leading Indian manufacturer of RF & Microwave systems, antenna measurement systems, waveguide components, microwave laboratory setups, RF absorbers, and engineering solutions since 1997."
        />

        <meta
          name="keywords"
          content="RF Microwave Systems India, Antenna Measurement Systems, Microwave Components, Waveguide Components, RF Engineering Solutions, Microwave Laboratory Setup"
        />

        <meta name="robots" content="index, follow" />

        <meta name="author" content="Microline India" />

        <meta name="theme-color" content="#0b1220" />

        <link rel="canonical" href={SITE_URL} />

        {/* Open Graph */}

        <meta property="og:type" content="website" />

        <meta property="og:site_name" content="Microline India" />

        <meta
          property="og:title"
          content="RF & Microwave Systems Manufacturer in India | Microline India"
        />

        <meta
          property="og:description"
          content="Advanced RF & Microwave engineering solutions, antenna systems, waveguide components, microwave labs, and engineering technologies since 1997."
        />

        <meta property="og:url" content={SITE_URL} />

        <meta property="og:image" content={OG_IMAGE} />

        <meta property="og:image:width" content="1024" />

        <meta property="og:image:height" content="1024" />

        <meta
          property="og:image:alt"
          content="Microline India RF & Microwave Engineering Solutions"
        />

        {/* Twitter */}

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="RF & Microwave Systems Manufacturer in India | Microline India"
        />

        <meta
          name="twitter:description"
          content="Advanced RF & Microwave systems, antenna measurement systems, waveguide components, microwave laboratories, and RF engineering solutions."
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

      <main>
        {/* ========================================
           HERO SECTION
        ======================================== */}

        <section
          className="hero"
          aria-label="Hero Section"
        >
          <div className="container">
            <div className="hero-text">
              <p className="hero-tag">
                RF & Microwave Engineering Excellence Since 1997
              </p>

              <h1>
                Advanced RF &
                <br />
                Microwave Engineering
                <br />
                <span className="highlight">
                  Solutions for India
                </span>
              </h1>

              <p className="hero-description">
                Microline India designs and manufactures advanced RF &
                Microwave systems, antenna measurement solutions,
                waveguide components, laboratory setups, and engineering
                technologies for research institutions, industries,
                and academia.
              </p>

              <div className="hero-actions">
                <Link
                  to="/products"
                  className="btn btn-primary"
                  aria-label="Explore RF and Microwave products"
                >
                  Explore Products
                </Link>

                <Link
                  to="/contact"
                  className="btn btn-outline bg-glass"
                  aria-label="Contact Microline India"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* ========================================
             STATS
          ======================================== */}

          <div
            ref={statsRef}
            className="stats-bar bg-marble"
          >
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>

                <div className="stat-text">
                  <strong>
                    <AnimatedCounter targetValue="27+" />
                  </strong>

                  <span>Years of Engineering Excellence</span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-users"></i>
                </div>

                <div className="stat-text">
                  <strong>
                    <AnimatedCounter targetValue="500+" />
                  </strong>

                  <span>
                    Institutional & Industrial Clients
                  </span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-cogs fa-spin"></i>
                </div>

                <div className="stat-text">
                  <strong>
                    <AnimatedCounter
                      targetValue="100"
                      suffix="%"
                    />
                  </strong>

                  <span>
                    In-House Engineering Development
                  </span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-file-alt"></i>
                </div>

                <div className="stat-text">
                  <strong>
                    <AnimatedCounter targetValue="1000+" />
                  </strong>

                  <span>
                    Customized Engineering Solutions
                  </span>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <i className="fas fa-globe"></i>
                </div>

                <div className="stat-text">
                  <strong>Pan India</strong>

                  <span>
                    Technical Support & Deployment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
           PRODUCT CATEGORIES
        ======================================== */}

        <section
          id="products"
          className="section bg-light"
        >
          <div className="container">
            <div className="section-title">
              <p className="section-subtitle">
                RF & Microwave Engineering Solutions
              </p>

              <h2>
                Our
                <span className="text-accent">
                  {" "}
                  Product Categories
                </span>
              </h2>

              <p className="section-description">
                Comprehensive RF & Microwave technologies designed
                for research laboratories, engineering institutions,
                industrial testing, and advanced communication
                systems.
              </p>
            </div>

            <div className="product-grid">
              {productCategories.map((cat, index) => (
                <Link
                  key={cat.slug}
                  to={`/products/${cat.slug}`}
                  className="card product-card"
                  aria-label={cat.title}
                  style={{
                    animationDelay: `${index * 0.08}s`,
                  }}
                >
                  <div className="card-image-wrapper">
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="card-img"
                      width="600"
                      height="400"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="card-body">
                    <h3>{cat.title}</h3>

                    <p>{cat.description}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center pt-4">
              <Link
                to="/products"
                className="btn btn-primary"
                aria-label="View all products"
              >
                View All Products

                <i className="fas fa-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================
           CLIENTS
        ======================================== */}

        <section
          id="clients"
          className="section"
        >
          <div className="container">
            <div className="section-title">
              <p className="section-subtitle">
                Trusted Across India
              </p>

              <h2>
                Our Esteemed
                <span className="text-accent">
                  {" "}
                  Clients & Institutions
                </span>
              </h2>

              <p className="section-description">
                Serving premier research organizations,
                universities, engineering institutes, and
                industrial clients across India.
              </p>
            </div>

            <div className="client-logo-slider">
              <div className="client-logo-track">
                {[...clients, ...clients].map(
                  (client, index) => (
                    <div
                      className="client-logo-item"
                      key={`${client.abbr}-${index}`}
                    >
                      <img
                        src={
                          new URL(
                            `/src/assets/images/clients/${client.abbr}.png`,
                            import.meta.url,
                          ).href
                        }
                        alt={`${client.name} logo`}
                        width="180"
                        height="90"
                        loading="lazy"
                        decoding="async"
                      />

                      <div className="client-logo-name">
                        {client.name}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
           WHY CHOOSE
        ======================================== */}

        <section
          id="why-choose-us"
          className="section bg-light"
        >
          <div className="container">
            <div className="section-title">
              <p className="section-subtitle">
                Engineering Excellence
              </p>

              <h2>
                Why Choose
                <span className="text-accent">
                  {" "}
                  Microline India?
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-4">
              {whyChoose.map((item) => (
                <article
                  key={item.title}
                  className="feature-card"
                >
                  <div className="feature-icon-wrapper">
                    <i className={`fas ${item.icon}`}></i>
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}