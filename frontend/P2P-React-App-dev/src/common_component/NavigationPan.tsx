import React from 'react'
interface listProp {
    list: string[],
}
const NavigationPan: React.FC<listProp> = ({ list }) => {
    return (

        <div className=' flex flex-row items-center space-x-2'>
            {
                list.map((l, i) => (
                    <div key={i} className=' flex flex-row items-center space-x-2'>
                        <div className='h-2 w-2 rounded-full bg-graishColor'></div>
                        <p className=' font-mon text-graishColor text-xs'>{l}</p>

                    </div>
                ))
            }


        </div>
    )
}
export default NavigationPan;