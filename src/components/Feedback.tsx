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
    name: 'The Mokoena Family',
    designation: 'Family Plan',
    description: 'With three kids, we needed a plan that could handle everything from check-ups to emergencies. Day1Health has exceeded our expectations!',
    profileImage: 'https://psu-gatsby-files-prod.s3.amazonaws.com/s3fs-public/styles/4_3_1500w/public/2022/05/TimekaTounsel.jpg?h=81da5ed6&itok=gBF4t3Yw'
  },
  {
    name: 'David Wilson',
    designation: 'Senior Member',
    description: 'The peace of mind that comes with Day1Health is priceless. Their network of doctors is extensive and the claims process is seamless.',
    profileImage: 'https://randomuser.me/api/portraits/men/75.jpg'
  },
  {
    name: 'Aisha Patel',
    designation: 'Day-to-Day Plan',
    description: 'Appointments are easy to book and the co-payments are reasonable. I switched last year and haven\'t looked back.',
    profileImage: 'https://randomuser.me/api/portraits/women/12.jpg'
  },
  {
    name: 'Johan van Rensburg',
    designation: 'Platinum Member',
    description: 'Transparent pricing, quick support, and excellent cover. Day1Health just works.',
    profileImage: 'https://randomuser.me/api/portraits/men/41.jpg'
  },
  {
    name: 'Lerato M.',
    designation: 'Executive Plan',
    description: 'Claims are paid fast and the benefits are exactly what my family needs. Highly recommended.',
    profileImage: 'https://randomuser.me/api/portraits/women/21.jpg'
  },
  {
    name: 'Carlos Diaz',
    designation: 'Hospital Plan',
    description: 'Had an emergency and everything was handled smoothly at the hospital. Grateful for the cover from day one.',
    profileImage: 'https://randomuser.me/api/portraits/men/19.jpg'
  },
  {
    name: 'Naledi & Thabo',
    designation: 'Couple, Day-to-Day',
    description: 'We\'re both covered and it\'s affordable. The app and statements are simple and clear.',
    profileImage: 'https://randomuser.me/api/portraits/women/50.jpg'
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
