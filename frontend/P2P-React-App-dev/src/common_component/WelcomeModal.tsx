// src/Modal.tsx
import React, { FC } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
}

const WelcomeModal: FC<ModalProps> = ({ isOpen, onClose, name }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full mx-80 h-96 relative">
        <button
          className="absolute top-2 right-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold h-6 w-6 rounded-full"
          onClick={onClose}
        >
          X
        </button>
        <div className="w-full h-48">
          <img
            src="/images/seven_rings_banner.png"
            alt="banner"
            className="w-full h-full"
          />
          <div className="h-4"></div>
          <div className="w-full flex justify-center items-center">
            {/* <p className="text-black font-mon font-bold text-2xl">{name}</p> */}
            <span
              className="text-[rgb(25,25,25)]"
              dangerouslySetInnerHTML={{ __html: name }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
