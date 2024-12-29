import React from 'react';
interface ErrorModalProps {
    isOpen: boolean;
    closeModal: () => void;

    message: string;

    // New prop to pass the navigation route
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, closeModal, message }) => {
    const handleClick = () => {
        closeModal();
    }
    if (!isOpen) {
        return null;
    }
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 bg-gray-700">
            <div className="w-[291.5px] h-[310px] relative bg-white rounded-[35px]">
                <div className="w-[81px] h-[81px] left-[109px] top-[47px] absolute bg-red-200 rounded-full" />
                <div className="w-3.5 h-3.5 left-[119.5px] top-[42.5px] absolute bg-red-200 rounded-full" />
                <div className="w-[17px] h-[17px] left-[150px] top-[29.5px] absolute bg-red-200 rounded-full" />
                <div className="w-2.5 h-2.5 left-[136px] top-[44.5px] absolute bg-red-200 rounded-full" />
                <div className="w-1.75 h-1.75 left-[149.5px] top-[47.75px] absolute bg-red-200 rounded-full" />
                <div className="w-[7.5px] h-[7.5px] left-[165px] top-[29.5px] absolute bg-red-200 rounded-full" />
                <div className="w-[83px] h-[83px] flex justify-center items-start left-[104.5px] top-[45px] absolute rounded-full border-2 border-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mt-5 text-red-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>

                </div>
                <div className=" w-full flex justify-center items-center top-[150px] absolute text-neutral-700 text-[16px] font-bold font-mon">Fail !!!</div>
                <div className=" w-full flex justify-center items-center px-8  top-[180px] absolute  text-neutral-700 text-sm font-mon font-medium">{message}</div>
                <button onClick={handleClick} className="w-[150px] h-7 px-[6.5px] py-1.25 left-[71px] top-[231px] absolute bg-red-700 rounded-[19px] justify-center items-center gap-1.25 inline-flex">
                    <div className="text-white text-md font-bold font-mon">Close</div>
                </button>
                <div className="w-[25px] h-[25px] left-[133.5px] top-[74px] absolute" />
            </div>
        </div>
    );
}

export default ErrorModal;
