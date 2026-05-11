import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50 pointer-events-none">
      {/* Dynamic Animated Blobs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-red-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-60"
        animate={{
          x: [0, 200, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-60"
        animate={{
          x: [0, -150, 0],
          y: [0, 150, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 2
        }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-purple-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-50"
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -150, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
      />
      
      {/* Subtle overlay to keep it clean */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
    </div>
  );
};

export default AnimatedBackground;
