// import React, { ChangeEvent, useState } from 'react';
// import ClipIcon from '../icons/ClipIcon';

// interface FilePickerInputProps {
//     onFileSelect: (file: File | null) => void;
//     width?: string,
//     fontSize?: string,
//     mimeType?: string,
// }

// const FilePickerInput: React.FC<FilePickerInputProps> = ({ onFileSelect, width, fontSize, mimeType }) => {
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);

//     const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files && event.target.files[0];
//         setSelectedFile(file);
//         onFileSelect(file);
//     };

//     return (
//         <div className="flex items-center ">
//             <label className={`flex-row justify-between cursor-pointer  items-center flex space-x-2 ${width == null ? "w-96" : width} h-10  rounded-[4px]  bg-whiteColor border-[0.5px] border-borderColor  pr-2`}>

//                 <div className=' flex flex-row space-x-2  items-center'>
//                     <div className={` font-mon px-2 h-10 bg-midBlack items-center flex rounded-l-[4px] text-whiteColor font-medium ${fontSize == null ? "text-[14px]" : fontSize}`}>Upload File</div>

//                     <input
//                         id="file-input"
//                         type='file'
//                         accept={mimeType === null ? "" : mimeType}
//                         className="hidden"
//                         onChange={handleFileChange}
//                     />
//                     <span className={`text-[#717171] font-mon ${fontSize == null ? "text-[14px]" : fontSize}`} >{selectedFile ? selectedFile.name : 'No file selected'}</span>
//                 </div>
//                 <div className=' h-5 w-5'>
//                     <ClipIcon className=' h-full w-full ' />
//                 </div>

//             </label>
//         </div>
//     );
// };
// export default FilePickerInput;

import React, { ChangeEvent, useEffect, useState } from "react";
import ClipIcon from "../icons/ClipIcon";

interface FilePickerInputProps {
  onFileSelect: (file: File | null) => void;
  width?: string;
  fontSize?: string;
  mimeType?: string;
  initialFileName?: string; // Add a prop for initial file name
  maxSize?: number;
  disable?: boolean;
  widthBlack?: string;
  clearFile?: boolean;
}

const FilePickerInput: React.FC<FilePickerInputProps> = ({
  onFileSelect,
  width,
  fontSize,
  mimeType,
  initialFileName,
  maxSize,
  disable,
  widthBlack,
  clearFile,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(
    initialFileName || null
  );

  useEffect(() => {
    clearF();
  }, [clearFile]);

  const clearF = () => {
    if (clearFile) {
      console.log("clear f called");

      setSelectedFile(null);
      onFileSelect(null);
      setFileName(null);
    }
  };

  useEffect(() => {
    // Update the file name when the initialFileName prop changes
    setFileName(initialFileName || null);
  }, [initialFileName]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    // if (file) {
    //     setSelectedFile(file);
    //     onFileSelect(file);
    //     setFileName(file.name);  // Update the file name
    // } else {
    //     setSelectedFile(null);
    //     onFileSelect(null);
    //     setFileName(null);
    // }

    if (file) {
      if (maxSize) {
        if (file.size > maxSize) {
          // File size exceeds the allowed limit, show alert
          alert("File must be less than or equal to 5 MB");
          return;
        }

        setSelectedFile(file);
        onFileSelect(file);
        setFileName(file.name);
      } else {
        setSelectedFile(null);
        onFileSelect(null);
        setFileName(null);
      }
    }
  };

  return (
    <div className="flex items-center">
      <label
        className={`flex-row justify-between cursor-pointer items-center flex space-x-2 ${
          width == null ? "w-96" : width
        } h-10 rounded-[4px] bg-whiteColor border-[0.5px] border-borderColor pr-2`}
      >
        <div className="flex flex-row space-x-2 items-center">
          <div
            className={`font-mon px-2 h-10 bg-midBlack items-center flex rounded-l-[4px]   ${
              widthBlack == null ? "w-28" : widthBlack
            } text-whiteColor font-medium ${
              fontSize == null ? "text-[14px]" : fontSize
            }`}
          >
            Upload File
          </div>
          <input
            disabled={disable == null ? false : disable}
            id="file-input"
            type="file"
            accept={mimeType === null ? "" : mimeType}
            className="hidden"
            onChange={handleFileChange}
          />
          <span
            className={`text-[#717171] w-40 font-mon overflow-hidden whitespace-nowrap overflow-ellipsis ${
              fontSize == null ? "text-[14px]" : fontSize
            }`}
          >
            {fileName || "No file selected"}
          </span>
        </div>
        <div className="h-5 w-5 ">
          <ClipIcon className="h-full w-full" />
        </div>
      </label>
    </div>
  );
};

export default FilePickerInput;

// import React, { ChangeEvent, useEffect, useState } from "react";
// import ClipIcon from "../icons/ClipIcon";

// interface FilePickerInputProps {
//   onFileSelect: (file: File | null) => void;
//   width?: string;
//   fontSize?: string;
//   mimeType?: string;
//   initialFileName?: string;
//   maxSize?: number;
//   disable?: boolean;
//   widthBlack?: string;
//   clearFile?: boolean; // New prop to trigger file input clear
// }

// const FilePickerInput: React.FC<FilePickerInputProps> = ({
//   onFileSelect,
//   width,
//   fontSize,
//   mimeType,
//   initialFileName,
//   maxSize,
//   disable,
//   widthBlack,
//   clearFile,
// }) => {
//   const [fileName, setFileName] = useState<string | null>(
//     initialFileName || null
//   );

//   useEffect(() => {
//     setFileName(initialFileName || null);
//   }, [initialFileName]);

//   useEffect(() => {
//     if (clearFile) {
//       setFileName(null);
//     }
//   }, [clearFile]);

//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files && event.target.files[0];
//     if (file) {
//       if (maxSize && file.size > maxSize) {
//         alert("File must be less than or equal to 5 MB");
//         return;
//       }
//       setFileName(file.name);
//       onFileSelect(file);
//     } else {
//       setFileName(null);
//       onFileSelect(null);
//     }
//   };

//   return (
//     <div className="flex items-center">
//       <label
//         className={`flex-row justify-between cursor-pointer items-center flex space-x-2 ${
//           width == null ? "w-96" : width
//         } h-10 rounded-[4px] bg-whiteColor border-[0.5px] border-borderColor pr-2`}
//       >
//         <div className="flex flex-row space-x-2 items-center">
//           <div
//             className={`font-mon px-2 h-10 bg-midBlack items-center flex rounded-l-[4px] ${
//               widthBlack == null ? "w-28" : widthBlack
//             } text-whiteColor font-medium ${
//               fontSize == null ? "text-[14px]" : fontSize
//             }`}
//           >
//             Upload File
//           </div>
//           <input
//             disabled={disable == null ? false : disable}
//             key={clearFile ? "reset" : "default"}
//             type="file"
//             accept={mimeType === null ? "" : mimeType}
//             className="hidden"
//             onChange={handleFileChange}
//           />
//           <span
//             className={`text-[#717171] w-44 font-mon overflow-hidden whitespace-nowrap overflow-ellipsis ${
//               fontSize == null ? "text-[14px]" : fontSize
//             }`}
//           >
//             {fileName || "No file selected"}
//           </span>
//         </div>
//         <div className="h-5 w-5">
//           <ClipIcon className="h-full w-full" />
//         </div>
//       </label>
//     </div>
//   );
// };

// export default FilePickerInput;
