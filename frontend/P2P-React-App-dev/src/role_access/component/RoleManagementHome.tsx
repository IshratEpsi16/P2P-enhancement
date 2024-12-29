import React from 'react'
import { useRoleAccessContext } from '../context/RoleAccessContext'
import UserRolePage from './UserRolePage';
import CreateRolePage from './CreateRolePage';
export default function RoleManagementHome() {
    const { roleAccessPageNo } = useRoleAccessContext();
    return (
        <div>
            {(() => {
                switch (roleAccessPageNo) {

                    case 1:
                        return <UserRolePage />
                    case 2:
                        return <CreateRolePage />


                    default:
                        return null
                }
            })()}
        </div>
    )
}
