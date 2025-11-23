'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { isImageCached, preloadImages, heroImages } from '@/app/utils/imagePreloader';

const luxuryImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=90',
    alt: 'Luxury modern home exterior',
    title: 'Modern Luxury Living',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=90',
    alt: 'Elegant living room interior',
    title: 'Sophisticated Interiors',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=90',
    alt: 'Luxury bedroom design',
    title: 'Refined Bedrooms',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=90',
    alt: 'Premium kitchen design',
    title: 'Gourmet Kitchens',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=90',
    alt: 'Luxury penthouse view',
    title: 'Stunning Views',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=90',
    alt: 'Luxury furniture design',
    title: 'Premium Furnishings',
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920&q=90',
    alt: 'Elegant dining area',
    title: 'Fine Dining Spaces',
  },
];

interface HeroSlideshowProps {
  onLoadingChange?: (isLoading: boolean, progress: number) => void;
}

export default function HeroSlideshow({ onLoadingChange }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef(false);

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;

  // Initialize and check cached images
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Check which images are already cached
    const cachedIds = new Set<number>();
    luxuryImages.forEach((img) => {
      if (isImageCached(img.url)) {
        cachedIds.add(img.id);
      }
    });

    if (cachedIds.size > 0) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setLoadedImages(cachedIds);
      }, 0);
    }

    // Preload any missing images
    preloadImages(heroImages)
      .then(() => {
        // All images loaded
        const allIds = new Set(luxuryImages.map((img) => img.id));
        setLoadedImages(allIds);
      })
      .catch(() => {
        // Silently fail - images will load normally via Image component
      });
  }, []);

  // Track image loading progress
  useEffect(() => {
    const totalImages = luxuryImages.length;
    const loadedCount = loadedImages.size;
    const progress = totalImages > 0 ? (loadedCount / totalImages) * 100 : 0;
    const isLoading = loadedCount < totalImages;

    if (onLoadingChange) {
      onLoadingChange(isLoading, progress);
    }
  }, [loadedImages, onLoadingChange]);

  // Handle image load (fallback for uncached images)
  const handleImageLoad = (imageId: number) => {
    setLoadedImages((prev) => {
      const newSet = new Set(prev);
      newSet.add(imageId);
      return newSet;
    });
  };

  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }

    // Clear any existing interval
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    // Set up new interval
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % luxuryImages.length);
    }, 6000); // Change slide every 6 seconds

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [isAutoPlaying]);

  const goToSlide = (index: number, e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Reset touch state to prevent interference
    setTouchStart(null);
    setTouchEnd(null);
    // Resume auto-play after 8 seconds
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? luxuryImages.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
    // Reset touch state to prevent interference
    setTouchStart(null);
    setTouchEnd(null);
    // Resume auto-play after 8 seconds
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === luxuryImages.length - 1 ? 0 : prevIndex + 1
    );
    setIsAutoPlaying(false);
    // Reset touch state to prevent interference
    setTouchStart(null);
    setTouchEnd(null);
    // Resume auto-play after 8 seconds
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    // Don't start swipe if touching a button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    // Don't track move if touching a button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    // Don't process swipe if touching a button
    if ((e.target as HTMLElement).closest('button')) {
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }
    
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
    
    // Reset touch state
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Mouse drag handlers
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    // Don't start drag if clicking on a button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const onMouseMove = () => {
    if (!isDragging || dragStart === null) return;
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || dragStart === null) return;
    
    // Don't trigger drag if clicking on a button
    if ((e.target as HTMLElement).closest('button')) {
      setIsDragging(false);
      setDragStart(null);
      return;
    }
    
    const distance = dragStart - e.clientX;
    const isLeftDrag = distance > minSwipeDistance;
    const isRightDrag = distance < -minSwipeDistance;

    if (isLeftDrag) {
      goToNext();
    }
    if (isRightDrag) {
      goToPrevious();
    }

    setIsDragging(false);
    setDragStart(null);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {/* Image Slideshow */}
      <div className="relative w-full h-full">
        {luxuryImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{
              willChange: 'opacity',
            }}
          >
            <div className="absolute inset-0">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                priority={index === 0 || index === 1}
                quality={95}
                className="object-cover"
                sizes="100vw"
                unoptimized={image.url.includes('unsplash.com')}
                onLoad={() => handleImageLoad(image.id)}
              />
              {/* Overlay gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-black/40"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Swipe Indicators - Mobile Only */}
      <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {luxuryImages.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index, e);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              goToSlide(index, e);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer touch-manipulation ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-1.5 bg-white/40 active:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Indicators - Desktop Only */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-50 gap-3">
        {luxuryImages.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index, e);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              goToSlide(index, e);
            }}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer touch-manipulation ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/40 hover:bg-white/60 active:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 md:top-8 right-4 md:right-8 z-30 px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 pointer-events-none">
        <span className="text-white text-xs md:text-sm font-light tracking-wide">
          {currentIndex + 1} / {luxuryImages.length}
        </span>
      </div>

      {/* Pause/Play Indicator */}
      {!isAutoPlaying && (
        <div className="absolute top-6 md:top-8 left-4 md:left-8 z-30 px-3 md:px-4 py-1.5 md:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 pointer-events-none">
          <span className="text-white text-xs md:text-sm font-light">⏸</span>
        </div>
      )}
    </div>
  );
}
