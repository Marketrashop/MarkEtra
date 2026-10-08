"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  useEffect,
} from "react";

import ExperienceBag from "./ExperienceBag";
import ExperienceParticles from "./ExperienceParticles";
import useExperience from "./useExperience";

export default function ExperienceOverlay() {
  const {
    experience,
    hideExperience,
  } = useExperience();

  useEffect(() => {
    if (
      !experience?.open
    ) {
      return;
    }

    const timeout =
      setTimeout(() => {
        experience.onComplete?.();

        hideExperience();
      }, 3200);

    return () => {
      clearTimeout(
        timeout,
      );
    };
  }, [
    experience,
    hideExperience,
  ]);

  return (
    <AnimatePresence>
      {experience?.open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.35,
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-xl"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 32,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              y: 24,
            }}
            transition={{
              duration: 0.5,
            }}
            className="relative w-[92%] max-w-md overflow-hidden rounded-[34px] border border-white/10 bg-[#090909] p-10 shadow-[0_0_120px_rgba(0,0,0,0.65)]"
          >
            <ExperienceParticles />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]" />

            <div className="relative flex flex-col items-center text-center">
              <ExperienceBag />

              <motion.p
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.45,
                }}
                className="mt-8 text-[10px] uppercase tracking-[0.42em] text-sky-400"
              >
                MarkEtra
              </motion.p>

              <motion.h2
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.6,
                }}
                className="mt-5 text-[2.2rem] font-extralight tracking-[-0.05em] text-white"
              >
                {experience.title}
              </motion.h2>

              <motion.p
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.75,
                }}
                className="mt-5 max-w-[20rem] text-[14px] leading-[2] text-gray-400"
              >
                {experience.description}
              </motion.p>

              <motion.div
                initial={{
                  scaleX: 0,
                }}
                animate={{
                  scaleX: 1,
                }}
                transition={{
                  delay: 1,
                  duration: 1,
                }}
                className="mt-10 h-px w-full origin-left bg-gradient-to-r from-transparent via-sky-400 to-transparent"
              />

              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 1.2,
                }}
                className="mt-8 text-[11px] uppercase tracking-[0.34em] text-gray-500"
              >
                {experience.status}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}