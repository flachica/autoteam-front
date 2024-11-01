import { createContext, useContext, useState, useEffect } from 'react';

interface DebugContextType {
  debugging: boolean;
  toggleDebugging: () => void;
}
const DebugContext = createContext<DebugContextType>({ debugging: false, toggleDebugging: () => {} });

export const DebugProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDebugging, setDebugging] = useState<boolean>(false);

  return (
    <DebugContext.Provider value={{
      debugging: isDebugging, toggleDebugging: () => {
        setDebugging(!isDebugging);
    } }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useIsDebugging = (): boolean => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useIsDebugging must be used within a PlayerProvider');
  }
  return context.debugging;
};

export const useToggleDebugging = (): (() => void) => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useToggleDebugging must be used within a DebugProvider');
  }
  return context.toggleDebugging;
};