import * as React from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

interface ScrollFadeProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  depth?: "fg" | "mid" | "bg" | "none"; // parallax layer depth
  key?: React.Key;
  scaleEnabled?: boolean;
}

export default function ScrollFade({
  children,
  delay = 0,
  y = 16, // Understated subtle vertical drift for premium 2026 feel
  duration = 0.85,
  className = "",
  depth = "none",
  scaleEnabled = true,
}: ScrollFadeProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  
  // Custom parallax scroll tracking of the viewport intersection
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Balanced depth coordinates (less aggressive to prevent motion fatigue)
  const yRaw = useTransform(
    scrollYProgress,
    [0, 1],
    depth === "bg" ? [24, -24] : depth === "fg" ? [-12, 12] : depth === "mid" ? [6, -6] : [0, 0]
  );

  // Soft elastic damping for a premium mechanical glide coefficient (organic inertia)
  const yParallaxSpring = useSpring(yRaw, {
    stiffness: 150,
    damping: 30,
    mass: 0.25,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        y: y, 
        scale: scaleEnabled ? 0.99 : 1,
        filter: "blur(4px)" 
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        filter: "blur(0px)" 
      }}
      viewport={{ once: false, amount: 0.05, margin: "-20px 0px" }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.19, 1, 0.22, 1] // Luxury expo-out curve for premium transition
      }}
      style={{ y: depth !== "none" ? yParallaxSpring : undefined }}
      className={`will-change-[transform,opacity,filter] ${className}`}
    >
      {children}
    </motion.div>
  );
}
