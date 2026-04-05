// components/ScrollToTop.tsx
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface ScrollToTopProps {
  threshold?: number; // pixels to scroll before showing button
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  className?: string;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({
  threshold = 300,
  position = "bottom-right",
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`fixed ${positionClasses[position]} z-50 p-2.5 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400 ${className}`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default ScrollToTop;
