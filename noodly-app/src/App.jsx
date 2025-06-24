import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Services from "./components/Services";
import Menu from "./components/Menu";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-noodly-blue">
      <Navbar />
      <Hero />
      <Story />
      <Services />
      <Menu />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
