import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMenuData } from "../hooks/useMenuData";
import "../styles/Navbar.css";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { products } = useMenuData();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Searching for:", searchTerm);
      console.log("Available products:", products);

      const searchResults = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      console.log("Search results:", searchResults);

      // Navigate to products page with search term
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);

      // Clear search input
      setSearchTerm("");
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo" onClick={handleNavClick}>
          Noodly
        </Link>

        <button className="mobile-menu-button" onClick={toggleMenu}>
          <i className={`fas fa-${isMenuOpen ? "times" : "bars"}`}></i>
        </button>

        <form onSubmit={handleSearch} className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </form>

        <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <Link to="/" className="nav-link" onClick={handleNavClick}>
            HOME
          </Link>
          <a href="#menu" className="nav-link" onClick={handleNavClick}>
            MENU
          </a>
          <a href="#service" className="nav-link" onClick={handleNavClick}>
            SERVICE
          </a>
          <Link to="/products" className="nav-link" onClick={handleNavClick}>
            PRODUCTS
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
