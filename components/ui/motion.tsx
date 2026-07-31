"use client";

import * as React from "react";
import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Premium Easing Curves
export const easings = {
  easeOutQuart: [0.25, 1, 0.5, 1],
  easeOutExpo: [0.16, 1, 0.3, 1], // Very smooth, used in Ordina/Linear
  easeInOut: [0.65, 0, 0.35, 1],
  springPop: { type: "spring", stiffness: 400, damping: 25 },
  springSmooth: { type: "spring", stiffness: 300, damping: 30 },
  springHover: { type: "spring", stiffness: 400, damping: 30 },
};

type RevealProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
};

// 1. Blur Reveal (for primary headings, heroes, general blocks)
export const BlurReveal = ({ children, delay = 0, duration = 0.8, className, once = true, ...props }: RevealProps) => (
  <motion.div
    initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
    whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
    viewport={{ once, margin: "-50px" }}
    transition={{ duration, delay, ease: easings.easeOutExpo }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// 2. Mask Reveal (for dramatic heading reveals sliding up from invisible boundary)
export const MaskReveal = ({ children, delay = 0, duration = 0.8, className, once = true, ...props }: RevealProps) => (
  <div className={cn("overflow-hidden", className)}>
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-50px" }}
      transition={{ duration, delay, ease: easings.easeOutExpo }}
      {...props}
    >
      {children}
    </motion.div>
  </div>
);

// 3. Stagger Container (for lists, feature grids, paragraphs)
type StaggerProps = HTMLMotionProps<"div"> & {
  delayChildren?: number;
  staggerChildren?: number;
  once?: boolean;
};

export const StaggerContainer = ({ children, delayChildren = 0, staggerChildren = 0.1, className, once = true, ...props }: StaggerProps) => {
  const variants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-50px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// 4. Stagger Item (used inside StaggerContainer)
export const StaggerItem = ({ children, className, ...props }: HTMLMotionProps<"div">) => {
  const variants: Variants = {
    hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: easings.easeOutExpo }
    },
  };

  return (
    <motion.div variants={variants} className={className} {...props}>
      {children}
    </motion.div>
  );
};

// 5. Card Reveal (Opacity, Scale, Rotate very slight, Blur)
export const CardReveal = ({ children, delay = 0, duration = 0.8, className, once = true, ...props }: RevealProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, rotate: -2, filter: "blur(10px)" }}
    whileInView={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }}
    viewport={{ once, margin: "-50px" }}
    transition={{ duration, delay, type: "spring", stiffness: 300, damping: 30 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// 6. Image Reveal (Clip Path Reveal + Scale)
export const ImageReveal = ({ children, delay = 0, duration = 1, className, once = true, ...props }: RevealProps) => (
  <motion.div
    initial={{ opacity: 0, clipPath: "inset(10% 10% 10% 10% round 16px)", scale: 1.05 }}
    whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 16px)", scale: 1 }}
    viewport={{ once, margin: "-50px" }}
    transition={{ duration, delay, ease: easings.easeOutExpo }}
    className={cn("overflow-hidden", className)}
    {...props}
  >
    {children}
  </motion.div>
);

// 7. Pop Reveal (for Badges/Icons)
export const PopReveal = ({ children, delay = 0, className, once = true, ...props }: RevealProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
    viewport={{ once }}
    transition={{ delay, ...easings.springPop }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// 8. Horizontal Reveal (for Testimonial/Slider items)
export const HorizontalReveal = ({ children, delay = 0, duration = 0.8, className, once = true, ...props }: RevealProps) => (
  <motion.div
    initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
    viewport={{ once, margin: "-50px" }}
    transition={{ duration, delay, ease: easings.easeOutExpo }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// 9. Stagger Text Container (for headings)
export const StaggerTextContainer = ({ children, delayChildren = 0, staggerChildren = 0.05, className, once = true, ...props }: StaggerProps) => {
  const variants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-50px" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// 10. Stagger Text Item (inline block for words/characters)
export const StaggerTextItem = ({ children, className, ...props }: HTMLMotionProps<"span">) => {
  const variants: Variants = {
    hidden: { opacity: 0, y: 15, filter: "blur(12px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: easings.easeOutExpo }
    },
  };

  return (
    <motion.span variants={variants} className={cn("inline-block", className)} {...props}>
      {children}
    </motion.span>
  );
};

// Helper to split text into words wrapped in StaggerTextItem
export const SplitText = ({ text, className }: { text: string, className?: string }) => {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <React.Fragment key={i}>
          <StaggerTextItem className={className}>{word}</StaggerTextItem>
          {i < text.split(" ").length - 1 && <span>&nbsp;</span>}
        </React.Fragment>
      ))}
    </>
  );
};
