// src/pages/Products.tsx

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import { Link } from "react-router-dom";

import { Helmet } from "react-helmet-async";

import { useTheme } from "../components/ui/ThemeProvider";

import productsHeroLight from "../assets/images/products-light.png";
import productsHeroDark from "../assets/images/products-dark.png";

import {
  useDatoProducts,
  type CMSProduct,
} from "../hooks/useDatoProducts";


/* ========================================
   Constants
======================================== */

const SITE_URL = "https://www.microlineindia.in";

const PAGE_URL = `${SITE_URL}/products`;

const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/* ========================================
   Helpers
======================================== */

function getCategoriesFromProducts(
  products: CMSProduct[]
) {
  const categories = products.map(
    (p) => p.category.name
  );

  return ["All", ...Array.from(new Set(categories))];
}

export default function Products() {
  const { isDarkMode } = useTheme();

  const {
    products: allProducts,
    loading,
    error,
  } = useDatoProducts();

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [isMobile, setIsMobile] =
    useState(false);

  /* ========================================
     Responsive Detection
  ======================================== */

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener(
      "resize",
      checkMobile
    );

    return () =>
      window.removeEventListener(
        "resize",
        checkMobile
      );
  }, []);

  /* ========================================
     Scroll To Top
  ======================================== */

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ========================================
     Memoized Categories
  ======================================== */

  const categories = useMemo(() => {
    return getCategoriesFromProducts(
      allProducts
    );
  }, [allProducts]);

  /* ========================================
     Memoized Filtering
  ======================================== */

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") {
      return allProducts;
    }

    return allProducts.filter(
      (p) =>
        p.category.name === activeCategory
    );
  }, [allProducts, activeCategory]);

  /* ========================================
     Structured Data
  ======================================== */

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${PAGE_URL}/#collectionpage`,
          url: PAGE_URL,
          name: "RF & Microwave Products | Microline India",
          description:
            "Explore RF & Microwave systems, antenna measurement systems, waveguide components, microwave laboratory setups, RF absorbers, and engineering solutions by Microline India.",
        },

        {
          "@type": "BreadcrumbList",
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
              item: PAGE_URL,
            },
          ],
        },

        ...allProducts
          .slice(0, 20)
          .map((product) => ({
            "@type": "Product",
            name: product.name,
            description:
              product.shortDescription,
            image: product.image?.url,
            category:
              product.category.name,
            brand: {
              "@type": "Brand",
              name: "Microline India",
            },
            url: `${SITE_URL}/products/${product.slug}`,
          })),
      ],
    }),
    [allProducts]
  );

  /* ========================================
     Handlers
  ======================================== */

  const handleCategoryChange =
    useCallback((category: string) => {
      setActiveCategory(category);
    }, []);

  /* ========================================
     Loading State
  ======================================== */

  if (loading) {
    return (
      <div
        className="loading-overlay"
        role="status"
        aria-live="polite"
      >
        <div className="loading-container">
          <div
            className="loading-ring"
            aria-hidden="true"
          />

          <div className="loading-content">
            <h3 className="loading-title">
              Loading products
            </h3>

            <p className="loading-message">
              Please wait while we prepare
              your content
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ========================================
     Error State
  ======================================== */

  if (error) {
    return (
      <div className="pt-navbar">
        <div className="error-container">
          <div
            className="error-card"
            role="alert"
          >
            <div
              className="error-icon"
              aria-hidden="true"
            >
              <i className="fas fa-exclamation-triangle" />
            </div>

            <h2 className="error-title">
              Unable to load products
            </h2>

            <p className="error-message">
              Failed to load products.
              Please refresh the page or try
              again later.
            </p>

            <button
              className="btn btn-primary error-retry-btn"
              onClick={() =>
                window.location.reload()
              }
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ========================================
         SEO
      ======================================== */}

      <Helmet prioritizeSeoTags>
        <title>
          RF & Microwave Products |
          Microline India
        </title>

        <meta
          name="description"
          content="Explore advanced RF & Microwave engineering products, antenna systems, microwave laboratories, waveguide components, and RF technologies."
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <link
          rel="canonical"
          href={PAGE_URL}
        />

        {/* Open Graph */}

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:title"
          content="RF & Microwave Products | Microline India"
        />

        <meta
          property="og:url"
          content={PAGE_URL}
        />

        <meta
          property="og:image"
          content={OG_IMAGE}
        />

        {/* Twitter */}

        <meta
          name="twitter:card"
          content="summary_large_image"
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

      <main className="pt-navbar">
        {/* ========================================
           Hero
        ======================================== */}

        <section className="page-hero bg-gradient-dark">
          <div
            className="page-hero-overlay"
            style={{
              backgroundImage: `url(${
                isDarkMode
                  ? productsHeroDark
                  : productsHeroLight
              })`,
            }}
          />

          <div className="container position-relative z-1">
            <div className="d-flex align-items-center gap-2 mb-2 text-uppercase ls-2 fw-700 fs-xs">

              <Link to="/" className="breadcrumb-link text-info">
                HOME
              </Link>


              <span
                className="text-white"
                style={{ opacity: 0.5 }}
              >
                /
              </span>

              <span className="text-gold">
                PRODUCTS
              </span>
            </div>

            <h1 className="text-white fs-2xl fw-900">
              RF & Microwave Products
            </h1>
          </div>
        </section>

        {/* ========================================
           Products
        ======================================== */}

        <section className="section py-5">
          <div className="container">
            {/* Filters */}

            <div className="category-filters">
              {isMobile ? (
                <div className="mobile-category-select-wrapper">
                  <select
                    value={activeCategory}
                    onChange={(e) =>
                      handleCategoryChange(
                        e.target.value
                      )
                    }
                    className="mobile-category-select"
                    aria-label="Filter products by category"
                  >
                    {categories.map((cat) => (
                      <option
                        key={cat}
                        value={cat}
                      >
                        {cat}
                      </option>
                    ))}
                  </select>

                  <i className="fas fa-chevron-down select-arrow" />
                </div>
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      handleCategoryChange(cat)
                    }
                    className={`filter-btn ${
                      cat === activeCategory
                        ? "active"
                        : ""
                    }`}
                  >
                    {cat}
                  </button>
                ))
              )}
            </div>

            {/* Empty State */}

            {filteredProducts.length === 0 && (
              <div className="empty-products">
                <i className="fas fa-box-open" />

                <h3>No Products Found</h3>

                <p>
                  No products available in
                  this category.
                </p>
              </div>
            )}

            {/* Product Grid */}

            <div className="product-grid">
              {filteredProducts.map(
                (product) => (
                  <article
                    key={product.slug}
                    className="product-card"
                  >
                    <div className="product-card-img">
                      <img
                        src={
                          product.image?.url
                        }
                        alt={product.name}
                        loading="lazy"
                      />

                      <span className="product-badge">
                        {
                          product.category
                            .name
                        }
                      </span>
                    </div>

                    <div className="product-card-body">
                      <h2>{product.name}</h2>

                      <p className="desc">
                        {
                          product.shortDescription
                        }
                      </p>

                      <Link
                        to={`/products/${product.slug}`}
                        state={{
                          product,
                        }}
                        className="view-details-btn d-flex align-items-center gap-2"
                        aria-label={`View details for ${product.name}`}
                      >
                        <i className="fas fa-eye" />

                        View Details

                        <i className="fas fa-chevron-right" />
                      </Link>
                    </div>
                  </article>
                )
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}