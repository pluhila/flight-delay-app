import React from "react";

function PlaneLogo({ style = {} }) {
  return (
    <svg
      width="70"
      height="70"
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <g>
        <circle cx="35" cy="35" r="34" fill="#1976d2" />
        <g>
          {/* Fuselage */}
          <rect x="32" y="15" width="6" height="32" rx="3" fill="#fff" />
          {/* Nose */}
          <ellipse cx="35" cy="15" rx="3" ry="4" fill="#fff" />
          {/* Left wing */}
          <polygon
            points="35,32 15,40 17,44 35,36"
            fill="#fff"
            stroke="#fff"
            strokeWidth="1.5"
          />
          {/* Right wing */}
          <polygon
            points="35,32 55,40 53,44 35,36"
            fill="#fff"
            stroke="#fff"
            strokeWidth="1.5"
          />
          {/* Tail */}
          <rect
            x="33.5"
            y="47"
            width="3"
            height="10"
            rx="1.2"
            fill="#fff"
          />
          {/* Tail wings */}
          <rect
            x="28"
            y="54"
            width="14"
            height="3"
            rx="1.5"
            fill="#fff"
            stroke="#fff"
            strokeWidth="1"
          />
        </g>
      </g>
    </svg>
  );
}

export default PlaneLogo;
