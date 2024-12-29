import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface RfqPageContextType {
  csApprovalPageNo: number;
  setCsApprovalPageNo: React.Dispatch<React.SetStateAction<number>>;
}

// Create the context
const CsApprovalContext = createContext<RfqPageContextType | undefined>(
  undefined
);

// Create a custom hook to access the context
export const useCsApprovalContext = (): RfqPageContextType => {
  const context = useContext(CsApprovalContext);
  if (!context) {
    throw new Error(
      "useCsApprovalContext must be used within a CsApprovalProvider"
    );
  }
  return context;
};

// Create a provider component to wrap around the app
export const CsApprovalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [number, setNumber] = useState<number>(1);

  return (
    <CsApprovalContext.Provider
      value={{ csApprovalPageNo: number, setCsApprovalPageNo: setNumber }}
    >
      {children}
    </CsApprovalContext.Provider>
  );
};
