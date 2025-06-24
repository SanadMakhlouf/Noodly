import React from "react";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="logo">Noodly</div>

        <div className="nav-links">
          <a href="#home" className="nav-link">
            HOME
          </a>
          <a href="#menu" className="nav-link">
            MENU
          </a>
          <a href="#service" className="nav-link">
            SERVICE
          </a>
          <a href="#shop" className="nav-link">
            SHOP
          </a>
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
