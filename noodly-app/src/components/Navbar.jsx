import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
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

        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
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
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
