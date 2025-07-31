import React, { useState, useEffect } from "react";
import { useMenuData } from "../hooks/useMenuData";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Products.css";
import logo from "../assets/img40-removebg-preview.png";
import bgImage from "../assets/noodly-cups.png";
import ProductDetails from "./ProductDetails";
import Cart from "./Cart";

const Products = () => {
  const { products, categories, error, selectedCategory, setSelectedCategory } =
    useMenuData();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderStatus, setShowOrderStatus] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";
  const navigate = useNavigate();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("noodlyCart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.error("Error loading cart from localStorage:", err);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("noodlyCart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Filter products based on search term only (category filtering is now handled by the API)
  const filteredProducts = products.filter((product) => {
    return (
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }).map(product => {
    // Add isTopRated property to approximately 30% of products
    return {
      ...product,
      isTopRated: Math.random() < 0.3
    };
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

  const handleAddToCart = (product, quantity, specialInstructions) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex !== -1) {
      // Update existing item
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
        specialInstructions:
          specialInstructions ||
          updatedItems[existingItemIndex].specialInstructions,
      };
      setCartItems(updatedItems);
    } else {
      // Add new item
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity,
          specialInstructions,
        },
      ]);
    }

    setSelectedProduct(null);
    setShowCart(true);
  };

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    console.log(`Updating quantity for product ${productId} to ${newQuantity}`);

    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    const updatedItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedItems);
  };

  const handleRemoveFromCart = (productId) => {
    console.log(`Removing product ${productId} from cart`);
    const updatedItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedItems);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("noodlyCart");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Create a combined product for checkout
    const firstItem = cartItems[0];
    setSelectedProduct({
      ...firstItem,
      isCartCheckout: true,
      cartItems: [...cartItems], // Create a new array to ensure proper state update
      onOrderSuccess: clearCart, // Pass the clearCart function to be called after successful order
    });
    setShowCart(false);
  };

  const handleCategoryClick = (categoryId) => {
    // Smooth scroll to top of products grid
    document
      .querySelector(".product-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSelectedCategory(categoryId);
  };

  const toggleOrderStatus = () => {
    // Load the last order details from localStorage
    const lastOrderDetails = localStorage.getItem("lastOrderDetails");

    if (lastOrderDetails) {
      try {
        const parsedDetails = JSON.parse(lastOrderDetails);

        // Create a status view with the saved order details
        setSelectedProduct({
          name: "Last Order",
          price: 0,
          id: "status-view",
          // Add the saved products for status display
          isCartCheckout: parsedDetails.isCartOrder,
          cartItems: parsedDetails.products || [],
        });

        setShowOrderStatus(true);
      } catch (err) {
        console.error("Error parsing last order details:", err);
        // Fallback to simple status view
        setSelectedProduct({
          name: "Last Order",
          price: 0,
          id: "status-view",
        });
        setShowOrderStatus(true);
      }
    } else {
      // No previous order, show empty status
      setSelectedProduct({
        name: "Last Order",
        price: 0,
        id: "status-view",
      });
      setShowOrderStatus(true);
    }
  };

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="products-container">
      <button
        onClick={() => navigate("/")}
        className="back-home-button"
        title="Back to Home"
      >
        <i className="fas fa-arrow-left"></i>
      </button>

      {/* Cart Button */}
      <button
        className="floating-cart-button"
        onClick={() => setShowCart(true)}
        title="View Cart"
      >
        <i className="fas fa-shopping-cart"></i>
        {cartItemCount > 0 && (
          <span className="cart-count">{cartItemCount}</span>
        )}
      </button>

      <div className="content-overlay">
        <div className="products-header">
          <div className="header-content">
                          <div className="logo-section">
                <img src={logo} alt="Noodly Logo" className="header-logo" />
                <h1 className="products-title">Menu</h1>
              </div>
            <div className="business-info">
              {/* Business info hidden in the new design */}
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
              onClick={() => handleOrderClick(product)}
            >
              {(product.id === 3 || product.id === 4) && (
                <div className="top-rated-badge">
                  <i className="fas fa-star"></i> Top rated
                </div>
              )}
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
                <div>
                  <h3 className="product-name">{product.name}</h3>
                </div>
                <div className="product-footer">
                  <div className="price-container">
                    <span className="price">
                      ₹ {product.price.toFixed(0)}
                    </span>
                  </div>
                  <button
                    className="customize-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderClick(product);
                    }}
                  >
                    +
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
            onAddToCart={handleAddToCart}
            showStatusOnly={showOrderStatus}
            isCartCheckout={selectedProduct.isCartCheckout}
            cartItems={selectedProduct.cartItems || cartItems}
            onOrderSuccess={selectedProduct.onOrderSuccess}
          />
        )}

        {showCart && (
          <Cart
            items={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClose={() => setShowCart(false)}
            onCheckout={handleCheckout}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
