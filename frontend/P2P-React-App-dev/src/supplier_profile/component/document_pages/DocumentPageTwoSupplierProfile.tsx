import React, { useState, useRef } from 'react'
import { useSupplierDocumentPageContext } from '../../context/SupplierDocumentPageContext';
import CommonButton from '../../../common_component/CommonButton';
import FilePickerInput from '../../../common_component/FilePickerInput';
import InputLebel from '../../../common_component/InputLebel';
import CommonInputField from '../../../common_component/CommonInputField';

export default function DocumentPageTwoSupplierProfile() {
    const incorporationNumberRef = useRef<HTMLInputElement | null>(null);
    const { page, setPage } = useSupplierDocumentPageContext();
    const [incorporationNumber, setIncorporationNumber] = useState('');



    const handleChangeIncorporationNumber = (value: string) => {
        setIncorporationNumber(value);
    }
    const handleCertificate = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };
    const handleMemorandum = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };
    const handleAssociation = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };
    const handleSignatories = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };
    const handleClientList = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };

    const submitAndNext = async () => {
        setPage(3)
    }
    const previous = () => {
        setPage(1)
    }
    const update = () => {

    }
    return (
        <div className='m-8'>
            <div className=' flex flex-col item start space-y-8 w-full my-16'>
                <InputLebel titleText={"Upload all the  required files. All file will be safe and secured by the admin."} />
                <div className=' flex flex-row w-full justify-between items-center'>

                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Incorporation Number"} />
                        <CommonInputField type='text' hint='0787235762' inputRef={incorporationNumberRef} onChangeData={handleChangeIncorporationNumber} />
                    </div>

                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Certificate of Incorporation"} />
                        <FilePickerInput onFileSelect={handleCertificate} />
                    </div>


                </div>
                <div className=' flex flex-row w-full justify-between items-center'>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Memorandum of Association"} />
                        <FilePickerInput onFileSelect={handleMemorandum} />
                    </div>

                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"List of Authorized Signatories"} />
                        <FilePickerInput onFileSelect={handleSignatories} />
                    </div>
                </div>
                <div className=' flex flex-row w-full justify-between items-center'>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Articles of Association"} />
                        <FilePickerInput onFileSelect={handleAssociation} />
                    </div>
                    <div className=' flex flex-col items-start space-y-2'>

                        <InputLebel titleText={"List of Prominent Clients"} />
                        <FilePickerInput onFileSelect={handleClientList} />
                    </div>
                </div>

                <div className=' my-8'>

                </div>
                <div className=' w-full flex flex-row justify-end space-x-8 items-center'>

                    <CommonButton titleText={"Previous"} color='bg-graishColor' onClick={previous} width='w-44' />
                    <CommonButton titleText={"Update"} color='bg-midGreen' onClick={update} width='w-44' />
                    <CommonButton titleText={"Next"} onClick={submitAndNext} width='w-44' />
                </div>

            </div>
        </div>
    )
}
