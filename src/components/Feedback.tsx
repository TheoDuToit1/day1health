import React from 'react';
import { Carousel, StarRating, TestimonialCard } from './ui/retro-testimonial';
import { useTheme } from '../contexts/ThemeContext';

interface FeedbackProps {
  isSidebarCollapsed: boolean;
}

const testimonials = [
  {
    name: 'Vinesh Bissin',
    designation: 'Day1 Member',
    description: 'Day1 Health has been fantastic for my family. The claims process is straightforward and their customer service is always helpful when I call.',
    profileImage: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&auto=format&fit=crop&q=60',
    rating: 4.5
  },
  {
    name: 'Johan',
    designation: 'helloPeter review',
    description: 'Was assisted by Johan and what a professional. man. Always kind, helpful and so much empathy towards us. Thank you so much Johan.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60',
    rating: 5
  },
  {
    name: 'Bukeka Msibi',
    designation: 'Day1 Member',
    description: 'Day1 Health has been excellent. I misplaced my product guide, and they quickly helped me.',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60',
    rating: 4.5
  },
  {
    name: 'Melicia S',
    designation: 'helloPeter review',
    description: 'I send a request to be called back and was called by Jane Sathekge who assisted me with all my questions with a smile on her face...she even went the extra mile to make contact with the dentist to reschedule my appointment. Thank you for your excellent and professional service on Saturday morning. Keep up the good work 🙏',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60',
    rating: 5
  },
  {
    name: 'Violet Joseph',
    designation: 'Day1 Member',
    description: 'Had to use my cover for a GP visit last month - everything went smoothly. No hassles, just showed my card and I was sorted.',
    profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=60',
    rating: 4.5
  },
  {
    name: 'Nerine A',
    designation: 'helloPeter review',
    description: 'I have been with Day 1 Health now for a couple of years. I have also been through some very difficult times during that period concerning the health of my family. I must compliment the staff at Day 1 Health especially Johan that have guided me to make the correct choices and guiding me through the processes. I must honestly say that they have been my lifeline and have been very helpful going out of their way to help me and...',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60',
    rating: 5
  },
  {
    name: 'Maria Maswangai',
    designation: 'Day1 Member',
    description: 'Been with Day1 Health for over a year now. Great value for money and they actually pay out when you need them to.',
    profileImage: 'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=400&auto=format&fit=crop&q=60',
    rating: 4.5
  },
  {
    name: 'Lynett C',
    designation: 'helloPeter review',
    description: 'I was assist by  Celine Kriel. Very professional and Helpful.',
    profileImage: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400&auto=format&fit=crop&q=60',
    rating: 5
  },
  {
    name: 'Salim Jadwat',
    designation: 'Day1 Member',
    description: 'My doctor accepts Day1 Health without any issues. The monthly premiums are affordable and the cover is comprehensive.',
    profileImage: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&auto=format&fit=crop&q=60',
    rating: 4.5
  },
  {
    name: 'SANNETTE C',
    designation: 'helloPeter review',
    description: 'A special thanks to David Baloyi (Sales Consultant & Authorized Representative) at Day1 Health, who ALWAYS replies on my email queries. He is consistent and truly reliable in my eyes!!! I hope his company values him!',
    profileImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&auto=format&fit=crop&q=60',
    rating: 5
  },
  {
    name: 'Rakesh Ramal',
    designation: 'Day1 Member',
    description: 'Their support team called to check how my recent hospital visit went. That level of care really impressed me - you don\'t get that everywhere.',
    profileImage: 'https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400&auto=format&fit=crop&q=60',
    rating: 5
  },
  {
    name: 'Trevor Williams',
    designation: 'Day1 Member',
    description: 'Switched from another provider last year and couldn\'t be happier. Day1 Health actually covers what they say they will.',
    profileImage: 'https://images.unsplash.com/photo-1544005313-ef5b7f8e3e32?w=400&auto=format&fit=crop&q=60',
    rating: 5
  },
  {
    name: 'Martina Van Wyk',
    designation: 'Day1 Member',
    description: 'Recommended Day1 Health to my whole family. When my mom needed emergency treatment, they covered everything without any drama.',
    profileImage: 'https://images.unsplash.com/photo-1541216970279-affbfdd55aa8?w=400&auto=format&fit=crop&q=60',
    rating: 5
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
          <span className={`inline-block px-3 py-1 text-sm font-medium rounded-[9px] mb-4 ${
            isDark 
              ? 'bg-green-900/50 text-green-400' 
              : 'bg-green-100 text-green-800'
          }`}>
            Reviews
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

        <div className="mb-12 flex justify-center">
          <div className={`inline-flex flex-col items-center gap-3 rounded-[9px] border px-5 py-4 text-center shadow-sm sm:flex-row sm:gap-4 sm:px-6 ${
            isDark
              ? 'border-emerald-900/70 bg-gradient-to-r from-emerald-950/50 via-gray-900 to-emerald-950/40'
              : 'border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-100/80'
          }`}>
            <img
              src="/assets/images/logo.svg"
              alt="Hello Peter"
              className="h-6 w-auto"
            />
            <div className={`hidden h-8 w-px sm:block ${
              isDark ? 'bg-emerald-800/70' : 'bg-emerald-200'
            }`} />
            <StarRating rating={5} label="5/5" />
          </div>
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


