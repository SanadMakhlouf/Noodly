import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMenuData } from "../hooks/useMenuData";
import "../styles/Navbar.css";
import logo from "../assets/img40-removebg-preview.png";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { products } = useMenuData();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleSectionClick = (sectionId) => {
    handleNavClick(); // Close mobile menu

    if (location.pathname !== "/") {
      // If we're not on the home page, navigate to home first
      navigate("/?section=" + sectionId);
    } else {
      // If we're already on the home page, scroll to the section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link
          to="/"
          className="logo"
          onClick={() => handleSectionClick("hero")}
        >
          <img src={logo} alt="Noodly Logo" className="navbar-logo" />
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
          <button
            className="nav-link"
            onClick={() => handleSectionClick("hero")}
          >
            HOME
          </button>
          <button
            className="nav-link"
            onClick={() => handleSectionClick("menu")}
          >
            MENU
          </button>
          <button
            className="nav-link"
            onClick={() => handleSectionClick("contact")}
          >
            CONTACT
          </button>
          <Link to="/products" className="nav-link" onClick={handleNavClick}>
            PRODUCTS
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
