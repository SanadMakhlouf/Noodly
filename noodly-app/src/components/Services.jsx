import React from "react";
import "../styles/Services.css";
import background from "../assets/img23.jpg";

function ServiceCard({ icon, title, description }) {
  return (
    <div className="service-card">
      <div className="service-icon">{icon}</div>
      <div className="service-content">
        <h3 className="service-title">{title}</h3>
        <p className="service-text">{description}</p>
      </div>
    </div>
  );
}

function Services() {
  return (
    <section
      className="services"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="container">
        <div className="services-grid">
          <ServiceCard
            icon={<i className="fa-solid fa-box"></i>}
            title="YOUR ORDER"
            description="Choose your favorite noodles and customize them to your taste"
          />
          <ServiceCard
            icon={<i className="fa-solid fa-motorcycle"></i>}
            title="WE DELIVER"
            description="Fast and reliable delivery right to your doorstep"
          />
          <ServiceCard
            icon={<i className="fa-solid fa-utensils"></i>}
            title="ENJOY FRESH FOOD"
            description="Savor the delicious taste of freshly prepared noodles"
          />
        </div>
      </div>
    </section>
  );
}

export default Services;
