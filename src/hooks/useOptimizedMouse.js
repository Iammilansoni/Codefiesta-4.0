import { useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useCallback } from "react";

// Optimized mouse tracking with throttling and performance monitoring
export const useOptimizedMouse = (throttleMs = 16) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const lastCall = useRef(0);
  const rafId = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const now = performance.now();
    
    // Throttle to 60fps max
    if (now - lastCall.current < throttleMs) {
      return;
    }
    
    lastCall.current = now;
    
    // Cancel previous RAF if pending
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    
    // Use RAF for smooth updates
    rafId.current = requestAnimationFrame(() => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    });
  }, [mouseX, mouseY, throttleMs]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleMouseMove]);

  return { mouseX, mouseY };
};

// Optimized transforms with memoization
export const useOptimizedTransforms = (mouseX, mouseY) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  return {
    bigX: useTransform(mouseX, [0, windowWidth], [20, -20]),
    bigY: useTransform(mouseY, [0, windowHeight], [10, -10]),
    smallX: useTransform(mouseX, [0, windowWidth], [-15, 15]),
    smallY: useTransform(mouseY, [0, windowHeight], [-8, 8])
  };
};
