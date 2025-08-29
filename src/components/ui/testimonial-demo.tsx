import {Carousel, TestimonialCard} from "@/components/ui/retro-testimonial";
import {iTestimonial} from "@/components/ui/retro-testimonial";

type TestimonialDetails = {
	[key: string]: iTestimonial & {id: string};
};

const testimonialData = {
	ids: [
		"day1-testimonial-001",
		"day1-testimonial-002", 
		"day1-testimonial-003",
		"day1-testimonial-004",
		"day1-testimonial-005",
		"day1-testimonial-006",
	],
	details: {
		"day1-testimonial-001": {
			id: "day1-testimonial-001",
			description:
				"Day1Health saved my family when we needed emergency care. The process was smooth, and we were covered from day one. I can't recommend them enough.",
			profileImage:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
			name: "Sarah M.",
			designation: "Executive Plan Member",
		},
		"day1-testimonial-002": {
			id: "day1-testimonial-002",
			description:
				"As a small business owner, I needed affordable healthcare that actually works. Day1Health delivered exactly that. My chronic medication is covered and I have peace of mind.",
			profileImage:
				"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
			name: "Michael K.",
			designation: "Day-to-Day Plan Member",
		},
		"day1-testimonial-003": {
			id: "day1-testimonial-003",
			description:
				"The customer service is outstanding. When I had questions about my benefits, they explained everything clearly. It's refreshing to deal with a company that actually cares.",
			profileImage:
				"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
			name: "Lisa T.",
			designation: "Platinum Plan Member",
		},
		"day1-testimonial-004": {
			id: "day1-testimonial-004",
			description:
				"After years of struggling with expensive medical aid, Day1Health was a breath of fresh air. Affordable, comprehensive, and they actually pay claims quickly.",
			profileImage:
				"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
			name: "David P.",
			designation: "Executive Plan Member",
		},
		"day1-testimonial-005": {
			id: "day1-testimonial-005",
			description:
				"I was skeptical about switching, but Day1Health proved me wrong. The network of doctors is extensive and the app makes everything so easy to manage.",
			profileImage:
				"https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
			name: "Jennifer R.",
			designation: "Day-to-Day Plan Member",
		},
		"day1-testimonial-006": {
			id: "day1-testimonial-006",
			description:
				"The peace of mind Day1Health provides is priceless. Knowing my family is covered from day one, with no waiting periods, makes all the difference.",
			profileImage:
				"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
			name: "Robert S.",
			designation: "Platinum Plan Member",
		},
	},
};

// Create testimonial cards
const cards = testimonialData.ids.map((cardId: string, index: number) => {
	const details = testimonialData.details as TestimonialDetails;
	return (
		<TestimonialCard
			key={cardId}
			testimonial={details[cardId]}
			index={index}
			backgroundImage="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=3131&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
		/>
	);
});

const TestimonialCarousel = () => {
  return (
    <div className="w-full">
      <Carousel items={cards} />
    </div>
  );
};

export { TestimonialCarousel };
