import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMenuData } from "../hooks/useMenuData";
import "../styles/Navbar.css";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
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
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          Noodly
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            HOME
          </Link>
          <a href="#menu" className="nav-link">
            MENU
          </a>
          <a href="#service" className="nav-link">
            SERVICE
          </a>
          <Link to="/products" className="nav-link">
            PRODUCTS
          </Link>
        </div>

        <form onSubmit={handleSearch} className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <svg
              className="search-icon"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      </div>
    </nav>
  );
}

export default Navbar;
