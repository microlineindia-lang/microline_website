import { useEffect, useState } from "react";
import { useTheme } from "../ui/ThemeProvider";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navLinks = [
  { label: "Home", page: "home" },
  { label: "About Us", page: "about" },
  { label: "Products", page: "products" },
  { label: "Services", page: "services" },
  { label: "Applications", page: "applications" },
  { label: "Achievements", page: "achievements" },
  { label: "Resources", page: "resources" },
  { label: "Contact Us", page: "contact" },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);


  useEffect(() => {
  const handleResize = () => {
    // auto‑close if switching to desktop
    if (window.innerWidth > 1024) {
      setMenuOpen(false);
      document.body.style.overflow = "unset";
    }
  };

  if (menuOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }

  window.addEventListener("resize", handleResize);

  return () => {
    document.body.style.overflow = "unset";
    window.removeEventListener("resize", handleResize);
  };
}, [menuOpen]);


  return (
    <nav className={`navbar bg-granite ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('home')}
        >
          <img src="/src/assets/images/microline-logo.png" alt="Microline India" />
        </motion.div>

        {/* Desktop Navigation - Hidden on tablet/medium screens */}
        <div className="nav-right">
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.page}>
                <button
                  onClick={() => onNavigate(link.page)}
                  className={currentPage === link.page ? "active" : ""}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Desktop Request Quote button */}
          <div className="desktop-cta">
            <button className="btn btn-primary" onClick={() => onNavigate("contact")}>
              Request Quote
            </button>
          </div>

          {/* Desktop Theme Toggle */}
          <div className="desktop-theme-toggle">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet toggle button - Now visible on medium screens */}
        <button
          className="mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile/Tablet Menu Panel - Includes theme toggle */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className={`mobile-menu bg-granite ${menuOpen ? "open" : ""}`}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
          >
            <ul>
              {navLinks.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => {
                      onNavigate(link.page);
                      setMenuOpen(false);
                    }}
                    className={currentPage === link.page ? "active-mobile" : ""}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
            
            {/* Mobile Theme Toggle */}
            <div className="mobile-theme-toggle">
              <button 
                className="btn btn-outline mobile-theme-btn" 
                onClick={() => {
                  toggleTheme();
                  // Don't close menu when toggling theme
                }}
              >
                {isDarkMode ? (
                  <>
                    <Sun size={16} />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={16} />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
            
            <button
              className="btn btn-primary mobile-cta"
              onClick={() => {
                onNavigate("contact");
                setMenuOpen(false);
              }}
            >
              Request Quote
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}