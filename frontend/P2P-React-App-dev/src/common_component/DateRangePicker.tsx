// import React, { useState, useEffect } from "react";
// import DatePicker from "react-tailwindcss-datepicker";

// interface CustomDatepickerProps {
//   value: {
//     startDate: Date | null;
//     endDate: Date | null;
//   };
//   placeholder: string;
//   onChange: (newValue: {
//     startDate: Date | null;
//     endDate: Date | null;
//   }) => void;
//   signle?: boolean;
//   height?: string;
//   width?: string;
//   useRange?: boolean;
//   disable?: boolean;
// }

// function DateRangePicker({
//   value,
//   onChange,
//   placeholder,
//   signle,
//   height,
//   width,
//   useRange,
//   disable,
// }: CustomDatepickerProps) {
//   // Initialize selectedDates as an object with startDate and endDate properties
//   const [selectedDates, setSelectedDates] = useState<{
//     startDate: Date | null;
//     endDate: Date | null;
//   }>(value);

//   useEffect(() => {
//     // Update internal state when the parent component changes the value prop
//     setSelectedDates(value);
//   }, [value]);

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleDateChange = (newDates: any) => {
//     setSelectedDates(newDates);
//     onChange(newDates);
//   };

//   return (
//     <DatePicker
//       asSingle={signle == null ? false : signle}
//       separator={"-"}
//       popoverDirection="down"
//       showFooter={true}
//       primaryColor={"green"}
//       displayFormat={"DD/MMMM/YYYY"}
//       inputClassName={`  ${height == null ? "h-10" : height} ${
//         width == null ? "w-60" : width
//       } px-4 rounded-sm border-[0.2px] border-borderColor bg-white `}
//       value={selectedDates}
//       onChange={handleDateChange}
//       placeholder={placeholder}
//       useRange={useRange == null ? true : useRange}
//       disabled={disable == null ? false : disable}
//     />
//   );
// }

// export default DateRangePicker;

import React, { useState, useEffect } from "react";
import DatePicker from "react-tailwindcss-datepicker";
import moment from "moment";

interface CustomDatepickerProps {
  value: {
    startDate: Date | null;
    endDate: Date | null;
  };
  placeholder: string;
  onChange: (newValue: {
    startDate: Date | null;
    endDate: Date | null;
  }) => void;
  signle?: boolean;
  height?: string;
  width?: string;
  useRange?: boolean;
  disable?: boolean;
}

function DateRangePicker({
  value,
  onChange,
  placeholder,
  signle,
  height,
  width,
  useRange,
  disable,
}: CustomDatepickerProps) {
  const [selectedDates, setSelectedDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>(value);

  useEffect(() => {
    setSelectedDates(value);
  }, [value]);

  const handleDateChange = (newDates: any) => {
    setSelectedDates(newDates);
    onChange(newDates);
  };

  return (
    <DatePicker
      asSingle={signle == null ? false : signle}
      separator={"-"}
      popoverDirection="down"
      showFooter={true}
      primaryColor={"green"}
      displayFormat={"DD-MMM-YYYY"}
      inputClassName={`  ${height == null ? "h-10" : height} ${
        width == null ? "w-60" : width
      } px-4 rounded-sm border-[0.2px] border-borderColor bg-white  `}
      value={selectedDates}
      onChange={handleDateChange}
      placeholder={placeholder}
      useRange={useRange == null ? true : useRange}
      disabled={disable == null ? false : disable}
    />
  );
}

export default DateRangePicker;
