// Performance configuration for different device types
export const DEVICE_CONFIGS = {
  mobile: {
    // Reduce animation complexity
    maxParticles: 50,
    animationDuration: 0.3,
    throttleMs: 32, // 30fps
    enableBlur: false,
    enableShadows: false,
    enablePostProcessing: false,
    starCount: 5000,
    // Reduce motion sensitivity
    mouseMultiplier: 0.5,
    // Simple transitions
    springConfig: {
      tension: 120,
      friction: 14
    }
  },
  tablet: {
    maxParticles: 150,
    animationDuration: 0.4,
    throttleMs: 24, // 40fps
    enableBlur: true,
    enableShadows: false,
    enablePostProcessing: true,
    starCount: 15000,
    mouseMultiplier: 0.8,
    springConfig: {
      tension: 180,
      friction: 18
    }
  },
  desktop: {
    maxParticles: 300,
    animationDuration: 0.6,
    throttleMs: 16, // 60fps
    enableBlur: true,
    enableShadows: true,
    enablePostProcessing: true,
    starCount: 25000,
    mouseMultiplier: 1,
    springConfig: {
      tension: 280,
      friction: 20
    }
  }
};

// Device detection utility
export const getDeviceType = () => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check for mobile devices
  const isMobile = width < 640 || 
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  
  if (isMobile) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Get configuration for current device
export const getDeviceConfig = () => {
  const deviceType = getDeviceType();
  return DEVICE_CONFIGS[deviceType];
};

// Performance monitoring utilities
export const performanceMonitor = {
  fps: 0,
  frameCount: 0,
  lastTime: performance.now(),
  
  start() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.measure();
  },
  
  measure() {
    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
    
    requestAnimationFrame(() => this.measure());
  },
  
  getFPS() {
    return this.fps;
  },
  
  isPerformanceGood() {
    return this.fps >= 30;
  }
};

// Responsive breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Media query utilities
export const createMediaQuery = (minWidth) => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(`(min-width: ${minWidth}px)`).matches;
};

export const getResponsiveValue = (values) => {
  if (typeof window === 'undefined') return values.default || values.sm || values[0];
  
  const width = window.innerWidth;
  
  if (width >= BREAKPOINTS['2xl'] && values['2xl']) return values['2xl'];
  if (width >= BREAKPOINTS.xl && values.xl) return values.xl;
  if (width >= BREAKPOINTS.lg && values.lg) return values.lg;
  if (width >= BREAKPOINTS.md && values.md) return values.md;
  if (width >= BREAKPOINTS.sm && values.sm) return values.sm;
  
  return values.default || values.sm || Object.values(values)[0];
};

// Debounce utility for performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for performance
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memory cleanup utilities
export const cleanupResources = () => {
  // Force garbage collection if available
  if (window.gc) {
    window.gc();
  }
  
  // Clear unused timers
  const highestTimeoutId = setTimeout(() => {});
  for (let i = 0; i < highestTimeoutId; i++) {
    clearTimeout(i);
  }
  
  const highestIntervalId = setInterval(() => {}, 9999);
  for (let i = 0; i < highestIntervalId; i++) {
    clearInterval(i);
  }
  clearInterval(highestIntervalId);
};

// Preload images for better performance
export const preloadImages = (imageSources) => {
  return Promise.all(
    imageSources.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    })
  );
};
