import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface RfqPageContextType {
  rfqPageNo: number;
  setRfqPageNo: React.Dispatch<React.SetStateAction<number>>;
}

// Create the context
const RfqPageContext = createContext<RfqPageContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useRfqPageContext = (): RfqPageContextType => {
  const context = useContext(RfqPageContext);
  if (!context) {
    throw new Error("useRfqPageContext must be used within a RfqPageProvider");
  }
  return context;
};

// Create a provider component to wrap around the app
export const RfqPageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [number, setNumber] = useState<number>(1);

  return (
    <RfqPageContext.Provider
      value={{ rfqPageNo: number, setRfqPageNo: setNumber }}
    >
      {children}
    </RfqPageContext.Provider>
  );
};
