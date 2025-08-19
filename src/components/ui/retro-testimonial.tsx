import React, {useEffect, useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {ArrowLeft, ArrowRight, Quote, X, Play, Pause, RotateCcw} from "lucide-react";
import {cn} from "@/lib/utils";
import { speakText } from "@/lib/tts";
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
				className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth [scrollbar-width:none] py-5"
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
						"flex flex-row justify-start gap-4 pl-2 md:pl-4 pr-4",
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
								className="last:pr-4 rounded-3xl"
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
				>
					<ArrowLeft className="h-6 w-6 text-white" />
				</button>
				<button
					className="relative z-40 h-10 w-10 rounded-full bg-green-600 flex items-center justify-center disabled:opacity-50 hover:bg-green-700 transition-colors duration-200"
					onClick={handleScrollRight}
					disabled={!canScrollRight}
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
	backgroundImage = "https://images.unsplash.com/photo-1686806372726-388d03ff49c8?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
}: {
	testimonial: iTestimonial;
	index: number;
	layout?: boolean;
	onCardClose?: () => void;
	backgroundImage?: string;
}) => {
	const { isDark } = useTheme();
	const [isExpanded, setIsExpanded] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [showAudioPulse, setShowAudioPulse] = useState(false);
	const audioRef = useRef<ReturnType<typeof speakText> | null>(null);
	const progressInterval = useRef<number | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const audioButtonRef = useRef<HTMLButtonElement>(null);

	// Truncate text and add ellipsis if needed
	const shouldTruncate = testimonial.description.length > MAX_PREVIEW_LENGTH;
	const truncatedText = shouldTruncate 
		? `${testimonial.description.slice(0, MAX_PREVIEW_LENGTH).trim()}...` 
		: testimonial.description;

	const handlePlayPause = () => {
	  if (isPlaying) {
		audioRef.current?.stop();
		if (progressInterval.current) {
		  clearInterval(progressInterval.current);
		  progressInterval.current = null;
		}
		setIsPlaying(false);
	  } else {
		// Stop any currently playing audio
		window.speechSynthesis.cancel();
		
		// Start new speech
		audioRef.current = speakText(testimonial.description);
		setIsPlaying(true);
		setCurrentTime(0);
		
		// Estimate duration (average reading speed is about 150 words per minute)
		const wordCount = testimonial.description.split(/\s+/).length;
		const estimatedDuration = (wordCount / 150) * 60 * 1000; // in milliseconds
		setDuration(estimatedDuration);
		
		// Update progress
		const startTime = Date.now();
		progressInterval.current = window.setInterval(() => {
		  const elapsed = Date.now() - startTime;
		  setCurrentTime(Math.min(elapsed, estimatedDuration));
		  
		  if (elapsed >= estimatedDuration) {
			setIsPlaying(false);
			if (progressInterval.current) {
			  clearInterval(progressInterval.current);
			  progressInterval.current = null;
			}
		  }
		}, 100);
	  }
	};

	const handleRestart = () => {
	  if (progressInterval.current) {
		clearInterval(progressInterval.current);
	  }
	  setCurrentTime(0);
	  
	  if (isPlaying) {
		window.speechSynthesis.cancel();
		handlePlayPause(); // This will restart the speech
		handlePlayPause(); // First call stops, second call starts again
	  }
	};

	// Clean up on unmount
	useEffect(() => {
	  return () => {
		if (progressInterval.current) {
		  clearInterval(progressInterval.current);
		}
		if (audioRef.current) {
		  audioRef.current.stop();
		}
	  };
	}, []);

	const handleExpand = () => {
		setIsExpanded(true);
		// Flash the audio button when popup opens
		setShowAudioPulse(true);
		const timer = setTimeout(() => setShowAudioPulse(false), 3000);
		return () => clearTimeout(timer);
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
											<h3 className="text-white font-semibold text-lg">{testimonial.name}</h3>
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
									{/* Audio Controls */}
									<div className="flex items-center justify-between mb-4">
										<div className="flex-1 pr-4">
											<div className="w-full bg-gray-100 rounded-full h-1.5">
												<div 
													className="bg-green-500 h-full rounded-full transition-all duration-300" 
													style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
												></div>
											</div>
										</div>
										<div className="flex items-center space-x-2">
											<button 
												ref={audioButtonRef}
												onClick={handlePlayPause}
												className={`p-2 rounded-full transition-all shadow-sm relative overflow-hidden ${
													isPlaying 
														? 'bg-green-100 text-green-700' 
														: 'bg-green-50 text-green-600 hover:bg-green-100'
												} ${showAudioPulse ? 'animate-pulse ring-2 ring-green-400' : ''}`}
												title={isPlaying ? 'Pause' : 'Play'}
											>
												{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
												{showAudioPulse && (
													<motion.span 
														className="absolute inset-0 rounded-full bg-green-200 opacity-0"
														animate={{ opacity: [0, 0.5, 0], scale: [1, 1.5, 2] }}
														transition={{ duration: 1.5, repeat: 2 }}
													/>
												)}
											</button>
											<button 
												onClick={handleRestart}
												className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors shadow-sm"
												title="Restart"
											>
												<RotateCcw className="w-3.5 h-3.5" />
											</button>
										</div>
									</div>
									
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
					className={`${index % 2 === 0 ? "rotate-0" : "-rotate-1"} rounded-3xl ${isDark ? 'bg-gradient-to-b from-gray-800 to-gray-700' : 'bg-gradient-to-b from-white to-green-50'} h-[440px] md:h-[480px] w-64 md:w-72 overflow-hidden flex flex-col items-center justify-start py-6 relative z-10 shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-green-500`}
				>
					<div className="absolute opacity-10 pointer-events-none" style={{inset: "-1px 0 0"}}>
						<div className="absolute inset-0">
							<img
								className="block w-full h-full object-center object-cover"
								src={backgroundImage}
								alt="Background layer"
							/>
						</div>
					</div>
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
						{testimonial.name}
					</motion.p>
					<motion.p
						layoutId={layout ? `category-${testimonial.name}` : undefined}
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

const ProfileImage = ({src, alt, className, ...rest}: {src: string; alt: string; className?: string}) => {
	const [isLoading, setLoading] = useState(true);

	return (
		<div className="w-[90px] h-[90px] md:w-[120px] md:h-[120px] overflow-hidden rounded-full border-4 border-green-200 aspect-[1/1] flex-none relative bg-gray-100">
			<img
				className={cn(
					"transition duration-300 absolute top-0 inset-0 rounded-inherit object-cover z-50",
					isLoading ? "blur-sm" : "blur-0",
					className
				)}
				onLoad={() => {
					return setLoading(false);
				}}
				src={src}
				loading="lazy"
				decoding="async"
				alt={alt || "Profile image"}
				{...rest}
			/>
		</div>
	);
};

// Export the components
export {Carousel, TestimonialCard, ProfileImage};
