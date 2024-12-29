import React, { useRef, useState } from 'react'
import CommonButton from '../../common_component/CommonButton';
import InputLebel from '../../common_component/InputLebel';
import CommonInputField from '../../common_component/CommonInputField';
import CommonDropDownSearch from '../../common_component/CommonDropDownSearch';

const options = [
    { value: "fox", label: "🦊 Fox" },
    { value: "Butterfly", label: "🦋 Butterfly" },
    { value: "Honeybee", label: "🐝 Honeybee" },
    { value: "Honeybee1", label: "🐝 Honeybee1" },
    { value: "Honeybee2", label: "🐝 Honeybee2" },
    { value: "Honeybee2", label: "🐝 Honeybee2" },
    { value: "Honeybee2", label: "🐝 Honeybee2" },
    { value: "Honeybee2", label: "🐝 Honeybee2" },
    { value: "Honeybee2", label: "🐝 Honeybee2" },
    { value: "Honeybee2", label: "🐝 Honeybee2" },
    { value: "Honeybee2", label: "🐝 Honeybee2" },
    { value: "Honeybee2", label: "🐝 Honeybee2" },
    { value: "Honeybee2", label: "🐝 Honeybee2" },
];
export default function BasicInformationSupplierProfilePage() {
    const organizationNameRef = useRef<HTMLInputElement | null>(null);
    const addressRef = useRef<HTMLInputElement | null>(null);
    const [organizationName, setOrganizationName] = useState('Abc Corporation');
    const [address, setAddress] = useState('Mirpur Dohs');
    const [itemCategory, setItemCategory] = useState(null);
    const [cat, setCat] = useState({});

    const handleChange = (value: any) => {
        console.log("value:", value);
        setItemCategory(value);

    };

    const handleOrganizationNameChange = (value: string) => {
        setOrganizationName(value);
    }

    const handleAddressChange = (value: string) => {

    }

    const submit = async () => {

    }
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    return (
        <div className=' bg-whiteColor py-4 w-3/4 flex flex-row justify-between items-center'>

            {/* left side */}
            <div className=' w-1/2 h-screen flex flex-col items-start'>

                <div className=' flex flex-col items-start space-y-2'>
                    <InputLebel titleText="Name of Organization" />
                    <CommonInputField inputRef={organizationNameRef} onChangeData={handleOrganizationNameChange} hint="" type="text" />
                </div>
                <div className=' mt-6'>

                </div>
                <div className=' flex flex-col items-start space-y-2'>
                    <InputLebel titleText="Item Category" />
                    <CommonDropDownSearch placeholder='Search Here' onChange={handleChange} value={itemCategory} options={options} width='w-96' />
                </div>
                <div className=' mt-6'></div>
                <InputLebel titleText="Type of Organization" />
                <div className=' mt-4'></div>

                {/* <FormControl >
                       
                        <RadioGroup defaultValue="medium" name="radio-buttons-group">

                            <Radio value="a" label="Proprietorship" color="neutral" />
                            <Radio value="v" label="Partnership" color="neutral" />
                            <Radio value="b" label="Private Limited Company" color="neutral" />
                            <Radio value="f" label="Limited Company" color="neutral" />
                            <Radio value="n" label="Government" color="neutral" />
                            <Radio value="m" label="Others" color="neutral" />

                        </RadioGroup>
                    </FormControl> */}

                <div className="form-control">
                    <label className="label justify-start  ">

                        <input type="radio" name="radio-10" className="radio checked:bg-neonBlue " />
                        <div className=' w-4'> </div>
                        <p className=" text-[16px] text-blackishColor font-mon ">Proprietorship</p>
                    </label>
                    <label className="label justify-start ">

                        <input type="radio" name="radio-10" className="radio checked:bg-neonBlue" />
                        <div className=' w-4'> </div>
                        <p className=" text-[16px] text-blackishColor font-mon ">Partnership</p>
                    </label>
                    <label className="label justify-start">

                        <input type="radio" name="radio-10" className="radio checked:bg-neonBlue" checked />
                        <div className=' w-4'> </div>
                        <p className=" text-[16px] text-blackishColor font-mon" >Private Limited Company</p>
                    </label>
                    <label className="label justify-start">

                        <input type="radio" name="radio-10" className="radio checked:bg-neonBlue" />
                        <div className=' w-4'> </div>
                        <p className=" text-[16px] text-blackishColor font-mon">Limited Company</p>
                    </label>
                    <label className="label justify-start">

                        <input type="radio" name="radio-10" className="radio checked:bg-neonBlue" />
                        <div className=' w-4'> </div>
                        <p className=" text-[16px] text-blackishColor font-mon">Goverment</p>
                    </label>
                    <label className="label justify-start">

                        <input type="radio" name="radio-10" className="radio checked:bg-neonBlue" />
                        <div className=' w-4'> </div>
                        <p className=" text-[16px] text-blackishColor font-mon">Others</p>
                    </label>
                </div>


            </div>

            {/* end left side */}

            {/* right side */}

            <div className=' w-1/2 h-screen pl-56  flex flex-col  items-start '>

                <div className=' flex flex-col items-start space-y-2 '>
                    <InputLebel titleText="Organization Address" />

                    <CommonInputField inputRef={addressRef} onChangeData={handleAddressChange} hint="" type="text" />


                </div>




                {/* country drop dowon */}
                <div className=' flex flex-col items-start space-y-2 mt-6'>
                    <InputLebel titleText="Incorporated in" />
                    <div className=' w-96 h-10 rounded-md  bg-inputBg border-[0.5px] border-borderColor '>
                        <select placeholder='Select Country' name="invitationtype" id="" className=' pl-3 w-[374px] h-9 rounded-md bg-inputBg text-hintColor  focus:outline-none'>
                            <option value="" disabled selected>Select Country</option>
                            <option value="Bangladesh" >Bangladesh</option>
                            <option value="Foreign" >Foreign</option>

                        </select>
                    </div>


                </div>
                <div className=' h-80'>

                </div>
                <CommonButton height='h-10' titleText="Update" onClick={submit} />
            </div>



            {/* end right side */}

        </div>
    )
}
