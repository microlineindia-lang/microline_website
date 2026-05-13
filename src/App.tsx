// src/App.tsx
import { Suspense, lazy } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import { ScrollToTop } from "./components/ui/ScrollToTop";

// Lazy imports
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Services = lazy(() => import("./pages/Services"));
const Applications = lazy(() => import("./pages/Applications"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Resources = lazy(() => import("./pages/Resources"));
const Contact = lazy(() => import("./pages/Contact"));

const EnterprisePageLoader = () => (
  <div className="suspense-loader-wrapper">
    <div className="loading-container">
      <div className="loading-ring"></div>
      <div className="loading-content">
        <h3 className="loading-title">Loading page</h3>
        <p className="loading-message">Please wait while we prepare your content</p>
      </div>
    </div>
  </div>
);

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigateTo = (page: string, data?: any) => {
    if (data && page === "product-detail") {
      // ✅ use the slug field from the CMS product
      navigate(`/product/${data.slug}`, { state: { product: data } });
    } else {
      navigate(`/${page === "home" ? "" : page}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentPage = location.pathname.substring(1) || "home";

  return (
    <>
      <ScrollToTop />
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
        >
          <Suspense fallback={<EnterprisePageLoader />}>
            <Routes location={location}>
              <Route path="/" element={<Home onNavigate={navigateTo} />} />
              <Route path="/home" element={<Home onNavigate={navigateTo} />} />
              <Route path="/about" element={<About onNavigate={navigateTo} />} />
              <Route path="/products" element={<Products onNavigate={navigateTo} />} />
              <Route path="/product/:id" element={<ProductDetail onNavigate={navigateTo} />} />
              <Route path="/services" element={<Services onNavigate={navigateTo} />} />
              <Route path="/applications" element={<Applications onNavigate={navigateTo} />} />
              <Route path="/achievements" element={<Achievements onNavigate={navigateTo} />} />
              <Route path="/resources" element={<Resources onNavigate={navigateTo} />} />
              <Route path="/contact" element={<Contact onNavigate={navigateTo} />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer onNavigate={navigateTo} />
    </>
  );
}