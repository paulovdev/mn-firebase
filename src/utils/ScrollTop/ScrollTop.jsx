import { FaArrowCircleUp } from "react-icons/fa";
import { useState, useEffect } from "react";
import { GoArrowUp } from 'react-icons/go'
import "./ScrollTop.scss";

const ScrollTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const threshold = 300; // 

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [threshold]); // Dependency array ensures recalculation when threshold changes

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (

    <div className={`icon-down not ${isVisible ? "show" : ""}`}
      onClick={scrollToTop} >  <GoArrowUp size={32} color="#fff" /></div>


  );
};

export default ScrollTop;
