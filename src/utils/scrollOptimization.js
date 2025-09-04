// Scroll optimization utilities for mobile and tablet devices

export const optimizeScrollListeners = () => {
  // Add passive event listeners for better scroll performance
  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
        return true;
      }
    });
    window.addEventListener("testPassive", null, opts);
    window.removeEventListener("testPassive", null, opts);
  } catch (error) {
    // Silent catch for older browsers
    console.warn('Passive event listeners not supported:', error.message);
  }

  return supportsPassive ? { passive: true } : false;
};

export const createMobileOptimizedAnimation = (isMobile, baseConfig) => {
  if (isMobile) {
    return {
      ...baseConfig,
      duration: (baseConfig.duration || 1) * 0.7,
      ease: "easeOut",
      type: "tween" // Use tween instead of spring for mobile
    };
  }
  return baseConfig;
};

export const createTouchOptimizedVariants = (isMobile) => ({
  initial: { 
    opacity: 0, 
    y: isMobile ? 20 : 50,
    scale: isMobile ? 0.95 : 0.9
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: isMobile ? 0.4 : 0.6,
      ease: isMobile ? "easeOut" : "easeInOut",
      type: isMobile ? "tween" : "spring",
      stiffness: isMobile ? undefined : 100,
      damping: isMobile ? undefined : 15
    }
  },
  exit: { 
    opacity: 0, 
    y: isMobile ? -20 : -50,
    scale: isMobile ? 0.95 : 0.9,
    transition: {
      duration: isMobile ? 0.3 : 0.4,
      ease: "easeIn"
    }
  }
});

// Reduce animations based on user preferences
export const respectMotionPreferences = (animation) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return {
      ...animation,
      duration: 0.01,
      transition: { duration: 0.01 }
    };
  }
  
  return animation;
};

// Throttle scroll events for better performance
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Debounce resize events
export const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};
