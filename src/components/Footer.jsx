import React from "react";
import "../styles/Footer.css";
import logo from "../assets/img40-removebg-preview.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-logo-container">
          <img src={logo} alt="Noodly Logo" className="footer-logo" />
        </div>
        <div>
          <h3 className="footer-title">OUR STORE</h3>
          <ul className="footer-links">
            <li className="footer-link">Shop</li>
            <li className="footer-link">About</li>
            <li className="footer-link">Contact</li>
          </ul>
        </div>
        <div>
          <h3 className="footer-title">GET IN TOUCH</h3>
          <ul className="footer-links">
            <li className="footer-link">+971 56 697 0038</li>
            <li className="footer-link">info@noodly.com</li>
            
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
