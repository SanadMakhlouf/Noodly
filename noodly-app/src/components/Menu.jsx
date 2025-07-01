import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Menu.css";
import noodle from "../assets/box1.png";

function MenuItem({ name, description, price }) {
  const navigate = useNavigate();

  const handleOrderClick = () => {
    navigate(`/products?search=${encodeURIComponent(name)}`);
  };

  return (
    <div className="menu-card">
      <div className="menu-image">
        <img src={noodle} alt={name} />
      </div>
      <div className="menu-content">
        <div>
          <h3 className="menu-title">{name}</h3>
          <p className="menu-description">{description}</p>
        </div>
        <div className="menu-price-container">
          <button className="menu-button" onClick={handleOrderClick}>
            ORDER NOW
          </button>
          <div className="menu-price">${Number(price).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

function Menu() {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Cheesy 2",
      description: "Delicious noodles with special ingredients",
      price: 30.0,
    },
    {
      name: "Soya",
      description: "Delicious noodles with special ingredients",
      price: 30.0,
    },
    {
      name: "Korean",
      description: "Delicious noodles with special ingredients",
      price: 30.0,
    },
    {
      name: "Korean",
      description: "Delicious noodles with special ingredients",
      price: 30.0,
    },
  ];

  const handleSeeMore = () => {
    navigate("/products");
  };

  return (
    <section className="menu" id="menu">
      <div className="container">
        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </div>
        <div className="see-more-container">
          <button className="see-more-button" onClick={handleSeeMore}>
            See More Products
          </button>
        </div>
      </div>
    </section>
  );
}

export default Menu;
