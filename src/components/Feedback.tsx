import React from 'react';
import { Carousel, TestimonialCard } from './ui/retro-testimonial';
import { useTheme } from '../contexts/ThemeContext';

interface FeedbackProps {
  isSidebarCollapsed: boolean;
}

const testimonials = [
  {
    name: 'Vinesh Bissin',
    designation: 'Member',
    description: 'I’m very happy with Day1 Health and even upgrading to a higher plan. Their service gives me real peace of mind.',
    profileImage: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Bukeka Msibi',
    designation: 'Member',
    description: 'Day1 Health has been excellent. I misplaced my product guide, and they quickly helped me. I’ll gladly leave a review on Google.',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Violet Joseph',
    designation: 'Member',
    description: 'My recent GP visit was smooth with no complaints. I’m happy with Day1 Health and will leave a review online.',
    profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Maria Maswangai',
    designation: 'Member',
    description: 'I’m really happy with my medical insurance. I’ll follow Day1 Health on Facebook and give them a Google Review.',
    profileImage: 'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Salim Jadwat',
    designation: 'Member',
    description: 'Everything is good with Day1 Health and my GP. I’m happy with the service and will leave a review and follow on Facebook.',
    profileImage: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Rakesh Ramal',
    designation: 'Member',
    description: 'I was so happy to receive a call from Day1 Health. I have no complaints and I’m comfortable following them on social media.',
    profileImage: 'https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Trevor Williams',
    designation: 'Member',
    description: 'I really appreciate the cover I have with Day1 Health. No complaints at all – only positive experiences. I’ll gladly give a review.',
    profileImage: 'https://images.unsplash.com/photo-1544005313-ef5b7f8e3e32?w=400&auto=format&fit=crop&q=60'
  },
  {
    name: 'Martina Van Wyk',
    designation: 'Member',
    description: 'I’m such a fan of Day1 Health. I’ve already left a review before and will gladly do another. Please keep up the excellent work!',
    profileImage: 'https://images.unsplash.com/photo-1541216970279-affbfdd55aa8?w=400&auto=format&fit=crop&q=60'
  }
];

const Feedback: React.FC<FeedbackProps> = ({ isSidebarCollapsed }) => {
  const { isDark } = useTheme();
  return (
    <section className={`py-20 transition-all duration-700 ease-in-out border-b scroll-mt-32 ${
      isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
    } ${
      isSidebarCollapsed ? 'lg:ml-24' : 'lg:ml-64'
    } ${
      isSidebarCollapsed ? 'lg:w-[calc(100%-6rem)]' : 'lg:w-[calc(100%-16rem)]'
    }`}
    style={{
      transition: 'margin-left 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }}>
      <div className="mx-auto px-4" style={{ maxWidth: '90rem' }}>
        <div className="text-center mb-16">
          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mb-4 ${
            isDark 
              ? 'bg-green-900/50 text-green-400' 
              : 'bg-green-100 text-green-800'
          }`}>
            Testimonials
          </span>
          <h2 id="feedback" className={`text-4xl font-bold text-center mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
            What Our Members Say
          </h2>
          <p className={`text-xl text-center mb-16 max-w-3xl mx-auto ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
            Real stories from real people who trust Day1Health with their healthcare needs.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Carousel
            items={testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                index={index}
                onCardClose={() => {}}
              />
            ))}
          />
        </div>
      </div>
    </section>
  );
};

export default Feedback;
