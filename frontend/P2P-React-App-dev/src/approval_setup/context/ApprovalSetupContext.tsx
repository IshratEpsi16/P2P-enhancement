import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the shape of the context
interface ApprovalSetupContextType {
    approvalSetupPageNo: number;
    setApprovalSetupPageNo: Dispatch<SetStateAction<number>>;
    templateId: number | null;
    setTemplateId: (templateId: number | null) => void;

}

// Create the context
const ApprovalSetupContext = createContext<ApprovalSetupContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useApprovalSetupContext = (): ApprovalSetupContextType => {
    const context = useContext(ApprovalSetupContext);
    if (!context) {
        throw new Error('ApprovalSetupContext must be used within a DocumentProvider');
    }
    return context;
};

// Create a provider component to wrap around the app
export const ApprovalSetupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [number, setNumber] = useState<number>(1);
    const [templateId,setTemplateId]=useState<number | null>(null);


    return (
        <ApprovalSetupContext.Provider
            value={{
                approvalSetupPageNo: number,
                setApprovalSetupPageNo: setNumber,
                templateId,
                setTemplateId

            }}
        >
            {children}
        </ApprovalSetupContext.Provider>
    );
};
