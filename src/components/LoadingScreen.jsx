import React, { useEffect, useState } from "react";
import logo from "../assets/img40-removebg-preview.png";
import "../styles/LoadingScreen.css";

const LoadingScreen = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    
    const loadingTimeout = setTimeout(() => {
      finishLoading();
    }, 2500);
    
    return () => {
      clearTimeout(timeout);
      clearTimeout(loadingTimeout);
    };
  }, [finishLoading]);

  return (
    <div className={`loading-screen ${isMounted ? "mounted" : ""}`}>
      <div className="loading-container">
        <img src={logo} alt="Noodly Logo" className="loading-logo" />
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;