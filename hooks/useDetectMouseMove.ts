import { useEffect, useRef, useState } from "react";

export const useDetectMouseMove = (idleTime: number = 4000) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [idle, setIdle] = useState<boolean>(false);

  const setIdleBackground = () => {
    setIdle(true);
  };

  const resetBackground = () => {
    setIdle(false);
  };

  useEffect(() => {
    const handleActivity = () => {
      resetBackground();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(setIdleBackground, idleTime);
    };

    const events = ["mousemove", "touchmove"];
    events.forEach((event) => document.addEventListener(event, handleActivity));

    timeoutRef.current = setTimeout(setIdleBackground, idleTime);

    return () => {
      events.forEach((event) => document.removeEventListener(event, handleActivity));
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      resetBackground();
    };
  }, [idleTime]);

  return {
    idle,
  };
};
