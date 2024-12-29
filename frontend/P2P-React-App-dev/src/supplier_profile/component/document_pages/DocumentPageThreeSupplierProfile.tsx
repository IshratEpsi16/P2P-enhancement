import React, { useState, useRef } from 'react'
import { useSupplierDocumentPageContext } from '../../context/SupplierDocumentPageContext';
import CommonButton from '../../../common_component/CommonButton';
import FilePickerInput from '../../../common_component/FilePickerInput';
import InputLebel from '../../../common_component/InputLebel';
export default function DocumentPageThreeSupplierProfile() {

    const { page, setPage } = useSupplierDocumentPageContext();

    const handleGoods = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };
    const handleSolvency = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };
    const handleExcellency = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };
    const handleCertificate = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };
    const handleProfile = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };
    const handleQualityCertificate = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };
    const handleAnnualTurnover = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };

    const submitAndNext = async () => {
        setPage(4)
    }
    const previous = () => {
        setPage(2)
    }
    const update = () => {

    }
    return (
        <div className=' m-8'>
            <div className=' flex flex-col item start space-y-8 w-full my-16'>
                <InputLebel titleText={"Upload all the  required files. All file will be safe and secured by the admin."} />
                <div className=' flex flex-row w-full justify-between items-center'>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"List of Available Goods / Services"} />
                        <FilePickerInput onFileSelect={handleGoods} />
                    </div>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Company Solvency Certificate / Bank Certificate"} />
                        <FilePickerInput onFileSelect={handleSolvency} />
                    </div>
                </div>
                <div className=' flex flex-row w-full justify-between items-center'>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Certificates of Excellency, Specializations etc"} />
                        <FilePickerInput onFileSelect={handleExcellency} />
                    </div>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Recommendation / Performance Certificate"} />
                        <FilePickerInput onFileSelect={handleCertificate} />
                    </div>
                </div>
                <div className=' flex flex-row w-full justify-between items-center'>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Company Profile"} />
                        <FilePickerInput onFileSelect={handleProfile} />
                    </div>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Quality Assurance Certificate"} />
                        <FilePickerInput onFileSelect={handleCertificate} />
                    </div>
                </div>
                <div className=' flex flex-row w-full justify-between items-center'>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Annual Turnover(Non-BD)"} />
                        <FilePickerInput onFileSelect={handleAnnualTurnover} />
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
