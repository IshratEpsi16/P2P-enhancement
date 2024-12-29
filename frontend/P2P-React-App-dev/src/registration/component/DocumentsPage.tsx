import React, { useRef, useState } from 'react'
import PageOne from './document_page_component/PageOne'
import PageTwo from './document_page_component/PageTwo';
import { useDocumentPageContext } from '../context/DocumentPageContext';
import PageThree from './document_page_component/PageThree';
import PageFour from './document_page_component/PageFour';

export default function DocumentsPage() {
    const { page } = useDocumentPageContext();

    return (
        <div>
            {(() => {
                switch (page) {
                    // case 'home':
                    //   return <Home/>
                    case 1:
                        return <PageOne />
                    case 2:
                        return <PageTwo />
                    case 3:
                        return <PageThree />
                    case 4:
                        return <PageFour />

                    default:
                        return null
                }
            })()}
        </div>
    )
}
