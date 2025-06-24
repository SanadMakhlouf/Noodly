import React from "react";
import "../styles/Menu.css";
import noodle from "../assets/box.png";

function MenuItem({ name, description, price, image }) {
  return (
    <div className="menu-card">
      <div className="menu-image">
        {image ? <img src={image} alt={name} /> : name}
      </div>
      <div className="menu-content">
        <div>
          <h3 className="menu-title">{name}</h3>
          <p className="menu-description">{description}</p>
          <div className="menu-size">CHOOSE YOUR SIZE</div>
          <div className="menu-sizes">NORMAL, MEDIUM, SPICY</div>
        </div>
        <div className="menu-price-container">
          <button className="menu-button">ORDER NOW</button>
          <div>
            
            <div className="menu-price">{price}</div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

function Menu() {
  const menuItems = [
    {
      name: "KOREAN",
      description:
        "Spicy Korean style noodles with special sauce and vegetables",
      price: "AED 450",
      image: noodle,
    },
    {
      name: "SOYA",
      description: "Classic soya sauce noodles with fresh vegetables",
      price: "AED 450",
      image: noodle,
    },
    {
      name: "CHEESY",
      description: "Creamy cheese noodles with special toppings and herbs",
      price: "AED 450",
      image: noodle,
    },
    {
      name: "KOREAN",
      description:
        "Spicy Korean style noodles with special sauce and vegetables",
      price: "AED 450",
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
