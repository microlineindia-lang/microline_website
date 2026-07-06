// src/components/common/Navbar.tsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../ui/ThemeProvider";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoLight from '../../assets/images/microline-logo-light.png';
import logoDark from '../../assets/images/microline-logo-dark.png';
import { datoClient } from '../../lib/datocms';
import { BRANDS_QUERY } from '../../lib/queries';

// --- Types ---
interface Brand {
  id: string;
  name: string;
  slug: string;

  logo: {
    url: string;
    alt?: string;
    title?: string;
  };

  logoDark?: {
    url: string;
    alt?: string;
    title?: string;
  };
}

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, data?: any) => void;
}

interface NavItem {
  label: string;
  page: string;        // used for onNavigate and active state
  path: string;        // real URL for href
  dropdown?: boolean;
}

const navItems: NavItem[] = [
  { label: "Home", page: "home", path: "/" },
  { label: "About Us", page: "about", path: "/about" },
  { label: "Products", page: "products", path: "/products" },
  { label: "Services", page: "services", path: "/services" },
  { label: "Applications", page: "applications", path: "/applications" },
  { label: "Achievements", page: "achievements", path: "/achievements" },
  { label: "Resources", page: "resources", path: "/resources" },
  { label: "Authorized Brands", page: "brands", path: "/brands", dropdown: true },
  { label: "Contact Us", page: "contact", path: "/contact" },
];

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  // Use number for browser timeout ID (compatible with window.setTimeout)
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = useMediaQuery('(max-width: 1199px)');

  // Fetch brands from DatoCMS
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await datoClient.request(BRANDS_QUERY);
        setBrands(data.allBrands);
      } catch (error) {
        console.error('Failed to load brands:', error);
      }
    };
    fetchBrands();
  }, []);

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body overflow for mobile menu
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [menuOpen]);

  // Auto-close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setMenuOpen(false);
        setMobileSubmenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Desktop hover handlers ---
  const handleMouseEnter = () => {
    if (isMobile) return;
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setDropdownOpen(true);
  };
  const handleMouseLeave = () => {
    if (isMobile) return;
    const timeout = setTimeout(() => setDropdownOpen(false), 200);
    setHoverTimeout(timeout);
  };
  const handleDropdownMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setDropdownOpen(true);
  };
  const handleDropdownMouseLeave = () => {
    const timeout = setTimeout(() => setDropdownOpen(false), 200);
    setHoverTimeout(timeout);
  };

  // --- Mobile submenu toggle ---
  const toggleMobileSubmenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileSubmenuOpen(!mobileSubmenuOpen);
  };

  // --- Close menu after navigation ---
  const closeMenu = () => {
    setMenuOpen(false);
    setMobileSubmenuOpen(false);
    setDropdownOpen(false);
  };

  // --- Navigation handler (for main links) using parent's onNavigate ---
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, page: string, path: string) => {
    e.preventDefault();
    onNavigate(page);
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Brand click handler (uses React Router navigate) ---
  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    navigate(`/brands/${slug}`);
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine if a link is active (based on currentPage or location)
  const isActive = (page: string) => currentPage === page || location.pathname === `/${page}`;

  return (
    <nav className={`navbar bg-granite ${scrolled ? 'scrolled' : ''}`} aria-label="Main navigation">
      <div className="container">
        {/* Logo as a real link */}
        <a href="/" className="logo" onClick={(e) => { e.preventDefault(); onNavigate('home'); closeMenu(); }}>
          <img
            src={isDarkMode ? logoDark : logoLight}
            alt="Microline India – RF, Microwave & Neuromorphic AI Solutions"
          />
        </a>

        {/* Desktop Navigation */}
        <div className="nav-right">
          <ul className="nav-links">
            {navItems.map((item) => {
              // For the dropdown item (Authorized Brands)
              if (item.dropdown) {
                const active = isActive(item.page) || location.pathname.startsWith('/brands');
                return (
                  <li
                    key={item.page}
                    className="dropdown-wrapper"
                    ref={dropdownRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <a
                      href={item.path}
                      className={active ? "active" : ""}
                      aria-haspopup="true"
                      aria-expanded={dropdownOpen}
                      onClick={(e) => {
                        // On mobile, toggle submenu; on desktop, navigate to /brands
                        if (isMobile) {
                          toggleMobileSubmenu(e);
                        } else {
                          handleNavClick(e, item.page, item.path);
                        }
                      }}
                    >
                      {item.label} <ChevronDown size={14} />
                    </a>
                    {/* Desktop dropdown (only on hover, not mobile) */}
                    {!isMobile && dropdownOpen && brands.length > 0 && (
                      <div
                        className="dropdown-menu"
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                      >
                        {brands.map((brand) => {
                          const logoUrl =
                            isDarkMode && brand.logoDark ? brand.logoDark.url : brand.logo.url;

                          const logoAlt =
                            isDarkMode && brand.logoDark ? brand.logoDark.alt : brand.logo.alt;

                          return (
                            <a
                              key={brand.id}
                              href={`/brands/${brand.slug}`}
                              className="dropdown-item"
                              onClick={(e) => handleBrandClick(e, brand.slug)}
                            >
                              <img
                                src={logoUrl}
                                alt={logoAlt || brand.name}
                                className="brand-logo"
                                loading="lazy"
                              />
                              <span>{brand.name}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              }

              // Regular nav link
              const active = isActive(item.page);
              return (
                <li key={item.page}>
                  <a
                    href={item.path}
                    className={active ? "active" : ""}
                    aria-current={active ? "page" : undefined}
                    onClick={(e) => handleNavClick(e, item.page, item.path)}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Desktop theme toggle (button, not navigation) */}
          <div className="desktop-theme-toggle">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
          >
            <ul>
              {navItems.map((item) => {
                if (item.dropdown) {
                  const active = isActive(item.page) || location.pathname.startsWith('/brands');
                  return (
                    <li key={item.page} className="mobile-dropdown-wrapper">
                      <button
                        onClick={toggleMobileSubmenu}
                        className={active ? "active-mobile" : ""}
                        aria-expanded={mobileSubmenuOpen}
                        aria-haspopup="true"
                      >
                        {item.label} <ChevronDown size={14} />
                      </button>
                      {mobileSubmenuOpen && brands.length > 0 && (
                        <ul className="mobile-submenu">
                          {brands.map((brand) => {
                            const logoUrl = isDarkMode && brand.logoDark ? brand.logoDark.url : brand.logo.url;
                            const logoAlt = isDarkMode && brand.logoDark ? brand.logoDark.alt : brand.logo.alt;
                            return (
                              <a
                                key={brand.id}
                                href={`/brands/${brand.slug}`}
                                className="dropdown-item"
                                onClick={(e) => handleBrandClick(e, brand.slug)}
                              >
                                <img
                                  src={logoUrl}
                                  alt={logoAlt || brand.name}
                                  className="brand-logo"
                                  loading="lazy"
                                />
                                <span>{brand.name}</span>
                              </a>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }
                const active = isActive(item.page);
                return (
                  <li key={item.page}>
                    <a
                      href={item.path}
                      className={active ? "active-mobile" : ""}
                      aria-current={active ? "page" : undefined}
                      onClick={(e) => handleNavClick(e, item.page, item.path)}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            {/* Mobile theme toggle */}
            <div className="mobile-theme-toggle">
              <button className="btn btn-outline mobile-theme-btn" onClick={toggleTheme}>
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
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}