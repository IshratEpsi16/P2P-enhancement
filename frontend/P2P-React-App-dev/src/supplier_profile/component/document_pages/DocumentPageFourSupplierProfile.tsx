import React, { useState, useRef } from 'react'
import { useSupplierDocumentPageContext } from '../../context/SupplierDocumentPageContext';
import CommonButton from '../../../common_component/CommonButton';
import FilePickerInput from '../../../common_component/FilePickerInput';
import InputLebel from '../../../common_component/InputLebel';
export default function DocumentPageFourSupplierProfile() {

    const { page, setPage } = useSupplierDocumentPageContext();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imagePreview2, setImagePreview2] = useState<string | null>(null);


    const handleMachineries = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };
    const handleBusinessPremises = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };
    const handlePhotograph = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);

            // Read the selected file and create a URL for preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const previewUrl = reader.result as string;
                setImagePreview(previewUrl);
            };
            reader.readAsDataURL(file);
        } else {
            // No file selected
            console.log('No file selected');
            setImagePreview(null);
        }
    };
    const handlePhotograph2 = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);

            // Read the selected file and create a URL for preview
            const reader = new FileReader();
            reader.onloadend = () => {
                const previewUrl = reader.result as string;
                setImagePreview2(previewUrl);
            };
            reader.readAsDataURL(file);
        } else {
            // No file selected
            console.log('No file selected');
            setImagePreview2(null);
        }
    };


    const previous = () => {
        setPage(3)
    }

    const update = () => {

    }

    return (
        <div className=' m-8'>
            <div className=' flex flex-col item-start space-y-8 w-full my-16'>
                <InputLebel titleText={"Upload all the  required files. All file will be safe and secured by the admin."} />
                <div className=' flex flex-row w-full justify-between items-start '>
                    <div className=' flex-1 flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"List of Machineries, Manpower, Competencies"} />
                        <FilePickerInput onFileSelect={handleMachineries} />
                    </div>
                    <div className=' w-36'></div>
                    <div className='flex-1 flex flex-col items-start space-y-2  '>
                        <InputLebel titleText={"Business Premises (rented / owned, with address)"} />
                        <FilePickerInput onFileSelect={handleBusinessPremises} />
                    </div>
                </div>
                <div className=' flex flex-row w-full justify-between items-start '>
                    <div className='flex-1 flex flex-col items-start space-y-2 '>
                        <InputLebel titleText={"Photograph of Owner-1"} />
                        <FilePickerInput onFileSelect={handlePhotograph} />
                        {imagePreview && <img src={imagePreview} alt="Preview" className=' mt-2 w-48 h-52 rounded-md p-2 border-2 border-borderColor shadow-md' />}
                    </div>
                    <div className=' w-36'></div>
                    <div className='flex-1 flex flex-col items-start space-y-2 '>
                        <InputLebel titleText={"Photograph of Owner-2"} />
                        <FilePickerInput onFileSelect={handlePhotograph2} />
                        {imagePreview2 && <img src={imagePreview2} alt="Preview" className=' mt-2 w-48 h-52 rounded-md p-2 border-2 border-borderColor shadow-md' />}
                    </div>

                </div>

                <div className=' my-8'>

                </div>
                <div className=' w-full flex flex-row justify-end space-x-8 items-center'>

                    <CommonButton titleText={"previous"} color='bg-graishColor' onClick={previous} width='w-44' />
                    <CommonButton titleText={"Update"} color='bg-midGreen' onClick={update} width='w-44' />

                </div>


            </div>
        </div>
    )
}
