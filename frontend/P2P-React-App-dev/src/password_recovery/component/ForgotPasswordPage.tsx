import React, { useState, useRef } from 'react'

import CommonInputField from '../../common_component/CommonInputField';
import CommonButton from '../../common_component/CommonButton';
import { useNavigate } from 'react-router-dom';
import ValidationError from '../../Alerts_Component/ValidationError';
import SendOtpService from '../service/OtpSendService';


import CircularProgressIndicator from '../../Loading_component/CircularProgressIndicator';

import SuccessToast, { showSuccessToast } from '../../Alerts_Component/SuccessToast';
import ErrorToast, { showErrorToast } from '../../Alerts_Component/ErrorToast';
export default function ForgotPasswordPage() {
    const usernameRef = useRef<HTMLInputElement | null>(null);
    const phoneRef = useRef<HTMLInputElement | null>(null);
    const [username, setUsername] = useState<string>('');
    const [phoneNo, setPhoneNo] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDisable, setIsDisable] = useState<boolean>(false);


    const [phoneError, setPhoneError] = useState<{ email?: string; phoneNo?: string; }>({});


    const navigate = useNavigate();

    //validation 
    const validateSend = () => {
        const errors: { email?: string; phoneNo?: string } = {};


        if (!phoneNo.trim()) {
            errors.phoneNo = 'Please Enter Phone No';
        }


        setPhoneError(errors);

        return Object.keys(errors).length === 0;
    };


    // const handleUsernameChange = (value: string) => {
    //     setUsername(value);


    // };
    const handlePhoneNo = (value: string) => {
        let phn;

        if (value[0] === '0') {
            phn = value.substring(1)

        }
        else {
            phn = value;
        }
        console.log(`phn: ${phn}`);

        setPhoneNo(phn);
    }

    const sendOtp = async () => {
        if (validateSend()) {
            setIsLoading(true);
            const result = await SendOtpService(phoneNo);
            if (result.data.status === 200) {
                setIsLoading(false);
                setIsDisable(true);
                showSuccessToast(result.data.message);

                setTimeout(() => {
                    navigate("/verify-otp", { state: { phoneNo } });
                }, 1200);
            }
            else {
                setIsLoading(false);
                showErrorToast(result.data.message);
            }


        }
        else {
            console.log('validation failed');

        }

    }

    return (
        <div className=' bg-whiteColor'>
            <SuccessToast />
            <div className='w-full h-screen px-16 py-16 flex flex-row items-start'>
                {/* left side */}
                <div className=' flex-1 h-screen flex justify-center items-center'>
                    <div className=' w-96 flex flex-col items-start space-y-0'>

                        <p className=' text-2xl font-bold text-midBlack font-mon'
                        >Welcome Back</p>
                        <p className=' text-sm font-mon font-medium text-midBlack'>Enter your phone to receive a one-time password.</p>
                        <div className='h-10'></div>
                        {/* <CommonInputField inputRef={usernameRef} onChangeData={handleUsernameChange} hint="Enter Email" type="text" />
                        <div className='h-10'></div> */}
                        <CommonInputField inputRef={phoneRef} onChangeData={handlePhoneNo} hint="Enter Mobile" type="number" />
                        {
                            phoneError.phoneNo && <ValidationError title={phoneError.phoneNo} />
                        }
                        <div className='h-12'></div>
                        {
                            isLoading
                                ?
                                <div className=' w-full flex justify-center items-center'>
                                    <CircularProgressIndicator />
                                </div>
                                :
                                <CommonButton
                                    disable={isDisable ? true : false}
                                    titleText={"SEND"} onClick={sendOtp} height='h-10' />}
                        <div className='h-4'></div>
                        <p className=' text-sm font-mon font-medium text-midBlack'>NB: Please do not disclose username/email to others.</p>
                        <div className='h-32'
                        ></div>

                    </div>
                </div>



                {/* left side */}

                {/* right side */}
                <div className=' flex-1'>
                    <img src="/images/forgot-password.jpg" alt="forgot-pass" className=' w-full h-full' />
                </div>


                {/* right side */}
            </div>
        </div>
    )
}
