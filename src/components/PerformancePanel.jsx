import React, { useState, useEffect } from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

const PerformancePanel = () => {
  const { fps, memory, renderTime } = usePerformanceMonitor();
  const [isVisible, setIsVisible] = useState(false);

  // Show performance panel in development
  useEffect(() => {
    const togglePanel = (e) => {
      if (e.key === 'p' && e.ctrlKey) {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', togglePanel);
    return () => window.removeEventListener('keydown', togglePanel);
  }, []);

  if (!isVisible) return null;

  const getPerformanceColor = (value, thresholds) => {
    if (value >= thresholds.good) return 'text-green-400';
    if (value >= thresholds.ok) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed top-4 left-4 z-[9999] bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4 text-white font-mono text-sm min-w-[200px]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-purple-400">Performance Monitor</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={getPerformanceColor(fps, { good: 55, ok: 30 })}>
            {fps.toFixed(1)}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Render:</span>
          <span className={getPerformanceColor(60 - renderTime, { good: 50, ok: 40 })}>
            {renderTime.toFixed(1)}ms
          </span>
        </div>
        
        {memory && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className={getPerformanceColor(100 - (memory.usedJSHeapSize / 1024 / 1024), { good: 80, ok: 60 })}>
              {(memory.usedJSHeapSize / 1024 / 1024).toFixed(1)}MB
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-3 pt-2 border-t border-white/20 text-xs text-white/60">
        Press Ctrl+P to toggle
      </div>
    </div>
  );
};

export default PerformancePanel;
