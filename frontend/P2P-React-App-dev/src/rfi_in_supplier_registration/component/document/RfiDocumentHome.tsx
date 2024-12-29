
import React from 'react'
import { useRfiDocumentApprovalViewContext } from '../../context/RfiDocumentPageContext'
import RfiPageOne from './RfiPageOne';
import RfiPageTwo from './RfiPageTwo';
import RfiPageThree from './RfiPageThree';
import RfiPageFour from './RfiPageFour';
export default function RfiDocumentHome() {
    const {page}=useRfiDocumentApprovalViewContext();
  return (
    <div>
    {(() => {
        switch (page) {
            // case 'home':
            //   return <Home/>
            case 1:
                return <RfiPageOne />
            case 2:
                return <RfiPageTwo />
            case 3:
                return <RfiPageThree />
            case 4:
                return <RfiPageFour />

            default:
                return null
        }
    })()}
</div>
  )
}
