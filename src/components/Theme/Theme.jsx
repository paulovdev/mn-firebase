import { useState } from "react";
import { FiMoon } from "react-icons/fi";

import { FiSun } from "react-icons/fi";

const Theme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  function toggleTheme(e) {
    e.preventDefault();
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("light");
  }

  return (
    <button onClick={toggleTheme} className="toggle-theme">
      {isDarkMode ? (
        <FiSun size={22} color="#000" />
      ) : (
        <FiMoon size={22} color="#fff" />
      )}
    </button>
  );
};

export default Theme;
