// hooks/useMatchHeight.ts
import { useEffect, type RefObject } from 'react';

export function useMatchHeight<T extends HTMLElement = HTMLDivElement>(
  leftRef: RefObject<T>,
  rightRef: RefObject<T>,
  breakpoint = 768 // px, will only sync above this width
) {
  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return;

    let resizeObserver: ResizeObserver | null = null;
    let mediaQueryList: MediaQueryList | null = null;

    const syncHeight = () => {
      // Only sync if screen width is above breakpoint (desktop/tablet landscape)
      if (window.innerWidth > breakpoint && leftRef.current && rightRef.current) {
        const rightHeight = rightRef.current.offsetHeight;
        if (rightHeight) {
          leftRef.current.style.height = `${rightHeight}px`;
        }
      } else {
        // On mobile, remove any forced height so CSS can take over
        if (leftRef.current) {
          leftRef.current.style.height = '';
        }
      }
    };

    // Initial sync
    syncHeight();

    // Watch for resize and layout changes
    resizeObserver = new ResizeObserver(() => syncHeight());
    resizeObserver.observe(rightRef.current);
    resizeObserver.observe(leftRef.current);

    // Also listen for orientation / window resize
    window.addEventListener('resize', syncHeight);
    // Optional: listen for orientation change
    mediaQueryList = window.matchMedia(`(min-width: ${breakpoint + 1}px)`);
    mediaQueryList.addEventListener('change', syncHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', syncHeight);
      mediaQueryList?.removeEventListener('change', syncHeight);
    };
  }, [breakpoint, leftRef, rightRef]);
}