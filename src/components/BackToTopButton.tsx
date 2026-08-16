import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      id="back-to-top-btn"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-amber-800 hover:bg-amber-900 text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-amber-600/50 group"
      title="回到頂部"
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5 text-amber-200 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
};
