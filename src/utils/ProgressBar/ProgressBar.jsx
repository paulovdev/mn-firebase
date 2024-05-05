import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./ProgressBar.scss";
export const ProgressBar = ({ backgroundColor }) => {
  const [scrollProgress, setScrollProgress] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight =
        "innerHeight" in window
          ? window.innerHeight
          : document.documentElement.offsetHeight;
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
      const windowBottom = windowHeight + window.pageYOffset;
      const scrollPercentage = (windowBottom / docHeight) * 100;
      setScrollProgress(scrollPercentage);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="progress-bar-container">
      <motion.div
        className="progress-bar-desktop"
        style={{ height: `${scrollProgress}%`, backgroundColor: backgroundColor }}
      />
      <motion.div
        className="progress-bar-mobile"
        style={{ width: `${scrollProgress}%`, backgroundColor: backgroundColor }}
      />
    </div>
  );
};
