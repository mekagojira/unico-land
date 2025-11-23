'use client';

import { useEffect, useState, useRef } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
  progress: number;
}

export default function LoadingScreen({ isLoading, progress }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeOutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth progress animation
  useEffect(() => {
    const targetProgress = Math.min(100, Math.max(0, progress));
    const diff = targetProgress - displayProgress;
    
    if (Math.abs(diff) > 0.5) {
      const timer = setTimeout(() => {
        setDisplayProgress((prev) => {
          const step = diff * 0.1;
          return Math.min(100, Math.max(0, prev + step));
        });
      }, 16); // ~60fps
      
      return () => clearTimeout(timer);
    }
  }, [progress, displayProgress]);

  // Auto-hide timeout (max 10 seconds)
  useEffect(() => {
    if (isLoading) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        // Force hide after 10 seconds even if still loading
        setIsVisible(false);
      }, 10000);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Delay hiding to allow fade-out animation
      fadeOutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 800);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (fadeOutRef.current) {
        clearTimeout(fadeOutRef.current);
      }
    };
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-opacity duration-700 ease-in-out ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Blurred luxury background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/95 via-blue-900/95 to-gray-950/95 backdrop-blur-3xl"></div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/30 via-transparent to-blue-600/20 animate-pulse"></div>
      
      {/* Luxury background pattern - very subtle */}
      <div 
        className="absolute inset-0 opacity-[0.02] backdrop-blur-2xl"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-59-19c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Content with blur effect */}
      <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm">
        {/* Elegant Logo/Brand */}
        <div className="mb-16 md:mb-20 relative">
          <div className="w-28 h-28 md:w-40 md:h-40 mx-auto relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-blue-500/20 to-blue-600/20 rounded-full blur-2xl animate-pulse"></div>
            
            {/* Middle ring with blur */}
            <div className="absolute inset-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10"></div>
            
            {/* Inner logo circle */}
            <div className="absolute inset-4 md:inset-6 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-blue-400/30 via-blue-500/40 to-blue-600/30 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                <span className="text-white/90 text-3xl md:text-5xl font-extralight tracking-wider">U</span>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Loading Text */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extralight text-white/80 mb-2 tracking-[0.2em] uppercase">
            Loading
          </h2>
          <div className="flex justify-center gap-1">
            <span className="text-white/60 text-xl animate-pulse" style={{ animationDelay: '0ms' }}>.</span>
            <span className="text-white/60 text-xl animate-pulse" style={{ animationDelay: '200ms' }}>.</span>
            <span className="text-white/60 text-xl animate-pulse" style={{ animationDelay: '400ms' }}>.</span>
          </div>
        </div>

        {/* Luxury Progress Bar */}
        <div className="w-72 md:w-96 mb-6 relative">
          <div className="h-0.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-blue-400/80 via-blue-300/90 to-blue-200/80 transition-all duration-500 ease-out rounded-full shadow-lg shadow-blue-500/50 relative overflow-hidden"
              style={{ width: `${displayProgress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>

        {/* Progress Percentage - Elegant */}
        <p className="text-sm md:text-base text-white/50 font-extralight tracking-widest">
          {Math.round(displayProgress)}%
        </p>
      </div>
    </div>
  );
}

