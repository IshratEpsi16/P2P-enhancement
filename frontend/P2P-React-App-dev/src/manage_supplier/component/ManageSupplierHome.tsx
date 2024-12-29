import React from 'react'
import { useManageSupplierContext } from '../interface/ManageSupplierContext'
import SupplierListPage from './SupplierListPage';
import ApproveSupplierPage from './ApproveSupplierPage';
import SupplierApprovalPage from './SupplierApprovalPage';

export default function ManageSupplierHome() {
    const { manageSupplierPageNo } = useManageSupplierContext();
   
    
    return (
        <div>
            {(() => {
                switch (manageSupplierPageNo) {

                    case 1:
                        return <SupplierListPage />
                    case 2:
                        return <SupplierApprovalPage />


                    default:
                        return null
                }
            })()}
        </div>
    )
}
