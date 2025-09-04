import React from 'react';

// Utility function to merge class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Function to repeat children multiple times
const repeatChildren = (children, times = 3) => {
  let repeated = [];
  for (let i = 0; i < times; i++) {
    repeated = repeated.concat(children);
  }
  return repeated;
};

// Marquee component
const Marquee = ({ 
  children, 
  pauseOnHover = false, 
  vertical = false, 
  reverse = false, 
  className = '',
  repeat = 6, // Increased default repeat for seamless effect
  duration = 20, // duration in seconds for animation
  ...props 
}) => {
  const marqueeClass = cn(
    'flex',
    vertical ? 'flex-col animate-marquee-vertical' : 'animate-marquee',
    reverse && (vertical ? 'animate-marquee-vertical-reverse' : 'animate-marquee-reverse'),
    pauseOnHover && 'hover:[animation-play-state:paused]',
    className
  );

  return (
    <div className={cn('overflow-hidden', vertical ? 'h-full' : 'w-full')} {...props}>
      <div className={marqueeClass} style={{ '--duration': `${duration}s` }}>
        {repeatChildren(children, repeat)}
      </div>
    </div>
  );
};

// Sample reviews data
const reviews = [
  { name: "Jack", username: "@jack", body: "I've never seen anything like this before. It's amazing. I love it.", img: "https://ik.imagekit.io/rcfcr7y0e/teamimages.jpg?updatedAt=1756833882794" },
  { name: "Jill", username: "@jill", body: "I don't know what to say. I'm speechless. This is amazing.", img: "https://ik.imagekit.io/rcfcr7y0e/teamimages.jpg?updatedAt=1756833882794" },
  { name: "John", username: "@john", body: "I'm at a loss for words. This is amazing. I love it.", img: "https://ik.imagekit.io/rcfcr7y0e/teamimages.jpg?updatedAt=1756833882794" },
  { name: "Jane", username: "@jane", body: "This is the best thing I've ever seen. I can't believe it.", img: "https://ik.imagekit.io/rcfcr7y0e/teamimages.jpg?updatedAt=1756833882794" },
  { name: "Bob", username: "@bob", body: "I'm blown away by this. It's incredible.", img: "https://ik.imagekit.io/rcfcr7y0e/teamimages.jpg?updatedAt=1756833882794" },
  { name: "Alice", username: "@alice", body: "This exceeded all my expectations. Fantastic work!", img: "https://ik.imagekit.io/rcfcr7y0e/teamimages.jpg?updatedAt=1756833882794" },
];

// Split reviews into rows with more content
const firstRow = reviews.slice(0, 3);
const secondRow = reviews.slice(3, 6);
const thirdRow = reviews.slice(0, 3);
const fourthRow = reviews.slice(3, 6);

// Hackathon Card
const HackathonCard = ({ img, name, description }) => {
  return (
    <div className="relative w-64 cursor-pointer overflow-hidden rounded-lg bg-purple-800 shadow-md hover:shadow-lg transition-shadow duration-300 mb-4 flex-shrink-0">
      <div className="aspect-video w-full overflow-hidden">
        <img className="w-full h-full object-cover" alt={name} src={img} />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-300 mb-1">{name}</h3>
        <p className="text-sm text-neutral-300">{description}</p>
      </div>
    </div>
  );
};

// Marquee3D component
export default function Marquee3D() {
  return (
    <div className="relative  flex h-[100vh]  -mr-16 w-[72vw] flex-row items-center justify-center gap-4 overflow-hidden ">
      <style jsx>{`
        @keyframes marquee-vertical {
          0% { 
            transform: translateY(0); 
          }
          100% { 
            transform: translateY(-50%); 
          }
        }

        @keyframes marquee-vertical-reverse {
          0% { 
            transform: translateY(-50%); 
          }
          100% { 
            transform: translateY(0); 
          }
        }

        .animate-marquee-vertical {
          animation: marquee-vertical var(--duration, 20s) linear infinite;
        }

        .animate-marquee-vertical-reverse {
          animation: marquee-vertical-reverse var(--duration, 20s) linear infinite;
        }

        [style*="perspective"] {
          perspective: 300px;
        }
      `}</style>

      <div
        className="flex pl-64  bg-red-   flex-row items-center gap-4"
        style={{
          transform: "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
        }}
      >
        <Marquee pauseOnHover vertical repeat={8} duration={30} className="h-full bg-">
          {firstRow.map((project, index) => (
            <HackathonCard key={`first-${project.name}-${index}`} {...project} />
          ))}
        </Marquee>
        
        <Marquee reverse pauseOnHover vertical repeat={8} duration={30} className="h-full">
          {secondRow.map((project, index) => (
            <HackathonCard key={`second-${project.name}-${index}`} {...project} />
          ))}
        </Marquee>
        
        {/* <Marquee pauseOnHover vertical repeat={8} duration={30} className="h-full">
          {thirdRow.map((project, index) => (
            <HackathonCard key={`third-${project.name}-${index}`} {...project} />
            ))}
            </Marquee> */}
        
        <Marquee pauseOnHover vertical repeat={8} duration={30} className="h-full">
          {thirdRow.map((project, index) => (
            <HackathonCard key={`third-${project.name}-${index}`} {...project} />
          ))}
        </Marquee>
        {/* <Marquee reverse pauseOnHover vertical repeat={8} duration={25} className="h-full">
          {fourthRow.map((project, index) => (
            <HackathonCard key={`fourth-${project.name}-${index}`} {...project} />
          ))}
        </Marquee> */}
      </div>
    </div>
  );
}