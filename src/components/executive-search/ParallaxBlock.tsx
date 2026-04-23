"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Vertical motion range [start, end] in px across scroll span */
  yRange?: [number, number];
};

/** Subtle scroll-linked vertical shift — premium, not gimmicky */
export function ParallaxBlock({ children, className, yRange = [48, -48] }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const [y0, y1] = yRange;
  const raw = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [y0, y1]);
  const y = useSpring(raw, { stiffness: 90, damping: 32, mass: 0.4 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
