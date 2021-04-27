import React, { useEffect, useState } from "react";

export const MobileContext = React.createContext(null);

export const MobileContextProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth <= 900) {
        if (!isMobile) setIsMobile(true);
      }
      else if (isMobile) setIsMobile(false);
    }
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);
  return (
    <MobileContext.Provider value={isMobile}>
      {children}
    </MobileContext.Provider>
  );
}