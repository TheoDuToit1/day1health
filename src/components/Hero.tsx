import { motion } from 'framer-motion';
import { HeartPulse, ShieldCheck, Activity, Heart, Star } from 'lucide-react';
import { HeroCTAButton } from './ui/hero-cta-button';
import { SlideUpTypewriter } from '@/components/ui/slide-up-typewriter';
import { useTheme } from '../contexts/ThemeContext';

interface HeroProps {
  isSidebarCollapsed: boolean;
}

const heroContent = {
  staticText: 'Health Refined\nCare You Trust',
  icon: HeartPulse,
  typewriterWords: [
    { text: 'Health Refined', icon: ShieldCheck },
    { text: 'Care You Trust', icon: Activity },
    { text: 'Health Assured', icon: Heart },
    { text: 'Care, Elevated', icon: Star }
  ],
  subheading: 'Private Care, Priced Right',
  bgColor: 'from-white to-white',
  textColor: 'text-gray-900',
};

const Hero: React.FC<HeroProps> = ({ isSidebarCollapsed }: HeroProps) => {
  const getContentPadding = () => {
    if (isSidebarCollapsed) {
      return 'pl-8 md:pl-12 lg:pl-16';
    }
    return 'pl-16 md:pl-24 lg:pl-32 xl:pl-48';
  };

  const getHeroPadding = () => {
    return isSidebarCollapsed ? 'pl-16 lg:pl-24' : 'pl-6 lg:pl-8';
  };

  const { isDark } = useTheme();

  return (
    <section id="hero" className="relative overflow-hidden transition-all duration-500 w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen flex items-center justify-center bg-gradient-to-br transition-colors duration-500 ease-in-out ${
          isDark ? 'from-gray-950 to-gray-900' : heroContent.bgColor
        } ${
          isDark ? 'text-white' : (heroContent.textColor || 'text-white')
        }`}
      >
        <div 
          className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-all duration-500 ease-in-out ${getContentPadding()} ${getHeroPadding()}`}
          style={{
            transitionProperty: 'padding',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDuration: '500ms'
          }}
        >
          <div className="w-full h-screen flex flex-col items-center justify-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center w-full max-w-7xl mx-auto px-6"
            >
              {/* Logo */}
              <motion.div 
                className="absolute z-10 top-16 left-1/2 -translate-x-1/2 -ml-24 sm:top-10 sm:left-auto sm:right-[102px] sm:translate-x-0 sm:ml-0 flex flex-col items-center"
                initial={{ opacity: 0, x: 20, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 0.9 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <img
                  src="/assets/images/Logo.jpg"
                  alt="DAY1HEALTH logo"
                  width="192"
                  height="48"
                  className="w-22 sm:w-28 md:w-36 lg:w-44 xl:w-48 pointer-events-none select-none"
                  onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
                />
                <motion.p
                  className="text-xs sm:text-sm md:text-base -mt-4 text-center font-medium"
                  style={{ color: '#1a568c' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                >
                  Health Cover Since 2003
                </motion.p>
              </motion.div>
              
              {/* Typewriter Section */}
              <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 items-center justify-center">
                <div className="relative min-w-[180px] sm:min-w-[200px] h-14 sm:h-20 md:h-24">
                  <SlideUpTypewriter 
                    words={heroContent.typewriterWords.map(word => word.text)}
                    className={`font-manrope font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl ${isDark ? 'text-emerald-400' : 'text-green-600'} leading-tight`}
                    letterDelay={80}
                    wordDisplayTime={1500}
                    wordExitTime={400}
                  />
                  {/* CTA Button */}
                  <motion.div 
                    className="mt-[140px] flex justify-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 2, duration: 0.6 }}
                    style={{ marginTop: '140px' }}
                  >
                    <HeroCTAButton
                      className={`font-manrope font-bold text-xl ${isDark ? 'text-emerald-400' : 'text-green-600'}`}
                      defaultText="Contact Now"
                      onClick={() => {
                        setTimeout(() => {
                          const contactSection = document.getElementById('contact');
                          if (contactSection) {
                            contactSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }, 2700);
                      }}
                    />
                  </motion.div>
                </div>
              </div>
              
              {/* Subheading */}
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className={`text-lg sm:text-2xl md:text-3xl ${
                  isDark ? 'text-gray-200' : 'text-black'
                } font-manrope font-bold max-w-4xl mx-auto leading-relaxed mt-[63px] mb-12`}
              >
                {heroContent.subheading}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>



      {/* Bottom Tabs - Moved to be part of the hero content */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/10">

      </div>

      {/* Section Separator */}
      <div className={`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t ${isDark ? 'from-gray-900' : 'from-white'} to-transparent`}></div>
    </section>
  );
};

export default Hero;

