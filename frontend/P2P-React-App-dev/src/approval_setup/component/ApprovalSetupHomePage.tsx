import React from 'react';
import { useApprovalSetupContext } from '../context/ApprovalSetupContext';
import ApprovalSetupPage from './ApprovalSetupPage';
import CreateApprovalSetupPage from './CreateApprovalSetupPage';

export default function ApprovalSetupHomePage() {
    const { approvalSetupPageNo } = useApprovalSetupContext();
    return (
        <div>
            {(() => {
                switch (approvalSetupPageNo) {

                    case 1:
                        return <ApprovalSetupPage />
                    case 2:
                        return <CreateApprovalSetupPage />


                    default:
                        return null
                }
            })()}
        </div>
    )
}
