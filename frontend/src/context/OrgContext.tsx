import React, { createContext, useContext, useState, useEffect } from 'react';

interface OrgContextType {
  currentOrgSlug: string;
  setCurrentOrgSlug: (slug: string) => void;
}

const OrgContext = createContext<OrgContextType>({
  currentOrgSlug: 'tech-corp', // Default fallback
  setCurrentOrgSlug: () => {},
});

export const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load from localStorage, default to 'tech-corp'
  const [currentOrgSlug, setCurrentOrgSlug] = useState(() => {
    return localStorage.getItem('currentOrgSlug') || 'tech-corp';
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentOrgSlug', currentOrgSlug);
  }, [currentOrgSlug]);

  return (
    <OrgContext.Provider value={{ currentOrgSlug, setCurrentOrgSlug }}>
      {children}
    </OrgContext.Provider>
  );
};

export const useOrg = () => useContext(OrgContext);