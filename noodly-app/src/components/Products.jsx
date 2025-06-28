import React, { useState } from "react";
import { useMenuData } from "../hooks/useMenuData";
import "../styles/Products.css";
import logo from "../assets/img40-removebg-preview.png";
import ProductDetails from "./ProductDetails";

const Products = () => {
  const { products, categories, loading, error } = useMenuData();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category_id === selectedCategory);

  const handleOrderClick = (product) => {
    console.log("Order clicked for product:", product);
    setSelectedProduct(product);
    console.log("Selected product state updated:", product);
  };

  const handleCloseDetails = () => {
    console.log("Closing product details");
    setSelectedProduct(null);
  };

  const handleConfirmOrder = (orderDetails) => {
    console.log("Order confirmed:", orderDetails);
    setSelectedProduct(null);
  };

  console.log("Current selected product:", selectedProduct);
  console.log("Filtered products:", filteredProducts);

  return (
    <div className="products-container">
      <div className="products-header">
        <img src={logo} alt="Noodly Logo" className="header-logo" />
        <h1 className="products-title">Our Menu</h1>
      </div>

      <div className="categories-scroll">
        <button
          className={`category-item ${
            selectedCategory === "all" ? "active" : ""
          }`}
          onClick={() => setSelectedCategory("all")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-item ${
              selectedCategory === category.id ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="category-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = "none";
                }}
              />
            )}
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
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
                <button
                  className="customize-button"
                  onClick={() => {
                    console.log("Order button clicked for:", product.name);
                    handleOrderClick(product);
                  }}
                >
                  order now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={handleCloseDetails}
          onConfirm={handleConfirmOrder}
        />
      )}
    </div>
  );
};

export default Products;
