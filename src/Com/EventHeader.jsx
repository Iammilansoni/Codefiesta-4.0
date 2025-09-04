import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EventHeader = () => {
  const [hovered, setHovered] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [circlePos, setCirclePos] = useState({ x: 0, y: 0 });

  // Track mouse inside component
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // Smooth follow for circle
  useEffect(() => {
    const smoothFollow = setInterval(() => {
      setCirclePos((prev) => ({
        x: prev.x + (cursor.x - prev.x) * 0.15,
        y: prev.y + (cursor.y - prev.y) * 0.15,
      }));
    }, 16);
    return () => clearInterval(smoothFollow);
  }, [cursor]);

  return (
    <div
    
      className="relative border-t-1 z-50 bg-black   pb-6 border-b-1      overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Glossy background on hover */}
      <motion.div
        className="absolute inset-0 z-0 rounded-xl"
     
      />


      {/* Scrolling text */}
      <div className="flex whitespace-nowrap relative w z-10">
        {/* Duplicate text to create seamless loop */}
        {[...Array(4)].map((_, i) => (
      <motion.h1
  key={i}
  initial={{ x: 0 }}
  animate={{ x: "-100%" }}
  transition={{ ease: "linear", duration: 4, repeat: Infinity }}
  className="md:text-[5vw]  text-[12vw]   font-loadfont leading-none    font-bold uppercase pt-6  text-transparent bg-clip-text 
             bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 px-10"
>
  ABOUT THE <span className="bg-clip-text  font-loadfont text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600">
    CODEFIESTA
  </span>
</motion.h1>
        ))}
      </div>
      
    </div>
  );
};

export default EventHeader;
