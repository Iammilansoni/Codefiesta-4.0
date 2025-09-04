import React, { useState, useEffect } from "react";
import { FaCrown } from 'react-icons/fa';

/* --- Modern Prize Showcase Card --- */
const ModernPrizeCard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);
  const TARGET = 700000;
  const cardRef = React.useRef(null);

  // Intersection observer for entrance animation
  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  // Counter animation
  useEffect(() => {
    if (!isVisible) return;
    let start;
    const duration = 2000;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * TARGET));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible]);

  return (
    <div ref={cardRef} className="relative w-full max-w-2xl mx-auto">
      {/* Main Prize Card */}
      <div className={`relative bg-gradient-to-br from-slate-900 via-gray-900 to-black rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-800/50 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 p-[1px]">
          <div className="w-full h-full rounded-3xl bg-gradient-to-br from-slate-900 via-gray-900 to-black" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-6">
          
          {/* Crown Icon */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl scale-150" />
            <FaCrown className="relative text-6xl md:text-7xl text-yellow-400 drop-shadow-lg animate-pulse" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-lg md:text-xl text-gray-300 tracking-[0.3em] uppercase font-light">
              Grand Prize
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto" />
          </div>

          {/* Prize Amount */}
          <div className="space-y-2">
            <div className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
              ₹{count.toLocaleString('en-IN')}
            </div>
            <p className="text-xl md:text-2xl text-gray-300 tracking-[0.2em] uppercase font-light">
              Seven Lakhs
            </p>
          </div>

          {/* Bottom accent */}
          <div className="pt-6">
            <p className="text-sm text-gray-500 tracking-wider uppercase">
              Ultimate Hackathon Champion
            </p>
          </div>
        </div>

        {/* Floating particles */}
        {isVisible && [...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/60 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const PrizesRewardsPage = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header */}
        <div className="text-center py-16 md:py-24">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-4">
            Prizes & Rewards
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 tracking-wide">
            Celebrating Excellence in Innovation
          </p>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mt-6" />
        </div>

        {/* Prize Section */}
        <div className="flex-1 flex items-center justify-center px-4 md:px-8 lg:px-16">
          <ModernPrizeCard />
        </div>
      </div>
    </div>
  );
};

export default PrizesRewardsPage;