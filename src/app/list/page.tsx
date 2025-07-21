/* eslint-disable @next/next/no-img-element */
"use client";

import { motion, AnimatePresence, useSpring } from "motion/react";
import { useState } from "react";
import { useEffect } from "react";

const listElements = [
  {
    id: 1,
    name: "Item 1",
    description: "This is the first item",
    category: "Category 1",
    image:
      "https://images.pexels.com/photos/32903797/pexels-photo-32903797.jpeg",
  },
  {
    id: 2,
    name: "Item 2",
    description: "This is the second item",
    category: "Category 2",
    image: "https://images.pexels.com/photos/4116411/pexels-photo-4116411.jpeg",
  },
  {
    id: 3,
    name: "Item 3",
    description: "This is the third item",
    category: "Category 2",
    image: "https://images.pexels.com/photos/8693381/pexels-photo-8693381.jpeg",
  },
  {
    id: 4,
    name: "Item 4",
    description: "This is the fourth item",
    category: "Category 3",
    image: "https://images.pexels.com/photos/7674327/pexels-photo-7674327.jpeg",
  },
  {
    id: 5,
    name: "Item 5",
    description: "This is the fifth item",
    category: "Category 1",
    image: "https://images.pexels.com/photos/6808985/pexels-photo-6808985.jpeg",
  },
  {
    id: 6,
    name: "Item 6",
    description: "This is the sixth item",
    category: "Category 1",
    image:
      "https://images.pexels.com/photos/33054757/pexels-photo-33054757.jpeg",
  },
  {
    id: 7,
    name: "Item 7",
    description: "This is the seventh item",
    category: "Category 3",
    image:
      "https://images.pexels.com/photos/33049098/pexels-photo-33049098.jpeg",
  },
  {
    id: 8,
    name: "Item 8",
    description: "This is the eighth item",
    category: "Category 2",
    image:
      "https://images.pexels.com/photos/11680999/pexels-photo-11680999.jpeg",
  },
  {
    id: 9,
    name: "Item 9",
    description: "This is the ninth item",
    category: "Category 2",
    image:
      "https://images.pexels.com/photos/33048706/pexels-photo-33048706.jpeg",
  },
  {
    id: 10,
    name: "Item 10",
    description: "This is the tenth item",
    category: "Category 3",
    image:
      "https://images.pexels.com/photos/33052460/pexels-photo-33052460.jpeg",
  },
  {
    id: 11,
    name: "Item 11",
    description: "This is the eleventh item",
    category: "Category 1",
    image:
      "https://images.pexels.com/photos/33053049/pexels-photo-33053049.jpeg",
  },
  {
    id: 12,
    name: "Item 12",
    description: "This is the twelfth item",
    category: "Category 1",
    image:
      "https://images.pexels.com/photos/33037599/pexels-photo-33037599.jpeg",
  },
  {
    id: 13,
    name: "Item 13",
    description: "This is the thirteenth item",
    category: "Category 3",
    image: "https://images.pexels.com/photos/7646667/pexels-photo-7646667.jpeg",
  },
  {
    id: 14,
    name: "Item 14",
    description: "This is the fourteenth item",
    category: "Category 2",
    image:
      "https://images.pexels.com/photos/33027948/pexels-photo-33027948.jpeg",
  },
  {
    id: 15,
    name: "Item 15",
    description: "This is the fifteenth item",
    category: "Category 2",
    image: "https://images.pexels.com/photos/4910357/pexels-photo-4910357.jpeg",
  },
];

export default function ListAnimation() {
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
  const [allImagesPreloaded, setAllImagesPreloaded] = useState(false);

  // Spring animations for smooth position following
  const springX = useSpring(0, {
    stiffness: 150,
    damping: 25,
    mass: 0.1,
  });
  const springY = useSpring(0, {
    stiffness: 150,
    damping: 25,
    mass: 0.1,
  });

  // Proper image preloading with loading state tracking
  useEffect(() => {
    const imagePromises = listElements.map((element) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setImagesLoaded((prev) => new Set(prev).add(element.image));
          resolve(element.image);
        };
        img.onerror = () =>
          reject(new Error(`Failed to load ${element.image}`));
        img.src = element.image;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        setAllImagesPreloaded(true);
      })
      .catch((error) => {
        console.warn("Some images failed to preload:", error);
        setAllImagesPreloaded(true); // Still allow interaction even if some images fail
      });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update spring values with offset
      springX.set(e.clientX + 10);
      springY.set(e.clientY + 10);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [springX, springY]);

  const [hoveredElement, setHoveredElement] = useState<number | null>(null);

  const springSlideY = useSpring(0, {
    stiffness: 150,
    damping: 25,
    mass: 0.1,
  });

  useEffect(() => {
    if (hoveredElement) {
      console.log(
        "hoveredElement",
        hoveredElement,
        ((hoveredElement ?? 1) - 1) * 350
      );
      springSlideY.set(-((hoveredElement ?? 1) - 1) * 350);
    } else {
      springSlideY.set(0);
    }
  }, [hoveredElement, springSlideY]);

  console.log(springSlideY);

  return (
    <main className="flex flex-col items-center h-screen w-screen font-sans p-4 justify-center">
      <div className="flex flex-col items-center justify-between w-full h-full border border-gray-200">
        {!allImagesPreloaded && (
          <div className="fixed top-4 right-4 z-50 bg-black/80 text-white px-3 py-2 text-sm">
            Loading images... ({imagesLoaded.size}/{listElements.length})
          </div>
        )}

        <AnimatePresence mode="wait">
          {listElements.map((element) => (
            <motion.div
              key={element.id}
              className={`flex gap-4 items-center justify-between p-4 w-full h-full lowercase cursor-pointer relative ${
                !allImagesPreloaded ? "opacity-50 pointer-events-none" : ""
              } ${
                element.id !== listElements.length
                  ? "border-b border-gray-200"
                  : ""
              }`}
              initial={{
                opacity: 0,
                y: 100,
                backgroundColor: "white",
                color: "black",
              }}
              animate={{ opacity: allImagesPreloaded ? 1 : 0.5, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              whileHover={{
                backgroundColor: "black",
                color: "white",
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              onHoverStart={() =>
                allImagesPreloaded && setHoveredElement(element.id)
              }
              onHoverEnd={() => {
                setHoveredElement(null);
              }}
            >
              <p className="w-[10%]">#{element.id}</p>
              <h2 className="w-[20%]">{element.name}</h2>
              <p className="w-[50%]">{element.description}</p>
              <p className="w-[20%]">{element.category}</p>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div
          className="fixed w-[500px] h-[350px] z-10 overflow-hidden pointer-events-none origin-top-left"
          initial={{
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            opacity: hoveredElement && allImagesPreloaded ? 1 : 0,
            scale: hoveredElement && allImagesPreloaded ? 1 : 0.5,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            top: springY,
            left: springX,
            opacity: hoveredElement && allImagesPreloaded ? 1 : 0,
          }}
        >
          <motion.div
            className="flex flex-col"
            style={{
              y: springSlideY,
              width: "500px",
              height: `${listElements.length * 350}px`,
            }}
          >
            {listElements.map((element) => (
              <img
                key={element.id}
                src={element.image}
                alt={element.name}
                className="w-[500px] h-[350px] object-cover flex-shrink-0"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
