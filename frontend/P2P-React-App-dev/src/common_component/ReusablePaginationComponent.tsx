import React from 'react';

interface ReusablePaginationProps {
    pageNo: number;
    limit: number;
    total?: number; // Change 'any[]' to the actual type of your list
    previous: () => void; // Function to handle previous button click
    next: () => void; // Function to handle next button click
}

const ReusablePaginationComponent: React.FC<ReusablePaginationProps> = ({ pageNo, limit, total, previous, next }) => {
    return (
        <div className='flex flex-row items-center'>
            <p className='text-sm text-black font-mon'>{pageNo === 1 ? 1 : pageNo}-{limit} of {total}</p>
            {/* <p className='text-sm text-black font-mon'>
                {pageNo === 1 ? 1 : (limit * (pageNo - 1) + 1)}
                -{Math.min(limit * pageNo, total!)} of {total}
            </p> */}


            <div className='w-2'></div>
            <button onClick={previous} disabled={pageNo === 1 ? true : false}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>
            <button
                disabled={limit >= total! ? true : false}
                onClick={next}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    );
}

export default ReusablePaginationComponent;




