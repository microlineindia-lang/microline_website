import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Helmet } from "react-helmet-async";

interface HomeProps {
  onNavigate: (page: string) => void;
}

/* ========================================
   Product Categories
======================================== */

const productCategories = [
  {
    title: "Microwave Test Systems",
    img: "https://images.pexels.com/photos/3912981/pexels-photo-3912981.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    title: "Antennas",
    img: "https://images.pexels.com/photos/1167355/pexels-photo-1167355.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    title: "RF & Microwave Components",
    img: "https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    title: "Waveguides & Accessories",
    img: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    title: "Laboratory Setups",
    img: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    title: "PCB & Fabrication Facilities",
    img: "https://images.pexels.com/photos/57007/pexels-photo-57007.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

/* ========================================
   Clients
======================================== */

const clients = [
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

const whyChoose = [
  {
    icon: "fa-microchip",
    title: "Advanced Technology",
    desc: "Cutting-edge microwave and RF solutions.",
  },
  {
    icon: "fa-check-circle",
    title: "Quality Assurance",
    desc: "Finest quality products with rigorous testing.",
  },
  {
    icon: "fa-users",
    title: "Experienced Team",
    desc: "Skilled professionals with deep domain expertise.",
  },
  {
    icon: "fa-globe",
    title: "End-to-End Support",
    desc: "From conception to technology development.",
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
  const [hasAnimated, setHasAnimated] =
    useState(false);

  const counterRef =
    useRef<HTMLDivElement>(null);

  const getNumericValue = () => {
    if (typeof targetValue === "number") {
      return targetValue;
    }

    const match =
      targetValue.toString().match(/\d+/);

    return match ? parseInt(match[0]) : 0;
  };

  const getSuffixText = () => {
    if (typeof targetValue === "string") {
      const match =
        targetValue.match(/[^0-9]+$/);

      return match ? match[0] : suffix;
    }

    return suffix;
  };

  const numericValue = getNumericValue();
  const displaySuffix = getSuffixText();

  useEffect(() => {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (
              entry.isIntersecting &&
              !hasAnimated
            ) {

              setHasAnimated(true);

              let start = 0;

              const end = numericValue;

              const duration = 2000;

              const increment =
                end / (duration / 16);

              const timer = setInterval(() => {

                start += increment;

                if (start >= end) {
                  setCount(end);
                  clearInterval(timer);

                } else {
                  setCount(Math.floor(start));
                }

              }, 16);

              return () => clearInterval(timer);
            }
          });
        },
        { threshold: 0.3 }
      );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();

  }, [numericValue, hasAnimated]);

  return (
    <div
      ref={counterRef}
      className="counter-value"
    >
      {prefix}
      {Math.floor(count)}
      {displaySuffix}
    </div>
  );
}

/* ========================================
   Home Page
======================================== */

export default function Home({
  onNavigate,
}: HomeProps) {

  /* ========================================
   Stats Bar Height Calculation
======================================== */
const statsRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const updateStatsHeight = () => {
  if (statsRef.current) {
    const height = statsRef.current.getBoundingClientRect().height;
    document.documentElement.style.setProperty("--stats-height", `${height}px`);
  }
};

  updateStatsHeight();

  const resizeObserver = new ResizeObserver(updateStatsHeight);
  if (statsRef.current) resizeObserver.observe(statsRef.current);

  window.addEventListener("resize", updateStatsHeight);

  return () => {
    window.removeEventListener("resize", updateStatsHeight);
    resizeObserver.disconnect();
  };
}, []);

  return (
    <>

      {/* ========================================
         SEO
      ======================================== */}

      <Helmet>
        <title>
          Microline India | Microwave & RF Solutions
        </title>

        <meta
          name="description"
          content="Microline India delivers advanced microwave and RF engineering solutions, laboratory setups, antennas, waveguides and fabrication systems since 1997."
        />

        <meta
          name="keywords"
          content="Microwave Systems, RF Solutions, Waveguides, Antennas, PCB Lab, Microwave India"
        />

        <meta
          property="og:title"
          content="Microline India"
        />

        <meta
          property="og:description"
          content="Innovating Microwave & RF Technology Since 1997."
        />
      </Helmet>

      {/* ========================================
         HERO SECTION
      ======================================== */}

      <section className="hero">

        <div className="container">

          {/* Left Content */}
          <div className="hero-text">

            <p className="hero-tag">
              Welcome to Microline India
            </p>

            <h1>
              Innovating Microwave
              <br />
              & RF Technology
              <br />

              <span className="highlight">
                Since 1997
              </span>
            </h1>

            <p>
              Delivering advanced microwave
              and RF solutions with
              innovation, precision and
              reliability.
            </p>

            <div className="hero-actions">

              <button
                onClick={() =>
                  onNavigate("products")
                }
                className="btn btn-primary"
              >
                Explore Products
              </button>

              <button
                onClick={() =>
                  onNavigate("contact")
                }
                className="btn btn-outline bg-glass"
              >
                Contact Us
              </button>

            </div>
          </div>


        </div>

        

        {/* ========================================
           STATS BAR
        ======================================== */}

        <div ref={statsRef} className="stats-bar bg-marble">

    <div className="stats-grid">

      <div className="stat-item">
        <div className="stat-icon"><i className="fas fa-calendar-alt"></i></div>
        <div className="stat-text">
          <strong><AnimatedCounter targetValue="27+" /></strong>
          <span>Years of Excellence</span>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon"><i className="fas fa-users"></i></div>
        <div className="stat-text">
          <strong><AnimatedCounter targetValue="500+" /></strong>
          <span>Satisfied Customers</span>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon"><i className="fas fa-cogs"></i></div>
        <div className="stat-text">
          <strong><AnimatedCounter targetValue="100" suffix="%" /></strong>
          <span>In-house Development</span>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon"><i className="fas fa-file-alt"></i></div>
        <div className="stat-text">
          <strong><AnimatedCounter targetValue="1000+" /></strong>
          <span>Custom Solutions</span>
        </div>
      </div>

      <div className="stat-item">
        <div className="stat-icon"><i className="fas fa-globe"></i></div>
        <div className="stat-text">
          <strong>Pan India</strong>
          <span>Support & Services</span>
        </div>
      </div>

    </div>

</div>
      </section>

      {/* ========================================
         PRODUCT CATEGORIES
      ======================================== */}

      <section className="section bg-light">

        <div className="container">

          <div className="section-title">

            <p className="section-subtitle">
              What We Offer
            </p>

            <h2>
              Our
              <span className="text-accent">
                {" "}
                Product Categories
              </span>
            </h2>

          </div>

          <div className="grid grid-cols-3">

            {productCategories.map(
              (cat, index) => (

                <div
                  key={cat.title}
                  className="card product-card"
                  onClick={() =>
                    onNavigate("products")
                  }
                  style={{
                    animationDelay:
                      `${index * 0.1}s`,
                  }}
                >

                  <div className="card-image-wrapper">

                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="card-img"
                    />

                  </div>

                  <div className="card-body">

                    <h3>{cat.title}</h3>

                    <button className="btn btn-outline">
                      View Products
                    </button>

                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ========================================
         CLIENTS
      ======================================== */}

      <section className="section">

        <div className="container">

          <div className="section-title">

            <h2>
              Our Esteemed
              <span className="text-accent">
                {" "}
                Clients & Partners
              </span>
            </h2>

          </div>

          <div className="client-logo-slider">
  <div className="client-logo-track">
    {clients.concat(clients).map((client, index) => (
    <div className="client-logo-item" key={index}>
      <img
        src={new URL(`/src/assets/images/clients/${client.abbr}.png`, import.meta.url).href}
        alt={client.name}
      />
      <div className="client-logo-name">{client.name}</div>
    </div>
  ))}
    {/* duplicate the list for continuous scroll */}
    {clients.concat(clients).map((client, index) => (
    <div className="client-logo-item" key={index}>
      <img
        src={new URL(`/src/assets/images/clients/${client.abbr}.png`, import.meta.url).href}
        alt={client.name}
      />
      <div className="client-logo-name">{client.name}</div>
    </div>
  ))}
  </div>
</div>

        </div>
      </section>

      {/* ========================================
         WHY CHOOSE
      ======================================== */}

      <section className="section bg-light">

        <div className="container">

          <div className="section-title">

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

              <div
                key={item.title}
                className="feature-card"
              >

                <div className="feature-icon-wrapper">

                  <i
                    className={`fas ${item.icon}`}
                  ></i>

                </div>

                <h4>{item.title}</h4>

                <p>{item.desc}</p>

              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}