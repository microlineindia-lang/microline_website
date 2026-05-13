import { useState } from 'react';
import { useTheme } from "../components/ui/ThemeProvider";
import productsHeroLight from '../assets/images/products-light.png';
import productsHeroDark from '../assets/images/products-dark.png';
import { useDatoProducts, type CMSProduct } from '../hooks/useDatoProducts';

interface ProductsProps {
  onNavigate: (page: string, data?: unknown) => void;
}

function getCategoriesFromProducts(products: CMSProduct[]) {
  const categories = products.map(p => p.category.name);
  return ['All', ...Array.from(new Set(categories))];
}

export default function Products({ onNavigate }: ProductsProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const { isDarkMode } = useTheme();
  const { products: allProducts, loading, error } = useDatoProducts();

  if (loading) return <div className="pt-navbar flex justify-center items-center h-screen">Loading products...</div>;
  if (error) return <div className="pt-navbar flex justify-center items-center h-screen text-red-500">Failed to load products.</div>;

  const categories = getCategoriesFromProducts(allProducts);
  const filtered =
    activeCategory === 'All'
      ? allProducts
      : allProducts.filter(p => p.category.name === activeCategory);

  return (
    <div className="pt-navbar">
      <div className="page-hero bg-gradient-dark">
        <div
          className="page-hero-overlay"
          style={{ backgroundImage: `url(${isDarkMode ? productsHeroDark : productsHeroLight})` }}
        />
        <div className="container position-relative z-1">
          <div className="d-flex align-items-center gap-2 mb-2 text-uppercase ls-2 fw-700 fs-xs">
            <button onClick={() => onNavigate('home')} className="breadcrumb-link text-info">HOME</button>
            <span className="text-white" style={{ opacity: 0.5 }}> / </span>
            <span className="text-gold">PRODUCTS</span>
          </div>
          <h1 className="text-white fs-2xl fw-900">Our Products</h1>
        </div>
      </div>

      <div className="section py-5">
        <div className="container">
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`filter-btn${cat === activeCategory ? ' active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {filtered.map(product => (
              <div key={product.slug} className="product-card">
                <div className="product-card-img">
                  <img src={product.image.url} alt={product.name} />
                  <span className="product-badge">{product.category.name}</span>
                </div>
                <div className="product-card-body">
                  <h3>{product.name}</h3>
                  <p className="desc">{product.shortDescription}</p>
                  <button
                    onClick={() => onNavigate('product-detail', product)}
                    className="view-details-btn d-flex align-items-center gap-2"
                  >
                    <i className="fas fa-eye"></i> View Details <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}