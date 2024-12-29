import React from 'react'

import { useRfiContactApprovalViewContext } from '../context/RfiContactApprovalViewContext'
import RfiContactListApprovalViewPage from './RfiContactListApprovalViewPage';
import RfiContactDetailsApprovalViewPage from './RfiContactDetailsApprovalViewPage';

export default function RfiContactHomeApprovalViewPage() {
    const {page}=useRfiContactApprovalViewContext();
  return (
    <div >
            {(() => {
                switch (page) {
                    case 1:
                        return <RfiContactListApprovalViewPage />


                    case 2:
                        return <RfiContactDetailsApprovalViewPage />

                    default:
                        return null;
                }
            })()}
        </div>
  )
}
