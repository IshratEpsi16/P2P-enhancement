import React from 'react'
interface listProp {
    list: any[]
}
const ApproveHierarchyTable: React.FC<listProp> = ({ list }) => {
    return (

        <div className="w-full  flex justify-center items-center  ring-1 ring-borderColor bg-gray-50">
            <table className="w-full  px-16  ">

                <thead className="   ">

                    <tr className=' w-full h-14 bg-lightGreen rounded-t-md' >
                        <th className='mediumText '>SL</th>
                        <th className='mediumText '>Perfomrmed By</th>
                        <th className='mediumText '>Date</th>
                        <th className='mediumText '>Action</th>
                        <th className='mediumText '>Remarks</th>
                    </tr>


                </thead>
                <tbody>
                    {list.map((item, index) => (
                        <tr key={item.id} className={`text-center h-14 ${index !== 0 ? 'border-t border-borderColor h-[0.1px] ' : ''}`}>
                            <td className="smallText h-14">{index + 1}</td>
                            <td className="smallText h-14">{item.name}</td>
                            <td className="smallText h-14">{item.date}</td>
                            <td className="font-mon text-sm  text-darkGreen font-semibold h-14">{item.action}</td>
                            <td className="smallText h-14">{item.remark}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>




    )
}

export default ApproveHierarchyTable;


