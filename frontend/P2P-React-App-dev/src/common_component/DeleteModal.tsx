import React, { ReactNode } from 'react'
interface DeleteModalProps {
    isOpen: boolean;
    closeModal: () => void;
    doDelete: () => void;
    message: string;


}

const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen, closeModal, doDelete, message
}

) => {

    const handleClick = () => {
        closeModal();
        doDelete();
    };
    if (!isOpen) {
        return null;
    }
    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 bg-gray-700">
            <div className="w-[291.5px] h-[240px] relative bg-white rounded-[10px]">

                <div className="w-[83px] h-[83px] flex justify-center items-start left-[104.5px] top-[15px] absolute rounded-full  ">
                    <img src="/images/delete.png" alt="delete_icon" className='w-8 h-8 mt-6' />

                    {/* <svg
                        className="w-8 h-8 mt-6 text-red-500"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path

                            d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 4V6H15V4H9Z"></path></svg> */}

                </div>
                <div className=" w-full flex justify-center items-center top-[100px] absolute text-neutral-700 text-[16px] font-bold font-mon">Warning !!!</div>
                <div className=" w-full flex justify-center items-center px-8  top-[130px] absolute  text-neutral-700 text-sm font-mon font-medium">{message}</div>
                <div
                    className=' w-full h-7 top-[181px] absolute  px-4  flex justify-between items-center'

                >
                    <button
                        onClick={closeModal}
                        className='h-7 w-28  rounded-[8px] bg-whiteColor border-[1px] border-borderColor   text-midBlack text-md font-medium font-mon'>
                        No
                    </button>
                    <button
                        onClick={handleClick}
                        className='h-7 w-28  rounded-[8px]  bg-red-700 text-white text-md font-medium font-mon'>
                        Yes
                    </button>

                </div>
                {/* <button onClick={handleClick} className="w-[150px] h-7 px-[6.5px] py-1.25 left-[71px] top-[231px] absolute bg-red-700 rounded-[19px] justify-center items-center gap-1.25 inline-flex">
                    <div className="text-white text-md font-bold font-mon">Close</div>
                </button> */}
                {/* <div className="w-[25px] h-[10px] left-[133.5px] top-[64px] absolute" /> */}
            </div>
        </div>
    )
}

export default DeleteModal;