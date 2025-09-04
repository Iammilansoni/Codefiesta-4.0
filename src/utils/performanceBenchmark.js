/**
 * Performance Benchmark Utility
 * Measures and reports performance improvements
 */

class PerformanceBenchmark {
  constructor() {
    this.metrics = {
      initialLoad: 0,
      sectionLoads: {},
      renderTimes: {},
      memoryUsage: [],
      fpsReadings: []
    };
    this.startTime = performance.now();
    this.observers = [];
    this.init();
  }

  init() {
    this.measureInitialLoad();
    this.setupPerformanceObserver();
    this.measureMemoryUsage();
    this.measureFPS();
  }

  measureInitialLoad() {
    window.addEventListener('load', () => {
      this.metrics.initialLoad = performance.now() - this.startTime;
      console.log(`📊 Initial Load Time: ${this.metrics.initialLoad.toFixed(2)}ms`);
    });
  }

  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Measure navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.logNavigationMetrics(entry);
          }
        }
      });

      // Measure resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            this.logResourceMetrics(entry);
          }
        }
      });

      try {
        navObserver.observe({ entryTypes: ['navigation'] });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(navObserver, resourceObserver);
      } catch (error) {
        console.warn('Performance Observer not fully supported', error);
      }
    }
  }

  logNavigationMetrics(entry) {
    const metrics = {
      'DNS Lookup': entry.domainLookupEnd - entry.domainLookupStart,
      'TCP Connection': entry.connectEnd - entry.connectStart,
      'Request Time': entry.responseStart - entry.requestStart,
      'Response Time': entry.responseEnd - entry.responseStart,
      'DOM Content Loaded': entry.domContentLoadedEventEnd - entry.navigationStart,
      'Load Complete': entry.loadEventEnd - entry.navigationStart
    };

    console.log('📊 Navigation Performance Metrics:');
    Object.entries(metrics).forEach(([key, value]) => {
      console.log(`  ${key}: ${value.toFixed(2)}ms`);
    });
  }

  logResourceMetrics(entry) {
    if (entry.duration > 100) { // Only log slow resources
      console.log(`⚠️ Slow Resource: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
    }
  }

  measureSectionLoad(sectionName) {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      this.metrics.sectionLoads[sectionName] = endTime - startTime;
      console.log(`📊 ${sectionName} Section Load: ${(endTime - startTime).toFixed(2)}ms`);
    };
  }

  measureRenderTime(componentName) {
    const startTime = performance.now();
    return () => {
      const renderTime = performance.now() - startTime;
      this.metrics.renderTimes[componentName] = renderTime;
      
      if (renderTime > 16) { // Slower than 60fps
        console.warn(`🐌 Slow Render: ${componentName} took ${renderTime.toFixed(2)}ms`);
      }
    };
  }

  measureMemoryUsage() {
    if (performance.memory) {
      const measureMemory = () => {
        const memory = {
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024),
          timestamp: Date.now()
        };
        
        this.metrics.memoryUsage.push(memory);
        
        // Keep only last 100 readings
        if (this.metrics.memoryUsage.length > 100) {
          this.metrics.memoryUsage.shift();
        }
      };

      // Measure memory every 5 seconds
      setInterval(measureMemory, 5000);
      measureMemory(); // Initial measurement
    }
  }

  measureFPS() {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFrame = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this.metrics.fpsReadings.push({ fps, timestamp: currentTime });
        
        // Keep only last 60 readings (1 minute at 1 reading per second)
        if (this.metrics.fpsReadings.length > 60) {
          this.metrics.fpsReadings.shift();
        }
        
        if (fps < 30) {
          console.warn(`🎯 Low FPS detected: ${fps}`);
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFrame);
    };

    requestAnimationFrame(measureFrame);
  }

  getReport() {
    const avgFPS = this.metrics.fpsReadings.length > 0 
      ? this.metrics.fpsReadings.reduce((sum, reading) => sum + reading.fps, 0) / this.metrics.fpsReadings.length
      : 0;

    const currentMemory = this.metrics.memoryUsage.length > 0 
      ? this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1]
      : null;

    return {
      initialLoadTime: this.metrics.initialLoad,
      sectionLoadTimes: this.metrics.sectionLoads,
      renderTimes: this.metrics.renderTimes,
      averageFPS: Math.round(avgFPS),
      currentMemoryUsage: currentMemory,
      totalSections: Object.keys(this.metrics.sectionLoads).length
    };
  }

  logReport() {
    const report = this.getReport();
    
    console.log('📊 Performance Report:');
    console.log('=====================');
    console.log(`Initial Load: ${report.initialLoadTime.toFixed(2)}ms`);
    console.log(`Average FPS: ${report.averageFPS}`);
    
    if (report.currentMemoryUsage) {
      console.log(`Memory Usage: ${report.currentMemoryUsage.used}MB / ${report.currentMemoryUsage.total}MB`);
    }
    
    console.log('\nSection Load Times:');
    Object.entries(report.sectionLoadTimes).forEach(([section, time]) => {
      console.log(`  ${section}: ${time.toFixed(2)}ms`);
    });
    
    console.log('\nRender Times:');
    Object.entries(report.renderTimes).forEach(([component, time]) => {
      console.log(`  ${component}: ${time.toFixed(2)}ms`);
    });
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
  }
}

// Create global benchmark instance
let benchmark = null;

export const initializeBenchmark = () => {
  if (typeof window !== 'undefined' && !benchmark) {
    benchmark = new PerformanceBenchmark();
    
    // Auto-log report every 30 seconds in development
    if (import.meta.env.DEV) {
      setInterval(() => {
        benchmark.logReport();
      }, 30000);
    }
  }
  return benchmark;
};

export const getBenchmark = () => benchmark;

export const measureSectionLoad = (sectionName) => {
  return benchmark ? benchmark.measureSectionLoad(sectionName) : () => {};
};

export const measureRenderTime = (componentName) => {
  return benchmark ? benchmark.measureRenderTime(componentName) : () => {};
};

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  initializeBenchmark();
}

export default PerformanceBenchmark;
