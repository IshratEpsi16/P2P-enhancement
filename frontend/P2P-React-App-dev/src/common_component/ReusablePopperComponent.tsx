import React from 'react';
import Popper from '@mui/material/Popper';

interface ReusablePopperProps {
    id: string | undefined;
    open: boolean;
    anchorEl: HTMLElement | null;
    handleClick: (event: React.MouseEvent<HTMLElement>) => void;
    setLimit: (limit: number) => void;
    limit: number; // Add this line to accept limit as a prop
}

const ReusablePopperComponent: React.FC<ReusablePopperProps> = ({ id, open, anchorEl, handleClick, setLimit, limit }) => {
    return (
        <div className='flex flex-row space-x-2 items-center'>
            <p className='text-sm text-black font-mon'>Row per page:</p>
            <p className='text-sm text-black font-mon'>{limit}</p>
            <div>
                <button aria-describedby={id} type="button" disabled={true} onClick={handleClick}>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mt-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg> */}
                    |
                </button>
                <Popper id={id} open={open} anchorEl={anchorEl}>
                    <div className=' bg-white w-14 h-36 rounded-md shadow-lg border-[0.2px] border-borderColor flex flex-col items-center py-2 space-y-2'>
                        <button onClick={() => { setLimit(5) }} className='font-mon text-[16px] text-blackColor font-medium'>
                            <p onClick={handleClick}>5</p>
                        </button>
                        <button onClick={() => { setLimit(10) }} className='font-mon text-[16px] text-blackColor font-medium'>
                            <p onClick={handleClick}>10</p>
                        </button>
                        <button onClick={() => { setLimit(15) }} className='font-mon text-[16px] text-blackColor font-medium'>
                            <p onClick={handleClick}>15</p>
                        </button>
                        <button onClick={() => { setLimit(20) }} className='font-mon text-[16px] text-blackColor font-medium'>
                            <p onClick={handleClick}>20</p>
                        </button>
                    </div>
                </Popper>
            </div>
        </div>
    );
}

export default ReusablePopperComponent;
