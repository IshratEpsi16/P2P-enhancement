import React, {
  useRef,
  ChangeEvent,
  useCallback,
  useEffect,
  KeyboardEvent,
} from "react";

interface inputProps {
  onChangeData: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  type: string;
  hint: string;
  width?: string;
  height?: string;
  bgColor?: string;
  disable?: boolean;
  maxCharacterlength?: number; // Step 1: Add maxCharacterlength prop
  value?: string;
  onEnterPressed?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

const CommonInputField: React.FC<inputProps> = ({
  onChangeData,




  inputRef,
  type,
  hint,
  width,
  height,
  bgColor,
  disable,
  maxCharacterlength, // Step 1: Destructure maxCharacterlength prop
  value,
  onEnterPressed,
}) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;

      // Step 2: Limit the input length
      if (
        maxCharacterlength != null &&
        inputValue.length > maxCharacterlength
      ) {
        return;
      }

      onChangeData(inputValue);
    },
    [onChangeData, maxCharacterlength]
  );

  const autofillStyles = {
    WebkitTransition: "background-color 5000s ease-in-out 0s",
    backgroundColor: "#fff",
    color: "#000",
  };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = value ?? ""; // Set value to empty string if it's undefined
    }
  }, [inputRef, value]);

  return (
    <input
      ref={inputRef}
      onChange={handleChange}
      placeholder={hint}
      type={type}
      onKeyDown={onEnterPressed}
      disabled={disable == null ? false : disable}
      maxLength={maxCharacterlength} // Step 2: Set the maxLength attribute
      style={autofillStyles}
      className={` ${width == null ? "w-96" : width} ${height == null ? "h-10" : height
        }  rounded-[4px]  ${bgColor == null ? "appearance-none bg-transparent" : bgColor
        } border-[0.5px] border-borderColor  focus:outline-none px-2 placeholder:font-mon placeholder:text-sm text-midBlack placeholder:text-[#C5C5C5] `}
    />
  );
};

export default CommonInputField;

// import React, { useRef, ChangeEvent, useCallback } from 'react';

// interface inputProps {
//   onChangeData: (value: string) => void;
//   inputRef: React.RefObject<HTMLInputElement>;
//   type: string;
//   hint: string;
//   width?: string;
//   height?: string;
//   bgColor?: string;
//   disable?: boolean;
// }

// const CommonInputField: React.FC<inputProps> = ({
//   onChangeData,
//   inputRef,
//   type,
//   hint,
//   width,
//   height,
//   bgColor,
//   disable,
// }) => {
//   const handleChange = useCallback(
//     (event: ChangeEvent<HTMLInputElement>) => {
//       onChangeData(event.target.value);
//     },
//     [onChangeData]
//   );

//   const autofillStyles = {
//     WebkitTransition: 'background-color 5000s ease-in-out 0s',
//     backgroundColor: '#fff',
//     color: '#000',
//   };

//   return (
//     <input
//       ref={inputRef}
//       onChange={handleChange}
//       placeholder={hint}
//       type={type}
//       disabled={disable == null ? false : disable}
//       style={autofillStyles} // Add autofill styles here
//       className={`placeholder:text-hintColor ${
//         width == null ? 'w-96' : width
//       } ${height == null ? 'h-10' : height}  rounded-[4px]  ${
//         bgColor == null ? 'appearance-none bg-transparent' : bgColor
//       } border-[0.5px] border-borderColor  focus:outline-none px-2 placeholder:font-mon placeholder:text-sm text-midBlack placeholder:text-graishColor`}
//     />
//   );
// };

// export default CommonInputField;

// import React, { useRef, ChangeEvent, useCallback } from 'react'

// interface inputProps {
//     onChangeData: (value: string) => void;
//     inputRef: React.RefObject<HTMLInputElement>;
//     type: string;
//     hint: string;
//     width?: string;
//     height?: string;
//     bgColor?: string;
//     disable?: boolean;
// }

// const CommonInputField: React.FC<inputProps> = ({ onChangeData, inputRef, type, hint, width, height, bgColor, disable }) => {

//     const handleChange = useCallback(
//         (event: ChangeEvent<HTMLInputElement>) => {
//             onChangeData(event.target.value);
//         },
//         [onChangeData]
//     );

//     return (

//         <input ref={inputRef} onChange={handleChange} placeholder={hint} type={type}
//             disabled={disable == null ? false : disable}

//             className={`placeholder:text-hintColor ${width == null ? "w-96" : width} ${height == null ? "h-10" : height}  rounded-[4px]  ${bgColor == null ? "appearance-none bg-transparent" : bgColor} border-[0.5px] border-borderColor  focus:outline-none px-2 placeholder:font-mon placeholder:text-sm text-midBlack placeholder:text-graishColor`} />
//     )
// }

// export default CommonInputField;

// import React, { useEffect } from 'react';

// interface InputProps {
//     onChangeData: (value: string) => void;
//     inputRef: React.RefObject<HTMLInputElement>;
//     type: string;
//     hint: string;
//     width?: string;
//     height?: string;
//     bgColor?: string;
//     disable?: boolean;
// }

// const CommonInputField: React.FC<InputProps> = ({
//     onChangeData,
//     inputRef,
//     type,
//     hint,
//     width,
//     height,
//     bgColor,
//     disable
// }) => {
//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const value = event.target.value;
//         onChangeData(value);
//     };

//     useEffect(() => {
//         console.log('useEffect triggered');
//         console.log('ref in common', inputRef.current?.value);
//     }, [inputRef]);
//     return (
//         <input
//             ref={inputRef}
//             onChange={handleInputChange}
//             placeholder={hint}
//             type={type}
//             disabled={disable == null ? false : disable}
//             className={`placeholder:text-hintColor ${width == null ? "w-96" : width} ${height == null ? "h-10" : height
//                 }  rounded-[4px]  ${bgColor == null ? "bg-inputBg" : bgColor} border-[0.5px] border-borderColor  focus:outline-none px-2 placeholder:font-mon placeholder:text-sm`}
//         />
//     );
// };

// export default CommonInputField;

// import React from 'react';

// interface inputProps {
//     onChangeData: (value: string | React.ChangeEvent<HTMLInputElement>) => void;
//     inputRef: React.RefObject<HTMLInputElement>;
//     type: string;
//     hint: string;
//     width?: string;
//     height?: string;
//     bgColor?: string;
//     disable?: boolean;
// }

// const CommonInputField: React.FC<inputProps> = ({ onChangeData, inputRef, type, hint, width, height, bgColor, disable }) => {

//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (typeof onChangeData === 'function') {
//             const value = event.target.value;
//             onChangeData(value);
//         }
//     };

//     return (
//         <input
//             ref={inputRef}
//             onChange={handleInputChange}
//             placeholder={hint}
//             type={type}
//             disabled={disable == null ? false : disable}
//             className={`placeholder:text-hintColor ${width == null ? 'w-96' : width} ${height == null ? 'h-10' : height} rounded-[4px] ${bgColor == null ? 'bg-inputBg' : bgColor
//                 } border-[0.5px] border-borderColor focus:outline-none px-2 placeholder:font-mon placeholder:text-sm`}
//         />
//     );
// };

// export default CommonInputField;
