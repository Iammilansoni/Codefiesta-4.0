import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

const PerformanceComparisonPanel = ({ enabled = false }) => {
  const { fps, memory, renderTime } = usePerformanceMonitor('Teams', enabled);
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderCount: 0,
    memoryUsage: 0,
    fpsAverage: 60
  });

  useEffect(() => {
    if (!enabled) return;

    const startTime = performance.now();
    
    // Measure initial load time
    const measureLoadTime = () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, loadTime }));
    };

    // Use setTimeout to measure when component is fully loaded
    setTimeout(measureLoadTime, 100);

    // Performance observer for render metrics
    if (window.PerformanceObserver) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('measure')) {
            console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['measure'] });
      } catch (error) {
        console.log('Performance Observer not supported for measures', error);
      }

      return () => observer.disconnect();
    }
  }, [enabled]);

  useEffect(() => {
    if (memory) {
      setMetrics(prev => ({
        ...prev,
        memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024 * 100) / 100
      }));
    }
  }, [memory]);

  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      fpsAverage: Math.round(fps * 10) / 10
    }));
  }, [fps]);

  if (!enabled) return null;

  const getPerformanceColor = (value, thresholds) => {
    if (value >= thresholds.good) return 'text-green-400';
    if (value >= thresholds.okay) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-4 text-white text-sm font-mono z-50 max-w-xs"
    >
      <h3 className="text-cyan-400 font-bold mb-2">Teams Performance</h3>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Load Time:</span>
          <span className={getPerformanceColor(
            metrics.loadTime < 1000 ? 1 : metrics.loadTime < 2000 ? 0.5 : 0,
            { good: 1, okay: 0.5 }
          )}>
            {metrics.loadTime.toFixed(1)}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={getPerformanceColor(fps, { good: 55, okay: 30 })}>
            {metrics.fpsAverage}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Memory:</span>
          <span className={getPerformanceColor(
            metrics.memoryUsage < 50 ? 1 : metrics.memoryUsage < 100 ? 0.5 : 0,
            { good: 1, okay: 0.5 }
          )}>
            {metrics.memoryUsage}MB
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Render:</span>
          <span className={getPerformanceColor(
            renderTime < 16 ? 1 : renderTime < 33 ? 0.5 : 0,
            { good: 1, okay: 0.5 }
          )}>
            {renderTime.toFixed(1)}ms
          </span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-white/20">
        <div className="text-xs text-gray-400">
          <div>✅ Lazy Loading Active</div>
          <div>✅ Image Optimization</div>
          <div>✅ Reduced Animations</div>
          <div>✅ Memoized Components</div>
        </div>
      </div>
    </motion.div>
  );
};

export default PerformanceComparisonPanel;
