import React, { useState, useRef } from 'react';
import { useSupplierDocumentPageContext } from '../../context/SupplierDocumentPageContext';
import CommonButton from '../../../common_component/CommonButton';
import FilePickerInput from '../../../common_component/FilePickerInput';
import InputLebel from '../../../common_component/InputLebel';
import CommonInputField from '../../../common_component/CommonInputField';
import DateRangePicker from '../../../common_component/DateRangePicker';

export default function DocumentPageOneSupplierProfile() {
    const registrationNumberRef = useRef<HTMLInputElement | null>(null);
    const etinNumberRef = useRef<HTMLInputElement | null>(null);
    const ebinNumberRef = useRef<HTMLInputElement | null>(null);
    const [assesmentYear, setAssesmentYear] = useState({
        startDate: null,
        endDate: null, // Set the endDate to the end of the current year
    });
    const [startDate, setStartDate] = useState({
        startDate: null,
        endDate: null, // Set the endDate to the end of the current year
    });
    const [endDate, setEndDate] = useState({
        startDate: null,
        endDate: null, // Set the endDate to the end of the current year
    });



    const [registrationNumber, setRegistrationNumber] = useState('');
    const [etinNumber, setEtinNumber] = useState('');
    const [ebinNumber, setBtinNumber] = useState('');

    const { page, setPage } = useSupplierDocumentPageContext();

    const handleAssementYearChange = (newValue: any) => {
        setAssesmentYear(newValue);
        // Handle the selected date here
    };
    const handleStartDateChange = (newValue: any) => {
        setStartDate(startDate)
        // Handle the selected date here
    };
    const handleEndDateChange = (newValue: any) => {
        setEndDate(endDate);
        // Handle the selected date here
    };
    const registrationNumberChange = (value: string) => {
        setRegistrationNumber(value);
    };
    const etinNumberChange = (value: string) => {
        setEtinNumber(value);
    };
    const ebinNumberChange = (value: string) => {
        setBtinNumber(value);
    };
    const handleAssementYearFile = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };

    const handleTradeLicense = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };
    const handleEtin = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };
    const handleEbin = (file: File | null) => {
        if (file) {
            // Handle the selected file here
            console.log('Selected file:', file);
        } else {
            // No file selected
            console.log('No file selected');
        }
    };

    const update = () => {

    }

    const submitAndNext = async () => {
        setPage(2);
        console.log(page);

    }
    return (
        <div className=' m-8'>
            <div className=' flex flex-col item start space-y-8 w-full my-16'>
                <InputLebel titleText={"Upload all the  required files. All file will be safe and secured by the admin."} />
                <div className=' flex flex-row w-full justify-between items-center'>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Trade License/ Export License number"} />
                        <CommonInputField type='text' hint='Chamber of Commerce Number' onChangeData={registrationNumberChange} inputRef={registrationNumberRef} />
                    </div>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Trade License/ Export License"} />
                        <FilePickerInput onFileSelect={handleTradeLicense} />
                    </div>
                </div>
                <div className=' flex flex-row w-full justify-between items-center'>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Trade License/ Export License Start date"} />
                        {/* <ReusableDatePicker placeholder="DD-MM-YYYY" onChange={handleStartDateChange} /> */}
                        <DateRangePicker onChange={handleStartDateChange} width='w-96' placeholder='DD/MM/YYYY' value={assesmentYear} signle={true} />

                    </div>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Trade License/ Export License End date"} />
                        {/* <ReusableDatePicker placeholder="DD-MM-YYYY" onChange={handleEndDateChange} /> */}
                        <DateRangePicker onChange={handleEndDateChange} width='w-96' placeholder='DD/MM/YYYY' value={assesmentYear} signle={true} />
                    </div>
                </div>
                <div className=' flex flex-row w-full justify-between items-center'>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"E-TIN Number"} />
                        <CommonInputField type='text' onChangeData={etinNumberChange} hint='978656487' inputRef={etinNumberRef} />

                    </div>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"E-TIN File"} />
                        <FilePickerInput onFileSelect={handleEtin} />
                    </div>
                </div>
                <div className=' flex flex-row w-full justify-between items-center'>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Tax Return Assessment Year"} />
                        {/* <ReusableDatePicker placeholder="YYYY-YYYY" onChange={handleAssementYearChange} /> */}
                        <DateRangePicker onChange={handleAssementYearChange} width='w-96' placeholder='YYYY-YYYY' value={assesmentYear} signle={true} />

                    </div>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"Tax Return Acknowledgement Slip"} />
                        <FilePickerInput onFileSelect={handleAssementYearFile} />
                    </div>
                </div>

                <div className=' flex flex-row w-full justify-between items-center'>
                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"E-BIN Number"} />
                        <CommonInputField type='text' onChangeData={ebinNumberChange} hint='978656487' inputRef={ebinNumberRef} />

                    </div>

                    <div className=' flex flex-col items-start space-y-2'>
                        <InputLebel titleText={"E-BIN File"} />
                        <FilePickerInput onFileSelect={handleEbin} />
                    </div>
                </div>
                <div className=' mt-8'>

                </div>
                <div className=' w-full flex space-x-4 items-center justify-end '>
                    <CommonButton titleText={"Update"} onClick={update} width='w-44' color='bg-midGreen' />
                    <CommonButton titleText={"Next"} onClick={submitAndNext} width='w-44' />
                </div>
                <div className=' mt-8'>

                </div>
            </div>
        </div>
    )
}
