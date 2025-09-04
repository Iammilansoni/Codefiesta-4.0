import React, { useState } from "react";
import ConfettiFireworks from "../components/magicui/ConfettiFireworks";

const TiltCard = () => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Enhanced tilt calculation for smooth movement in all directions
    const rotateY = ((x - centerX) / centerX) * 12; // Reduced intensity for smoother effect
    const rotateX = -((y - centerY) / centerY) * 12; // Negative for natural tilt

    setRotate({ x: rotateX, y: rotateY });

    // Shine effect follows mouse more precisely
    const shineX = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;
    setShinePos({ x: shineX, y: shineY });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setShinePos({ x: 50, y: 50 });
    setIsHovered(false);
  };

  return (
    <div
            

        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          background: `
            radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, 
              rgba(255,255,255,${isHovered ? 0.4 : 0.1}) 0%, 
              rgba(255,255,255,0) 50%),
            linear-gradient(135deg, 
              #0a0a0f 0%, 
              #1a1a2e 25%, 
              #16213e 50%, 
              #0f3460 75%, 
              #533483 100%),
            linear-gradient(45deg, 
              transparent 30%, 
              rgba(255,255,255,0.02) 50%, 
              transparent 70%)
          `,
          border: isHovered
            ? "1px solid rgba(139, 92, 246, 0.8)"
            : "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: isHovered
            ? `0 25px 50px rgba(139, 92, 246, 0.3),
               0 15px 35px rgba(0, 0, 0, 0.4),
               inset 0 1px 0 rgba(255, 255, 255, 0.1)`
            : `0 15px 35px rgba(0, 0, 0, 0.3),
               0 5px 15px rgba(0, 0, 0, 0.2),
               inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
          transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
        className="w-[420px] h-[260px] rounded-2xl cursor-pointer flex items-center justify-center text-white relative overflow-hidden backdrop-blur-sm"
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              transform: `translate(${shinePos.x * 0.1}px, ${shinePos.y * 0.1}px)`,
              transition: 'transform 0.3s ease'
            }}
          />
        </div>

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.2,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}

        {/* Glowing orb effect */}
        <div
          className="absolute w-32 h-32 rounded-full opacity-20 blur-xl"
          style={{
            background: `radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)`,
            left: `${shinePos.x - 16}%`,
            top: `${shinePos.y - 16}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease',
          }}
        />

        {/* Main content */}
        <div className="flex items-center space-x-6 z-10 relative">
          {/* Currency symbol with glow */}
          <div className="relative">
            <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-violet-300 via-purple-300 to-indigo-300 drop-shadow-2xl">
              ₹
            </div>
            {isHovered && (
              <div className="absolute inset-0 text-7xl font-bold text-violet-300 blur-sm opacity-50 animate-pulse">
                ₹
              </div>
            )}
          </div>

          {/* Amount with enhanced typography */}
          <div className="text-right">
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-violet-200 tracking-tight leading-none">
              7,00,000
            </div>
            <div className="text-sm text-gray-300 mt-1 tracking-widest uppercase opacity-80">
              Seven Lakhs
            </div>
          </div>
        </div>

        {/* Premium border glow */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-50"
          style={{
            background: `linear-gradient(135deg, transparent 30%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)`,
            transform: `rotate(${rotate.y * 0.5}deg)`,
            transition: 'transform 0.3s ease'
          }}
        />

        {/* Corner highlights */}
        <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-violet-400 opacity-30 rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-violet-400 opacity-30 rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-violet-400 opacity-30 rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-violet-400 opacity-30 rounded-br-lg" />
      </div>
  );
};

export default TiltCard;