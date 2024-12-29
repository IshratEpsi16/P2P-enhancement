import React, { useState, useRef } from "react";

interface SearchInputProps {
  onChangeData: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  search: () => void;
  placeholder: string;
  height?: string;
  width?: string;
}

const CommonSearchField: React.FC<SearchInputProps> = ({
  onChangeData,
  inputRef,
  search: searchSupplier,
  placeholder,
  width,
  height,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onChangeData(value);
  };
  return (
    <div
      className={`${width === null ? "w-56" : width} ${
        height === null ? "h-10" : height
      } bg-inputBg border-[0.5px] border-borderColor rounded-md px-2 flex flex-row items-center space-x-1`}
    >
      <input
        onChange={handleInputChange}
        ref={inputRef}
        placeholder={placeholder}
        type="text"
        className={`placeholder:text-[#C5C5C5] placeholder:font-mon flex-1 h-10 bg-inputBg focus:outline-none placeholder:text-sm`}
      />
      <button onClick={searchSupplier} className="w-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
    </div>
  );
};

export default CommonSearchField;
