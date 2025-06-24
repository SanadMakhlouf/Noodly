import React from "react";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div>
          <div className="footer-logo">Noodly</div>
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
            <li className="footer-link">+94 771234567</li>
            <li className="footer-link">info@noodly.com</li>
            <li className="footer-link">123 Noodle Street</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
