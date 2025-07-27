import { useState, useEffect } from 'react';
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
  textColor?: string;
  buttonBg?: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 0,
    staticText: 'Health 🩺',
    typewriterWords: ['Well', 'Protected', 'Secured'],
    subheading: 'Simple, affordable healthcare from day one.',
    bgColor: 'from-green-600 to-green-700',
  },
  {
    id: 1,
    staticText: 'Community 🙏',
    typewriterWords: ['United', 'Supported', 'Covered'],
    subheading: 'Designed with community in mind.',
    bgColor: 'from-blue-900 to-blue-800',
  },
  {
    id: 2,
    staticText: 'Freelance? 💼',
    typewriterWords: ['Covered', 'Protected', 'Empowered'],
    subheading: 'Flexible medical plans for freelancers.',
    bgColor: 'from-amber-800 to-amber-700',
  },
  {
    id: 3,
    staticText: 'Family 👨‍👩‍👧‍👦',
    typewriterWords: ['Protected', 'Secure', 'Together'],
    subheading: 'Because everyone deserves Day1 protection.',
    bgColor: 'from-pink-100 to-blue-100',
    textColor: 'text-gray-900',
    buttonBg: 'bg-green-600 hover:bg-green-700',
  },
];

const Hero = ({ isSidebarCollapsed }: HeroProps) => {
  // Calculate padding based on sidebar state with more noticeable difference
  const getContentPadding = () => {
    if (isSidebarCollapsed) {
      return 'pl-12 md:pl-16 lg:pl-24';
    }
    return 'pl-24 md:pl-32 lg:pl-48 xl:pl-64';
  };
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

  const getHeroPadding = () => {
    return isSidebarCollapsed ? 'pl-24 lg:pl-32' : 'pl-8 lg:pl-12';
  };

  return (
    <section id="hero" className="relative min-h-[calc(100vh-80px)] overflow-hidden transition-all duration-500 pb-20 w-full">
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
              className={`min-h-screen flex items-center justify-start bg-gradient-to-br ${slide.bgColor} ${slide.textColor || 'text-white'}`}
            >
              <div 
                className={`container mx-auto pr-12 lg:pr-24 pt-32 pb-16 transition-all duration-500 ease-in-out ${getContentPadding()} ${getHeroPadding()}`}
                style={{
                  transitionProperty: 'padding',
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDuration: '500ms'
                }}
              >
                <div className="max-w-4xl">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12"
                  >
                    <h1 className="text-8xl md:text-9xl lg:text-[10rem] font-bold leading-none mb-4">
                      <div className="flex flex-col">
                        <span className="whitespace-nowrap">{slide.staticText}</span>
                        <span className="relative h-[1.2em] mt-2">
                          <span className={`relative ${currentText ? 'opacity-100' : 'opacity-0'}`}>
                            {currentText}
                            <span className={`inline-block w-[4px] h-16 ml-2 ${slide.id === 3 ? 'bg-gray-900' : 'bg-white'} align-middle ${currentText ? 'opacity-100' : 'opacity-0'}`}></span>
                          </span>
                        </span>
                      </div>
                    </h1>
                    <p className="text-2xl md:text-3xl mt-8 max-w-2xl leading-relaxed">
                      {slide.subheading}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12"
                  >
                    <button className={`${slide.buttonBg || 'bg-white text-green-700 hover:bg-gray-100'} font-semibold py-4 px-10 rounded-lg text-lg transition-colors duration-300 flex items-center`}>
                      Get my price
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </button>


                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className={`absolute top-1/2 right-8 transform -translate-y-1/2 flex flex-col space-y-3 z-10 transition-all duration-300 ${isSidebarCollapsed ? 'right-4' : 'right-8'}`}>
        {heroSlides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index 
                ? (slide.id === 3 ? 'bg-gray-900 scale-125' : 'bg-white scale-125')
                : (slide.id === 3 ? 'bg-gray-900/30 hover:bg-gray-900/50' : 'bg-white/50 hover:bg-white/75')
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom Tabs - Moved to be part of the hero content */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/10">
        {/* Mobile Navigation Dots */}
        <div className="lg:hidden fixed bottom-8 left-0 right-0 flex justify-center space-x-2 z-40">
          {[0, 1, 2, 3].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                currentSlide === index ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Section Separator */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;