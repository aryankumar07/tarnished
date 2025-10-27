import { useEffect, useRef, useState } from "react";

export const useDetectMouseMove = (idleTime: number = 10000) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [idle, setIdle] = useState<boolean>(false);

  const setIdleBackground = () => setIdle(true);
  const resetBackground = () => setIdle(false);

  useEffect(() => {
    const handleActivity = () => {
      resetBackground();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(setIdleBackground, idleTime);
    };

    // Add all the events that should reset idle state
    const events = ["mousemove", "touchmove", "click", "scroll"];

    events.forEach((event) => document.addEventListener(event, handleActivity));

    // Start the initial idle timer
    timeoutRef.current = setTimeout(setIdleBackground, idleTime);

    return () => {
      events.forEach((event) => document.removeEventListener(event, handleActivity));
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      resetBackground();
    };
  }, [idleTime]);

  return { idle };
};
