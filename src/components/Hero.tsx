import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface HeroProps {
  isSidebarCollapsed: boolean;
}

interface HeroSlide {
  id: number;
  staticText: string;
  typewriterWords: string[];
  subheading: string;
  bgColor: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 0,
    staticText: 'Your Health,',
    typewriterWords: ['Well', 'Protected', 'Secured'],
    subheading: 'Simple, affordable healthcare from day one.',
    bgColor: 'from-green-600 to-green-700',
  },
  {
    id: 1,
    staticText: 'Church Members,',
    typewriterWords: ['United', 'Supported', 'Covered'],
    subheading: 'Designed with community in mind.',
    bgColor: 'from-blue-900 to-blue-800',
  },
  {
    id: 2,
    staticText: 'Self-Employed?',
    typewriterWords: ['Covered', 'Protected', 'Empowered'],
    subheading: 'Flexible medical plans for freelancers.',
    bgColor: 'from-amber-800 to-amber-700',
  },
  {
    id: 3,
    staticText: 'Family First,',
    typewriterWords: ['Protected', 'Secure', 'Together'],
    subheading: 'Because everyone deserves Day1 protection.',
    bgColor: 'from-slate-700 to-slate-600',
  },
];

const Hero = ({ isSidebarCollapsed }: HeroProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const typingSpeed = 150;
  const wordDelay = 2000; // 2 seconds delay between words

  // Get words for current slide
  const currentWords = heroSlides[currentSlide]?.typewriterWords || [];

  // Typewriter effect
  useEffect(() => {
    if (currentWords.length === 0) return;

    const currentWord = currentWords[currentWordIndex];

    if (!isDeleting) {
      // Typing effect
      if (currentText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timeout);
      } else {
        // Pause at end of word
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, wordDelay);
        return () => clearTimeout(timeout);
      }
    } else {
      // Deleting effect
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        }, typingSpeed / 2);
        return () => clearTimeout(timeout);
      } else {
        // Move to next word
        setIsDeleting(false);
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % currentWords.length);
      }
    }
  }, [currentText, isDeleting, currentWordIndex, currentWords]);

  // Reset typewriter when slide changes
  useEffect(() => {
    setCurrentText('');
    setCurrentWordIndex(0);
    setIsDeleting(false);
  }, [currentSlide]);

  const navTabs = ['Comprehensive', 'Day-to-Day', 'Hospital', 'Senior Cover'];
  const taglines = ['No call centers', 'No paperwork', 'No commission'];

  return (
    <section 
      className={`relative min-h-[calc(100vh-80px)] overflow-hidden transition-all duration-300 pb-20 ${
        isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
      }`}
    >
      <AnimatePresence mode="wait">
        {heroSlides.map((slide, index) => {
          if (currentSlide !== index) return null;

          return (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${slide.bgColor} text-white`}
            >
              <div className="container mx-auto px-4 pt-32 pb-16">
                <div className="max-w-4xl mx-auto text-center">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                  >
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                      <div className="inline-flex flex-col sm:flex-row sm:items-baseline gap-2">
                        <span className="whitespace-nowrap">{slide.staticText}</span>
                        <span className="relative h-[1.2em] inline-flex items-center min-w-[180px] sm:min-w-[220px] text-left justify-center sm:justify-start">
                          <span className={`relative ${currentText ? 'opacity-100' : 'opacity-0'}`}>
                            {currentText}
                            <span className={`inline-block w-[2px] h-8 ml-1 bg-white align-middle ${currentText ? 'opacity-100' : 'opacity-0'}`}></span>
                          </span>
                        </span>
                      </div>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mt-4">
                      {slide.subheading}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-10"
                  >
                    <button className="bg-white text-green-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-300 flex items-center mx-auto">
                      Get my price
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </button>

                    <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-white/80">
                      {taglines.map((tagline, i) => (
                        <div key={i} className="flex items-center">
                          {tagline}
                          {i < taglines.length - 1 && (
                            <span className="mx-2">•</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute top-1/2 right-8 transform -translate-y-1/2 flex flex-col space-y-3 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Tabs - Moved to be part of the hero content */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-1 py-3">
            {navTabs.map((tab, index) => (
              <button
                key={index}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  currentSlide === index
                    ? 'bg-white text-gray-900'
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setCurrentSlide(index)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section Separator */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;