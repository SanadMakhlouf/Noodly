import React from "react";
import "../styles/Menu.css";

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
        </div>
        <div className="menu-price-container">
          <div>
            <div className="menu-size">CHOOSE YOUR SIZE</div>
            <div className="menu-price">{price}</div>
          </div>
          <button className="menu-button">ORDER NOW</button>
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
      price: "Rs 450",
      image: null,
    },
    {
      name: "SOYA",
      description: "Classic soya sauce noodles with fresh vegetables",
      price: "Rs 450",
      image: null,
    },
    {
      name: "CHEESY",
      description: "Creamy cheese noodles with special toppings and herbs",
      price: "Rs 450",
      image: null,
    },
    {
      name: "KOREAN",
      description:
        "Spicy Korean style noodles with special sauce and vegetables",
      price: "Rs 450",
      image: null,
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
        <div className="pagination-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot active"></div>
        </div>
      </div>
    </section>
  );
}

export default Menu;
