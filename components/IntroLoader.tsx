"use client";

import { motion } from "framer-motion";

export default function IntroLoader() {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden"
      style={{ backgroundColor: "#0d0b07" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <style>{`
        @keyframes trunkGrow {
          from { stroke-dashoffset: 120; opacity: 0; }
          to   { stroke-dashoffset: 0;   opacity: 1; }
        }
        @keyframes branchGrow {
          from { stroke-dashoffset: 80; opacity: 0; }
          to   { stroke-dashoffset: 0;  opacity: 1; }
        }
        @keyframes canopyBloom {
          from { transform: scaleY(0) scaleX(0.3); opacity: 0; }
          to   { transform: scaleY(1) scaleX(1);   opacity: 1; }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50%       { transform: rotate(4deg); }
        }
        @keyframes swayL {
          0%, 100% { transform: rotate(0deg); }
          50%       { transform: rotate(-5deg); }
        }
        @keyframes bladeRise {
          from { transform: scaleY(0); opacity: 0; }
          to   { transform: scaleY(1); opacity: 1; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50%       { opacity: 0.9;  }
        }
        @keyframes flyFloat {
          0%   { transform: translate(0px, 0px);    opacity: 0; }
          20%  { opacity: 1; }
          50%  { transform: translate(18px, -14px); opacity: 0.9; }
          80%  { opacity: 0.6; }
          100% { transform: translate(-8px, -28px); opacity: 0; }
        }
        @keyframes moonRise {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes horizonPulse {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.6; }
        }
        @keyframes titleFade {
          from { opacity: 0; letter-spacing: 0.5em; }
          to   { opacity: 0.65; letter-spacing: 0.35em; }
        }

        .safari-trunk {
          stroke-dasharray: 120; stroke-dashoffset: 120;
          animation: trunkGrow 1.1s cubic-bezier(0.16,1,0.3,1) 0.4s forwards;
        }
        .safari-branch-l {
          stroke-dasharray: 80; stroke-dashoffset: 80;
          animation: branchGrow 0.8s ease-out 1.3s forwards; opacity: 0;
        }
        .safari-branch-r {
          stroke-dasharray: 80; stroke-dashoffset: 80;
          animation: branchGrow 0.8s ease-out 1.5s forwards; opacity: 0;
        }
        .safari-branch-m {
          stroke-dasharray: 60; stroke-dashoffset: 60;
          animation: branchGrow 0.6s ease-out 1.7s forwards; opacity: 0;
        }
        .safari-canopy-main {
          transform-origin: 50% 100%; transform: scaleY(0) scaleX(0.3); opacity: 0;
          animation: canopyBloom 0.9s cubic-bezier(0.34,1.56,0.64,1) 1.9s forwards;
        }
        .safari-canopy-left {
          transform-origin: 80% 100%; transform: scaleY(0) scaleX(0.3); opacity: 0;
          animation: canopyBloom 0.8s cubic-bezier(0.34,1.56,0.64,1) 2.1s forwards;
        }
        .safari-canopy-right {
          transform-origin: 20% 100%; transform: scaleY(0) scaleX(0.3); opacity: 0;
          animation: canopyBloom 0.8s cubic-bezier(0.34,1.56,0.64,1) 2.3s forwards;
        }
        .safari-canopy-top {
          transform-origin: 50% 100%; transform: scaleY(0) scaleX(0.3); opacity: 0;
          animation: canopyBloom 0.7s cubic-bezier(0.34,1.56,0.64,1) 2.05s forwards;
        }
        .safari-moon { animation: moonRise 1.2s ease-out 0.3s both; }
        .safari-horizon { animation: horizonPulse 4s ease-in-out 2s infinite; }
        .safari-title {
          animation: titleFade 1.8s ease-out 2.8s both;
          font-family: 'Cormorant Garamond', 'Garamond', Georgia, serif;
          font-weight: 300;
          font-size: 11px;
          fill: #c8a96e;
          letter-spacing: 0.35em;
          text-anchor: middle;
        }

        .safari-g1  { transform-origin: 60px  300px; animation: bladeRise 0.4s ease-out 0.50s both, sway  3.2s ease-in-out 1.2s infinite; }
        .safari-g2  { transform-origin: 67px  300px; animation: bladeRise 0.4s ease-out 0.65s both, swayL 2.9s ease-in-out 1.4s infinite; }
        .safari-g3  { transform-origin: 75px  300px; animation: bladeRise 0.4s ease-out 0.80s both, sway  3.5s ease-in-out 1.1s infinite; }
        .safari-g4  { transform-origin: 52px  300px; animation: bladeRise 0.35s ease-out 0.55s both, swayL 3.1s ease-in-out 1.3s infinite; }
        .safari-g5  { transform-origin: 83px  300px; animation: bladeRise 0.4s ease-out 0.70s both, sway  2.8s ease-in-out 1.6s infinite; }
        .safari-g6  { transform-origin: 44px  300px; animation: bladeRise 0.35s ease-out 0.90s both, swayL 3.3s ease-in-out 1.0s infinite; }
        .safari-g7  { transform-origin: 320px 300px; animation: bladeRise 0.4s ease-out 0.60s both, sway  3.0s ease-in-out 1.5s infinite; }
        .safari-g8  { transform-origin: 328px 300px; animation: bladeRise 0.4s ease-out 0.75s both, swayL 2.7s ease-in-out 1.2s infinite; }
        .safari-g9  { transform-origin: 335px 300px; animation: bladeRise 0.35s ease-out 0.85s both, sway  3.4s ease-in-out 1.7s infinite; }
        .safari-g10 { transform-origin: 314px 300px; animation: bladeRise 0.4s ease-out 0.50s both, swayL 3.2s ease-in-out 1.1s infinite; }
        .safari-g11 { transform-origin: 342px 300px; animation: bladeRise 0.4s ease-out 0.95s both, sway  2.9s ease-in-out 1.4s infinite; }
        .safari-g12 { transform-origin: 307px 300px; animation: bladeRise 0.35s ease-out 1.00s both, swayL 3.1s ease-in-out 1.8s infinite; }

        .safari-s1 { animation: twinkle 4.1s ease-in-out 0.2s infinite; }
        .safari-s2 { animation: twinkle 3.7s ease-in-out 1.1s infinite; }
        .safari-s3 { animation: twinkle 5.0s ease-in-out 0.5s infinite; }
        .safari-s4 { animation: twinkle 4.3s ease-in-out 1.8s infinite; }
        .safari-s5 { animation: twinkle 3.9s ease-in-out 0.8s infinite; }
        .safari-s6 { animation: twinkle 4.7s ease-in-out 2.1s infinite; }
        .safari-s7 { animation: twinkle 3.5s ease-in-out 0.4s infinite; }

        .safari-ff1 { animation: flyFloat 4.5s ease-in-out 3.0s infinite; }
        .safari-ff2 { animation: flyFloat 5.2s ease-in-out 3.8s infinite; }
        .safari-ff3 { animation: flyFloat 3.9s ease-in-out 4.4s infinite; }
      `}</style>

      <svg
        viewBox="0 0 400 420"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        aria-hidden="true"
      >
        <rect width="400" height="420" fill="#0d0b07" />
        <rect y="300" width="400" height="120" fill="#1a1408" />

        <ellipse
          className="safari-horizon"
          cx="200" cy="302" rx="180" ry="18"
          fill="#7a4a10" opacity="0.4"
        />

        <circle className="safari-moon" cx="320" cy="60" r="22" fill="#2a1f0a" />
        <circle className="safari-moon" cx="330" cy="52" r="22" fill="#0d0b07" />
        <circle
          className="safari-moon"
          cx="320" cy="60" r="20"
          fill="none" stroke="#c8a96e" strokeWidth="0.5" opacity="0.5"
        />

        <circle className="safari-s1" cx="42"  cy="38"  r="1"   fill="#c8a96e" />
        <circle className="safari-s2" cx="110" cy="22"  r="1.2" fill="#c8a96e" />
        <circle className="safari-s3" cx="178" cy="55"  r="0.9" fill="#c8a96e" />
        <circle className="safari-s4" cx="248" cy="30"  r="1.1" fill="#c8a96e" />
        <circle className="safari-s5" cx="80"  cy="85"  r="0.8" fill="#c8a96e" />
        <circle className="safari-s6" cx="155" cy="100" r="1"   fill="#c8a96e" />
        <circle className="safari-s7" cx="355" cy="95"  r="0.9" fill="#c8a96e" />

        <path
          d="M0 305 Q60 270 120 290 Q180 270 240 285 Q300 265 360 280 Q390 275 400 278 L400 305 Z"
          fill="#120e06"
        />

        <path
          className="safari-trunk"
          d="M200 300 C200 280 198 250 200 210"
          stroke="#5a3d1a" strokeWidth="3" fill="none" strokeLinecap="round"
        />
        <path
          className="safari-branch-l"
          d="M200 220 C190 215 170 205 150 195"
          stroke="#5a3d1a" strokeWidth="2" fill="none" strokeLinecap="round"
        />
        <path
          className="safari-branch-r"
          d="M200 215 C212 210 230 200 252 192"
          stroke="#5a3d1a" strokeWidth="2" fill="none" strokeLinecap="round"
        />
        <path
          className="safari-branch-m"
          d="M200 210 C200 205 200 195 200 188"
          stroke="#5a3d1a" strokeWidth="1.5" fill="none" strokeLinecap="round"
        />

        <ellipse className="safari-canopy-left"  cx="154" cy="193" rx="36" ry="11" fill="#2a3a1a" />
        <ellipse className="safari-canopy-right" cx="250" cy="190" rx="38" ry="12" fill="#2a3a1a" />
        <ellipse className="safari-canopy-main"  cx="200" cy="185" rx="58" ry="16" fill="#1e2e12" />
        <ellipse className="safari-canopy-top"   cx="200" cy="178" rx="50" ry="10" fill="#324520" />

        <line className="safari-g1"  x1="60"  y1="300" x2="56"  y2="272" stroke="#3d4e1a" strokeWidth="1.5" strokeLinecap="round" />
        <line className="safari-g2"  x1="67"  y1="300" x2="72"  y2="268" stroke="#4a5c20" strokeWidth="1.5" strokeLinecap="round" />
        <line className="safari-g3"  x1="75"  y1="300" x2="70"  y2="275" stroke="#3a4818" strokeWidth="1.5" strokeLinecap="round" />
        <line className="safari-g4"  x1="52"  y1="300" x2="48"  y2="278" stroke="#455520" strokeWidth="1.5" strokeLinecap="round" />
        <line className="safari-g5"  x1="83"  y1="300" x2="88"  y2="271" stroke="#3d4e1a" strokeWidth="1.5" strokeLinecap="round" />
        <line className="safari-g6"  x1="44"  y1="300" x2="40"  y2="280" stroke="#4a5c20" strokeWidth="1.5" strokeLinecap="round" />
        <line className="safari-g7"  x1="320" y1="300" x2="316" y2="273" stroke="#3d4e1a" strokeWidth="1.5" strokeLinecap="round" />
        <line className="safari-g8"  x1="328" y1="300" x2="333" y2="269" stroke="#4a5c20" strokeWidth="1.5" strokeLinecap="round" />
        <line className="safari-g9"  x1="335" y1="300" x2="331" y2="276" stroke="#3a4818" strokeWidth="1.5" strokeLinecap="round" />
        <line className="safari-g10" x1="314" y1="300" x2="310" y2="279" stroke="#455520" strokeWidth="1.5" strokeLinecap="round" />
        <line className="safari-g11" x1="342" y1="300" x2="347" y2="272" stroke="#3d4e1a" strokeWidth="1.5" strokeLinecap="round" />
        <line className="safari-g12" x1="307" y1="300" x2="303" y2="281" stroke="#4a5c20" strokeWidth="1.5" strokeLinecap="round" />

        <rect y="298" width="400" height="6" fill="#1a1408" />

        <circle className="safari-ff1" cx="130" cy="265" r="2" fill="#d4af37" />
        <circle className="safari-ff2" cx="270" cy="255" r="2" fill="#d4af37" />
        <circle className="safari-ff3" cx="90"  cy="248" r="2" fill="#d4af37" />

        <text className="safari-title" x="200" y="370">
          LUXE PLAINS AFRICA SAFARIS
        </text>
      </svg>
    </motion.div>
  );
}