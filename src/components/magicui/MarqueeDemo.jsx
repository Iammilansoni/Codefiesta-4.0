import React from "react";
import { Marquee } from "@magic-ui/react";
import { ReviewCard } from "./ReviewCard";

const reviews = [
  { name: "Jack", username: "@jack", body: "Amazing!", img: "https://avatar.vercel.sh/jack" },
  { name: "Jill", username: "@jill", body: "Speechless!", img: "https://avatar.vercel.sh/jill" },
  { name: "John", username: "@john", body: "I love it!", img: "https://avatar.vercel.sh/john" },
  { name: "Jane", username: "@jane", body: "So cool!", img: "https://avatar.vercel.sh/jane" },
  { name: "Jenny", username: "@jenny", body: "Fantastic!", img: "https://avatar.vercel.sh/jenny" },
  { name: "James", username: "@james", body: "Mind-blowing!", img: "https://avatar.vercel.sh/james" },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-6">
      {/* Top row */}
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>

      {/* Bottom row */}
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>

      {/* Optional gradient fade on sides */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
