import { FaArrowCircleUp } from "react-icons/fa";
import { useState, useEffect } from "react";
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
    <div
      className={`scroll-top ${isVisible ? "show" : ""}`}
      onClick={scrollToTop}
    >
      <FaArrowCircleUp size={32}/>
    </div>
  );
};

export default ScrollTop;
