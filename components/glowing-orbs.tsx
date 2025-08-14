"use client"

import { motion } from "framer-motion"

export function GlowingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large central orb - simplified animation */}
      <motion.div
        className="absolute w-96 h-96 rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0.05) 40%, transparent 70%)",
          filter: "blur(40px)",
          top: "20%",
          left: "10%",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Cyan orb */}
      <motion.div
        className="absolute w-80 h-80 rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 211, 238, 0.25) 0%, rgba(34, 211, 238, 0.05) 40%, transparent 70%)",
          filter: "blur(30px)",
          top: "40%",
          right: "5%",
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Violet orb */}
      <motion.div
        className="absolute w-64 h-64 rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)",
          filter: "blur(25px)",
          bottom: "10%",
          left: "30%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
