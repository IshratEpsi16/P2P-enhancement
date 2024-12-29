import React from 'react';
import { useContactPageContext } from '../../context/ContactPageContext';
import ContactListPage from './ContactListPage';
import ContactSupplierPage from './ContactSupplierPage';

export default function ContactHome() {

    const { page } = useContactPageContext();
    return (
        <div >
            {(() => {
                switch (page) {
                    case 1:
                        return <ContactListPage />


                    case 2:
                        return <ContactSupplierPage />

                    default:
                        return null;
                }
            })()}
        </div>
    )
}
