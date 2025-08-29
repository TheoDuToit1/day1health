"use client";

import * as React from 'react';
import { motion } from 'framer-motion';

interface TestimonialCardProps {
  handleShuffle: () => void;
  testimonial: string;
  position: string;
  id: number;
  author: string;
  detailedDescription?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export function TestimonialCard({ handleShuffle, testimonial, position, id, author, onClick, isSelected }: TestimonialCardProps) {
  const dragRef = React.useRef(0);
  const isFront = position === "front";

  return (
    <motion.div
      style={{
        zIndex: position === "front" ? "2" : position === "middle" ? "1" : "0"
      }}
      animate={{
        rotate: position === "front" ? "-6deg" : position === "middle" ? "0deg" : "6deg",
        x: position === "front" ? "0%" : position === "middle" ? "33%" : "66%"
      }}
      drag={true}
      dragElastic={0.35}
      dragListener={isFront}
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onDragStart={(e) => {
        const clientX = 'clientX' in e ? e.clientX : e.touches?.[0]?.clientX || 0;
        dragRef.current = clientX;
      }}
      onDragEnd={(e) => {
        const clientX = 'clientX' in e ? e.clientX : e.changedTouches?.[0]?.clientX || 0;
        if (dragRef.current - clientX > 150) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      transition={{ duration: 0.35 }}
      onClick={onClick}
      className={`group absolute left-0 top-0 grid h-[450px] w-[350px] select-none place-content-center space-y-6 rounded-2xl border-2 ${isSelected ? 'border-green-500 bg-green-50/90' : 'border-slate-200'} bg-white/90 p-6 shadow-xl backdrop-blur-md ${
        isFront ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
      } hover:bg-slate-800/30 transition-colors`}
    >
      <img
        src={`https://i.pravatar.cc/128?img=${id}`}
        alt={`Avatar of ${author}`}
        className="pointer-events-none mx-auto h-32 w-32 rounded-full border-2 border-slate-200 bg-slate-100 object-cover shadow-md"
      />
      <span className="text-center text-lg italic text-gray-800 transition-colors duration-300 group-hover:text-white">"{testimonial}"</span>
      <span className="text-center text-sm font-medium text-green-600">{author}</span>
    </motion.div>
  );
}
