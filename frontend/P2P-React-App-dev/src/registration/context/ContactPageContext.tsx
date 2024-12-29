

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface ContactPageContextType {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    contactId: number | null;
    setContactId: React.Dispatch<React.SetStateAction<number | null>>;
    contactLength: number;
    setContactLength: React.Dispatch<React.SetStateAction<number>>;

}

// Create the context
const ContactPageContext = createContext<ContactPageContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useContactPageContext = (): ContactPageContextType => {
    const context = useContext(ContactPageContext);
    if (!context) {
        throw new Error('useContactPageContext must be used within a ContactProvider');
    }
    return context;
};

// Create a provider component to wrap around the app
export const ContactPageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [number, setNumber] = useState<number>(1);
    const [contactId, setContactId] = useState<number | null>(null);
    const [contactLength, setContactLength] = useState<number>(0);


    return (
        <ContactPageContext.Provider value={{ page: number, setPage: setNumber, contactId, setContactId, contactLength, setContactLength }}>
            {children}
        </ContactPageContext.Provider>
    );
};
