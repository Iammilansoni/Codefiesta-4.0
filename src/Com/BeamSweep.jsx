import React from "react";

const BeamSweep = () => {
  const svgStyles = {
    width: "100%",
    height: "auto",
  };

  const beamLineStyles = {
    stroke: "url(#beamGradient)",
    strokeWidth: 3,
    fill: "none",
    strokeDasharray: 500,
    strokeDashoffset: 500,
    animation: "beamSweep 3s linear infinite",
  };

  return (
    <div style={{ width: "200px", display: "flex", justifyContent: "center" }}>
      <svg viewBox="0 0 236 68" xmlns="http://www.w3.org/2000/svg" style={svgStyles}>
        <path
          className="beam-line"
          d="M0.5 0.5H89C90.6569 0.5 92 1.84315 92 3.5V29C92 30.6569 93.3431 32 95 32H148.5C150.157 32 151.5 33.3431 151.5 35V64C151.5 65.6569 152.843 67 154.5 67H235.5"
          style={beamLineStyles}
        />
        <defs>
          <linearGradient id="beamGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="236" y2="0">
            <stop stopColor="#2EB9DF" stopOpacity="0"></stop>
            <stop offset="0.25" stopColor="#2EB9DF" stopOpacity="1"></stop>
            <stop offset="0.75" stopColor="#9E00FF" stopOpacity="1"></stop>
            <stop offset="1" stopColor="#9E00FF" stopOpacity="0"></stop>
          </linearGradient>
        </defs>
      </svg>

      {/* Keyframes for the animation */}
      <style>
        {`
          @keyframes beamSweep {
            0% {
              stroke-dashoffset: 500;
            }
            40% {
              stroke-dashoffset: 0;
            }
            60% {
              stroke-dashoffset: -500;
            }
            100% {
              stroke-dashoffset: -500;
            }
          }
        `}
      </style>
    </div>
  );
};

export default BeamSweep;
