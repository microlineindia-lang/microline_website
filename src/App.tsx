// src/App.tsx
import { Suspense, lazy, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { productData } from "./pages/Products";

/* ========================================
   Lazy Loaded Pages
======================================== */

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Services = lazy(() => import("./pages/Services"));
const Applications = lazy(() => import("./pages/Applications"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Resources = lazy(() => import("./pages/Resources"));
const Contact = lazy(() => import("./pages/Contact"));

/* ========================================
   App Component
======================================== */



export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  /* ========================================
     Navigation Handler
  ======================================== */

  const navigateTo = (
    page: string,
    data?: any
  ) => {
    // Product detail route
    if (data && page === "product-detail") {
      navigate(`/product/${data.id}`, {
        state: { product: data },
      });
    } else {
      // Normal routes
      navigate(
        `/${page === "home" ? "" : page}`
      );
    }

    // Smooth scroll top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ========================================
     Current Page
  ======================================== */

  const currentPage =
    location.pathname.substring(1) || "home";


    
  /* ========================================
     Render
  ======================================== */

  return (
    <>
      {/* Scroll Reset */}
      <ScrollToTop />

      {/* Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
      />

      {/* Animated Page Transitions */}
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -20,
          }}
          transition={{
            duration: 0.35,
          }}
        >
          {/* Lazy Loading */}
          <Suspense
            fallback={
              <div className="page-loader">
                <div className="loader-spinner"></div>
              </div>
            }
          >
            <Routes location={location}>
              {/* All your routes remain the same */}
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

      {/* Footer - Appears on all pages */}
      <Footer onNavigate={navigateTo} />
    </>
  );
}