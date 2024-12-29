import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { showErrorToast } from '../../Alerts_Component/ErrorToast';
import SuccessToast, { showSuccessToast } from '../../Alerts_Component/SuccessToast';

import { useAuth } from '../../login_both/context/AuthContext';
import NewUserPasswordChangeService from '../service/NewUserPasswordChangeService';
import CircularProgressIndicator from '../../Loading_component/CircularProgressIndicator';
import CommonButton from '../../common_component/CommonButton';
import ValidationError from '../../Alerts_Component/ValidationError';

export default function NewUserPasswordChangePage() {

    const passwordRef = useRef<HTMLInputElement | null>(null);
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDisable, setIsDisable] = useState<boolean>(false);

    const { setIsBuyer, setToken } = useAuth();

    const location = useLocation();
    const tokenPassed = location.state && location.state.token;

    useEffect(() => {
        console.log(tokenPassed);
        localStorage.removeItem('token');
        localStorage.removeItem('isBuyer');
        setToken(null);
        setIsBuyer(null);



    }, []);

    const navigate = useNavigate();
    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPassword(value);


    };
    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setConfirmPassword(value);


    };

    //validation

    const [passwordError, setPasswordError] = useState<{ password?: string; confirmPassword?: string; }>({});




    //validation 
    const validatePassword = () => {
        const errors: { password?: string; confirmPassword?: string } = {};
        const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;

        if (!password.trim()) {
            errors.password = 'Please Enter Password';
        }
        if (!confirmPassword.trim()) {
            errors.confirmPassword = 'Please Enter Confirm Password';
        }
        if (password !== confirmPassword) {
            errors.confirmPassword = 'Password Does Not Match';
        }
        if (!passwordRegex.test(password)) {
            errors.confirmPassword = 'Password must contain at least 1 number, 1 uppercase letter, and 1 special character';
        }
        if(password.length !==0 && password.length<6){
            errors.confirmPassword="Password length must be 6 or more"
        }


        setPasswordError(errors);

        return Object.keys(errors).length === 0;
    };


    const changePassword = async () => {
        if (validatePassword()) {
            setIsLoading(true);
            const result = await NewUserPasswordChangeService(tokenPassed, password);
            console.log(result.data);

            if (result.data.status === 200) {
                setIsLoading(false);
                setIsDisable(true);
                showSuccessToast(result.data.message);
                setTimeout(() => {
                    navigate("/");
                }, 1000)
            }
            else {
                setIsLoading(false);
                showErrorToast(result.data.message);
            }
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
                        >First Time Mandatory Password Change</p>
                        {/* <p className=' text-sm font-mon font-medium text-midBlack'>Enter your phone to receive a one-time password.</p> */}
                        <div className='h-10'></div>
                        <div className=' flex flex-row justify-between w-96 h-10 rounded-md  bg-inputBg border-[0.5px] border-borderColor shadow-sm '>
                            <input ref={passwordRef} onChange={handlePasswordChange} placeholder="Password" type={!showPassword ? "password" : "text"} className=' placeholder:text-hintColor rounded-md  h-9 bg-inputBg  focus:outline-none px-4 flex-1' />
                            <button onClick={() => { setShowPassword(!showPassword) }}>
                                {
                                    !showPassword ? <img src="/images/invisible.png" alt="" className=' w-4 h-3 mr-4' /> :
                                        <img src="/images/visible.png" alt="" className=' w-5 h-4 mr-4' />
                                }
                            </button>
                        </div>
                        {
                            passwordError.password && <ValidationError title={passwordError.password} />
                        }
                        <div className='h-10'></div>
                        <div className=' flex flex-row justify-between w-96 h-10 rounded-md  bg-inputBg border-[0.5px] border-borderColor shadow-sm '>
                            <input ref={confirmPasswordRef} onChange={handleConfirmPasswordChange} placeholder="Confirm Password" type={!showPassword ? "password" : "text"} className=' placeholder:text-hintColor rounded-md  h-9 bg-inputBg  focus:outline-none px-4 flex-1' />
                            <button onClick={() => { setShowPassword(!showPassword) }}>
                                {
                                    !showPassword ? <img src="/images/invisible.png" alt="" className=' w-4 h-3 mr-4' /> :
                                        <img src="/images/visible.png" alt="" className=' w-5 h-4 mr-4' />
                                }
                            </button>
                        </div>
                        <span className=' smallText '>Hint: 1 uppercase, 1 number, 1 special character and minimum 6 character long.</span>
                        {
                            passwordError.confirmPassword && <ValidationError title={passwordError.confirmPassword} />
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
                                    titleText={"CHANGE"} onClick={changePassword} height='h-10' />
                        }

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
