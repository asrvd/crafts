/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, useAnimate } from "motion/react";
import { useState } from "react";

const links = [
  {
    name: "Github",
    url: "https://github.com/asrvd",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/asrvd/",
  },
  {
    name: "Twitter",
    url: "https://x.com/_asheeshh",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/asrvd_/",
  },
];

export default function Two() {
  const [scope, animate] = useAnimate();
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <main className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <motion.div
          className="border border-zinc-200/50 bg-zinc-100/50 flex flex-col items-center justify-center gap-4"
          ref={scope}
          style={{
            height: "max-content",
            width: "max-content",
            borderRadius: "100%",
          }}
          onClick={() => {
            const newIsExpanded = !isExpanded;
            setIsExpanded(newIsExpanded);
            animate(
              scope.current,
              {
                borderRadius: newIsExpanded ? "16px" : "100%",
                width: newIsExpanded ? "250px" : "max-content",
                height: newIsExpanded ? "220px" : "max-content",
                padding: newIsExpanded ? "8px" : "0px",
              },
              {
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 16,
              }
            );
          }}
        >
          <div className="flex items-center justify-between gap-4 w-full">
            <img
              src="https://avatars.githubusercontent.com/u/68690233?v=4"
              alt="avatar"
              className="w-12 h-12 rounded-full"
            />
            {isExpanded && (
              <motion.div
                className="flex flex-col gap-1"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: isExpanded ? 1 : 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: 0.6,
                }}
              >
                <p className="text-lg font-semibold leading-none">ashish</p>
                <p className="text-base text-zinc-600 leading-none">
                  asrvd@gmail.com
                </p>
              </motion.div>
            )}
          </div>
          {isExpanded && (
            <motion.div
              className="flex flex-col w-full"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: isExpanded ? 1 : 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: 0.6,
              }}
            >
              {links.map((link) => (
                <a
                  href={link.url}
                  key={link.name}
                  className="text-base text-zinc-600 leading-none  rounded-md p-2 hover:bg-zinc-200/50 transition-all duration-300 ease-in-out"
                >
                  {link.name}
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
