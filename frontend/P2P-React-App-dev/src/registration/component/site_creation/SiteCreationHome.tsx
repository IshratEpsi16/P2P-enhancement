import React from 'react';
import { useSiteCreationPageContext } from '../../context/SiteCreationPageContext';
import SiteCreationPage from './SiteCreationPage';
import SiteListPage from './SiteListPage';

export default function SiteCreationHome() {

    const { page } = useSiteCreationPageContext();
    return (
        <div >
            {(() => {
                switch (page) {
                    case 1:
                        return <SiteListPage />


                    case 2:
                        return <SiteCreationPage />

                    default:
                        return null;
                }
            })()}
        </div>
    )
}
