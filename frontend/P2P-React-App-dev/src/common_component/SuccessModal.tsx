import React, { ReactNode } from 'react'
interface SuccessModalProps {
    isOpen: boolean;
    closeModal: () => void;
    navigateTo: (route: string) => void;
    message: string;

    navigationRoute: string; // New prop to pass the navigation route
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen, closeModal, navigateTo, message, navigationRoute
}

) => {

    const handleContinueClick = () => {
        closeModal();
        navigateTo(navigationRoute);
    };
    if (!isOpen) {
        return null;
    }
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 bg-gray-700">
            <div className="w-[291.5px] h-[310px] relative bg-white rounded-[17.5px]">
                <div className="w-[85.5px] h-[118.5px] left-[104.5px] top-[29.5px] absolute">
                    <div className="w-[81px] h-[81px] left-[4.5px] top-[17.5px] absolute bg-neutral-300 rounded-full" />
                    <div className="w-3.5 h-3.5 left-[15px] top-[13px] absolute bg-neutral-300 rounded-full" />
                    <div className="w-[17px] h-[17px] left-[45.5px] top-[86px] absolute bg-neutral-300 rounded-full" />
                    <div className="w-2.5 h-2.5 left-[31.5px] top-[101.5px] absolute bg-neutral-300 rounded-full" />
                    <div className="w-1.75 h-1.75 left-[45px] top-[111.5px] absolute bg-neutral-300 rounded-full" />
                    <div className="w-[7.5px] h-[7.5px] left-[60.5px] top-0 absolute bg-neutral-300 rounded-full" />
                    <div className="w-[83px] h-[83px] left-0 top-[15.5px] absolute rounded-full border-2 border-green-800 flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 font-bold text-darkGreen">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>

                    </div>
                    <div className="w-[38.5px] h-[40.5px] left-[22px] top-[37px] absolute" />
                </div>
                <div className=" w-full flex justify-center items-center top-[165px] absolute text-neutral-700 text-[16px] font-bold font-mon">Success !!!</div>
                <div className=" px-8 w-full  flex justify-center items-center top-[193.5px] absolute text-center text-neutral-700 text-sm  font-medium font-mon ">{message}</div>
                <button onClick={handleContinueClick} className="w-[150px] h-8 px-[6.5px] py-1.25 left-[71px] top-[231px] absolute bg-green-800 rounded-[19px] justify-center items-center gap-1.25 inline-flex">
                    <div className="text-white text-sm font-bold font-mon">Continue</div>
                </button>
            </div>
        </div>
    )
}

export default SuccessModal;