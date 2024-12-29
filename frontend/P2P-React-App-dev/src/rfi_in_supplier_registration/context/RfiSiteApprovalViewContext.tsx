

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface RfiSiteApprovalViewContextType {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    siteId: number | null;
    setSiteId: React.Dispatch<React.SetStateAction<number | null>>;

    siteLength: number;
    setSiteLength: React.Dispatch<React.SetStateAction<number>>;

}

// Create the context
const RfiSiteApprovalViewContext = createContext<RfiSiteApprovalViewContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useRfiSiteApprovalViewContext = (): RfiSiteApprovalViewContextType => {
    const context = useContext(RfiSiteApprovalViewContext);
    if (!context) {
        throw new Error('useRfiSiteContext must be used within a DocumentProvider');
    }
    return context;
};

// Create a provider component to wrap around the app
export const RfiSiteApprovalViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [number, setNumber] = useState<number>(1);
    const [siteId, setSiteId] = useState<number | null>(null);
    const [siteLength, setSiteLength] = useState<number>(0);


    return (
        <RfiSiteApprovalViewContext.Provider value={{ page: number, setPage: setNumber, siteId, setSiteId, siteLength, setSiteLength }}>
            {children}
        </RfiSiteApprovalViewContext.Provider>
    );
};
