

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface MouPageContextType {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    siteId: number | null;
    setSiteId: React.Dispatch<React.SetStateAction<number | null>>;
    // contactLength: number;
    // setContactLength: React.Dispatch<React.SetStateAction<number>>;

}

// Create the context
const MouPageContext = createContext<MouPageContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useMouPageContext = (): MouPageContextType => {
    const context = useContext(MouPageContext);
    if (!context) {
        throw new Error('useContactPageContext must be used within a ContactProvider');
    }
    return context;
};

// Create a provider component to wrap around the app
export const MouPageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [number, setNumber] = useState<number>(1);
    const [siteId, setSiteId] = useState<number | null>(null);
    // const [contactLength, setContactLength] = useState<number>(0);


    return (
        <MouPageContext.Provider value={{ page: number, setPage: setNumber,siteId,setSiteId  }}>
            {children}
        </MouPageContext.Provider>
    );
};
