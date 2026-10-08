"use client";

import {
  motion,
} from "framer-motion";

export default function ExperienceBag() {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        initial={{
          scale: 0.75,
          opacity: 0,
        }}
        animate={{
          scale: [
            0.75,
            1.18,
            1,
          ],
          opacity: [
            0,
            0.42,
            0.18,
          ],
        }}
        transition={{
          delay: 0.75,
          duration: 1.2,
          ease: "easeOut",
        }}
        className="absolute h-52 w-52 rounded-full bg-sky-400/15 blur-3xl"
      />

      <motion.div
        animate={{
          scale: [
            1,
            1.025,
            1,
            1.02,
            1,
          ],
        }}
        transition={{
          delay: 1.1,
          duration: 2.6,
          ease: "easeInOut",
        }}
        className="relative flex items-center justify-center"
      >
        <motion.svg
          width="122"
          height="136"
          viewBox="0 0 108 120"
          fill="none"
          initial={{
            opacity: 0,
            scale: 0.92,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <motion.path
            d="M28 42H80L74 96H34L28 42Z"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{
              pathLength: 0,
            }}
            animate={{
              pathLength: 1,
            }}
            transition={{
              duration: 0.9,
            }}
          />

          <motion.path
            d="M40 42C40 30 46 22 54 22C62 22 68 30 68 42"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{
              pathLength: 0,
            }}
            animate={{
              pathLength: 1,
            }}
            transition={{
              delay: 0.92,
              duration: 0.55,
            }}
          />
        </motion.svg>

        <motion.div
          initial={{
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            delay: 0.95,
            type: "spring",
            stiffness: 220,
            damping: 16,
          }}
          className="absolute flex h-14 w-14 items-center justify-center rounded-full border border-sky-400/40 bg-sky-400/15 backdrop-blur-md"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 22 22"
            fill="none"
          >
            <motion.path
              d="M5 11L9.2 15L17 7"
              stroke="#7DD3FC"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{
                pathLength: 0,
              }}
              animate={{
                pathLength: 1,
              }}
              transition={{
                delay: 1.2,
                duration: 0.45,
                ease: "easeOut",
              }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}