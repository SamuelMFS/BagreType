import { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  currentLayout: string | null;
  setCurrentLayout: (layout: string | null) => void;
  layoutName: string;
  setLayoutName: (name: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [currentLayout, setCurrentLayout] = useState<string | null>(null);
  const [layoutName, setLayoutName] = useState<string>('qwerty');

  return (
    <LayoutContext.Provider value={{
      currentLayout,
      setCurrentLayout,
      layoutName,
      setLayoutName
    }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
