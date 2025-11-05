import React, {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {ArrowLeft, ArrowRight, Quote, X} from "lucide-react";
import {cn} from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

// ===== Types and Interfaces =====
export interface iTestimonial {
	name: string;
	designation: string;
	description: string;
	profileImage: string;
}

interface iCarouselProps {
	items: React.ReactElement<{
		testimonial: iTestimonial;
		index: number;
		layout?: boolean;
		onCardClose: () => void;
	}>[];
	initialScroll?: number;
}

// ===== Custom Hooks =====
const useOutsideClick = (
	ref: React.RefObject<HTMLDivElement | null>,
	onOutsideClick: () => void,
) => {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if (!ref.current || ref.current.contains(event.target as Node)) {
				return;
			}
			onOutsideClick();
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, [ref, onOutsideClick]);
};

// ===== Components =====
const Carousel = ({items, initialScroll = 0}: iCarouselProps) => {
	const carouselRef = React.useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = React.useState(false);
	const [canScrollRight, setCanScrollRight] = React.useState(true);

	const checkScrollability = () => {
		if (carouselRef.current) {
			const {scrollLeft, scrollWidth, clientWidth} = carouselRef.current;
			setCanScrollLeft(scrollLeft > 0);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
		}
	};

	const handleScrollLeft = () => {
		if (carouselRef.current) {
			carouselRef.current.scrollBy({left: -300, behavior: "smooth"});
		}
	};

	const handleScrollRight = () => {
		if (carouselRef.current) {
			carouselRef.current.scrollBy({left: 300, behavior: "smooth"});
		}
	};

	const handleCardClose = (index: number) => {
		if (carouselRef.current) {
			const cardWidth = isMobile() ? 256 : 288;
			const gap = isMobile() ? 4 : 8;
			const scrollPosition = (cardWidth + gap) * (index + 1);
			carouselRef.current.scrollTo({
				left: scrollPosition,
				behavior: "smooth",
			});
		}
	};

	const isMobile = () => {
		return window && window.innerWidth < 768;
	};

	useEffect(() => {
		if (carouselRef.current) {
			carouselRef.current.scrollLeft = initialScroll;
			checkScrollability();
		}
	}, [initialScroll]);

	return (
		<div className="relative w-full mt-10">
			<div
				className="flex w-full overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] py-5 snap-x snap-mandatory"
				ref={carouselRef}
				onScroll={checkScrollability}
			>
				<div
					className={cn(
						"absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l",
					)}
				/>
				<div
					className={cn(
						"flex flex-row justify-start gap-4 px-0",
						"w-full",
					)}
				>
					{items.map((item, index) => {
						return (
							<motion.div
								initial={{opacity: 0, y: 20}}
								animate={{
									opacity: 1,
									y: 0,
									transition: {
										duration: 0.5,
										delay: 0.2 * index,
										ease: "easeOut"
									}
								}}
								viewport={{ once: true }}
								key={`card-${index}`}
								className="rounded-3xl snap-start shrink-0 first:ml-4 last:mr-4"
							>
								{React.cloneElement(item, {
									onCardClose: () => {
										return handleCardClose(index);
									},
								})}
							</motion.div>
						);
					})}
				</div>
			</div>
			<div className="flex justify-center gap-2 mt-6">
				<button
					className="relative z-40 h-10 w-10 rounded-full bg-green-600 flex items-center justify-center disabled:opacity-50 hover:bg-green-700 transition-colors duration-200"
					onClick={handleScrollLeft}
					disabled={!canScrollLeft}
					aria-label="Previous testimonial"
				>
					<ArrowLeft className="h-6 w-6 text-white" />
				</button>
				<button
					className="relative z-40 h-10 w-10 rounded-full bg-green-600 flex items-center justify-center disabled:opacity-50 hover:bg-green-700 transition-colors duration-200"
					onClick={handleScrollRight}
					disabled={!canScrollRight}
					aria-label="Next testimonial"
				>
					<ArrowRight className="h-6 w-6 text-white" />
				</button>
			</div>
		</div>
	);
};

const MAX_PREVIEW_LENGTH = 80; // Maximum characters to show in preview

const TestimonialCard = ({
	testimonial,
	index,
	layout = false,
	onCardClose = () => {},
}: {
	testimonial: iTestimonial;
	index: number;
	layout?: boolean;
	onCardClose?: () => void;
}) => {
	const { isDark } = useTheme();
	const [isExpanded, setIsExpanded] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Format names as: Firstname L.
	const formatName = (fullName: string) => {
		if (!fullName) return "";
		const parts = fullName.trim().split(/\s+/).filter(Boolean);
		const first = parts[0] || "";
		const last = parts.length > 1 ? parts[parts.length - 1] : "";
		const initial = last ? last.charAt(0).toUpperCase() + "." : "";
		return initial ? `${first} ${initial}` : first;
	};

	// Truncate text and add ellipsis if needed
	const shouldTruncate = testimonial.description.length > MAX_PREVIEW_LENGTH;
	const truncatedText = shouldTruncate 
		? `${testimonial.description.slice(0, MAX_PREVIEW_LENGTH).trim()}...` 
		: testimonial.description;

	// Audio functionality removed

	const handleExpand = () => {
		setIsExpanded(true);
	};
	const handleCollapse = () => {
		setIsExpanded(false);
		onCardClose();
	};

	useEffect(() => {
		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				handleCollapse();
			}
		};

		if (isExpanded) {
			const scrollY = window.scrollY;
			document.body.style.position = "fixed";
			document.body.style.top = `-${scrollY}px`;
			document.body.style.width = "100%";
			document.body.style.overflow = "hidden";
			document.body.dataset.scrollY = scrollY.toString();
		} else {
			const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
			document.body.style.position = "";
			document.body.style.top = "";
			document.body.style.width = "";
			document.body.style.overflow = "";
			window.scrollTo({top: scrollY, behavior: "instant"});
		}

		window.addEventListener("keydown", handleEscapeKey);
		return () => {
			return window.removeEventListener("keydown", handleEscapeKey);
		};
	}, [isExpanded]);

	useOutsideClick(containerRef, handleCollapse);

	return (
		<>
			<AnimatePresence>
				{isExpanded && (
					<div className="fixed inset-0 h-screen overflow-hidden z-50">
						<motion.div
							initial={{opacity: 0}}
							animate={{opacity: 1}}
							exit={{opacity: 0}}
							className="bg-black/50 backdrop-blur-lg h-full w-full fixed inset-0"
						/>
						<motion.div
							initial={{opacity: 0, scale: 0.95}}
							animate={{opacity: 1, scale: 1}}
							exit={{opacity: 0, scale: 0.95}}
							transition={{ type: 'spring', damping: 20, stiffness: 300 }}
							ref={containerRef}
							layoutId={layout ? `card-${testimonial.name}` : undefined}
							className={`max-w-3xl mx-auto ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-2xl rounded-2xl overflow-hidden z-[60] relative my-10 max-h-[85vh] flex flex-col`}
						>
							<div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
											<Quote className="h-5 w-5 text-white" />
										</div>
										<div>
											<h3 className="text-white font-semibold text-lg">{formatName(testimonial.name)}</h3>
											<p className="text-green-100 text-sm">{testimonial.designation}</p>
										</div>
									</div>
									<button
										onClick={handleCollapse}
										className="h-8 w-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 transition-colors"
									>
										<X className="h-5 w-5 text-white" />
									</button>
								</div>
							</div>
							<div className="p-6 overflow-y-auto flex-grow">
								<div className={`relative ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-green-100'} p-6 rounded-lg border`}>
									
									{/* Testimonial Text */}
									<div className="relative">
										<Quote className="absolute -left-2 -top-4 h-5 w-5 text-green-200 opacity-70" />
										<p className={`${isDark ? 'text-gray-200' : 'text-gray-700'} text-base leading-relaxed pl-4`}>{testimonial.description}</p>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
			<motion.div
				layoutId={layout ? `card-${testimonial.name}` : undefined}
				className=""
				whileHover={{
					rotateX: 2,
					rotateY: 2,
					rotate: 1,
					scale: 1.02,
					transition: { duration: 0.3, ease: "easeOut" },
				}}
			>
				<div
					className={`${index % 2 === 0 ? "rotate-0" : "-rotate-1"} rounded-3xl ${isDark ? 'bg-gradient-to-b from-gray-800 to-gray-700' : 'bg-gradient-to-b from-white to-green-50'} h-[440px] md:h-[480px] w-[85vw] sm:w-64 md:w-72 overflow-hidden flex flex-col items-center justify-start py-6 relative z-10 shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-green-500`}
				>
					<ProfileImage src={testimonial.profileImage} alt={testimonial.name} />
					<div className="px-4 mt-4 text-center">
						<motion.p
							layoutId={layout ? `title-${testimonial.name}` : undefined}
							className={`${isDark ? 'text-gray-200' : 'text-gray-700'} text-base md:text-lg font-medium leading-relaxed`}
						>
							"{truncatedText}"
						</motion.p>
						{shouldTruncate && (
							<button 
								onClick={handleExpand}
								className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium flex items-center justify-center w-full group"
							>
								Read more
								<svg 
									className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" 
									fill="none" 
									viewBox="0 0 24 24" 
									stroke="currentColor"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</button>
						)}
					</div>
					<motion.p
						layoutId={layout ? `category-${testimonial.name}` : undefined}
						className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg md:text-xl font-bold text-center mt-4`}
					>
						{formatName(testimonial.name)}
					</motion.p>
					<motion.p
						className="text-green-600 text-sm md:text-base font-medium text-center mt-2 underline underline-offset-4"
					>
						{testimonial.designation.length > 30
							? `${testimonial.designation.slice(0, 30)}...`
							: testimonial.designation}
					</motion.p>
				</div>
			</motion.div>
		</>
	);
};

const ProfileImage = ({ src: _src, alt, className, ...rest }: { src: string; alt: string; className?: string }) => {
  const initials = (alt || 'User')
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join('') || 'U';

  return (
    <div
      className={cn(
        "w-[90px] h-[90px] md:w-[120px] md:h-[120px] overflow-hidden rounded-full border-4 border-green-200 aspect-[1/1] flex-none relative",
        "bg-green-600 text-white flex items-center justify-center font-semibold text-xl md:text-2xl",
        className
      )}
      aria-label={alt || 'Profile image'}
      {...rest}
    >
      <span aria-hidden="true">{initials}</span>
      <span className="sr-only">{alt || 'Profile image'}</span>
    </div>
  );
};

// Export the components
export {Carousel, TestimonialCard, ProfileImage};
