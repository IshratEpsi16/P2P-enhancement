// // DropDown.tsx

// import React, { useState, useEffect } from "react";

// interface Option {
//   value: string;
//   label: string;
// }

// interface DropDownProps {
//   options: Option[];
//   onSelect: (value: string) => void;
//   width?: string;
//   height?: string;
//   sval?: string;
//   disable?: boolean;
//   hint?: string;
// }

// const DropDown: React.FC<DropDownProps> = ({
//   options,
//   onSelect,
//   width,
//   height,
//   sval,
//   disable,
//   hint,
// }) => {
//   const [selectedValue, setSelectedValue] = useState<string>("");

//   const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedOption = options.find(
//       (option) => option.value === event.target.value
//     );
//     console.log("Selected Option:", selectedOption);

//     if (selectedOption) {
//       setSelectedValue(selectedOption.value); // Update with the string value
//       onSelect(selectedOption.value);
//     } else {
//       setSelectedValue(""); // Reset to empty string if no option is selected
//       onSelect("");
//     }
//   };

//   useEffect(() => {
//     console.log("Options changed:", options);
//   }, [options]);

//   return (
//     <select
//       disabled={disable == null ? false : disable}
//       value={sval}
//       onChange={handleSelectChange}
//       className={`px-2 pt-[1px] rounded-md ${
//         height == null ? "h-10" : height
//       } ${
//         width == null ? "w-52" : width
//       } border-[0.5px] border-borderColor focus:outline-none bg-white`}
//     >
//       <option className="font-mon text-sm" value="" disabled>
//         {hint == null ? "Select an option" : hint}
//       </option>
//       {options.map((option) => (
//         <option
//           className="font-mon text-sm"
//           key={option.value}
//           value={option.value}
//         >
//           {option.label}
//         </option>
//       ))}
//     </select>
//   );
// };

// export default DropDown;

import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface DropDownProps {
  options: Option[];
  onSelect: (value: string) => void;
  width?: string;
  height?: string;
  sval?: string;
  disable?: boolean;
  hint?: string;
}

const DropDown: React.FC<DropDownProps> = ({
  options,
  onSelect,
  width,
  height,
  sval,
  disable,
  hint,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(sval || "");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = options.find(
      (option) => option.value === event.target.value
    );
    setSelectedValue(event.target.value); // Update state with selected value

    if (selectedOption) {
      onSelect(selectedOption.value);
    } else {
      onSelect(""); // No valid selection
    }
  };

  useEffect(() => {
    setSelectedValue(sval || "");
  }, [sval]);

  return (
    <select
      disabled={disable ?? false}
      value={selectedValue}
      onChange={handleSelectChange}
      className={`px-2 pt-[1px] rounded-md ${
        height == null ? "h-10" : height
      } ${
        width == null ? "w-52" : width
      } border-[0.5px] border-borderColor focus:outline-none bg-white`}
    >
      <option className="font-mon text-sm" value="" disabled>
        {hint ?? "Select an option"}
      </option>
      {options.map((option) => (
        <option
          className="font-mon text-sm"
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default DropDown;
