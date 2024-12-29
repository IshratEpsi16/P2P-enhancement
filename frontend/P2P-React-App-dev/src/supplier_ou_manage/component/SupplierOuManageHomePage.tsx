import React from 'react'
import { useMouPageContext } from '../context/MouPageContext'
import MouSupplierListPage from './MouSupplierListPage';
import MouSupplierDetailsPage from './MouSupplierDetailsPage';
import MouSiteListPage from './MouSiteListPage';
export default function SupplierOuManageHomePage() {
    const {page}=useMouPageContext();
  return (
    <div >
    {(() => {
        switch (page) {
            case 1:
                return <MouSupplierListPage />


            case 2:
                return <MouSiteListPage />
            case 3:
                return <MouSupplierDetailsPage />

            default:
                return null;
        }
    })()}
</div>
  )
}
