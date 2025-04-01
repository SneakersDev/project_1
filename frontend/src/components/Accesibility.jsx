import React, { useState } from "react";
import "../styles/accesibility/accesibility.css"
import { WiMoonAltThirdQuarter } from "react-icons/wi";

const AccessibilityButtons = () => {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);

  const increaseFontSize = () => {
    if (fontSize < 24) {
      const newSize = fontSize + 1;
      setFontSize(newSize);
      applyFontSize(newSize);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      const newSize = fontSize - 1;
      setFontSize(newSize);
      applyFontSize(newSize);
    }
  };

  const applyFontSize = (size) => {
    document.querySelectorAll("h4, h5, h6, p, label").forEach((el) => {
      el.style.fontSize = `${size}px`;
    });
  };

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle("modo-contraste");
  };

  return (
    <section className="btn-accesibility">
      <button onClick={increaseFontSize}>A+</button>
      <button onClick={decreaseFontSize}>A-</button>
      <button onClick={toggleContrast}><WiMoonAltThirdQuarter /></button>
    </section>
  );
};

export default AccessibilityButtons;