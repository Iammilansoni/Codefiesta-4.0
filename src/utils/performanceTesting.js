// Performance testing utilities for the hackathon website

// Measure page load performance
export const measurePageLoad = () => {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve(getPerformanceMetrics());
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => {
          resolve(getPerformanceMetrics());
        }, 100);
      });
    }
  });
};

// Get comprehensive performance metrics
export const getPerformanceMetrics = () => {
  const navigation = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');
  
  const metrics = {
    // Navigation timing
    domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
    loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
    
    // Critical rendering path
    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
    
    // Resource timing
    totalResources: performance.getEntriesByType('resource').length,
    totalSize: 0,
    
    // Memory (if available)
    memory: performance.memory ? {
      used: Math.round((performance.memory.usedJSHeapSize / 1024 / 1024) * 100) / 100,
      total: Math.round((performance.memory.totalJSHeapSize / 1024 / 1024) * 100) / 100,
      limit: Math.round((performance.memory.jsHeapSizeLimit / 1024 / 1024) * 100) / 100,
    } : null,
    
    // Network information (if available)
    connection: navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
    } : null,
  };

  // Calculate total resource size
  const resources = performance.getEntriesByType('resource');
  metrics.totalSize = resources.reduce((total, resource) => {
    return total + (resource.transferSize || 0);
  }, 0);

  return metrics;
};

// Measure component render time
export const measureComponentRender = (componentName, renderFn) => {
  const startTime = performance.now();
  const result = renderFn();
  const endTime = performance.now();
  
  console.log(`${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`);
  return result;
};

// Monitor FPS
export class FPSMonitor {
  constructor() {
    this.fps = 0;
    this.frames = 0;
    this.lastTime = performance.now();
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    this.tick();
  }

  stop() {
    this.isRunning = false;
  }

  tick() {
    if (!this.isRunning) return;

    this.frames++;
    const currentTime = performance.now();
    
    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
      this.frames = 0;
      this.lastTime = currentTime;
    }

    requestAnimationFrame(() => this.tick());
  }

  getFPS() {
    return this.fps;
  }
}

// Monitor memory usage
export const getMemoryUsage = () => {
  if (!performance.memory) {
    return null;
  }

  const memory = performance.memory;
  return {
    used: Math.round((memory.usedJSHeapSize / 1024 / 1024) * 100) / 100,
    total: Math.round((memory.totalJSHeapSize / 1024 / 1024) * 100) / 100,
    limit: Math.round((memory.jsHeapSizeLimit / 1024 / 1024) * 100) / 100,
    percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100),
  };
};

// Measure bundle sizes
export const analyzeBundleSize = () => {
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  const resources = performance.getEntriesByType('resource').filter(
    resource => resource.name.includes('.js') || resource.name.includes('.css')
  );

  return {
    scriptCount: scripts.length,
    styleCount: styles.length,
    totalSize: resources.reduce((total, resource) => total + (resource.transferSize || 0), 0),
    resources: resources.map(resource => ({
      name: resource.name.split('/').pop(),
      size: resource.transferSize || 0,
      duration: resource.duration,
    })),
  };
};

// Performance recommendations
export const getPerformanceRecommendations = (metrics) => {
  const recommendations = [];

  if (metrics.firstContentfulPaint > 2000) {
    recommendations.push('Consider optimizing critical resources to improve First Contentful Paint');
  }

  if (metrics.totalSize > 5 * 1024 * 1024) { // 5MB
    recommendations.push('Bundle size is large, consider code splitting and lazy loading');
  }

  if (metrics.memory && metrics.memory.percentage > 80) {
    recommendations.push('High memory usage detected, check for memory leaks');
  }

  if (metrics.totalResources > 50) {
    recommendations.push('Many resources loaded, consider bundling or reducing requests');
  }

  return recommendations;
};

// Run comprehensive performance test
export const runPerformanceTest = async () => {
  console.log('🚀 Running performance analysis...');
  
  const metrics = await measurePageLoad();
  const bundle = analyzeBundleSize();
  const memory = getMemoryUsage();
  const recommendations = getPerformanceRecommendations(metrics);

  const report = {
    timestamp: new Date().toISOString(),
    metrics,
    bundle,
    memory,
    recommendations,
  };

  console.log('📊 Performance Report:', report);
  return report;
};

// Export FPS monitor instance
export const fpsMonitor = new FPSMonitor();
