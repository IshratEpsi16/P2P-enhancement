import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface PoPageContextType {
  poPageNoInContext: number;
  setPoPageNoInContext: React.Dispatch<React.SetStateAction<number>>;
}

// Create the context
const PoPageContext = createContext<PoPageContextType | undefined>(undefined);

// Create a custom hook to access the context
export const usePoPageContext = (): PoPageContextType => {
  const context = useContext(PoPageContext);
  if (!context) {
    throw new Error("usePoPageContext must be used within a DocumentProvider");
  }
  return context;
};

// Create a provider component to wrap around the app
export const PoPageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [number, setNumber] = useState<number>(1);

  return (
    <PoPageContext.Provider
      value={{ poPageNoInContext: number, setPoPageNoInContext: setNumber }}
    >
      {children}
    </PoPageContext.Provider>
  );
};
