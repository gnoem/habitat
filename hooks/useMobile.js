import { useEffect, useState } from "react";

export const useMobile = (window) => {
  const [isMobile, setIsMobile] = useState(null);
  useEffect(() => {
    if (!window) return;
    const checkWidth = () => {
      if (window.innerWidth <= 900) {
        if (!isMobile) setIsMobile(true);
      }
      else if (isMobile) setIsMobile(false);
    }
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, [window]);
  return isMobile;
}