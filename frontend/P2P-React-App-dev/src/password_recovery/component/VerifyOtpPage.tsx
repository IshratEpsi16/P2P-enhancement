import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import CommonButton from '../../common_component/CommonButton';
import ValidationError from '../../Alerts_Component/ValidationError';
import VerifyOtpService from '../service/VerifyOtpService';

import SuccessToast, { showSuccessToast } from '../../Alerts_Component/SuccessToast';
import ErrorToast, { showErrorToast } from '../../Alerts_Component/ErrorToast';

import CircularProgressIndicator from '../../Loading_component/CircularProgressIndicator';
import ReSendOtpService from '../service/ResendOtpService';
export default function VerifyOtpPage() {

    const inputOneRef = useRef<HTMLInputElement | null>(null);
    const inputTwoRef = useRef<HTMLInputElement | null>(null);
    const inputThreeRef = useRef<HTMLInputElement | null>(null);
    const inputFourRef = useRef<HTMLInputElement | null>(null);
    const [inputOne, setInputOne] = useState<string>('');
    const [inputTwo, setInputTwo] = useState<string>('');
    const [inputThree, setInputThree] = useState<string>('');
    const [inputFour, setInputFour] = useState<string>('');
    const [isVerifyClick, setIsVerifyClick] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDisable, setIsDisable] = useState<boolean>(false);

    const location = useLocation();
    const phoneNo = location.state && location.state.phoneNo;



    const navigate = useNavigate();

    //validation

    const [verifyError, setVerifyError] = useState<{ inputOne?: string; inputTwo?: string; inputThree?: string; inputFour?: string; }>({});




    //validation 
    const validateVerify = () => {
        const errors: { inputOne?: string; inputTwo?: string, inputThree?: string, inputFour?: string } = {};


        if (!inputOne.trim() || !inputTwo.trim() || !inputThree.trim() || !inputFour.trim()) {
            errors.inputOne = 'Please Enter OTP';
        }
        // if (!inputTwo.trim()) {
        //     errors.inputTwo = 'Please Enter OTP';
        // }
        // if (!inputThree.trim()) {
        //     errors.inputThree = 'Please Enter OTP';
        // }
        // if (!inputFour.trim()) {
        //     errors.inputFour = 'Please Enter OTP';
        // }


        setVerifyError(errors);

        return Object.keys(errors).length === 0;
    };

    //timer

    const [isTimerComplete, setIsTimerComplete] = useState(false);
    const [countdown, setCountdown] = useState(120); // 300 seconds = 5 minutes
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const startTimer = () => {
        setIsTimerRunning(true);
    };

    const resetTimer = () => {
        setIsTimerRunning(false);
        setCountdown(120); // Reset countdown to 30 seconds
        setIsTimerComplete(false);

        // Clear input values
        setInputOne('');
        setInputTwo('');
        setInputThree('');
        setInputFour('');
    };


    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isTimerRunning && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsTimerComplete(true);
            setIsTimerRunning(false);
        }

        // Clean up the timer on component unmount
        return () => clearInterval(timer);
    }, [isTimerRunning, countdown]);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    };

    const startResendTimer = () => {
        resetTimer(); // Reset the timer before starting it again
        startTimer(); // Start the timer for Resend OTP
    };



    //timer
    const handleInputOneChange = (value: string) => {
        setInputOne(value);


    };
    const handleInputTwoChange = (value: string) => {
        setInputTwo(value);


    };
    const handleInputThreeChange = (value: string) => {
        setInputThree(value);


    };
    const handleInputFourChange = (value: string) => {
        setInputFour(value);


    };

    const handleInputChange = (index: number, value: string) => {
        switch (index) {
            case 1:
                setInputOne(value);
                if (value !== '' && inputTwoRef.current) {
                    inputTwoRef.current.focus();
                }
                break;
            case 2:
                setInputTwo(value);
                if (value !== '' && inputThreeRef.current) {
                    inputThreeRef.current.focus();
                }
                break;
            case 3:
                setInputThree(value);
                if (value !== '' && inputFourRef.current) {
                    inputFourRef.current.focus();
                }
                break;
            case 4:
                setInputFour(value);
                // If you want to trigger a specific action after the last input, add it here
                break;
            default:
                break;
        }
    };

    const verifyOtp = async () => {
        const otp: string = `${inputOne}${inputTwo}${inputThree}${inputFour}`;
        if (validateVerify()) {
            setIsLoading(true);
            const result = await VerifyOtpService(otp, phoneNo);
            if (result.data.status === 200) {
                setIsLoading(false); //button disable korbo jate bar bar na pathate pare
                setIsDisable(true);
                clearData();
                showSuccessToast(result.data.message);
                setTimeout(() => {
                    navigate("/change-password", { state: { phoneNo } });
                }, 1000)
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
    const resendOtp = async () => {
        startResendTimer();
        const result = await ReSendOtpService(phoneNo);
        if (result.data.status === 200) {
            showSuccessToast(result.data.message);


        }
        else {
            showErrorToast(result.data.message);
        }
        //    if(!isTimerRunning){
        //     
        //    }

    }

    const clearData = () => {
        if (inputOneRef.current && inputTwoRef.current && inputThreeRef.current && inputFourRef.current) {
            inputOneRef.current.value = '';
            inputTwoRef.current.value = '';
            inputThreeRef.current.value = '';
            inputFourRef.current.value = '';
            setInputOne('');
            setInputTwo('');
            setInputThree('');
            setInputFour('');
        }
    }

    return (
        <div className=' bg-whiteColor'>
            <SuccessToast />
            <div className='w-full h-screen px-16 py-16 flex flex-row items-start'>
                {/* left side */}
                <div className=' flex-1 h-screen flex justify-center items-center'>
                    <div className=' w-96 flex flex-col items-center space-y-0'>

                        <p className=' text-4xl font-bold text-midBlack font-mon'
                        >Authentication</p>
                        <p className=' text-3xl font-bold text-midBlack font-mon'
                        >Code</p>
                        <div className='h-6'></div>
                        <p className='  text-sm font-mon font-medium text-midBlack'>Please enter the OTP sent to your number.</p>
                        <div className='h-10'></div>
                        <div className=' w-full flex flex-row  justify-between items-start'>
                            <div className="w-14 h-14 ">

                                <input
                                    ref={inputOneRef}
                                    onChange={(e) => handleInputChange(1, e.target.value)}
                                    className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="" maxLength={1} />

                            </div>
                            <div className="w-14 h-14 ">

                                <input
                                    ref={inputTwoRef}
                                    onChange={(e) => handleInputChange(2, e.target.value)}
                                    className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="" maxLength={1} />

                            </div>
                            <div className="w-14 h-14 ">

                                <input
                                    ref={inputThreeRef}
                                    onChange={(e) => handleInputChange(3, e.target.value)}
                                    className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="" maxLength={1} />

                            </div>
                            <div className="w-14 h-14 ">

                                <input
                                    ref={inputFourRef}
                                    onChange={(e) => handleInputChange(4, e.target.value)}
                                    className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700" type="text" name="" id="" maxLength={1} />

                            </div>
                        </div>
                        {
                            verifyError.inputOne && <ValidationError title={verifyError.inputOne} />
                        }
                        {/* {
                            verifyError.inputTwo && <ValidationError title={verifyError.inputTwo} />
                        }
                        {
                            verifyError.inputThree && <ValidationError title={verifyError.inputThree} />
                        }
                        {
                            verifyError.inputFour && <ValidationError title={verifyError.inputFour} />
                        } */}
                        <div className='h-12'></div>




                        <p className=' text-sm font-mon font-medium text-midBlack'>Didn't receive and OTP?</p>
                        <div className='h-6'></div>
                        {
                            (!isTimerComplete && isTimerRunning)
                                ?
                                <p className='text-sm font-mon font-medium text-midBlack'>Resend OTP in {formatTime(countdown)}</p>
                                :
                                <button

                                    onClick={resendOtp}
                                    className='text-sm font-mon font-medium text-midBlack underline '
                                >
                                    Resend OTP
                                </button>

                        }


                        <div className='h-6'></div>

                        {
                            isLoading
                                ?
                                <div className=' w-full flex justify-center items-center'>
                                    <CircularProgressIndicator />
                                </div>
                                :
                                <CommonButton
                                    disable={isDisable ? true : false}
                                    titleText={"VERIFY"} onClick={verifyOtp} height='h-10' />}

                        <div className='h-32'
                        ></div>

                    </div>
                </div>



                {/* left side */}

                {/* right side */}
                <div className=' flex-1'>
                    <img src="/images/otp.jpg" alt="forgot-pass" className=' w-full h-full' />
                </div>


                {/* right side */}
            </div>
        </div>
    )
}
