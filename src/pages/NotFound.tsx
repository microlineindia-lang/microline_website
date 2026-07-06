import { Helmet } from "react-helmet-async";

interface NotFoundProps {
  onNavigate: (page: string) => void;
}

const SITE_URL = "https://www.microlineindia.in";

export default function NotFound({ onNavigate }: NotFoundProps) {
  return (
    <>
      {/* ========================================
          SEO & METADATA
      ======================================== */}
      <Helmet>
        <title>404 - Signal Lost | Microline India</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={`${SITE_URL}/404`} />
      </Helmet>

      {/* ========================================
          ARTISTIC 404 HERO SECTION
      ======================================== */}
      <main className="error-page section" style={{ minHeight: "85vh", display: "flex", alignItems: "center" }}>
        <div className="container">
          <div className="grid grid-cols-2 items-center gap-8">
            
            {/* Left Column: Content */}
            <div className="error-text-content">
              <p className="hero-tag" style={{ color: "var(--text-accent, #0056b3)", fontWeight: "600" }}>
                Error Code: 404
              </p>
              
              <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: "1.2", marginBottom: "1.5rem" }}>
                Signal Frequency <br />
                <span className="highlight">Out of Range</span>
              </h1>
              
              <p className="hero-description" style={{ marginBottom: "2rem", fontSize: "1.1rem" }}>
                The engineering solution or technical documentation you are trying to reach has moved off our network grid. Let's recalibrate your connection path.
              </p>

              {/* Dynamic Navigation Options */}
              <div className="hero-actions" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => onNavigate("home")}
                  className="btn btn-primary"
                  aria-label="Return to Main Station"
                >
                  <i className="fas fa-home ms-2" style={{ marginRight: "8px" }}></i>
                  Return Home
                </button>
                
                <button
                  onClick={() => onNavigate("products")}
                  className="btn btn-outline bg-glass"
                  aria-label="Explore RF Products"
                >
                  Browse Products
                </button>
              </div>
            </div>

            {/* Right Column: Abstract Artistic RF Visual */}
            <div className="error-graphic-wrapper" style={{ display: "flex", justifyContent: "center", position: "relative" }}>
              <div className="rf-artistic-container" style={{ width: "100%", maxWidth: "450px", aspectRatio: "1" }}>
                <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
                  {/* Subtle Background Mesh Grid */}
                  <path d="M0 100H400M0 200H400M0 300H400M100 0V400M200 0V400M300 0V400" stroke="rgba(0, 86, 179, 0.05)" strokeWidth="1"/>
                  
                  {/* Pulsing Signal Concentric Circles */}
                  <circle cx="200" cy="200" r="160" stroke="rgba(0, 86, 179, 0.1)" strokeWidth="2" strokeDasharray="5 5" />
                  <circle cx="200" cy="200" r="110" stroke="rgba(0, 86, 179, 0.15)" strokeWidth="1.5" />
                  <circle cx="200" cy="200" r="60" stroke="rgba(240, 84, 84, 0.2)" strokeWidth="2" />

                  {/* Attenuated / Broken Microwave Waveform path */}
                  <path 
                    d="M 30,200 Q 75,120 120,200 T 210,200 T 280,240 T 320,200 T 370,200" 
                    stroke="url(#rfGradient)" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    style={{ animation: "dash 4s linear infinite" }}
                  />

                  {/* Central Node representing loss of link */}
                  <circle cx="210" cy="200" r="6" fill="#f05454" />
                  <circle cx="210" cy="200" r="15" stroke="#f05454" strokeWidth="1" opacity="0.5" />
                  
                  {/* Glowing 404 center indicator */}
                  <text x="50%" y="54%" textAnchor="middle" fill="rgba(0, 86, 179, 0.08)" fontSize="110" fontWeight="900" fontFamily="sans-serif">
                    404
                  </text>

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="rfGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0056b3" />
                      <stop offset="50%" stopColor="#f05454" />
                      <stop offset="100%" stopColor="#0056b3" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}