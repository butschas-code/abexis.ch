"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const appleEase = [0.25, 0.1, 0.25, 1] as const;

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
};

export function MotionSection({ children, className, delay = 0, id }: Props) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }
  return (
    <motion.section
      id={id}
      className={className}
      initial={reduce ? false : { y: 22 }}
      whileInView={reduce ? undefined : { y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, ease: appleEase, delay }}
    >
      {children}
    </motion.section>
  );
}
