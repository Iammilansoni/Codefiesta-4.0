/**
 * Global optimization utilities for improving page load performance
 */

// Resource preloader utility
export const preloadResources = () => {
  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.href = '/src/assets/fonts/fonts.css';
  fontLink.as = 'style';
  document.head.appendChild(fontLink);

  // Preload critical images
  const criticalImages = [
    '/src/assets/final logo.png',
    '/src/assets/teams/teamimages.jpg',
    '/src/assets/backgroundO.png'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  });
};

// Performance optimization for animations
export const optimizeAnimations = () => {
  // Reduce motion for users who prefer it
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01s');
    document.documentElement.style.setProperty('--transition-duration', '0.01s');
  }
};

// Memory management utility
export const cleanupResources = () => {
  // Clean up any persistent timers or intervals
  const highestId = setTimeout(() => {}, 0);
  for (let i = 0; i < highestId; i++) {
    clearTimeout(i);
  }
};

// Batch DOM operations
export const batchDOMOperations = (operations) => {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      operations.forEach(op => op());
      resolve();
    });
  });
};

// Image optimization utility
export const createOptimizedImageSrc = (src, width = 800, quality = 75) => {
  // Return optimized image URL (if using a service like Cloudinary)
  // For now, just return the original src
  // Future: return `${src}?w=${width}&q=${quality}`;
  console.log(`Image optimization requested: ${src} (${width}x${quality})`);
  return src;
};

// Initialize global optimizations
export const initializeOptimizations = () => {
  // Set up performance observers
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure' && entry.duration > 100) {
          console.warn(`Slow operation detected: ${entry.name} took ${entry.duration}ms`);
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (error) {
      console.log('Performance Observer not fully supported', error);
    }
  }

  // Optimize animations based on user preferences
  optimizeAnimations();
  
  // Preload critical resources
  preloadResources();
};

export default {
  preloadResources,
  optimizeAnimations,
  cleanupResources,
  batchDOMOperations,
  createOptimizedImageSrc,
  initializeOptimizations
};
