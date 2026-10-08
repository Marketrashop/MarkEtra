"use client";

import {
  motion,
} from "framer-motion";

const PARTICLES = [
  {
    size: 8,
    left: "18%",
    delay: 0,
    duration: 4.8,
  },
  {
    size: 6,
    left: "34%",
    delay: 0.8,
    duration: 5.4,
  },
  {
    size: 10,
    left: "68%",
    delay: 1.1,
    duration: 5,
  },
  {
    size: 7,
    left: "82%",
    delay: 1.6,
    duration: 5.8,
  },
];

export default function ExperienceParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map(
        (
          particle,
          index,
        ) => (
          <motion.span
            key={index}
            initial={{
              opacity: 0,
              y: 36,
            }}
            animate={{
              opacity: [
                0,
                0.5,
                0,
              ],
              y: [
                -10,
                -90,
              ],
              x: [
                0,
                -5,
                5,
                0,
              ],
            }}
            transition={{
              repeat:
                Infinity,
              repeatDelay:
                0.8,
              duration:
                particle.duration,
              delay:
                particle.delay,
              ease:
                "easeInOut",
            }}
            className="absolute rounded-full bg-sky-300"
            style={{
              width:
                particle.size,
              height:
                particle.size,
              left:
                particle.left,
              bottom: 40,
              filter:
                "blur(1px)",
            }}
          />
        ),
      )}
    </div>
  );
}