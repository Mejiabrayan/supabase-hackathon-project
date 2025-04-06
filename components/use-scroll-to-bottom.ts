import { useEffect, useRef } from 'react';

export function useScrollToBottom<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);

  useEffect(() => {
    if (!containerRef.current || !endRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            containerRef.current?.scrollTo({
              top: containerRef.current.scrollHeight,
              behavior: 'smooth',
            });
          }
        });
      },
      { root: containerRef.current }
    );

    observer.observe(endRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return [containerRef, endRef] as const;
}