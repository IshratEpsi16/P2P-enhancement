

import React from 'react'
import { useRfiSiteApprovalViewContext } from '../context/RfiSiteApprovalViewContext'
import RfiSiteListApprovalViewPage from './RfiSiteListApprovalViewPage';
import RfiSiteDetailsViewApprovalPage from './RfiSiteDetailsViewApprovalPage';

export default function RfiSiteHomeAprrovalViewPage() {
    const {page}=useRfiSiteApprovalViewContext();
  return (
    <div >
    {(() => {
        switch (page) {
            case 1:
                return <RfiSiteListApprovalViewPage />


            case 2:
                return <RfiSiteDetailsViewApprovalPage />

            default:
                return null;
        }
    })()}
</div>
  )
}
