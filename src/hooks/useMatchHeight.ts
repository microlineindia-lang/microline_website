// hooks/useMatchHeight.ts
import { useEffect, type RefObject } from "react";

export function useMatchHeight<T extends HTMLElement = HTMLDivElement>(
  leftRef: RefObject<T | null>,
  rightRef: RefObject<T | null>,
  breakpoint = 768
) {
  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return;

    let resizeObserver: ResizeObserver | null = null;
    let mediaQueryList: MediaQueryList | null = null;

    const syncHeight = () => {
      if (window.innerWidth > breakpoint && leftRef.current && rightRef.current) {
        const rightHeight = rightRef.current.offsetHeight;
        if (rightHeight) {
          leftRef.current.style.height = `${rightHeight}px`;
        }
      } else {
        if (leftRef.current) {
          leftRef.current.style.height = "";
        }
      }
    };

    syncHeight();

    resizeObserver = new ResizeObserver(() => syncHeight());

    if (rightRef.current) resizeObserver.observe(rightRef.current);
    if (leftRef.current) resizeObserver.observe(leftRef.current);

    window.addEventListener("resize", syncHeight);

    mediaQueryList = window.matchMedia(`(min-width: ${breakpoint + 1}px)`);
    mediaQueryList.addEventListener("change", syncHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncHeight);
      mediaQueryList?.removeEventListener("change", syncHeight);
    };
  }, [breakpoint, leftRef, rightRef]);
}