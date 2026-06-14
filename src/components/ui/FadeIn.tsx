"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// BiliPai AppMotionTokens —— 全局动画节奏（所有页面共享）
export const MOTION = {
  fade: {
    y: 12,
    spring: { stiffness: 100, damping: 15 },
  },
  // 阶梯延迟（替代手写 delay={0.15} 的魔法数字）
  stagger: {
    step1: 0,    // 首行：搜索栏
    step2: 0.08, // 二行：ProfileCard + CloudPlayer
    step3: 0.16, // 三行：Carousel + PhotoWall
    step4: 0.24, // 尾行：Dashboard
  },
} as const;

export default function FadeIn({ children, step }: { children: ReactNode; step?: keyof typeof MOTION.stagger }) {
  const delay = step ? MOTION.stagger[step] : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: MOTION.fade.y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: MOTION.fade.spring.stiffness, damping: MOTION.fade.spring.damping, delay }}
    >
      {children}
    </motion.div>
  );
}
