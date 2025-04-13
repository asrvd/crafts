/* eslint-disable @next/next/no-img-element */
"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState, useEffect } from "react";

const cards = [
  {
    id: 1,
    title: "The Odyssey",
    description: "Explore unknown galaxies.",
    content:
      "Throughout their journey, players will encounter diverse alien races, each with their own unique cultures and technologies. Engage in thrilling space combat, negotiate complex diplomatic relations, and make critical decisions that affect the balance of power in the galaxy.",
    image:
      "https://animations.dev/how-i-use-framer-motion/how-i-code-animations/space.png",
  },
  {
    id: 2,
    title: "Angry Rabbits",
    description: "They are coming for you.",
    content:
      "The rabbits are angry and they are coming for you. You have to defend yourself with your carrot gun. The game is not simple, you have to be fast and accurate to survive.",
    image:
      "https://animations.dev/how-i-use-framer-motion/how-i-code-animations/rabbit.png",
  },
  {
    id: 3,
    title: "Ghost Town",
    description: "Scarry ghosts.",
    content:
      "In this game, players explore a deserted town, uncovering its eerie past and the mysteries behind its sudden abandonment. The gameplay combines puzzle-solving, exploration, and narrative elements and something else.",
    image:
      "https://animations.dev/how-i-use-framer-motion/how-i-code-animations/ghost.webp",
  },
  {
    id: 4,
    title: "Pirates in the jungle",
    description: "Find the treasure.",
    content:
      "You are a pirate and you have to find the treasure in the jungle. But be careful, there are traps and wild animals. Some filler text to make it longer. Maybe even longer, because it looks better.",
    image:
      "https://animations.dev/how-i-use-framer-motion/how-i-code-animations/pirate.png",
  },
  {
    id: 5,
    title: "Lost in the mountains",
    description: "Be careful.",
    content:
      "You are lost in the mountains and you have to find your way home. But be careful, there are dangerous animals and you can get lost.",
    image:
      "https://animations.dev/how-i-use-framer-motion/how-i-code-animations/boy.webp",
  },
];

export default function Three() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [cardWidths, setCardWidths] = useState<Array<number>>([]);
  const [initialCardPositions, setInitialCardPositions] = useState<
    Array<{ top: number; left: number }>
  >([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      // Calculate card widths
      const cardWidths = Array.from(cardRefs.current).map(
        (card) => card?.getBoundingClientRect().width || 0
      );
      setCardWidths(cardWidths);

      // Store initial card positions
      const positions = Array.from(cardRefs.current).map((card) => {
        if (!card) return { top: 0, left: 0 };
        const rect = card.getBoundingClientRect();
        return {
          top: rect.top,
          left: rect.left,
        };
      });
      setInitialCardPositions(positions);
    }
  }, []);

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, cards.length);
  }, []);

  const handleCardOpen = (id: number) => {
    if (activeCard === null && !isAnimating) {
      setIsAnimating(true);
      setActiveCard(id);
    }
  };

  const handleCardClose = () => {
    if (activeCard !== null && !isAnimating) {
      setIsAnimating(true);
      setActiveCard(null);
    }
  };

  return (
    <main className="min-h-screen min-w-screen flex items-center justify-center">
      {/* Background blur when a card is active */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            className="fixed inset-0 bg-zinc-500/10 backdrop-blur-sm z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCardClose}
          />
        )}
      </AnimatePresence>

      <div
        className="flex flex-col w-full lg:w-[30%] px-4 max-h-max relative"
        ref={containerRef}
      >
        {cards.map((card, index) => {
          const cardIndex = cards.findIndex((c) => c.id === card.id);
          const cardWidth = cardWidths[cardIndex] || 0;
          const initialPosition = initialCardPositions[cardIndex] || {
            top: 0,
            left: 0,
          };

          return (
            <div key={card.id} className="relative">
              {/* Static visible card */}
              <motion.div
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={`flex gap-4 py-2 px-2 items-center bg-white w-full cursor-pointer`}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeCard === card.id ? 0 : 1,
                }}
                transition={{
                  ease: "easeInOut",
                }}
                onClick={() => handleCardOpen(card.id)}
              >
                <div className="flex flex-col gap-4 w-full bg-white">
                  <div className="flex gap-4 items-center w-full max-h-max">
                    <img
                      className="h-16 aspect-square rounded-2xl"
                      alt={card.title}
                      src={card.image}
                    />
                    <div className="flex gap-2 justify-between w-full items-center">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-medium leading-none">
                          {card.title}
                        </h3>
                        <p className="text-sm text-zinc-600 leading-none">
                          {card.description}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardOpen(card.id);
                        }}
                        className="text-blue-600 font-medium rounded-full px-3 py-1 max-h-max max-w-max bg-zinc-100/80 hover:bg-zinc-100 focus:ring-1 focus:ring-zinc-200 transition-all duration-300 border border-zinc-200/40 leading-tight"
                      >
                        Get
                      </button>
                    </div>
                    {index !== cards.length - 1 && (
                      <div className="h-px bg-zinc-200/80 w-[calc(100%-5rem)] self-end absolute right-0 bottom-0" />
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Animated absolute card (shown when active) */}
              <AnimatePresence
                onExitComplete={() => {
                  setIsAnimating(false);
                }}
              >
                {activeCard === card.id && (
                  <motion.div
                    className="fixed z-50 bg-white rounded-2xl border border-zinc-200 shadow-lg"
                    initial={{
                      width: cardWidth,
                      opacity: 0,
                      top: initialPosition.top,
                      left: initialPosition.left,
                      y: 0,
                      scale: 1,
                    }}
                    animate={{
                      opacity: 1,
                      top: "50%",
                      left: "50%",
                      x: "-50%",
                      y: "-50%",
                      scale: 1.2
                    }}
                    exit={{
                      width: cardWidth,
                      opacity: 0,
                      top: initialPosition.top,
                      left: initialPosition.left,
                      x: 0,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                      type: "tween"
                    }}
                    onAnimationComplete={() => {
                      if (activeCard !== null) {
                        setIsAnimating(false);
                      }
                    }}
                  >
                    <div className="flex flex-col gap-4 w-full p-4">
                      <div className="flex gap-4 items-center w-full max-h-max">
                        <img
                          className="h-20 aspect-square rounded-2xl"
                          alt={card.title}
                          src={card.image}
                        />
                        <div className="flex gap-2 justify-between w-full items-center">
                          <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-medium leading-none">
                              {card.title}
                            </h3>
                            <p className="text-sm text-zinc-600 leading-none">
                              {card.description}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCardClose();
                            }}
                            className="text-blue-600 font-medium rounded-full px-3 py-1 max-h-max max-w-max bg-zinc-100/80 hover:bg-zinc-100 focus:ring-1 focus:ring-zinc-200 transition-all duration-300 border border-zinc-200/40 leading-tight"
                          >
                            Get
                          </button>
                        </div>
                      </div>
                      <motion.p
                        className="text-sm text-zinc-600"
                        initial={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
                        exit={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                        transition={{
                          duration: 0.2,
                          ease: "easeOut",
                          delay: 0.1,
                        }}
                      >
                        {card.content}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </main>
  );
}
