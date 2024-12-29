import React from 'react'
import { useBankViewApprovalContext } from '../../interface/bank/BankViewApprovalContext'
import BankListViewForApprovalPage from './BankListViewForApprovalPage';
import BankDetailsViewForApprovalPage from './BankDetailsViewForApprovalPage';
export default function BankHomeViewForApprovalPage() {
    const {page}=useBankViewApprovalContext();
  return (
    <div >
    {(() => {
        switch (page) {
            case 1:
                return <BankListViewForApprovalPage />


            case 2:
                return <BankDetailsViewForApprovalPage />

            default:
                return null;
        }
    })()}
</div>
  )
}
