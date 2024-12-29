import React, { useRef, useState, useEffect } from "react";

import InputLebel from "../../common_component/InputLebel";
import CommonInputField from "../../common_component/CommonInputField";
import CommonButton from "../../common_component/CommonButton";
import { Link, useLocation } from "react-router-dom"; // If you're using React Router
import jwtDecode from "jwt-decode";
import { isTokenValid } from "../../utils/methods/TokenValidityCheck";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import CreateSupplierAccountService from "../service/CreateSupplierAccountService";
import { useNavigate } from "react-router-dom";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import ValidationError from "../../Alerts_Component/ValidationError";
import InvitationViewService from "../service/InvitationViewService";

export default function CreateAccountPage() {
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const mobileNoRef = useRef<HTMLInputElement | null>(null);
  const [mobileNo, setMobileNo] = useState<string>("");
  const [bgId, setBgId] = useState<number | null>(null);
  const [initiatorId, setInitiatorId] = useState<number | null>(null);
  const location = useLocation();
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [createError, setCreateError] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    mobileNo?: string;
  }>({});

  const navigate = useNavigate();

  //validation
  const validateCreate = () => {
    const errors: {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      mobileNo?: string;
    } = {};
    const passwordRegex =
      /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;
    if (!username.trim()) {
      errors.username = "Please Enter Username";
    }
    if (!email.trim()) {
      errors.email = "Please Enter Email";
    }
    if (!mobileNo.trim()) {
      errors.mobileNo = "Please Enter Mobile Number";
    }
    if (!password.trim()) {
      errors.password = "Please Enter Password";
    }
    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Please Enter Confirm Password";
    }
    if (
      password !== "" &&
      confirmPassword !== "" &&
      password !== confirmPassword
    ) {
      errors.confirmPassword = "Password does not match";
    }
    if (!passwordRegex.test(password)) {
      errors.confirmPassword =
        "Password must contain at least 1 number, 1 uppercase letter, and 1 special character";
    }
    if (password.length !== 0 && password.length < 6) {
      errors.confirmPassword = "Password length must be 6 or more";
    }

    setCreateError(errors);

    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    // Get the token from the URL
    const token = new URLSearchParams(window.location.search).get("token");

    const isTokenExpired = !isTokenValid(token!);
    if (isTokenExpired) {
      setIsExpired(true);
    } else {
      if (token) {
        try {
          const decodedToken = decodeJWT(token);

          // Extract USER_ID from the decoded payload
          const name = decodedToken?.decodedPayload?.NAME;
          const email = decodedToken?.decodedPayload?.EMAIL;
          const type = decodedToken?.decodedPayload?.TYPE;
          const mNo = decodedToken?.decodedPayload?.MOBILE_NUMBER;
          const bgId = decodedToken?.decodedPayload?.BUSINESS_GROUP_ID;
          const initid = decodedToken?.decodedPayload?.INITIATOR_ID;
          console.log(name);
          console.log(email);
          console.log(type);
          console.log(bgId);
          invitationView(token, email);

          if (usernameRef.current && emailRef.current && mobileNoRef.current) {
            usernameRef.current.value = name;
            emailRef.current.value = email;
            mobileNoRef.current.value = mNo;
            setUsername(name);
            setEmail(email);
            setMobileNo(mNo);
            setBgId(bgId);
            setInitiatorId(initid);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }
  }, []);

  const decodeJWT = (token: string) => {
    try {
      // Split the token into header, payload, and signature (assuming they are separated by dots)
      const [encodedHeader, encodedPayload] = token.split(".");

      // Decode base64-encoded header and payload
      const decodedHeader = JSON.parse(window.atob(encodedHeader));
      const decodedPayload = JSON.parse(window.atob(encodedPayload));

      // Log the decoded header and payload
      console.log("Decoded Header:", decodedHeader);
      console.log("Decoded Payload:", decodedPayload);

      // Make sure that the decoded payload has the expected structure
      if (
        decodedPayload &&
        decodedPayload.hasOwnProperty("NAME") &&
        decodedPayload.hasOwnProperty("EMAIL") &&
        decodedPayload.hasOwnProperty("TYPE")
      ) {
        const name = decodedPayload.NAME;
        const email = decodedPayload.EMAIL;
        const type = decodedPayload.TYPE;
        const mobileNumber = decodedPayload.MOBILE_NUMBER;
        const bgId = decodedPayload.BUSINESS_GROUP_ID;
        const intId = decodedPayload.INITIATOR_ID;
        return {
          decodedHeader,
          decodedPayload,
          name,
          email,
          type,
          mobileNumber,
          bgId,
          intId,
        };
      } else {
        console.error(
          "Error: Decoded payload does not have the expected structure."
        );
        return null;
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handleMobileNo = (value: string) => {
    setMobileNo(value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
  };
  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setConfirmPassword(value);
  };
  const createAccount = async () => {
    if (validateCreate()) {
      setIsLoading(true);
      const result = await CreateSupplierAccountService(
        username,
        email,
        mobileNo,
        password,
        bgId!,
        initiatorId!
      );
      if (result.data.status === 200) {
        setIsLoading(false);
        showSuccessToast(result.data.message);
        setTimeout(() => {
          navigate("/");
        }, 1001);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } else {
      console.log("validation failed");
    }
  };

  const invitationView = async (token: string, email: string) => {
    console.log("email", email);
    console.log("token", token);

    const result = await InvitationViewService(token, email);
    console.log(result);
  };
  return (
    <div>
      <SuccessToast />
      {isExpired ? (
        <div className=" flex justify-center items-center w-full h-screen">
          <p className=" text-lg font-bold text-redColor font-mon">
            Invitation has expired
          </p>
        </div>
      ) : (
        <div className=" flex flex-row space-x-6 ">
          {/* left side */}
          <div className="w-1/2 h-screen">
            <img
              src="/images/ssgilbg.png"
              alt="login"
              className=" h-screen w-full"
            />
          </div>
          {/* end left side */}

          {/* right side */}

          <div className="w-1/2 h-screen flex justify-start items-center">
            <div className=" flex flex-col items-start">
              <h3 className=" text-3xl font-bold text-blackColor ">
                Create Account
              </h3>
              <div className=" flex flex-row space-x-2 items-center mb-6 mt-1">
                <p className=" text-graishColor text-sm">
                  Already have account?
                </p>
                <Link to={"/login"}>
                  <p className=" text-sm text-darkGreen font-semibold">Login</p>
                </Link>
              </div>
              <div className=" flex flex-col items-start space-y-4">
                <div className=" flex flex-col items-start space-y-2">
                  <InputLebel titleText="Username" />
                  <CommonInputField
                    inputRef={usernameRef}
                    onChangeData={handleUsernameChange}
                    hint="Supplier Name"
                    type="text"
                    maxCharacterlength={99}
                  />
                </div>
                {createError.username && (
                  <ValidationError title={createError.username} />
                )}

                <div className=" flex flex-col items-start space-y-2">
                  <InputLebel titleText="Email" />
                  <CommonInputField
                    inputRef={emailRef}
                    onChangeData={handleEmailChange}
                    hint="Email Address"
                    type="text"
                  />
                </div>
                {createError.email && (
                  <ValidationError title={createError.email} />
                )}
                <div className=" flex flex-col items-start space-y-2">
                  <InputLebel titleText="Mobile No" />
                  <CommonInputField
                    inputRef={mobileNoRef}
                    onChangeData={handleMobileNo}
                    hint="Mobile No"
                    type="number"
                  />
                  {createError.mobileNo && (
                    <ValidationError title={createError.mobileNo} />
                  )}
                </div>
                <div className=" flex flex-col items-start space-y-2">
                  <InputLebel titleText="Password" />
                  {/* <div className=' flex flex-row justify-between w-96 h-10 rounded-md  bg-inputBg border-[0.5px] border-borderColor '>
                                    <input ref={passwordRef} onChange={handlePasswordChange} placeholder="Password" type={!showPassword ? "password" : "text"} className=' placeholder:text-hintColor rounded-md  h-9 bg-inputBg  focus:outline-none px-4' />
                                    <button onClick={() => { setShowPassword(!showPassword) }}>
                                        {
                                            !showPassword ? <img src="/images/invisible.png" alt="" className=' w-4 h-3 mr-4' /> :
                                                <img src="/images/visible.png" alt="" className=' w-5 h-4 mr-4' />
                                        }
                                    </button>
                                </div> */}
                  <div className=" flex flex-row justify-between w-96 h-10 rounded-md  bg-inputBg border-[0.5px] border-borderColor shadow-sm ">
                    <input
                      ref={passwordRef}
                      onChange={handlePasswordChange}
                      placeholder="Password"
                      type={!showPassword ? "password" : "text"}
                      className=" placeholder:text-hintColor rounded-md  h-9 bg-inputBg  focus:outline-none px-4 flex-1"
                    />
                    <button
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {!showPassword ? (
                        <img
                          src="/images/invisible.png"
                          alt=""
                          className=" w-4 h-3 mr-4"
                        />
                      ) : (
                        <img
                          src="/images/visible.png"
                          alt=""
                          className=" w-5 h-4 mr-4"
                        />
                      )}
                    </button>
                  </div>
                </div>
                {createError.password && (
                  <ValidationError title={createError.password} />
                )}
                <div className=" flex flex-col items-start space-y-2">
                  <InputLebel titleText="Confirm Password" />
                  {/* <div className=' flex flex-row justify-between w-96 h-10 rounded-md  bg-inputBg border-[0.5px] border-borderColor '>
                                    <input ref={confirmPasswordRef} onChange={handleConfirmPasswordChange} placeholder="Confirm Password" type={!showPassword ? "password" : "text"} className=' placeholder:text-hintColor rounded-md  h-19 bg-inputBg  focus:outline-none px-4' />
                                    <button onClick={() => { setShowPassword(!showPassword) }}>
                                        {
                                            !showPassword ? <img src="/images/invisible.png" alt="" className=' w-4 h-3 mr-4' /> :
                                                <img src="/images/visible.png" alt="" className=' w-5 h-4 mr-4' />
                                        }
                                    </button>
                                </div> */}

                  <div className=" flex flex-row justify-between w-96 h-10 rounded-md  bg-inputBg border-[0.5px] border-borderColor shadow-sm ">
                    <input
                      ref={confirmPasswordRef}
                      onChange={handleConfirmPasswordChange}
                      placeholder="Password"
                      type={!showPassword ? "password" : "text"}
                      className=" placeholder:text-hintColor rounded-md  h-9 bg-inputBg  focus:outline-none px-4 flex-1"
                    />
                    <button
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {!showPassword ? (
                        <img
                          src="/images/invisible.png"
                          alt=""
                          className=" w-4 h-3 mr-4"
                        />
                      ) : (
                        <img
                          src="/images/visible.png"
                          alt=""
                          className=" w-5 h-4 mr-4"
                        />
                      )}
                    </button>
                  </div>
                </div>

                <span className=" smallText w-96 ">
                  Hint: 1 uppercase, 1 number, 1 special character and minimum 6
                  character long.
                </span>
                {createError.confirmPassword && (
                  <span className="w-96">
                    <ValidationError title={createError.confirmPassword} />
                  </span>
                )}
                <div className=" mt-2"></div>
                {isLoading ? (
                  <div className=" w-full flex justify-center items-center">
                    <CircularProgressIndicator />
                  </div>
                ) : (
                  <CommonButton titleText="CREATE" onClick={createAccount} />
                )}
              </div>
            </div>
          </div>
          {/* end right side */}
        </div>
      )}
    </div>
  );
}
