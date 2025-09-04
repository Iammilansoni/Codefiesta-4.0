import React from "react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import Marquee3D from "./Marquee3D";
import profilePho from '../../assets/teams/teamimages.jpg'

// Sample reviews data
const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://ik.imagekit.io/rcfcr7y0e/teamimages.jpg?updatedAt=1756833882794",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://ik.imagekit.io/rcfcr7y0e/teamimages.jpg?updatedAt=1756833882794",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://ik.imagekit.io/rcfcr7y0e/teamimages.jpg?updatedAt=1756833882794",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://ik.imagekit.io/rcfcr7y0e/teamimages.jpg?updatedAt=1756833882794",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://ik.imagekit.io/rcfcr7y0e/teamimages.jpg?updatedAt=1756833882794",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://ik.imagekit.io/rcfcr7y0e/teamimages.jpg?updatedAt=1756833882794",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure
      className={cn(
        "relative h-30 w-36 ml-3 cursor-pointer overflow-hidden rounded-xl border shadow-md transition-transform duration-300 hover:scale-105",
        "border-gray-950/[.1] bg-gray-100 dark:border-gray-50/[.1] dark:bg-gray-800"
      )}
    >
      {/* Image section - covers most of the card */}
      <div className="h-3/4 w-full">
        <img
          className="h-full w-full object-cover"
          src={img}
          alt={name}
        />
      </div>
      {/* Bottom section for name and description */}
      <div className="h-1/4 w-full p-3 bg-white dark:bg-gray-900">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
          {name}
        </h3>
      </div>
    </figure>
  );
};

export function ReviewMarquee() {
  // Create conditional scroll props
  const scrollProps = window.innerWidth > 625 ? {
    'data-scroll': true,
    'data-scroll-speed': '-.9'
  } : {};

  return (
    <>
      {window.innerWidth <= 908 ? (
        <div
          {...scrollProps}
          className="relative flex w-full flex-col gap-3 mt-3 items-center justify-center overflow-hidden"
        >
          <Marquee pauseOnHover className="[--duration:20s] flex">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:10s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>
      ) : (
        <div {...scrollProps}>
          <Marquee3D />
        </div>
      )}
    </>
  );
}