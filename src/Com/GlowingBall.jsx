import React, { memo, useMemo, useRef, useEffect } from "react";

const GlowingBall = memo(({ gradientColors }) => {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = React.useState(false);

  // Intersection observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Memoize styles to prevent recalculation
  const ballStyles = useMemo(() => {
    const shadowColor = gradientColors
      .split(",")
      .pop()
      .replace(")", ",0.8)");
    
    return {
      background: gradientColors,
      boxShadow: `0 0 200px 100px ${shadowColor}`,
      filter: "blur(40px)",
    };
  }, [gradientColors]);

  return (
    <div 
      ref={containerRef}
      className="relative w-[200px] sm:w-[400px] md:w-[600px] lg:w-[780px] h-[200px] sm:h-[400px] md:h-[600px] lg:h-[780px]"
    >
      <style>
        {`
          @keyframes revolve {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Orbit Container - only animate when in view */}
      <div
        className={`absolute w-full h-full rounded-full ${isInView ? 'animate-spin' : ''}`}
        style={{
          animationDuration: isInView ? '10s' : '0s',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'linear',
          transformOrigin: "center",
          willChange: isInView ? 'transform' : 'auto',
        }}
      >
        {/* Offset Ball */}
        <div
          className="absolute md:w-[500px] md:h-[500px] sm:w-[300px] sm:h-[300px] w-[150px] h-[150px] rounded-full"
          style={{
            left: "50%",
            top: "70%",
            transform: "translate(-50%, -50%)",
            ...ballStyles,
          }}
        />
      </div>
    </div>
  );
});

GlowingBall.displayName = 'GlowingBall';

export default GlowingBall;
