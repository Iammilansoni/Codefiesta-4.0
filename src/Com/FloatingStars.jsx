import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Generate stars randomly across the screen
const generateFloatingStars = (count, sizeMin, sizeMax) => {
  const colors = [
    'rgba(255, 255, 255, 0.9)',
    'rgba(173, 216, 230, 0.8)',
    'rgba(255, 182, 193, 0.7)',
    'rgba(144, 238, 144, 0.6)',
    'rgba(255, 255, 224, 0.8)',
    'rgba(221, 160, 221, 0.7)',
  ];

  return Array.from({ length: count }).map(() => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: sizeMin + Math.random() * (sizeMax - sizeMin),
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: 5 + Math.random() * 10,
    delay: Math.random() * 5,
    twinkleSpeed: 2 + Math.random() * 3,
    starType: Math.random() > 0.7 ? 'cross' : 'diamond',
  }));
};

const FloatingStars = ({ count = 120, sizeMin = 1, sizeMax = 4 }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    setStars(generateFloatingStars(count, sizeMin, sizeMax));
    // Re-generate stars on window resize
    const handleResize = () => setStars(generateFloatingStars(count, sizeMin, sizeMax));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [count, sizeMin, sizeMax]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: `${s.size * 3}px`,
            height: `${s.size * 3}px`,
            left: s.x,
            top: s.y,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x: [
              s.x,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              s.x,
            ],
            y: [
              s.y,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              s.y,
            ],
            opacity: [0.3, 1, 0.7, 0.3],
            scale: [0.8, 1.2, 0.9, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1],
          }}
        >
          {/* Star Shape */}
          {s.starType === "cross" ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div
                className="absolute"
                style={{
                  width: `${s.size}px`,
                  height: `${s.size * 4}px`,
                  background: `linear-gradient(to bottom, transparent 0%, ${s.color} 20%, ${s.color} 80%, transparent 100%)`,
                  borderRadius: "50px",
                  filter: `drop-shadow(0 0 ${s.size * 2}px ${s.color}) blur(0.5px)`,
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: s.twinkleSpeed,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute"
                style={{
                  width: `${s.size * 4}px`,
                  height: `${s.size}px`,
                  background: `linear-gradient(to right, transparent 0%, ${s.color} 20%, ${s.color} 80%, transparent 100%)`,
                  borderRadius: "50px",
                  filter: `drop-shadow(0 0 ${s.size * 2}px ${s.color}) blur(0.5px)`,
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: s.twinkleSpeed,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div
                className="abslute"
                style={{
                  width: `${s.size * 2}px`,
                  height: `${s.size * 2}px`,
                  background: s.color,
                  borderRadius: "0",
                  transform: "rotate(45deg)",
                  filter: `drop-shadow(0 0 ${s.size * 3}px ${s.color}) blur(0.3px)`,
                  clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                }}
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: s.twinkleSpeed * 1.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute"
                style={{
                  width: `${s.size * 4}px`,
                  height: `${s.size * 4}px`,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${s.color}20 0%, transparent 70%)`,
                  filter: "blur(2px)",
                }}
                animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.5, 1.5, 0.5] }}
                transition={{
                  duration: s.twinkleSpeed * 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingStars;
