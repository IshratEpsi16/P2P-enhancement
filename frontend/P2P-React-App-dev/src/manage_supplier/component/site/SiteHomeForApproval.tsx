import React from 'react'
import { useSiteApprovalViewContext } from '../../interface/contact/SiteApprovalViewContext'
import SiteListForApprovalPage from './SiteListForApprovalPage';
import SiteDetailsForApprovalPage from './SiteDetailsForApprovalPage';

export default function SiteHomeForApproval() {
    const {page}=useSiteApprovalViewContext();
  return (
    <div >
    {(() => {
        switch (page) {
            case 1:
                return <SiteListForApprovalPage />


            case 2:
                return <SiteDetailsForApprovalPage />

            default:
                return null;
        }
    })()}
</div>
  )
}
