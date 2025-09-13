import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface RollingNumberProps {
  value: number;
  className?: string;
  digitClassName?: string;
  duration?: number; // seconds per change animation
  delayPerDigit?: number; // stagger between digits
  prefix?: string; // e.g. "R"
  suffix?: string; // e.g. "/mo"
  heightPx?: number; // override digit slot height
}

// A slot-machine style rolling number that animates each digit vertically
// whenever the value changes. Designed to be lightweight and easy to drop in.
export const RollingNumber: React.FC<RollingNumberProps> = ({
  value,
  className,
  digitClassName,
  duration = 0.55,
  delayPerDigit = 0.04,
  prefix,
  suffix,
  heightPx,
}) => {
  // Convert to string; keep only digits and separators you want to render.
  const str = useMemo(() => Math.max(0, Math.floor(value)).toString(), [value]);
  const digits = str.split('');
  const slotDigits = ['0','1','2','3','4','5','6','7','8','9'];
  const digitHeight = heightPx ?? 28; // px; height for each digit slot

  return (
    <div className={className} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 0, fontVariantNumeric: 'tabular-nums' }}>
      {prefix ? <span className={digitClassName}>{prefix}</span> : null}
      {digits.map((d, i) => {
        const idx = parseInt(d, 10);
        const y = isNaN(idx) ? 0 : -idx * digitHeight;
        return (
          <div
            key={`slot-${i}`}
            style={{
              position: 'relative',
              width: '1ch',
              height: digitHeight,
              overflow: 'hidden',
              display: 'inline-block',
            }}
          >
            <motion.div
              key={`roller-${i}`}
              initial={false}
              animate={{ y }}
              transition={{ duration, ease: [0.22, 1, 0.36, 1], delay: i * delayPerDigit }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                lineHeight: `${digitHeight}px`,
                willChange: 'transform',
              }}
            >
              {slotDigits.map((sd) => (
                <div key={sd} className={digitClassName} style={{ height: digitHeight, textAlign: 'center' }}>
                  {sd}
                </div>
              ))}
            </motion.div>
          </div>
        );
      })}
      {suffix ? <span className={digitClassName}>{suffix}</span> : null}
    </div>
  );
};
