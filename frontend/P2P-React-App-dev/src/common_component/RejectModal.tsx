import React, { useState, useRef } from 'react';

interface RejectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onReject: () => void;
    titleText: string;
    labelText: string;
}

const RejectModal: React.FC<RejectDialogProps> = ({ isOpen, onClose, onReject, titleText, labelText }) => {
    const idRef = useRef<HTMLInputElement | null>(null);
    const [id, setId] = useState<string>('');
    const [reason, setReason] = useState<string>('');

    const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputText = e.target.value;
        if (inputText.length <= 200) {
            setReason(inputText);
        } else {
            setReason(inputText.slice(0, 200));
        }
    }

    const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputText = e.target.value;
        setId(inputText);
    }

    const cancelDialog = () => {
        if (idRef.current) {
            idRef.current.value = "";
        }

        setReason('');
        onClose();
    }
    if (!isOpen) {
        return null;
    }

    return (

        <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 bg-gray-700">
            <div className='w-96 rounded-md bg-white'>
                <div className='w-full h-10 bg-red-400 rounded-t-md flex justify-center items-center'>
                    <p className='text-sm font-mon font-medium text-white'>{titleText}</p>
                </div>
                <div className='h-4'></div>
                <div className='w-full flex flex-col items-end space-y-2'>
                    <div className='px-8 flex flex-row space-x-2 items-center'>
                        <div className='w-28'>
                            <p className='font-medium text-blackColor text-sm font-mon'>{labelText}</p>
                        </div>
                        <input type='text' ref={idRef} onChange={handleIdChange} placeholder='0767453245676' className='px-2 text-xs w-48 h-8 rounded-md border-[1px] border-borderColor focus:outline-none placeholder:font-mon placeholder:text-xs' />
                    </div>
                </div>
                <div className='h-2'></div>
                <div className='w-full flex flex-col items-end space-y-2'>
                    <div className='px-8 flex flex-row space-x-2 items-start'>
                        <div className='w-28'>
                            <p className='font-medium text-blackColor text-sm font-mon'>Reject Reason</p>
                        </div>
                        <textarea
                            value={reason}
                            onChange={handleReasonChange}
                            className='text-xs w-48 h-40 bg-inputBg mt-2 rounded-md shadow-sm focus:outline-none p-4 border-[1px] border-borderColor'
                        />
                    </div>
                </div>
                <div className='h-4'></div>
                <div className='w-full flex flex-row space-x-4 px-8 justify-end'>
                    <button onClick={cancelDialog} className='text-xs text-blackColor border-[1px] h-6 w-16 border-borderColor flex justify-center items-center rounded-md font-mon'>Cancel</button>
                    <button onClick={onReject} className='text-xs bg-red-400 rounded-md h-6 w-16 text-white font-mon'>Reject</button>
                </div>
                <div className='h-8'></div>
            </div>
        </div>

    );
}

export default RejectModal;
