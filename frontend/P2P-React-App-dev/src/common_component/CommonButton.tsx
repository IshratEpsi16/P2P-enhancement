import React from "react";

interface commonButtonProps {
  titleText: string;
  onClick: () => void;
  width?: string;
  color?: string;
  height?: string;
  disable?: boolean;
  buttonId?: string;
  // onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

const CommonButton: React.FC<commonButtonProps> = ({
  titleText,
  onClick,
  width,
  color,
  height,
  disable,
  buttonId,
}) => {
  return (
    <button
      // tabIndex={0}
      // onKeyDown={onKeyDown} // Add this line
      id={buttonId === undefined ? undefined : buttonId}
      disabled={disable ? true : false}
      onClick={onClick}
      className={`${color == null ? "bg-shinyBlackColor" : color} ${
        width == null ? "w-96" : width
      } ${
        height == null ? "h-8" : height
      } rounded-[4px] shadow-[2px] flex justify-center items-center`}
    >
      <p className=" text-whiteColor text-sm font-medium font-mon">
        {titleText}
      </p>
    </button>
  );
};

export default CommonButton;
