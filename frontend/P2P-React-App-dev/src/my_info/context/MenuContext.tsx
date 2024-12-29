import React, { createContext, useState, useContext, ReactNode } from 'react';

interface MenuContextProps {
    menu: number | null; // Change 'any' to the type of your 'menu' state
    setMenu: React.Dispatch<React.SetStateAction<any>>; // Change 'any' to the type of your 'menu' state
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [menu, setMenu] = useState<number | null>(500); // Change 'any' to the initial state type

    return (
        <MenuContext.Provider value={{ menu, setMenu }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenuContext = (): MenuContextProps => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenuContext must be used within a MenuProvider');
    }
    return context;
};
