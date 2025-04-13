/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, useAnimate } from "motion/react";
import { useState, useEffect } from "react";

const lines = [
  "...",
  "I had to bypass old mythologies I had",
  "Put my heart on display like it was an iMac",
  "To all my young ni**as, let me be the demonstration",
  "How to conduct differences with a healthy conversation",
  "If that's your family, then handle it as such",
  "Don't let the socials gas you up or let emotions be your crutch",
  "Pick up the phone and bust it up before the history is lost",
  "Hand-to-handshake is good when you have a heart-to-heart",
  "...",
];

export default function One() {
  const [scope, animate] = useAnimate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isExpanded) {
      interval = setInterval(() => {
        setHighlightedIndex((prevIndex) => (prevIndex + 1) % lines.length);
      }, 1500); // Change every 1.5 seconds
    } else {
      setHighlightedIndex(0); // Reset the highlighted index when not expanded
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isExpanded]);

  const toggleHeight = () => {
    const newIsExpanded = !isExpanded;
    setIsExpanded(newIsExpanded);
    animate(
      scope.current,
      {
        width: newIsExpanded ? "100%" : "180px",
        height: newIsExpanded ? "100%" : "180px",
      },
      {
        duration: 0.4,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 16,
      }
    );
  };

  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-center p-4">
      <div className="lg:w-[30%] md:w-[60%] h-full flex flex-col gap-4 justify-center items-center">
        <motion.div
          className="w-full h-full flex flex-col items-center justify-between border bg-white border-zinc-200 rounded-2xl shadow-sm cursor-pointer aspect-square overflow-auto z-10 hide-scrollbar"
          style={{ willChange: "width", width: "180px", height: "180px" }}
          onClick={toggleHeight}
          ref={scope}
        >
          <div className="flex gap-4 justify-between cursor-pointer w-full sticky top-0 z-10 p-4 bg-white">
            <img
              src="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
              alt="gnx"
              className="w-36 h-36 rounded-xl object-cover border border-zinc-200"
            />
            {isExpanded && (
              <motion.div
                className="flex flex-col gap-1 text-right min-h-full justify-between items-end"
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: 0.2,
                }}
                style={{ willChange: "opacity" }}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: isExpanded ? 1 : 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
              >
                <p className="text-sm leading-none font-bold">GNX</p>
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-bold leading-none">
                    heart pt. 6
                  </h2>
                  <p className="text-sm text-zinc-500 leading-none">
                    Kendrick Lamar
                  </p>
                </div>
              </motion.div>
            )}
          </div>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: isExpanded ? 1 : 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.2,
              }}
              className="px-4 pb-4"
            >
              <p className="text-2xl leading-none font-bold flex flex-col gap-2">
                {lines.map((line, index) => (
                  <motion.span
                    key={index}
                    initial={{
                      color: "#a1a1aa",
                      scale: 1,
                    }}
                    animate={{
                      color: index === highlightedIndex ? "#3f3f46" : "#a1a1aa",
                      scale: index === highlightedIndex ? 1.004 : 1,
                    }}
                    exit={{
                      color: "#a1a1aa",
                      scale: 1,
                    }}
                    transition={{
                      duration: 1,
                    }}
                  >
                    {line}
                  </motion.span>
                ))}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
