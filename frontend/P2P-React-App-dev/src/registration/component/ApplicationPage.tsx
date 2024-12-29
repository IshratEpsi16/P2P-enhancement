import React, { useRef, useState, useEffect } from 'react'
import InputLebel from '../../common_component/InputLebel';
import CommonInputField from '../../common_component/CommonInputField';
import FilePickerInput from '../../common_component/FilePickerInput';
import CommonButton from '../../common_component/CommonButton';
import moment from 'moment';
import { useDocumentPageContext } from '../context/DocumentPageContext';
export default function ApplicationPage() {
    const ownernameRef = useRef<HTMLInputElement | null>(null);
    const applicationDate = moment(Date()).format('DD-MM-YYYY')
    const [ownerName, setOwnerName] = useState('');



    const handleOwnerNameChange = (value: string) => {
        setOwnerName(value);
        console.log(ownerName);

    }

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

    const submit = async () => {

    }

    return (
        <div className=' m-8'>
            <div className=' w-3/4 flex flex-col items-start'>
                <div className='mb-4 flex flex-row space-x-4 items-center'>
                    <InputLebel titleText="Date" />
                    <div className=' w-48 h-10 bg-inputBg border-[0.5px] border-borderColor rounded-md  px-4 flex items-center'>
                        {applicationDate}
                    </div>
                </div>
                <InputLebel titleText={"TO"} />
                <InputLebel titleText={"The Managing Director"} />
                <InputLebel titleText={"Shun Shing Group (BD Subsidiary)"} />
                <InputLebel titleText={"Land View (7th to 9 th Floor), 28 Gulshan North C/A"} />
                <InputLebel titleText={"Gulshan -2, Dhaka."} />
                <div className='mb-8'></div>
                <InputLebel titleText={"We hereby confirm that our company is owned by following persons and not related directly / indirectly or financed by any Director or staff members of your company."} />
                <div className=' my-8 flex flex-col items-start space-y-2'>
                    <InputLebel titleText={"Name of Owner:"} />
                    <CommonInputField type='text' hint='Owner Name' onChangeData={handleOwnerNameChange} inputRef={ownernameRef} />
                </div>
                <div className=' my-8 flex flex-col items-start space-y-1'>
                    <InputLebel titleText={"Sincerely yours"} />
                    <FilePickerInput width='w-80' onFileSelect={handleSignature} />
                    <InputLebel titleText={"Signature of Owner/Partner/ Director"} />
                </div>
                <div className=' my-8 flex flex-col items-start space-y-1'>
                    <InputLebel titleText={"Seal of the organization"} />
                    <FilePickerInput width='w-80' onFileSelect={handleSeal} />
                    <InputLebel titleText={"Your company Seal"} />
                </div>
                <div className='my-12 w-full flex flex-row items-end justify-end'>
                    <CommonButton titleText={"Submit"} onClick={submit} />

                </div>
            </div>

        </div>
    )
}
