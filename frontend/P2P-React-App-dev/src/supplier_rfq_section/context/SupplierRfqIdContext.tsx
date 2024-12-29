import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import RfqListItemSupplier from "../inteface/RfqListItemSupplier";

// Define the shape of the context for RFQ
interface SupplierRfqIdContextType {
  selectedRfq: RfqListItemSupplier | null; // Change to single RfqListItemSupplier or null
  setSelectedRfq: Dispatch<SetStateAction<RfqListItemSupplier | null>>; // Setter for RFQ
}

// Create the context for RFQ
const SupplierRfqIdContext = createContext<
  SupplierRfqIdContextType | undefined
>(undefined);

// Custom hook to access the RFQ context
export const useSupplierRfqIdContext = (): SupplierRfqIdContextType => {
  const context = useContext(SupplierRfqIdContext);
  if (!context) {
    throw new Error(
      "useSupplierRfqIdContext must be used within a SupplierRfqIdProvider"
    );
  }
  return context;
};

// Provider component to wrap around the app for RFQ
export const SupplierRfqIdProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedRfq, setSelectedRfq] = useState<RfqListItemSupplier | null>(
    null
  ); // Initialize with null

  return (
    <SupplierRfqIdContext.Provider value={{ selectedRfq, setSelectedRfq }}>
      {children}
    </SupplierRfqIdContext.Provider>
  );
};
