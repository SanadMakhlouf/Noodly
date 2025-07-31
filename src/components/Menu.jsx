import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Menu.css";
import { useMenuData } from "../hooks/useMenuData";

function MenuItem({ id, name, image, price }) {
  const navigate = useNavigate();

  const handleOrderClick = () => {
    navigate(`/products?search=${encodeURIComponent(name)}`);
  };

  return (
    <div className="menu-card">
      <div className="menu-image">
        <img 
          src={image} 
          alt={name} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/noodle-placeholder.jpg";
          }}
        />
      </div>
      <div className="menu-content">
        <div>
          <h3 className="menu-title">{name}</h3>
        </div>
        <div className="menu-price-container">
          <button className="menu-button" onClick={handleOrderClick}>
            ORDER NOW
          </button>
          <div className="menu-price">{Number(price).toFixed(2)} AED</div>
        </div>
      </div>
    </div>
  );
}

function Menu() {
  const navigate = useNavigate();
  const { products, loading, error } = useMenuData();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  
  useEffect(() => {
    if (products.length > 0) {
      // Take the first 4 products from the API
      setFeaturedProducts(products.slice(0, 4));
    }
  }, [products]);

  const handleSeeMore = () => {
    navigate("/products");
  };

  return (
    <section className="menu" id="menu">
      <div className="container">
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : error ? (
          <div className="error">Error loading products</div>
        ) : (
          <div className="menu-grid">
            {featuredProducts.map((item) => (
              <MenuItem key={item.id} {...item} />
            ))}
          </div>
        )}
        <div className="see-more-container">
          <button className="see-more-button" onClick={handleSeeMore}>
            See More Products
          </button>
        </div>
      </div>
    </section>
  );
}

export default Menu;
