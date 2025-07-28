import React from 'react';
import { Carousel, TestimonialCard } from './ui/retro-testimonial';

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
  return (
    <section id="feedback" className={`py-20 bg-gray-50 transition-all duration-500 ${
      isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-40'
    }`}>
      <div className="mx-auto px-4" style={{ maxWidth: '90rem' }}>
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Members Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
