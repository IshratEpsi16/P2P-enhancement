import React from 'react'

interface inputProps {

    title: string;

}
const ValidationError: React.FC<inputProps> = ({ title }) => {
    return (
        <div>
            <span className=' text-red-500 text-xs font-mon'>{title}</span>
        </div>
    )
}

export default ValidationError;