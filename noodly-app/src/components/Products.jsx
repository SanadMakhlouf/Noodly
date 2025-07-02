import React, { useState, useEffect } from "react";
import { useMenuData } from "../hooks/useMenuData";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Products.css";
import logo from "../assets/img40-removebg-preview.png";
import bgImage from "../assets/noodly-cups.png";
import ProductDetails from "./ProductDetails";

const Products = () => {
  const { products, categories, error, selectedCategory, setSelectedCategory } =
    useMenuData();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const navigate = useNavigate();

  // Filter products based on search term only (category filtering is now handled by the API)
  const filteredProducts = products.filter((product) => {
    return (
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Scroll to matching product if search query exists
  useEffect(() => {
    if (searchQuery && filteredProducts.length > 0) {
      const firstMatch = document.getElementById(
        `product-${filteredProducts[0].id}`
      );
      if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [searchQuery, filteredProducts]);

  if (error) {
    return (
      <div className="products-container">
        <div className="error-container">Error: {error}</div>
      </div>
    );
  }

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setShowOrderStatus(false);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
    setShowOrderStatus(false);
  };

  const handleConfirmOrder = (orderDetails) => {
    console.log("Order confirmed:", orderDetails);
    // Don't close the modal here - let the user close it manually from the status page
  };

  const handleCategoryClick = (categoryId) => {
    // Smooth scroll to top of products grid
    document
      .querySelector(".product-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSelectedCategory(categoryId);
  };

  const toggleOrderStatus = () => {
    // Create a dummy product for the status view
    setSelectedProduct({
      name: "Last Order",
      price: 0,
      id: "status-view",
    });
    setShowOrderStatus(true);
  };

  return (
    <div className="products-container">
      <button
        onClick={() => navigate("/")}
        className="back-home-button"
        title="Back to Home"
      >
        <i className="fas fa-arrow-left"></i>
      </button>
      <div className="content-overlay">
        <div className="products-header">
          <div className="header-content">
            <div className="logo-section">
              <img src={logo} alt="Noodly Logo" className="header-logo" />
              <h1 className="products-title">Our Menu</h1>
            </div>
            <div className="business-info">
              <div className="info-item">
                <i className="fas fa-clock"></i>
                <span>Open daily from 3:30PM to 11:00 pm</span>
              </div>
              <div className="info-item">
                <i className="fas fa-star"></i>
                <span>Serving up the best noodles in Abudhabi ✨</span>
              </div>
              <div className="info-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>Based in Alshawamekh 📍</span>
              </div>
            </div>
          </div>
          {searchQuery && (
            <p className="search-results">
              Search results for: "{searchQuery}" ({filteredProducts.length}{" "}
              items found)
            </p>
          )}
        </div>

        <div className="categories-scroll">
          <button
            className={`category-item ${
              selectedCategory === "0" ? "active" : ""
            }`}
            onClick={() => handleCategoryClick("0")}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-item ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(category.id)}
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
            <div
              key={product.id}
              id={`product-${product.id}`}
              className={`product-card ${
                searchQuery &&
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ? "search-match"
                  : ""
              }`}
            >
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
                    {product.discountedPrice ? (
                      <>
                        <span className="original-price">
                          {product.price.toFixed(2)} AED
                        </span>
                        <span className="discounted-price">
                          {product.discountedPrice.toFixed(2)} AED
                        </span>
                      </>
                    ) : (
                      <span className="price">
                        {product.price.toFixed(2)} AED
                      </span>
                    )}
                  </div>
                  <button
                    className="customize-button"
                    onClick={() => handleOrderClick(product)}
                  >
                    order now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Track Order Button */}
        <button className="floating-track-button" onClick={toggleOrderStatus}>
          <i className="fas fa-truck"></i>
        </button>

        {selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onClose={handleCloseDetails}
            onConfirm={handleConfirmOrder}
            showStatusOnly={showOrderStatus}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
