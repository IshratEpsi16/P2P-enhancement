import React from 'react'
import { useDocumentApprovalViewContext } from '../../interface/document/DocumentApprovalViewContext'
import PageOneViewForApproval from './PageOneViewForApproval';
import PageTwoViewForApproval from './PageTwoViewForApproval';
import PageThreeViewForApproval from './PageThreeViewForApproval';
import PageFourViewForApproval from './PageFourViewForApproval';
export default function DocumentHomeApprovalPage() {
    const {page}=useDocumentApprovalViewContext();
  return (
    <div>
    {(() => {
        switch (page) {
            // case 'home':
            //   return <Home/>
            case 1:
                return <PageOneViewForApproval />
            case 2:
                return <PageTwoViewForApproval />
            case 3:
                return <PageThreeViewForApproval />
            case 4:
                return <PageFourViewForApproval />

            default:
                return null
        }
    })()}
</div>
  )
}

