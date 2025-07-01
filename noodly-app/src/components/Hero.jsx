import React from "react";
import "../styles/Hero.css";
import product from "../assets/product.png";

function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">ORDER YOUR</h1>
          <h1 className="hero-subtitle">FAVOURITE FOODS</h1>
          <p className="hero-text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad minim veniam, quis.
          </p>
          <button className="btn-primary">
            <i className="fa-solid fa-cart-shopping"></i>
            ADD TO CART
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
