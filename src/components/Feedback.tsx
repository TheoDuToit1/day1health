import React from 'react';
import { Carousel, TestimonialCard } from './ui/retro-testimonial';
import { useTheme } from '../contexts/ThemeContext';

interface FeedbackProps {
  isSidebarCollapsed: boolean;
}

const testimonials = [
  {
    name: 'Sarah Johnson',
    designation: 'Premium Member',
    description: 'Day1Health has completely transformed how I manage my family\'s healthcare. The coverage is comprehensive and the service is outstanding!',
    profileImage: 'https://randomuser.me/api/portraits/women/43.jpg'
  },
  {
    name: 'Michael Chen',
    designation: 'Executive Plan',
    description: 'As someone who travels frequently, having reliable health coverage is crucial. Day1Health has been there for me across multiple countries.',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'The Ndlovu Family',
    designation: 'Family Plan',
    description: 'With three kids, we needed a plan that could handle everything from check-ups to emergencies. Day1Health has exceeded our expectations!',
    profileImage: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    name: 'David Wilson',
    designation: 'Senior Member',
    description: 'The peace of mind that comes with Day1Health is priceless. Their network of doctors is extensive and the claims process is seamless.',
    profileImage: 'https://randomuser.me/api/portraits/men/75.jpg'
  }
];

const Feedback: React.FC<FeedbackProps> = ({ isSidebarCollapsed }) => {
  const { isDark } = useTheme();
  return (
    <section id="feedback" className={`py-20 transition-all duration-700 ease-in-out ${
      isDark ? 'bg-gray-800' : 'bg-gray-50'
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
          <h2 className={`text-4xl font-bold text-center mb-4 ${
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
