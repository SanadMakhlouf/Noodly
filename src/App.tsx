import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Services from "./components/Services";
import Menu from "./components/Menu";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const theme = createTheme({
  palette: {
    primary: {
      main: "#002090", // Dark blue
    },
    secondary: {
      main: "#F8CA13", // Yellow
    },
  },
  typography: {
    fontFamily: '"Poppins", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ backgroundColor: "#002090", minHeight: "100vh" }}>
        <Navbar />
        <Hero />
        <Story />
        <Services />
        <Menu />
        <Contact />
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
