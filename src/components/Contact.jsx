import React from "react";
import "../styles/Contact.css";
import bag from "../assets/bag.png";

function ContactCard({ icon, title, subtitle }) {
  return (
    <div className="contact-card">
      <div className="contact-icon">{icon}</div>
      <h3 className="contact-title">{title}</h3>
      <p className="contact-text">{subtitle}</p>
    </div>
  );
}

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container contact-container">
        <div className="contact-grid">
          <ContactCard
            icon={
              <svg
                width="68"
                height="68"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            }
            title="Phone"
            subtitle="+94 771234567"
          />
          <ContactCard
            icon={
              <svg
                width="68"
                height="68"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            }
            title="Whatsapp"
            subtitle="+94 771234567"
          />
          <ContactCard
            icon={
              <svg
                width="68"
                height="68"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
            title="Email"
            subtitle="info@noodly.com"
          />
          <ContactCard
            icon={
              <svg
                width="68"
                height="68"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            }
            title="Our Shop"
            subtitle="123 Noodle Street"
          />
        </div>
        <div className="contact-image">
          <img src={bag} alt="Noodly Shopping Bag" />
        </div>
      </div>
    </section>
  );
}

export default Contact;
