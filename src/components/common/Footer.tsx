// src/components/common/Footer.tsx
import { Link } from 'react-router-dom';

const Footer = () => {
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
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/products">Products</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/applications">Applications</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="footer-contact-item">
              <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
              <address className="footer-address">
                27 Harimati Sarani, Garia, Kolkata - 700084, West Bengal, India
              </address>
            </div>
            <div className="footer-contact-item">
              <i className="fas fa-envelope" aria-hidden="true"></i>
              <a href="mailto:info@microlineindia.in">info@microlineindia.in</a>
            </div>
            <div className="footer-contact-item">
              <i className="fas fa-phone-alt" aria-hidden="true"></i>
              <a href="tel:+919874790272">+91 98747 90272</a>
            </div>
            <div className="footer-contact-item">
              <i className="fas fa-clock" aria-hidden="true"></i>
              <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Microline India. All rights reserved.</p>
          <p>Innovating Microwave & RF Technology</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;