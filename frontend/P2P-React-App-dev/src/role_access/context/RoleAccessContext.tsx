import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the shape of the context
interface RoleAccessContextType {
    roleAccessPageNo: number;
    setRoleAccessPageNo: Dispatch<SetStateAction<number>>;
    userId: number | null;
    setUserId: Dispatch<SetStateAction<number | null>>;
}

// Create the context
const RoleAccessContext = createContext<RoleAccessContextType | undefined>(undefined);

// Create a custom hook to access the context
export const useRoleAccessContext = (): RoleAccessContextType => {
    const context = useContext(RoleAccessContext);
    if (!context) {
        throw new Error('roleAccessContext must be used within a DocumentProvider');
    }
    return context;
};

// Create a provider component to wrap around the app
export const RoleAccessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [number, setNumber] = useState<number>(1);
    const [userId, setUserId] = useState<number | null>(null);

    return (
        <RoleAccessContext.Provider
            value={{
                roleAccessPageNo: number,
                setRoleAccessPageNo: setNumber,
                userId,
                setUserId,
            }}
        >
            {children}
        </RoleAccessContext.Provider>
    );
};
