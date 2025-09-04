import React, { useState, useEffect, useRef, memo, useMemo } from 'react';

const chars = "-_~`!@#$%^&*()+=[]{}|;:,.<>?";

const TextEncrypted = memo(({ text, interval = 80, pause = 1000 }) => {
  const [outputText, setOutputText] = useState("");
  const [direction, setDirection] = useState("forward"); 
  const [isMounted, setIsMounted] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const startAnimation = () => {
      clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setOutputText((prev) => {
          if (direction === "forward") {
            if (prev.length < text.length) {
              return prev + text[prev.length];
            } else {
              clearInterval(timerRef.current);
              setTimeout(() => setDirection("backward"), pause);
              return prev;
            }
          } else {
            if (prev.length > 0) {
              return prev.slice(0, -1);
            } else {
              clearInterval(timerRef.current);
              setTimeout(() => setDirection("forward"), pause);
              return prev;
            }
          }
        });
      }, interval);
    };

    startAnimation();

    return () => clearInterval(timerRef.current);
  }, [direction, isMounted, interval, pause, text]);

  // Memoize the remainder calculation for performance
  const remainder = useMemo(() => {
    return outputText.length < text.length
      ? text
          .slice(outputText.length)
          .split("")
          .map(() => chars[Math.floor(Math.random() * chars.length)])
          .join("")
      : "";
  }, [outputText.length, text]);

  return (
    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white font-loadfont transition-all duration-300 ease-in-out">
      {outputText}
      <span className="opacity-90">{remainder}</span>
    </span>
  );
});

TextEncrypted.displayName = 'TextEncrypted';

const Loading = memo(() => {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-[#010138] via-[#000825] to-[#010138] flex items-center justify-center">
      <div className="text-center space-y-4">
        <TextEncrypted text="Codefiesta 4.0" interval={70} pause={400} />
        
        {/* Simple loading dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-white rounded-full animate-pulse"
              style={{
                animationDelay: `${index * 200}ms`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

Loading.displayName = 'Loading';

export default Loading;
