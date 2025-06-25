import React from "react";
import "../styles/Menu.css";
import noodle from "../assets/box1.png";

function MenuItem({ name, description, price, image, spiceLevels }) {
  return (
    <div className="menu-card">
      <div className="menu-image">
        {image ? <img src={image} alt={name} /> : name}
      </div>
      <div className="menu-content">
        <div>
          <h3 className="menu-title">{name}</h3>
          <p className="menu-description">{description}</p>
          <div className="menu-size">CHOOSE SPICE LEVEL :</div>
          <div className="menu-sizes">
            {spiceLevels || "NORMAL, MEDIUM, SPICY"}
          </div>
        </div>
        <div className="menu-price-container">
          <button className="menu-button">ORDER NOW</button>
          <div className="menu-price">{price}</div>
        </div>
      </div>
    </div>
  );
}

function Menu() {
  const menuItems = [
    {
      name: "KOREAN",
      description: "CHILI KOREAN SAUCE, NOODLY SPECIAL SPICES, PEPPERS.",
      price: "35 AED",
      image: noodle,
    },
    {
      name: "SOYA",
      description: "SOYA SAUCE, FRESH VEGETABLES, NOODLY SPECIAL HERBS.",
      price: "35 AED",
      image: noodle,
    },
    {
      name: "CHEESY",
      description: "CREAMY CHEESE SAUCE, SPECIAL TOPPINGS, HERBS.",
      price: "35 AED",
      image: noodle,
    },
    {
      name: "SPICY",
      description: "HOT CHILI SAUCE, NOODLY SPECIAL SPICES, VEGETABLES.",
      price: "35 AED",
      image: noodle,
    },
  ];

  return (
    <section className="menu">
      <div className="container">
        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Menu;
