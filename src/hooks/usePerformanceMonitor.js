import { useEffect, useRef, useState } from 'react';

// Performance monitor for debugging
export const usePerformanceMonitor = (componentName, enabled = false) => {
  const renderCount = useRef(0);
  const lastRender = useRef(performance.now());
  const [fps, setFps] = useState(60);
  const [memory, setMemory] = useState(null);
  const [renderTime, setRenderTime] = useState(16);

  useEffect(() => {
    if (!enabled) return;

    renderCount.current += 1;
    const now = performance.now();
    const timeSinceLastRender = now - lastRender.current;
    
    console.log(`[Performance] ${componentName}:`, {
      renderCount: renderCount.current,
      timeSinceLastRender: `${timeSinceLastRender.toFixed(2)}ms`,
      fps: `${(1000 / timeSinceLastRender).toFixed(1)} fps`
    });
    
    lastRender.current = now;
  });

  // Real-time performance monitoring
  useEffect(() => {
    let animationId;
    const frameCount = { value: 0 };
    const lastTime = { value: performance.now() };
    const renderStart = { value: 0 };
    
    const measurePerformance = () => {
      const currentTime = performance.now();
      frameCount.value++;
      
      // Calculate render time
      if (renderStart.value) {
        setRenderTime(currentTime - renderStart.value);
      }
      renderStart.value = currentTime;
      
      // Calculate FPS every second
      if (currentTime - lastTime.value >= 1000) {
        const newFps = (frameCount.value * 1000) / (currentTime - lastTime.value);
        setFps(newFps);
        frameCount.value = 0;
        lastTime.value = currentTime;
      }
      
      // Get memory usage if available
      if (performance.memory) {
        setMemory({
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        });
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    };
    
    measurePerformance();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return { fps, memory, renderTime, renderCount: renderCount.current };
};

// Frame rate monitor
export const useFPSMonitor = (enabled = false) => {
  const frames = useRef(0);
  const lastTime = useRef(performance.now());
  const fps = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    let animationId;
    
    const measureFPS = () => {
      frames.current++;
      const now = performance.now();
      
      if (now - lastTime.current >= 1000) {
        fps.current = Math.round((frames.current * 1000) / (now - lastTime.current));
        
        if (fps.current < 30) {
          console.warn(`[FPS Warning] Low FPS detected: ${fps.current}`);
        }
        
        frames.current = 0;
        lastTime.current = now;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };
    
    measureFPS();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [enabled]);

  return fps.current;
};

// Component lifecycle tracker
export const useComponentLifecycle = (componentName) => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(`🟢 ${componentName} mounted`);
    }
    
    return () => {
      if (import.meta.env.DEV) {
        console.log(`🔴 ${componentName} unmounted`);
      }
    };
  }, [componentName]);
};

// Render time tracker
export const useRenderTime = (componentName) => {
  const startTime = useRef(0);
  
  useEffect(() => {
    startTime.current = performance.now();
  });
  
  useEffect(() => {
    const renderTime = performance.now() - startTime.current;
    if (renderTime > 16 && import.meta.env.DEV) {
      console.log(`🐌 ${componentName} render time: ${renderTime.toFixed(2)}ms`);
    }
  });
};
