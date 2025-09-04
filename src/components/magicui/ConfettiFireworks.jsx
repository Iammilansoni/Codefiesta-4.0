import React, { useRef, useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiFireworks() {
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleClick = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const id = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(id);
        intervalRef.current = null;
        return;
      }

      const particleCount = Math.floor(50 * (timeLeft / duration));
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    intervalRef.current = id;
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="px-4 py-2 z-50 rounded bg-indigo-600 text-white hover:bg-indigo-500"
      >
        Trigger Fireworks
      </button>
    </div>
  );
}
