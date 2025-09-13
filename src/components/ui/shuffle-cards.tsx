import { TestimonialCard } from "@/components/ui/testimonial-cards";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    testimonial: "Day1Health made getting health insurance so simple. I finally feel secure knowing I'm covered for anything life throws at me.",
    author: "Sarah M. - Marketing Director @ TechCorp",
    detailedDescription: "Sarah was struggling with complex insurance paperwork and confusing policy terms at her previous provider. After switching to Day1Health, she found the enrollment process straightforward and transparent. The digital-first approach and clear communication helped her understand exactly what she was covered for, giving her the confidence to focus on her career without worrying about unexpected medical costs."
  },
  {
    id: 2,
    testimonial: "The coverage is comprehensive and the claims process is seamless. Best decision I made for my health and peace of mind.", 
    author: "Michael K. - Software Engineer @ StartupXYZ",
    detailedDescription: "As a software engineer at a fast-growing startup, Michael needed reliable health coverage that wouldn't slow him down with bureaucratic hassles. Day1Health's streamlined claims process and comprehensive coverage meant he could get the care he needed quickly. When he had a minor injury during a weekend hiking trip, his claim was processed within 24 hours, allowing him to focus on recovery rather than paperwork."
  },
  {
    id: 3,
    testimonial: "Finally, health insurance that actually works for working professionals. The team at Day1Health truly understands our needs.",
    author: "Jessica L. - Product Manager @ InnovateCo",
    detailedDescription: "Jessica had been frustrated with traditional insurance providers that seemed designed for a different era. As a busy product manager, she needed flexible coverage that understood the demands of modern work life. Day1Health's approach to preventive care, mental health support, and flexible scheduling for appointments perfectly aligned with her lifestyle and career demands."
  }
];

interface ShuffleCardsProps {
  className?: string;
  onTestimonialSelect?: (testimonial: typeof testimonials[0]) => void;
  selectedTestimonialId?: number;
}

function ShuffleCards({ className = "", onTestimonialSelect, selectedTestimonialId }: ShuffleCardsProps) {
  const [positions, setPositions] = useState(["front", "middle", "back"]);

  const handleShuffle = () => {
    const newPositions = [...positions];
    newPositions.unshift(newPositions.pop()!);
    setPositions(newPositions);
    
    // Auto-select the new front testimonial
    const frontIndex = positions.findIndex(pos => pos === "front");
    const newFrontIndex = (frontIndex + 1) % testimonials.length;
    if (onTestimonialSelect) {
      onTestimonialSelect(testimonials[newFrontIndex]);
    }
  };

  const handleCardClick = (testimonial: typeof testimonials[0]) => {
    if (onTestimonialSelect) {
      onTestimonialSelect(testimonial);
    }
  };

  return (
    <div className={`grid place-content-center overflow-hidden px-8 py-12 text-slate-50 h-full w-full ${className}`}>
      <div className="relative ml-0 h-[450px] w-[350px] flex justify-center">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            {...testimonial}
            handleShuffle={handleShuffle}
            position={positions[index]}
            onClick={() => handleCardClick(testimonial)}
            isSelected={selectedTestimonialId === testimonial.id}
          />
        ))}
      </div>
    </div>
  );
}

export { ShuffleCards }
