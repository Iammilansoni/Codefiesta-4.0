import { useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

export const useOptimizedScroll = (targetRef, options = {}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width <= 1024 && width > 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: options.offset || ["start end", "end start"]
  });

  const optimizedOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );

  // Mobile-optimized animation configs
  const animationConfig = useMemo(() => ({
    duration: isMobile ? 0.3 : 0.5,
    stiffness: isMobile ? 200 : 100,
    damping: isMobile ? 25 : 15,
    mass: isMobile ? 0.5 : 1,
    ease: isMobile ? "easeOut" : "easeInOut"
  }), [isMobile]);

  return {
    scrollYProgress,
    isMobile,
    isTablet,
    optimizedOpacity,
    animationConfig
  };
};

// Mobile-optimized spring configurations
export const getSpringConfig = (isMobile = false) => ({
  type: "spring",
  stiffness: isMobile ? 200 : 100,
  damping: isMobile ? 25 : 15,
  mass: isMobile ? 0.5 : 1
});

// Mobile-optimized transition configurations
export const getTransitionConfig = (isMobile = false, duration = 1) => ({
  duration: isMobile ? duration * 0.7 : duration,
  ease: isMobile ? "easeOut" : "easeInOut"
});

// Reduced motion preferences
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};
