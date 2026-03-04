"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function AnimatedSection({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

