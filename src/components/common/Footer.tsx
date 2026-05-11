// src/components/common/Footer.tsx
// src/components/common/Footer.tsx
import type { FC } from "react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-brand">
              <h3>Microline India</h3>
              <p>
                Advanced Microwave & RF Engineering
                Solutions Since 1997.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <button onClick={() => onNavigate("about")}>
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("products")}>
                  Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("services")}>
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("applications")}>
                  Applications
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="footer-contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>Kolkata, West Bengal, India</span>
            </div>
            <div className="footer-contact-item">
              <i className="fas fa-envelope"></i>
              <span>sales@microlineindia.com</span>
            </div>
            <div className="footer-contact-item">
              <i className="fas fa-phone-alt"></i>
              <span>+91 33 1234 5678</span>
            </div>
            <div className="footer-contact-item">
              <i className="fas fa-clock"></i>
              <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Microline India. All rights reserved.</p>
          <p>Innovating Microwave & RF Technology Since 1997</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;