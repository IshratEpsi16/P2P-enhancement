import React from 'react'
import { useContactApprovalViewContext } from '../../interface/contact/ContactApprovalViewContext'
import ContactListViewForApproval from './ContactListViewForApproval';
import ContactDetailsViewForApproval from './ContactDetailsViewForApproval';
export default function ContactHomeForApprovalView() {
    const {page}=useContactApprovalViewContext();
  return (
    <div >
            {(() => {
                switch (page) {
                    case 1:
                        return <ContactListViewForApproval />


                    case 2:
                        return <ContactDetailsViewForApproval />

                    default:
                        return null;
                }
            })()}
        </div>
  )
}
