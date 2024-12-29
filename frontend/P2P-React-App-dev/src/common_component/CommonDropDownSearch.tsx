import React from "react";
import Select from "react-tailwindcss-select";

interface Option {
  value: string;
  label: string;
}

interface ReusableSelectProps {
  value: Option | Option[] | null;
  onChange: (value: Option | Option[] | null) => void;
  options: Option[];
  width?: string;
  placeholder: string;
  disable?: boolean;
  isMutiSelect?: boolean;
  maxSelections?: number; // Add maxSelections prop
}

// Define a type alias for the SelectValue
type SelectValue = Option | Option[] | null;

const CommonDropDownSearch: React.FC<ReusableSelectProps> = ({
  value,
  onChange,
  options,
  width,
  placeholder,
  disable,
  isMutiSelect,
  maxSelections, // Include maxSelections in props
}) => {
  const handleSelectChange = (selectedValues: SelectValue) => {
    // Check if maxSelections is defined and limit the number of selections
    if (
      maxSelections !== undefined &&
      selectedValues instanceof Array &&
      selectedValues.length > maxSelections
    ) {
      selectedValues = selectedValues.slice(0, maxSelections);
    }

    // Pass the selected values to the parent component
    onChange(selectedValues);
  };

  return (
    <Select
      value={value ? (isMutiSelect ? value : (value as Option)) : null}
      onChange={handleSelectChange}
      options={options}
      primaryColor={"sky"}
      isClearable={true}
      isSearchable={true}
      placeholder={placeholder}
      isDisabled={disable == null ? false : disable}
      isMultiple={isMutiSelect == null ? false : isMutiSelect}
      classNames={{
        menuButton: (value?: { isDisabled?: boolean }) =>
          `py-[1px] ${
            width === null ? "w-96" : width
          } bg-inputBg rounded-md  bg-inputBg border-[0.5px] border-borderColor  flex flex-row `,
        // menu: `bg-whiteColor border-[0.5px] border-hintColor rounded-md mt-1 absolute ${
        //   width === null ? "w-96" : width
        // }`,
      }}
    />
  );
};

export default CommonDropDownSearch;

// import React, { useEffect } from "react";
// import Select from "react-tailwindcss-select";

// interface Option {
//   value: string;
//   label: string;
// }

// interface ReusableSelectProps {
//   value: Option | Option[] | null;
//   onChange: (value: Option | Option[] | null) => void;
//   options: Option[];
//   width?: string;
//   placeholder: string;
//   disable?: boolean;
//   isMutiSelect?: boolean;
//   maxSelections?: number;
//   onDeselect?: (id: string) => void; // Add onDeselect callback
// }

// // Define a type alias for the SelectValue
// type SelectValue = Option | Option[] | null;

// const CommonDropDownSearch: React.FC<ReusableSelectProps> = ({
//   value,
//   onChange,
//   options,
//   width,
//   placeholder,
//   disable,
//   isMutiSelect,
//   maxSelections,
//   onDeselect,
// }) => {
//   const handleSelectChange = (selectedValues: SelectValue) => {
//     // Check if maxSelections is defined and limit the number of selections
//     if (maxSelections !== undefined && selectedValues instanceof Array && selectedValues.length > maxSelections) {
//       selectedValues = selectedValues.slice(0, maxSelections);
//     }

//     // Pass the selected values to the parent component
//     onChange(selectedValues);
//   };

//   // Use useEffect to handle deselection changes
//   useEffect(() => {
//     if (value instanceof Array && onDeselect) {
//       const selectedIds = value.map((selectedOption) => selectedOption.value);
//       const previousIds = options.map((option) => option.value);

//       // Find the deselected item by comparing previous and current selected ids
//       const deselectedId = previousIds.find((id) => !selectedIds.includes(id));

//       if (deselectedId) {
//         // Call onDeselect callback with the deselected item's id
//         onDeselect(deselectedId);
//       }
//     }
//   }, [value, options, onDeselect]);

//   return (
//     <Select
//       value={value ? (isMutiSelect ? value : (value as Option)) : null}
//       onChange={handleSelectChange}
//       options={options}
//       primaryColor={"sky"}
//       isClearable={true}
//       isSearchable={true}
//       placeholder={placeholder}
//       isDisabled={disable == null ? false : disable}
//       isMultiple={isMutiSelect == null ? false : isMutiSelect}
//       classNames={{
//         menuButton: (value?: { isDisabled?: boolean }) =>
//           `h-10 ${width === null ? "w-96" : width} bg-inputBg rounded-md  bg-inputBg border-[0.5px] border-borderColor  flex flex-row `,
//         menu: `bg-whiteColor border-[0.5px] border-hintColor rounded-md mt-1 absolute ${
//           width === null ? "w-96" : width
//         }`,
//       }}
//     />
//   );
// };

// export default CommonDropDownSearch;
