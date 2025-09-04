import { useState, useEffect, useRef, useCallback } from "react";

// Helper function moved outside component to avoid hoisting issues
const getTimeLeft = (target) => {
  const targetTime = new Date(target).getTime();
  const now = Date.now();
  const diff = targetTime - now;

  if (diff <= 0) {
    return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
};

// Optimized countdown timer with efficient updates
export const useOptimizedCountdown = (targetDate, updateInterval = 1000) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));
  const intervalRef = useRef(null);
  const lastUpdate = useRef(Date.now());

  const updateTimer = useCallback(() => {
    const now = Date.now();
    
    // Only update if enough time has passed
    if (now - lastUpdate.current >= updateInterval) {
      setTimeLeft(getTimeLeft(targetDate));
      lastUpdate.current = now;
    }
  }, [targetDate, updateInterval]);

  useEffect(() => {
    // Use setInterval instead of RAF for timer (more efficient)
    intervalRef.current = setInterval(updateTimer, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateTimer, updateInterval]);

  return timeLeft;
};
