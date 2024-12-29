import React from 'react'
import { useBankPageContext } from '../context/BankPageContext'
import BankListPage from './BankListPage';
import BankDetailsPage from './BankDetailsPage';
export default function BankHome() {
    const {page}=useBankPageContext();
  return (
    <div >
            {(() => {
                switch (page) {
                    case 1:
                        return <BankListPage />


                    case 2:
                        return <BankDetailsPage />

                    default:
                        return null;
                }
            })()}
        </div>
  )
}
