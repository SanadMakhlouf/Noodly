import React from "react";
import { useMenuData } from "../hooks/useMenuData";
import "../styles/Products.css";
import logo from "../assets/img40-removebg-preview.png";
const Products = () => {
  const { products, loading, error } = useMenuData();

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading-container">Loading delicious meals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error-container">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <img
          src={logo}
          alt="Noodly Logo"
          className="header-logo"
        />
        <h1 className="products-title">Our Menu</h1>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img
                className="product-image"
                src={product.image}
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/noodle-placeholder.jpg";
                }}
              />
            </div>
            <div className="product-content">
              <h3 className="product-name">{product.name}</h3>
              {product.description && (
                <p className="product-description">{product.description}</p>
              )}
              <div className="product-footer">
                <div className="price-container">
                  {product.discountedPrice > 0 ? (
                    <>
                      <span className="original-price">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="price">
                        ${product.discountedPrice.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="price">${product.price.toFixed(2)}</span>
                  )}
                </div>
                {product.customizable && (
                  <button className="customize-button">order now</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
