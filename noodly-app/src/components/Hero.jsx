import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";
import product from "../assets/product.png";

function Hero() {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    navigate("/products");
  };

  return (
    <section className="hero" id="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">ORDER YOUR</h1>
          <h1 className="hero-subtitle">FAVOURITE FOODS</h1>
          <p className="hero-text">
            Experience the authentic taste of Asian noodles right at your
            doorstep. From our signature Cheesy noodles to Korean and Soya
            flavors, we bring you the perfect blend of taste and tradition.
            Fresh, hot, and ready to serve in Abu Dhabi! ✨
          </p>
          <button className="btn-primary" onClick={handleAddToCart}>
            <i className="fa-solid fa-cart-shopping"></i>
            ORDER NOW
          </button>
        </div>
        <div className="hero-image">
          <img src={product} alt="Noodly Product" className="product-image" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
