import React, { memo } from "react";
import { useOptimizedCountdown } from "../hooks/useOptimizedCountdown";

const CountdownTimer = memo(({ targetDate = "2025-09-10T00:00:00" }) => {
  const timeLeft = useOptimizedCountdown(targetDate, 1000);

  return (
    <div className="text-center w-fit">
      <div className="flex justify-center items-center gap-1 xs:gap-2 sm:gap-3 md:gap-4">
        <TimeBox label="Days" value={timeLeft.days} />
        <Colon />
        <TimeBox label="Hours" value={timeLeft.hours} />
        <Colon />
        <TimeBox label="Minutes" value={timeLeft.minutes} />
        <Colon />
        <TimeBox label="Seconds" value={timeLeft.seconds} />
      </div>
    </div>
  );
});

const TimeBox = memo(({ label, value }) => (
  <div className="text-center px-1 xs:px-2 sm:px-3 md:px-4">
    <div className="text-gray-300 text-xs xs:text-sm sm:text-base md:text-lg mb-1 xs:mb-2">{label}</div>
    <div className="font-bold text-gray-300 text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
      {value}
    </div>
  </div>
));

const Colon = memo(() => (
  <div className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2 xs:mt-3 sm:mt-4 md:mt-5 font-bold text-gray-300">
    :
  </div>
));

CountdownTimer.displayName = 'CountdownTimer';
TimeBox.displayName = 'TimeBox';
Colon.displayName = 'Colon';

export default CountdownTimer;
