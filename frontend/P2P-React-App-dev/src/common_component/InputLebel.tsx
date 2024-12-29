import React from 'react'
interface labelProps {
    titleText: String;
}

const InputLebel: React.FC<labelProps> = ({ titleText }) => {
    return (
        <p className=' font-mon text-midBlack text-[16px] font-semibold'>{titleText}</p>
    )
}

export default InputLebel;