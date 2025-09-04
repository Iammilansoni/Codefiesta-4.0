import React, { useEffect, useState, useRef, memo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useMotionValue, useSpring } from 'framer-motion';

const MouseFollowHighlight = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [clickEffect, setClickEffect] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [trailingStars, setTrailingStars] = useState([]);
  const [hasMouseMoved, setHasMouseMoved] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorRef = useRef(null);
  const starIdRef = useRef(0);

  // Smooth spring animations for better performance - FAST settings
  const springConfig = { damping: 15, stiffness: 300, mass: 0.05 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Secondary cursor for trailing effect - slightly slower but still fast
  const trailX = useSpring(mouseX, { damping: 20, stiffness: 200, mass: 0.08 });
  const trailY = useSpring(mouseY, { damping: 20, stiffness: 200, mass: 0.08 });

  // Detect if device supports touch
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  useEffect(() => {
    let rafId;

    const updateMousePosition = (e) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const newX = e.clientX;
        const newY = e.clientY;

        // Update mouse position
        mouseX.set(newX);
        mouseY.set(newY);

        // Mark that mouse has moved for the first time
        if (!hasMouseMoved) {
          setHasMouseMoved(true);
        }

        // Only create trailing stars after mouse has moved and is visible
        if (hasMouseMoved && isVisible && Math.random() < 0.4) { // 40% chance to create a star
          const starTypes = ['✦', '✧', '⭐', '✨', '⋆', '✩'];
          const colors = [
            'rgba(139, 92, 246, 1)', // Purple
            'rgba(59, 130, 246, 1)',  // Blue
            'rgba(147, 51, 234, 1)',  // Purple variant
            'rgba(79, 70, 229, 1)',   // Indigo
            'rgba(255, 255, 255, 0.9)', // White
          ];
          
          const newStar = {
            id: starIdRef.current++,
            x: newX + (Math.random() - 0.5) * 30, // Wider spread
            y: newY + (Math.random() - 0.5) * 30,
            size: Math.random() * 4 + 2, // Random size between 2-6px
            life: 1, // Start with full opacity
            decay: Math.random() * 0.015 + 0.008, // Slower decay for longer trails
            color: colors[Math.floor(Math.random() * colors.length)],
            twinkle: Math.random() * 360, // Random rotation for twinkling
            type: starTypes[Math.floor(Math.random() * starTypes.length)],
            drift: (Math.random() - 0.5) * 2, // Random horizontal drift
          };

          setTrailingStars(prev => {
            // Add new star and remove old ones (keep max 20 stars for longer trail)
            const updated = [...prev, newStar].slice(-20);
            return updated;
          });
        }

        if (!isVisible) {
          setIsVisible(true);
        }
      });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Click effect handler
    const handleClick = (e) => {
      setClickPosition({ x: e.clientX, y: e.clientY });
      setClickEffect(true);
      setTimeout(() => setClickEffect(false), 1000);
      
      // Create burst of stars on click - only if mouse has moved
      if (hasMouseMoved) {
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const distance = Math.random() * 50 + 20;
          const burstStar = {
            id: starIdRef.current++,
            x: e.clientX + Math.cos(angle) * distance,
            y: e.clientY + Math.sin(angle) * distance,
            size: Math.random() * 3 + 2,
            life: 1,
            decay: 0.02,
            color: 'rgba(255, 255, 255, 1)',
            twinkle: Math.random() * 360,
            type: '✨',
            drift: Math.cos(angle) * 2,
          };
          
          setTrailingStars(prev => [...prev, burstStar]);
        }
      }
    };

    // Enhanced hover detection for interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = target.closest('button, a, input, textarea, select, [role="button"], [tabindex], .cursor-pointer, .interactive');
      
      if (isInteractive) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // Touch event handlers for mobile/tablet
    const handleTouchStart = (e) => {
      if (!hasMouseMoved) {
        setHasMouseMoved(true);
      }
      
      // Create sparkles at touch point
      const touch = e.touches[0];
      createSparklesAtPoint(touch.clientX, touch.clientY);
      
      // Don't show cursor glow on touch devices
      setIsVisible(false);
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const currentTime = Date.now();
      
      // Throttle touch events to every 100ms to not interfere with scrolling
      if (currentTime - lastTouchTime < 100) {
        return;
      }
      
      setLastTouchTime(currentTime);
      
      // Create trailing stars on touch move with lower probability to reduce performance impact
      if (hasMouseMoved && Math.random() < 0.3) { // Reduced from 0.6 to 0.3
        const starTypes = ['✦', '✧', '⭐', '✨', '⋆', '✩'];
        const colors = [
          'rgba(139, 92, 246, 1)', // Purple
          'rgba(59, 130, 246, 1)',  // Blue
          'rgba(147, 51, 234, 1)',  // Purple variant
          'rgba(79, 70, 229, 1)',   // Indigo
          'rgba(255, 255, 255, 0.9)', // White
        ];

        const newStar = {
          id: starIdRef.current++,
          x: touch.clientX + (Math.random() - 0.5) * 30,
          y: touch.clientY + (Math.random() - 0.5) * 30,
          size: Math.random() * 4 + 2,
          life: 1,
          decay: Math.random() * 0.015 + 0.008,
          color: colors[Math.floor(Math.random() * colors.length)],
          twinkle: Math.random() * 360,
          type: starTypes[Math.floor(Math.random() * starTypes.length)],
          drift: (Math.random() - 0.5) * 2,
        };

        setTrailingStars(prev => [...prev, newStar].slice(-15)); // Reduced from 20 to 15
      }
      
      // Keep cursor hidden on touch devices
      setIsVisible(false);
    };

    // Function to create sparkles at a specific point
    const createSparklesAtPoint = (x, y) => {
      for (let i = 0; i < 6; i++) { // Reduced from 12 to 6 sparkles
        const angle = (i / 6) * Math.PI * 2;
        const distance = Math.random() * 30 + 10; // Reduced distance
        const sparkle = {
          id: starIdRef.current++,
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance,
          size: Math.random() * 2 + 1, // Reduced size
          life: 1,
          decay: 0.04, // Faster decay for better performance
          color: 'rgba(255, 255, 255, 1)',
          twinkle: Math.random() * 360,
          type: '✨',
          drift: Math.cos(angle) * 1,
        };
        
        setTrailingStars(prev => [...prev, sparkle]);
      }
    };

    // Event listeners
    document.addEventListener('mousemove', updateMousePosition, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });
    
    // Touch event listeners for mobile/tablet - using passive for better scrolling
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', () => {
      // Clean up any pending touch interactions
      setIsVisible(false);
    }, { passive: true });

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', () => {});
    };
  }, [mouseX, mouseY, isVisible, hasMouseMoved, lastTouchTime]);

  // Animate trailing stars
  useEffect(() => {
    if (trailingStars.length === 0) return;

    const animateStars = () => {
      setTrailingStars(prev => 
        prev.map(star => ({
          ...star,
          life: star.life - star.decay,
          x: star.x + star.drift * 0.5, // Apply horizontal drift
          y: star.y - 1, // Stars float upward
          twinkle: star.twinkle + 1, // Reduced from 3 to 1 for much slower rotation
        })).filter(star => star.life > 0) // Remove faded stars
      );
    };

    const interval = setInterval(animateStars, 32); // Reduced from ~60fps to ~30fps for better performance
    return () => clearInterval(interval);
  }, [trailingStars.length]);

  if (!isVisible || isTouchDevice) return (
    <>
      {/* Trailing Stars - always show these */}
      {trailingStars.map((star) => (
        <motion.div
          key={star.id}
          className="pointer-events-none fixed z-[9994]"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: star.life,
            rotate: star.twinkle 
          }}
          transition={{
            scale: { duration: 0.2 },
            opacity: { duration: 0.1 },
            rotate: { duration: 0.3, ease: "easeInOut" }
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              color: star.color,
              fontSize: star.size,
              textShadow: `0 0 ${star.size * 2}px ${star.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {star.type}
          </div>
        </motion.div>
      ))}
    </>
  );

  return (
    <>
      {/* Main cursor glow */}
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed z-[9999] mix-blend-screen"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isVisible ? 0.8 : 0,
        }}
        transition={{
          scale: { duration: 0.1, ease: "easeOut" },
          opacity: { duration: 0.15 }
        }}
      >
        {/* Primary glow */}
        <div
          className="rounded-full w-6 h-6 sm:w-8 sm:h-8"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.9) 0%, rgba(59, 130, 246, 0.7) 25%, rgba(147, 51, 234, 0.5) 50%, rgba(79, 70, 229, 0.3) 75%, transparent 100%)',
            filter: 'blur(8px)',
            animation: 'pulse 1s ease-in-out infinite alternate',
          }}
        />
        
        {/* Inner core with hackathon theme */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-1.5 h-1.5 sm:w-2 sm:h-2"
          style={{
            background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.9), rgba(139, 92, 246, 0.8))',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.9), 0 0 30px rgba(59, 130, 246, 0.6)',
          }}
        />
      </motion.div>

      {/* Trail cursor */}
      <motion.div
        className="pointer-events-none fixed z-[9998] mix-blend-screen"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 2 : 1.2,
          opacity: isVisible ? 0.4 : 0,
        }}
        transition={{
          scale: { duration: 0.15, ease: "easeOut" },
          opacity: { duration: 0.2 }
        }}
      >
        {/* Trail glow */}
        <div
          className="rounded-full w-8 h-8 sm:w-12 sm:h-12"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(59, 130, 246, 0.3) 30%, rgba(147, 51, 234, 0.2) 60%, rgba(79, 70, 229, 0.1) 80%, transparent 100%)',
            filter: 'blur(15px)',
            animation: 'pulse 1.5s ease-in-out infinite alternate',
          }}
        />
      </motion.div>

      {/* Ambient glow when hovering */}
      {isHovering && (
        <motion.div
          className="pointer-events-none fixed z-[9997] mix-blend-screen"
          style={{
            x,
            y,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 3, opacity: 0.2 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div
            className="rounded-full w-16 h-16 sm:w-20 sm:h-20"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 40%, rgba(147, 51, 234, 0.1) 70%, transparent 100%)',
              filter: 'blur(25px)',
            }}
          />
        </motion.div>
      )}

      {/* Click ripple effect */}
      {clickEffect && (
        <motion.div
          className="pointer-events-none fixed z-[9995]"
          style={{
            left: clickPosition.x,
            top: clickPosition.y,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div
            className="rounded-full w-6 h-6 sm:w-8 sm:h-8 border-2"
            style={{
              borderColor: 'rgba(139, 92, 246, 0.6)',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
            }}
          />
        </motion.div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.9;
            filter: hue-rotate(0deg) brightness(1);
          }
          50% {
            transform: scale(1.05);
            opacity: 0.7;
            filter: hue-rotate(15deg) brightness(1.1);
          }
          100% {
            transform: scale(1.1);
            opacity: 0.6;
            filter: hue-rotate(30deg) brightness(1.2);
          }
        }
        
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          25% {
            opacity: 0.5;
            transform: scale(0.5) rotate(90deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
          75% {
            opacity: 0.7;
            transform: scale(1.2) rotate(270deg);
          }
        }

        @keyframes glow-shift {
          0% {
            filter: hue-rotate(0deg) brightness(1) saturate(1);
          }
          33% {
            filter: hue-rotate(120deg) brightness(1.1) saturate(1.2);
          }
          66% {
            filter: hue-rotate(240deg) brightness(1.2) saturate(1.1);
          }
          100% {
            filter: hue-rotate(360deg) brightness(1) saturate(1);
          }
        }

        /* Hide default cursor on interactive elements */
        button, a, input, textarea, select, [role="button"], [tabindex], .cursor-pointer, .interactive {
          cursor: none !important;
        }

        /* Hide default cursor on the entire page for desktop */
        @media (min-width: 768px) {
          * {
            cursor: none !important;
          }
          
          /* Add subtle glow to interactive elements when hovered */
          button:hover, a:hover, .cursor-pointer:hover, .interactive:hover {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3) !important;
            transition: box-shadow 0.3s ease !important;
          }
        }

        /* Mobile responsiveness - show normal cursor on touch devices */
        @media (hover: none) and (pointer: coarse) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
});

MouseFollowHighlight.displayName = 'MouseFollowHighlight';

export default MouseFollowHighlight;
