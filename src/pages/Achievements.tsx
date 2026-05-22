// src/pages/Achievements.tsx
import anechoicChamber from '../assets/images/products/anechoic-chamber.png';
import mircrowaveLab from '../assets/images/products/microwave-lab.png';
import { useTheme } from "../components/ui/ThemeProvider.tsx";
import achievementsHeroLight from '../assets/images/achievements-light.png';
import achievementsHeroDark from '../assets/images/achievements-dark.png';


interface AchievementsProps {
  onNavigate: (page: string) => void;
}

const achievements = [
  'Developed 64-Channel 16-Bit RIS Control Circuit (DAC) for TCS Innovation Lab, Kolkata',
  'Established advanced Microwave Laboratories for BIT Mesra, NIT Sikkim, NIT Jamshedpur, NIT Silchar, NIT Durgapur, NIT Goa, NIT Warangal, NIT Rourkela, and Tripura University',
  'Designed and delivered Microwave Scanning Systems for SISIR Radar applications',
  'Developed Microwave Anechoic Chambers for IEM Kolkata, TCS Kolkata, NIT Jamshedpur, NIT Sikkim, and other premier institutions',
  'Manufactured custom Waveguides and Microwave Components for DRDO researchers and R&D organizations',
  'Provided complete PCB Laboratory setups for Calcutta University, BIT Mesra, VIT Warangal, and Jadavpur University',
  'Established advanced Electrical and Power Electronics laboratories for BIT Sindri, IIT Bhubaneswar, NIT Meghalaya, Jalpaiguri Government Engineering College, and other institutions',
  'Supplied Machine Laboratories and Technical Training Infrastructure for NITTTR Kolkata, NERIST Arunachal Pradesh, and multiple engineering colleges',
  'Collaborated with microwave researchers from IITs, NITs, DRDO, and leading research organizations across India',
  'Delivered customized Microwave, RF, and Antenna Testing solutions for academic, industrial, and defence applications',
];

const clients = [
  {
    name: 'Premier Institutes',
    count: '25+',
    desc: 'IITs, NITs & Universities',
  },
  {
    name: 'Defence & R&D',
    count: '10+',
    desc: 'DRDO & research projects',
  },
  {
    name: 'Industrial Installations',
    count: '50+',
    desc: 'Custom RF & microwave systems',
  },
  {
    name: 'Research Collaborations',
    count: '100+',
    desc: 'Academic & industrial partnerships',
  },
];

export default function Achievements({ onNavigate }: AchievementsProps) {
  const { isDarkMode } = useTheme();
  return (
    <div className="pt-navbar">
      {/* Hero */}
      <div className="page-hero bg-gradient-dark">
        <div
          className="page-hero-overlay"
          style={{
            backgroundImage: `url(${isDarkMode ? achievementsHeroDark : achievementsHeroLight})`,
          }}
        />
        <div className="container position-relative z-1">
          <div className="d-flex align-items-center gap-2 mb-2 text-uppercase ls-2 fw-700 fs-xs">
            <button onClick={() => onNavigate('home')} className="breadcrumb-link text-info">HOME</button>
            <span className="text-white" style={{ opacity: 0.5 }}> / </span>
            <span className="text-gold">ACHIEVEMENTS</span>
          </div>
          <h1 className="text-white fs-2xl fw-900">Our Achievements</h1>
        </div>
      </div>

      {/* Content */}
      <div className="section py-16">
        <div className="container">
          {/* Client Stats */}
          <div className="grid grid-cols-2 lg-grid-cols-4 gap-6 mb-16">
            {clients.map((c) => (
              <div key={c.name} className="client-stat-card">
                <p className="count">{c.count}</p>
                <p className="name">{c.name}</p>
                <p className="desc">{c.desc}</p>
              </div>
            ))}
          </div>
            
<h2 className="section-title text-center">
                Notable <span className="text-accent">Accomplishments</span>
              </h2>

          <div className="row mb-16">
  {/* Achievements List */}
  <div className="col-12 col-lg-7">
    <div className="d-flex flex-column gap-3">
      {achievements.map((a) => (
        <div key={a} className="achievement-item">
          <i className="fas fa-medal"></i>
          <p>{a}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Visual Cards */}
  <div className="col-12 col-lg-5">
    <div className="visual-card">
      <img
        src={anechoicChamber}
        alt="Anechoic Chamber"
        className="visual-card-img visual-card-img-tall"
      />
      <div className="visual-card-caption">
        <p className="title">Microwave 3D Anechoic Chamber</p>
        <p className="subtitle">State-of-the-art facility for antenna testing</p>
      </div>
    </div>

    <div className="visual-card">
      <img
        src={mircrowaveLab}
        alt="Lab Setup"
        className="visual-card-img visual-card-img-short"
      />
      <div className="visual-card-caption">
        <p className="title">Microwave Laboratory Setup</p>
        <p className="subtitle">Complete lab setups for NIT campuses</p>
      </div>
    </div>
  </div>
</div>

          {/* Timeline */}
          <div className="timeline">
            <h2 className="section-title mb-8">
              Our <span className="text-accent">Journey</span>
            </h2>
            <div className="timeline-line" />
            {[{year: '1997', 
                event: 'Microline India founded with a vision to advance Microwave & RF technology solutions in India',
              },
              {year: '2003',
                event: 'Started supplying Microwave Test Benches and Engineering Laboratory setups to academic institutions',
              },
              {year: '2008',
                event: 'Expanded into Defence and Research applications with custom RF and Waveguide solutions',
              },
              {year: '2014',
                event: 'Successfully delivered Microwave Labs and RF systems to multiple NIT campuses across India',
              },
              {year: '2020',
                event: 'Introduced advanced Microwave 3D Automated Anechoic Chamber and Scanner systems',
              },
              {year: '2024',
                event: 'Continuing innovation in Microwave, Antenna Measurement, RIS Control Systems, and RF Technologies',
              },
            ].map((item, i) => (
              <div
                key={item.year}
                className={`timeline-item ${i % 2 !== 0 ? 'timeline-item-reverse' : ''}`}
              >
                <div className="timeline-content">
                  <div className="timeline-card">
                    <p className="year">{item.year}</p>
                    <p className="event">{item.event}</p>
                  </div>
                </div>
                <div className="timeline-dot" />
                <div className="timeline-spacer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}