'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';

interface AnimateOnViewProps {
  children: ReactNode;
  className?: string;
  /** Stagger index (0–12) for delayed reveal */
  stagger?: number;
  /** Root margin for Intersection Observer (e.g. "-60px" = trigger 60px before element hits viewport bottom) */
  rootMargin?: string;
  /** Only animate once (default true) */
  once?: boolean;
  as?: 'div' | 'section' | 'span';
}

export default function AnimateOnView({
  children,
  className = '',
  stagger,
  rootMargin = '0px 0px -50px 0px',
  once = true,
  as: Component = 'div',
}: AnimateOnViewProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
        else if (!once) setVisible(false);
      },
      { rootMargin, threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, once]);

  const staggerClass = stagger !== undefined ? `stagger-${stagger}` : '';

  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`animate-on-view ${visible ? 'is-visible' : ''} ${staggerClass} ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
