import React from "react";
import "../styles/Services.css";
import background from "../assets/img23.jpg";

function ServiceCard({ icon, title, description }) {
  return (
    <div className="service-card">
      <div className="service-icon">{icon}</div>
      <h3 className="service-title">{title}</h3>
      <p className="service-text">{description}</p>
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
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus luctus nec ullamcorper mattis."
          />
          <ServiceCard
            icon={<i className="fa-solid fa-motorcycle"></i>}
            title="WE DELIVER"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus luctus nec ullamcorper mattis."
          />
          <ServiceCard
            icon={<i className="fa-solid fa-utensils"></i>}
            title="ENJOY FRESH FOOD"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus luctus nec ullamcorper mattis."
          />
        </div>
      </div>
    </section>
  );
}

export default Services;
