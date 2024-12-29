import React, { useState, useRef } from 'react'
import CommonButton from '../../common_component/CommonButton';
import FilePickerInput from '../../common_component/FilePickerInput';
import CommonInputField from '../../common_component/CommonInputField';
import FormControl from '@mui/joy/FormControl';

import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';

export default function DeclarationSupplierProfilePage() {

    const nameRef = useRef<HTMLInputElement | null>(null);
    const [isAgree, setIsAgree] = useState(false);
    const [name, setName] = useState('');
    const [value, setValue] = React.useState('female');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleSignature = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };
    const handleSeal = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };

    const handleNameChange = (name: string) => {
        setName(name);
    }

    const submit = async () => {

    }


    return (
        <div className=' m-8'>

            <div className=' mt-16 w-full h-screen flex flex-col items-start'>


                <h3 className=' font-bold text-lg text-hintColor font-mon'>Declaration</h3>
                <p className=' mt-4  text-sm font-medium text-hintColor font-mon'>We hereby certify that all of the information stated herein, and the documents furnished are true, correct and complete. Further, we acknowledge that the relationship between us and SCBL in connection with selling of our products/services to SCBL will be governed by the purchase contract(s) to be entered into between the parties.</p>
                <p className=' mt-4 text-sm font-medium text-hintColor mb-4 font-mon'>We hereby confirm that our company is owned by following persons and not related directly/ indirectly by any Director or staff members of your company.</p>
                {/* <p className=' mt-8 mb-2 font-medium text-hintColor text-sm'>Owner/Partner/ Director</p> */}

                <FormControl>
                    {/* <FormLabel>Gender</FormLabel> */}
                    <RadioGroup

                        defaultValue="Owner"
                        name="controlled-radio-buttons-group"
                        value={value}
                        onChange={handleChange}
                        sx={{ my: 1 }}
                    >
                        <div className=' flex flex-row space-x-4'>
                            <Radio value="Owner" label="Owner" />
                            <Radio value="Partner" label="Partner" />
                            <Radio value="Authority" label="Authority" />
                        </div>
                    </RadioGroup>
                </FormControl>

                <div className='w-full flex flex-row justify-between mt-4 '>
                    <div className=' flex flex-col items-start'>
                        <p className='mb-2 font-medium text-hintColor text-[16px] font-mon'>Signature with Date & Seal</p>
                        <FilePickerInput width='w-96' onFileSelect={handleSignature} />
                        <p className='mb-2 mt-6 font-medium text-hintColor text-[16px] font-mon  '>Name of Signatory</p>
                        <CommonInputField inputRef={nameRef} onChangeData={handleNameChange} hint='ex: Mohsin Khan' type='text' />
                        <div className=' mt-8 flex flex-row space-x-4 items-center'>
                            <button onClick={() => { setIsAgree(!isAgree) }} className={`w-5 h-5 ${isAgree ? "bg-[#00A76F] " : "bg-whiteColor border-[0.5px] border-hintColor"} rounded-sm shadow-sm flex justify-center items-center `}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-whiteColor font-bold">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>

                            </button>
                            <p className=' mt-[2px] font-semibold text-sm font-mon text-hintColor'>I agree with all the terms & conditions.</p>
                        </div>
                    </div>
                    <div className=' flex flex-col items-start'>
                        <p className='mb-2 font-medium text-hintColor text-[16px] font-mon '>Company Seal</p>
                        <FilePickerInput width='w-96' onFileSelect={handleSeal} />

                        <div className=' mt-48'>

                        </div>
                        <CommonButton titleText="Update" onClick={submit} width='w-44' color='bg-midGreen' />
                    </div>
                </div>
            </div>
        </div>
    )
}

