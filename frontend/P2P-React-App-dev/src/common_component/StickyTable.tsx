import React from 'react';
import Box from '@mui/material/Box';
import Popper from '@mui/material/Popper';

const StickyTable = () => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    return (

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 bg-[#F4F6F8] h-14">
                    <tr>
                        <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                            SL
                        </th>
                        <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                            Supplier Name
                        </th>
                        <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                            Description
                        </th>
                        <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">
                            Status
                        </th>
                        <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  tracking-wider">

                        </th>

                        {/* Add more header columns as needed */}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]">
                    {/* Table rows go here */}
                    <td className="  h-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        body 1
                    </td>
                    <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        body 1
                    </td>
                    <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        body 1
                    </td>
                    <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        body 1
                    </td>
                    <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        body 1
                    </td>
                </tbody>
                <tfoot className="sticky bottom-0 bg-white">
                    <tr className=' h-12'>
                        <td className="px-6 py-3  tracking-wider">
                            <div className=' flex flex-row space-x-2 items-center'>
                                <p className=' text-sm text-black font-mon'>Row per page:</p>
                                <p className=' text-sm text-black font-mon'>10</p>
                                <div>
                                    <button aria-describedby={id} type="button" onClick={handleClick}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mt-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>

                                    </button>
                                    <Popper id={id} open={open} anchorEl={anchorEl}>
                                        <div className=' bg-white w-14 h-36 rounded-md shadow-lg border-[0.2px] border-borderColor flex flex-col items-center py-2 space-y-2'>
                                            <button onClick={handleClick} className=' font-mon text-[16px] text-blackColor font-medium'>
                                                5
                                            </button>
                                            <button onClick={handleClick} className=' font-mon text-[16px] text-blackColor font-medium'>
                                                10
                                            </button>
                                            <button onClick={handleClick} className=' font-mon text-[16px] text-blackColor font-medium'>
                                                15
                                            </button>
                                            <button onClick={handleClick} className=' font-mon text-[16px] text-blackColor font-medium'>
                                                100
                                            </button>
                                        </div>
                                    </Popper>
                                </div>

                            </div>
                        </td>

                        {/* Add more footer columns as needed */}
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default StickyTable;
