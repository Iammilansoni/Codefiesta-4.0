import React, { useState } from "react";

const HackathonAboutCard = () => {
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
    const rotateY = ((x - centerX) / centerX) * 12;
    const rotateX = -((y - centerY) / centerY) * 12;

    setRotate({ x: rotateX, y: rotateY });

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
    <div className="h-screen w-full mt-4 border-x-2 border-neutral-600 relative overflow-hidden">
      {/* Background with matte finish */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-neutral-900" />
      
      {/* Colorful ambient background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 15% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 85% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 70% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 30% 70%, rgba(99, 102, 241, 0.2) 0%, transparent 40%)
          `
        }}
      />

      {/* Animated title section */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="text-center">
          <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4 animate-pulse">
            About Hackathon
          </h2>
          <div className="w-48 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full animate-pulse" />
        </div>
      </div>

      {/* Main card container */}
      <div className="absolute inset-0 flex items-center justify-center pt-20">
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            background: `
              radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, 
                rgba(255,255,255,${isHovered ? 0.3 : 0.1}) 0%, 
                rgba(255,255,255,0) 60%),
              linear-gradient(135deg, 
                rgba(15, 23, 42, 0.95) 0%, 
                rgba(30, 41, 59, 0.9) 25%, 
                rgba(51, 65, 85, 0.9) 50%, 
                rgba(30, 41, 59, 0.95) 75%, 
                rgba(15, 23, 42, 0.95) 100%),
              linear-gradient(45deg, 
                transparent 30%, 
                rgba(59, 130, 246, 0.05) 40%,
                rgba(147, 51, 234, 0.05) 50%,
                rgba(236, 72, 153, 0.05) 60%,
                transparent 70%)
            `,
            border: isHovered
              ? "2px solid rgba(59, 130, 246, 0.8)"
              : "2px solid rgba(100, 116, 139, 0.3)",
            boxShadow: isHovered
              ? `0 25px 50px rgba(59, 130, 246, 0.4),
                 0 15px 35px rgba(147, 51, 234, 0.3),
                 0 5px 15px rgba(236, 72, 153, 0.2),
                 inset 0 1px 0 rgba(255, 255, 255, 0.1)`
              : `0 15px 35px rgba(0, 0, 0, 0.4),
                 0 5px 15px rgba(0, 0, 0, 0.2),
                 inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
            transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
          className="w-[65vw] h-[60vh] max-w-4xl rounded-3xl cursor-pointer flex flex-col items-center justify-center text-white relative overflow-hidden backdrop-blur-sm"
        >
          {/* Colorful floating stars */}
          {[...Array(25)].map((_, i) => {
            const colors = ['#3b82f6', '#9333ea', '#ec4899', '#6366f1', '#8b5cf6'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            return (
              <div
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  backgroundColor: randomColor,
                  width: `${Math.random() * 4 + 2}px`,
                  height: `${Math.random() * 4 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.6 + 0.3,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 2 + 2}s`,
                  filter: 'blur(0.5px)',
                }}
              />
            );
          })}

          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-15">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(147, 51, 234, 0.2) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px',
                transform: `translate(${shinePos.x * 0.1}px, ${shinePos.y * 0.1}px)`,
                transition: 'transform 0.3s ease'
              }}
            />
          </div>

          {/* Glowing orb effect with colors */}
          <div
            className="absolute w-40 h-40 rounded-full opacity-25 blur-2xl"
            style={{
              background: `
                radial-gradient(circle, 
                  rgba(59, 130, 246, 0.6) 0%, 
                  rgba(147, 51, 234, 0.4) 30%,
                  rgba(236, 72, 153, 0.3) 60%,
                  transparent 80%)
              `,
              left: `${shinePos.x - 20}%`,
              top: `${shinePos.y - 20}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.3s ease',
            }}
          />

          {/* Main content */}
          <div className="text-center z-10 relative px-8">
            <h3 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Innovation Unleashed
            </h3>
            
            <p className="text-xl leading-relaxed text-gray-200 mb-8 max-w-3xl">
              Join the ultimate coding challenge where brilliant minds converge to create 
              groundbreaking solutions. Experience 48 hours of pure innovation, collaboration, 
              and technological excellence.
            </p>
            
            <div className="grid grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  48h
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">
                  Duration
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                  500+
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">
                  Participants
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                  ₹10L+
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">
                  Prize Pool
                </div>
              </div>
            </div>
          </div>

          {/* Premium border glow with colors */}
          <div 
            className="absolute inset-0 rounded-3xl opacity-60"
            style={{
              background: `linear-gradient(135deg, 
                transparent 20%, 
                rgba(59, 130, 246, 0.1) 40%,
                rgba(147, 51, 234, 0.1) 60%,
                rgba(236, 72, 153, 0.1) 80%,
                transparent 100%)`,
              transform: `rotate(${rotate.y * 0.3}deg)`,
              transition: 'transform 0.3s ease'
            }}
          />

          {/* Colorful corner highlights */}
          <div className="absolute top-3 left-3 w-12 h-12 border-l-2 border-t-2 border-blue-400 opacity-40 rounded-tl-2xl" />
          <div className="absolute top-3 right-3 w-12 h-12 border-r-2 border-t-2 border-purple-400 opacity-40 rounded-tr-2xl" />
          <div className="absolute bottom-3 left-3 w-12 h-12 border-l-2 border-b-2 border-purple-400 opacity-40 rounded-bl-2xl" />
          <div className="absolute bottom-3 right-3 w-12 h-12 border-r-2 border-b-2 border-pink-400 opacity-40 rounded-br-2xl" />
        </div>
      </div>
    </div>
  );
};

export default HackathonAboutCard;