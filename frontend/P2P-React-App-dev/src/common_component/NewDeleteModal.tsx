import React, { ReactNode } from "react";
import DeleteIcon from "../icons/DeleteIcon";
interface NewDeleteModalProps {
  isOpen: boolean;
  closeModal: () => void;
  action: () => void;
  message?: string;
  imgSrc?: string;
}

const NewDeleteModal: React.FC<NewDeleteModalProps> = ({
  isOpen,
  closeModal,
  action,
  message,
  imgSrc,
}) => {
  const handleClick = () => {
    closeModal();
    action();
  };
  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 bg-gray-700">
      <div className="w-[491.5px] h-[240px] relative bg-white rounded-[10px]">
        <div className="w-[283px] h-[83px] flex justify-center items-start left-[104.5px] top-[15px] absolute rounded-full  ">
          <div className=" mt-6 h-14 w-14 rounded-full  bg-red-100 flex justify-center items-center">
            <DeleteIcon className=" text-red-400" />
          </div>
        </div>
        <div className=" w-full flex justify-center items-center top-[100px] absolute text-neutral-700 text-[18px] font-bold font-mon">
          Do You Want To Delete ?
        </div>
        <div className=" w-full flex justify-center items-center px-8  top-[130px] absolute  text-neutral-700 text-sm font-mon font-medium">
          {message == null ? "Do you want to LogOut ?" : message}
        </div>
        <div className=" w-full flex space-x-4 h-7 top-[181px] absolute  px-4   justify-center items-center">
          <button
            onClick={handleClick}
            className="h-10 w-28  rounded-[8px]  bg-red-500 text-white text-md font-medium font-mon"
          >
            Yes
          </button>
          <button
            onClick={closeModal}
            className="h-10 w-28  rounded-[8px] bg-white border-[1px] border-borderColor    text-md font-medium font-mon text-black"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewDeleteModal;
