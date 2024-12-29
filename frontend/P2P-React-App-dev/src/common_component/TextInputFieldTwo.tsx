import React, { useRef, ChangeEvent, useCallback } from 'react'


interface inputProps {
    onChangeData: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    // inputRef: string;
    // type: string;
    hint: string;
    width?: string;
    height?: string;
    bgColor?: string;
    disable?: boolean;
}

const TextInputField: React.FC<inputProps> = ({ onChangeData, hint, width, height, bgColor, disable }) => {


    return (

        <textarea


            value={hint} onChange={onChangeData}
            disabled={disable == null ? false : disable}
            className={`placeholder:text-hintColor ${width == null ? "w-96" : width} ${height == null ? "h-10" : height}  rounded-[4px]  ${bgColor == null ? "bg-inputBg" : bgColor} border-[0.5px] border-borderColor  focus:outline-none px-2 placeholder:font-mon placeholder:text-sm`}
        ></textarea>

        // <input ref={inputRef} onChange={handleChange} placeholder={hint} type={type}
        //     disabled={disable == null ? false : disable}

        //     className={`placeholder:text-hintColor ${width == null ? "w-96" : width} ${height == null ? "h-10" : height}  rounded-[4px]  ${bgColor == null ? "bg-inputBg" : bgColor} border-[0.5px] border-borderColor  focus:outline-none px-2 placeholder:font-mon placeholder:text-sm`} />
    )
}

export default TextInputField;