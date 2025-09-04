import React, { useEffect, useState } from 'react';

const NeonTubelight = () => {
    const [isFlickeringHorizontal, setIsFlickeringHorizontal] = useState(true);
    const [isFlickeringVertical, setIsFlickeringVertical] = useState(true);

    useEffect(() => {
        // Horizontal tube flicker
        const horizontalFlicker = setInterval(() => {
            setIsFlickeringHorizontal(false);
            setTimeout(() => setIsFlickeringHorizontal(true), Math.random() * 80 + 40);
            setTimeout(() => setIsFlickeringHorizontal(false), Math.random() * 150 + 80);
            setTimeout(() => setIsFlickeringHorizontal(true), Math.random() * 120 + 100);
        }, Math.random() * 1000 + 100); // 1.2-3.2 seconds

        // Vertical tube flicker
        const verticalFlicker = setInterval(() => {
            setIsFlickeringVertical(false);
            setTimeout(() => setIsFlickeringVertical(true), Math.random() * 80 + 40);
            setTimeout(() => setIsFlickeringVertical(false), Math.random() * 150 + 80);
            setTimeout(() => setIsFlickeringVertical(true), Math.random() * 120 + 100);
        }, Math.random() * 1000 + 100); // 1.2-3.2 seconds

        return () => {
            clearInterval(horizontalFlicker);
            clearInterval(verticalFlicker);
        };
    }, []);

    return (
        <>
            <style>
                {`
          @keyframes pulse-slow {
            0%, 100% {
              filter: brightness(100%);
            }
            50% {
              filter: brightness(115%);
            }
          }
          .animate-pulse-slow {
            animation: pulse-slow 2.5s ease-in-out infinite;
          }
        `}
            </style>
            <div className="relative h-[100vh] w-full flex items-center justify-center">
                {/* Horizontal Tube */}
                <div
                    className={`absolute top-10 h-1 w-[90vw] rounded-full bg-gradient-to-r from-pink-600 via-pink-500 to-blue-600
            ${isFlickeringHorizontal ? 'opacity-80' : 'opacity-15'}
            transition-opacity duration-50
            shadow-[0_0_15px_5px_rgba(236,72,153,1),0_0_30px_10px_rgba(59,130,246,0.8)]
            animate-pulse-slow`}
                >
                    <div
                        className={`absolute inset-0 h-full w-full rounded-full bg-gradient-to-r from-pink-300 to-blue-300
              ${isFlickeringHorizontal ? 'opacity-60' : 'opacity-10'}
              transition-opacity duration-50 blur-sm`}
                    ></div>
                </div>
                {/* Vertical Tube */}
                {/* <div
                    className={`absolute left-10 w-1 h-[80vh] rounded-full bg-gradient-to-b from-pink-600 via-pink-500 to-blue-600
            ${isFlickeringVertical ? 'opacity-80' : 'opacity-15'}
            transition-opacity duration-50
            shadow-[0_0_15px_5px_rgba(236,72,153,1),0_0_30px_10px_rgba(59,130,246,0.8)]
            animate-pulse-slow`}
                >
                    <div
                        className={`absolute inset-0 h-full w-full rounded-full bg-gradient-to-b from-pink-300 to-blue-300
              ${isFlickeringVertical ? 'opacity-60' : 'opacity-10'}
              transition-opacity duration-50 blur-sm`}
                    ></div>
                </div>

                <div
                    className={`absolute left-10 w-1 h-[80vh] rounded-full bg-gradient-to-b from-pink-600 via-pink-500 to-blue-600
            ${isFlickeringVertical ? 'opacity-80' : 'opacity-15'}
            transition-opacity duration-50
            shadow-[0_0_15px_5px_rgba(236,72,153,1),0_0_30px_10px_rgba(59,130,246,0.8)]
            animate-pulse-slow`}
                >
                    <div
                        className={`absolute inset-0 h-full w-full rounded-full bg-gradient-to-b from-pink-300 to-blue-300
              ${isFlickeringVertical ? 'opacity-60' : 'opacity-10'}
              transition-opacity duration-50 blur-sm`}
                    ></div>
                </div> */}

            </div>
        </>
    );
};

export default NeonTubelight;