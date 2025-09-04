import * as React from "react";
import { cn } from "@/lib/utils";

export function Marquee({
  className,
  reverse,
  vertical,
  pauseOnHover = false,
  children,
  ...props
}) {
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden",
        vertical ? "flex-col" : "flex-row",
        className
      )}
      style={{ position: 'relative' }}
      {...props}
    >
      <div
        className={cn(
          "flex shrink-0 animate-marquee",
          reverse ? "animate-marquee-reverse" : "",
          vertical ? "flex-col" : "flex-row"
        )}
      >
        {children}
        {children}
      </div>

      <style jsx="true">{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(
              ${vertical ? "0, -50%" : "-50%, 0"},
              0
            );
          }
        }
        .animate-marquee {
          animation: marquee var(--duration, 30s) linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee var(--duration, 30s) linear infinite reverse;
        }
        .group:hover .animate-marquee {
          animation-play-state: ${pauseOnHover ? "paused" : "running"};
        }
      `}</style>
    </div>
  );
}
