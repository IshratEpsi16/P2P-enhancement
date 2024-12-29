

import React from 'react'

import { useRfiBankViewApprovalContext } from '../context/RfiBankApprovalViewContext'
import RfiBankListApprovalViewPage from './RfiBankListApprovalViewPage';
import RfiBankDetailsApprovalViewPage from './RfiBankDetailsApprovalViewPage';

export default function RfiBankHomeApprovalViewPage() {
    const {page}=useRfiBankViewApprovalContext();
  return (
    <div >
    {(() => {
        switch (page) {
            case 1:
                return <RfiBankListApprovalViewPage />


            case 2:
                return <RfiBankDetailsApprovalViewPage />

            default:
                return null;
        }
    })()}
</div>
  )
}
