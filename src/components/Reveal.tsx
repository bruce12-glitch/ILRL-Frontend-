import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** stagger delay in ms */
  delay?: number;
  id?: string;
}

/**
 * Fades + lifts content into view once via IntersectionObserver.
 * Respects prefers-reduced-motion through CSS (no JS check needed).
 */
export function Reveal({ children, className, delay = 0, id }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If the element is already in view on mount, show immediately
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      id={id}
      ref={ref}
      className={cn("reveal", shown && "is-shown", className)}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
