import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface RfqCreateProcessContextType {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

// Create the context
const RfqCreateProcessContext = createContext<
  RfqCreateProcessContextType | undefined
>(undefined);

// Create a custom hook to access the context
export const useRfqCreateProcessContext = (): RfqCreateProcessContextType => {
  const context = useContext(RfqCreateProcessContext);
  if (!context) {
    throw new Error(
      "useRfqCreateProcessContext must be used within a DocumentProvider"
    );
  }
  return context;
};

// Create a provider component to wrap around the app
export const RfqCreateProcessProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [number, setNumber] = useState<number>(1);

  return (
    <RfqCreateProcessContext.Provider
      value={{ page: number, setPage: setNumber }}
    >
      {children}
    </RfqCreateProcessContext.Provider>
  );
};
