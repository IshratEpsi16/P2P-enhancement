import React from 'react'
import { useSupplierDocumentPageContext } from '../context/SupplierDocumentPageContext';
import DocumentPageOneSupplierProfile from './document_pages/DocumentPageOneSupplierProfile';
import DocumentPageTwoSupplierProfile from './document_pages/DocumentPageTwoSupplierProfile';
import DocumentPageThreeSupplierProfile from './document_pages/DocumentPageThreeSupplierProfile';
import DocumentPageFourSupplierProfile from './document_pages/DocumentPageFourSupplierProfile';
export default function DocumentSupplierProfilePage() {

    const { page } = useSupplierDocumentPageContext();
    return (
        <div>
            {(() => {
                switch (page) {
                    // case 'home':
                    //   return <Home/>
                    case 1:
                        return <DocumentPageOneSupplierProfile />
                    case 2:
                        return <DocumentPageTwoSupplierProfile />
                    case 3:
                        return <DocumentPageThreeSupplierProfile />
                    case 4:
                        return <DocumentPageFourSupplierProfile />

                    default:
                        return null
                }
            })()}
        </div>
    )
}
