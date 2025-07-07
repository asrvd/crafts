"use client";

import { useRef } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";

export default function VidScroll() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get scroll progress relative to the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Listen to scroll progress changes and update video currentTime
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const video = videoRef.current;
    if (!video) return;

    // Only update if video metadata is loaded
    if (video.duration && video.duration > 0) {
      const targetTime = latest * video.duration;
      video.currentTime = targetTime;
    }
  });

  return (
    <main className="h-screen w-screen bg-black">
      <div className="h-[300vh] w-screen" ref={containerRef}>
        <video
          ref={videoRef}
          src="/desktop-mockup.mp4"
          muted
          playsInline
          preload="metadata"
          className="w-full h-screen object-cover sticky top-0"
        />
      </div>
      <div className="h-screen w-screen bg-red-500"></div>
    </main>
  );
}
