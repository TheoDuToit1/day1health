import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SlideUpTypewriterProps {
  words: string[];
  className?: string;
  letterDelay?: number;
  wordDisplayTime?: number;
  wordExitTime?: number;
}

export const SlideUpTypewriter: React.FC<SlideUpTypewriterProps> = ({
  words,
  className = '',
  letterDelay = 100,
  wordDisplayTime = 2000,
  wordExitTime = 800
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [phase, setPhase] = useState<'entering' | 'displaying' | 'exiting'>('entering');
  const [visibleLetters, setVisibleLetters] = useState<number>(0);

  useEffect(() => {
    if (words.length === 0) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const currentWord = words[currentWordIndex];

    if (phase === 'entering') {
      if (visibleLetters < currentWord.length) {
        // Show next letter
        timeoutId = setTimeout(() => {
          setVisibleLetters(prev => prev + 1);
        }, letterDelay);
      } else if (visibleLetters === currentWord.length) {
        // All letters visible, move to display phase
        timeoutId = setTimeout(() => {
          setPhase('displaying');
        }, 300);
      }
    } else if (phase === 'displaying') {
      // Display complete word for specified time
      timeoutId = setTimeout(() => {
        setPhase('exiting');
      }, wordDisplayTime);
    } else if (phase === 'exiting') {
      // Exit animation complete, move to next word
      // Calculate total exit time including stagger delays
      const totalExitTime = wordExitTime + (currentWord.length * 80); // 80ms per letter stagger
      timeoutId = setTimeout(() => {
        setVisibleLetters(0);
        setCurrentWordIndex(prev => (prev + 1) % words.length);
        setPhase('entering');
      }, totalExitTime);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentWordIndex, phase, visibleLetters, words, letterDelay, wordDisplayTime, wordExitTime]);

  // Reset animation when words change
  useEffect(() => {
    setCurrentWordIndex(0);
    setVisibleLetters(0);
    setPhase('entering');
  }, [words]);

  if (words.length === 0) return null;

  const currentWord = words[currentWordIndex];

  return (
    <div className={`relative ${className}`}>
      <div className="flex justify-center">
        {currentWord.split('').map((letter, index) => {
          const isVisible = index < visibleLetters;
          const shouldExit = phase === 'exiting';
          
          return (
            <motion.span
              key={`${currentWordIndex}-${index}`}
              className="inline-block"
              initial={{ 
                y: 40, 
                opacity: 0,
                scale: 0.8
              }}
              animate={{ 
                y: shouldExit ? -60 : (isVisible ? 0 : 40),
                opacity: shouldExit ? 0 : (isVisible ? 1 : 0),
                scale: shouldExit ? 0.8 : (isVisible ? 1 : 0.8)
              }}
              transition={{
                duration: shouldExit ? 0.4 : 0.6,
                ease: shouldExit ? [0.55, 0.085, 0.68, 0.53] : [0.25, 0.46, 0.45, 0.94],
                delay: shouldExit ? index * 0.08 : 0
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
};


