import React, { memo, useMemo, useRef, useEffect } from "react";

const Rightball = memo(({ gradientColors }) => {
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
      willChange: isInView ? 'transform' : 'auto',
    };
  }, [gradientColors, isInView]);

  return (
    <div 
      ref={containerRef}
      className="relative w-[200px] sm:w-[400px] md:w-[600px] lg:w-[780px] h-[200px] sm:h-[400px] md:h-[600px] lg:h-[780px]"
    >
      {/* Rotating Wrapper - only animate when in view */}
      <div
        className={`absolute w-full h-full rounded-full ${isInView ? 'glowing-rotate' : ''}`}
        style={ballStyles}
      />
    </div>
  );
});

Rightball.displayName = 'Rightball';

export default Rightball;
