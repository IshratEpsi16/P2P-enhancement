import React, { useRef, useState, useEffect, KeyboardEvent } from "react";
import CommonButton from "../../common_component/CommonButton";
import CommonInputField from "../../common_component/CommonInputField";
import InputLebel from "../../common_component/InputLebel";
import { useNavigate, Link } from "react-router-dom";

import LoginService from "../service/LoginService";

import ValidationError from "../../Alerts_Component/ValidationError";

import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";

import { useAuth } from "../context/AuthContext";
import LoginInterface from "../interface/LoginInterface";

import InternetConnectionCheck from "../../utils/methods/component/InternetConnectionCheck";

import jwtDecode from "jwt-decode";
import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import encodeAndSaveToLocalStorage from "../../utils/methods/encodeAndSaveToLocalStorage";
import { isTokenValid } from "../../utils/methods/TokenValidityCheck";
import SupplierMaintananceModeChangeService from "../../system_setup/service/SupplierMaintananceModeService";
import useProfileUpdateStore from "../../manage_supplier_profile_update/store/profileUpdateStore";
import useAuthStore from "../store/authStore";

interface DecodedToken {
  // Define the structure of the decoded token here
  // For example, you can use an interface to match the expected token structure
  iss: string;
  // Add other token properties here...
}

export default function LoginPage() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [isSave, setIsSave] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<LoginInterface | null>(null);

  console.log("render login page");

  const { setProfileUidInStore, setProfileNewInfoUidInStore, setInitiatorStatus } =
    useProfileUpdateStore();
  const {
    loginData,
    setLoginData,
    setToken,
    setUserId,
    setIsNewUser,
    setRegToken,
    setSubmissionStatus,
    setIsRegCompelte,
    setBuyerId,

    //new add

    userId,

    setBgId,
  } = useAuth();

  const { setIsWlcMsgSwn, setWlcMessage, setIsRegistrationInStore } =
    useAuthStore();

  // //internet check
  // const [isOnline, setIsOnline] = useState(navigator.onLine);
  // useEffect(() => {
  //     // Update network status
  //     const handleStatusChange = () => {
  //         setIsOnline(navigator.onLine);
  //     };

  //     // Listen to the online status
  //     window.addEventListener('online', handleStatusChange);

  //     // Listen to the offline status
  //     window.addEventListener('offline', handleStatusChange);

  //     // Specify how to clean up after this effect for performance improvment
  //     return () => {
  //         window.removeEventListener('online', handleStatusChange);
  //         window.removeEventListener('offline', handleStatusChange);
  //     };
  // }, [isOnline]);

  // //internet check

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      // Find your button element by its ID or using a ref
      const button = document.getElementById("btn");
      if (button) {
        button.click(); // Trigger click event
      }
    }
  };

  const navigate = useNavigate();

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPassword(value);
  };

  //validation
  const validateLogin = () => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Please Enter Username/Email";
    }
    if (!password.trim()) {
      errors.password = "Please Enter Password";
    }

    setLoginError(errors);

    return Object.keys(errors).length === 0;
  };
  const { token, isBuyer, setIsBuyer } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCredentialsFromLocalStorage();
    console.log("Token in log:", token);
    // console.log('isBuyer in App:', isBuyer);
  }, [token, isBuyer]);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  useEffect(() => {
    // Get the token from the URL
    const token = new URLSearchParams(window.location.search).get("token");

    const isTokenExpired = !isTokenValid(token!);
    if (isTokenExpired) {
      setIsExpired(true);
    } else {
      if (token) {
        try {
          const decodedToken = decodeJWT2(token);

          // Extract USER_ID from the decoded payload
          const supplierId = decodedToken?.decodedPayload?.SUPPLIER_ID;

          if (emailRef.current && emailRef.current && passwordRef.current) {
            emailRef.current.value = supplierId;
            // usernameRef.current.value = name;
            // emailRef.current.value = email;
            // mobileNoRef.current.value = mNo;
            // setUsername(name);
            setEmail(supplierId);
            // setMobileNo(mNo);
            // setBgId(bgId);
            // setInitiatorId(initid);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }
  }, []);

  const decodeJWT2 = (token: string) => {
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
      if (decodedPayload && decodedPayload.hasOwnProperty("SUPPLIER_ID")) {
        const supplierId = decodedPayload.SUPPLIER_ID;
        console.log(supplierId);

        return {
          decodedHeader,
          decodedPayload,
          supplierId,
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

  //   if (loading) {
  //     // You can render a loading indicator here
  //     return setIsLoading(true);

  //   }

  // {
  //     "USER_ID": 1,
  //     "APPLICATION_STATUS": "APPROVED",
  //     "USER_ACTIVE_STATUS": 0,
  //     "EMPLOYEE_ID": null,
  //     "SUPPLIER_ID": null,
  //     "USER_TYPE": "Buyer",
  //     "iat": 1701235775,
  //     "exp": 1701239375
  //   }

  const decodeJWT = (token: string) => {
    try {
      // Split the token into header, payload, and signature
      const [encodedHeader, encodedPayload] = token.split(".");

      // Function to decode base64url
      const base64urlDecode = (str: string) => {
        // Replace '-' with '+', '_' with '/', and pad the string with '=' to make it base64 compliant
        str = str.replace(/-/g, "+").replace(/_/g, "/");
        while (str.length % 4) {
          str += "=";
        }
        return window.atob(str);
      };

      // Decode base64url-encoded header and payload
      const decodedHeader = JSON.parse(base64urlDecode(encodedHeader));
      const decodedPayload = JSON.parse(base64urlDecode(encodedPayload));

      // Log the decoded header and payload
      console.log("Decoded Header:", decodedHeader);
      console.log("Decoded Payload:", decodedPayload);

      // Ensure the decoded payload has the expected structure
      if (decodedPayload && decodedPayload.hasOwnProperty("USER_ID")) {
        const userId = decodedPayload.USER_ID;
        const isNewUser = decodedPayload.IS_NEW_USER;
        const approval = decodedPayload.APPROVAL_STATUS;
        const submissionStatus = decodedPayload.SUBMISSION_STATUS;
        const isRegComplete = decodedPayload.IS_REG_COMPLETE;
        const buyerId = decodedPayload.BUYER_ID;
        const isWlcSwn = decodedPayload.IS_WLC_MSG_SHOWN;
        const wlcMessage = decodedPayload.WELCOME_MSG;

        return {
          decodedHeader,
          decodedPayload,
          userId,
          isNewUser,
          approval,
          submissionStatus,
          isRegComplete,
          buyerId,
          isWlcSwn,
          wlcMessage,
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

  // const decodeJWT = (token: string) => {
  //   try {
  //     // Split the token into header, payload, and signature (assuming they are separated by dots)
  //     const [encodedHeader, encodedPayload] = token.split(".");

  //     // Decode base64-encoded header and payload
  //     const decodedHeader = JSON.parse(window.atob(encodedHeader));
  //     const decodedPayload = JSON.parse(window.atob(encodedPayload));

  //     // Log the decoded header and payload
  //     console.log("Decoded Header:", decodedHeader);
  //     console.log("Decoded Payload:", decodedPayload);

  //     // Make sure that the decoded payload has the expected structure
  //     if (decodedPayload && decodedPayload.hasOwnProperty("USER_ID")) {
  //       const userId = decodedPayload.USER_ID;
  //       const isNewUser = decodedPayload.IS_NEW_USER;
  //       const approval = decodedPayload.APPROVAL_STATUS;
  //       const submissionStatus = decodedPayload.SUBMISSION_STATUS;
  //       const isRegComplete = decodedPayload.IS_REG_COMPLETE;
  //       const buyerId = decodedPayload.BUYER_ID;
  //       const isWlcSwn = decodedPayload.IS_WLC_MSG_SHOWN;
  //       const wlcMessage = decodedPayload.WELCOME_MSG;
  //       // setProfileUidInStore(decodedPayload.PROFILE_UPDATE_UID);
  //       // console.log(`userId: ${userId}`);
  //       return {
  //         decodedHeader,
  //         decodedPayload,
  //         userId,
  //         isNewUser,
  //         approval,
  //         submissionStatus,
  //         isRegComplete,
  //         buyerId,
  //         isWlcSwn,
  //         wlcMessage,
  //       };
  //     } else {
  //       console.error(
  //         "Error: Decoded payload does not have the expected structure."
  //       );
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error decoding JWT:", error);
  //     return null;
  //   }
  // };

  const maintenanceCheck = async (token: string) => { };

  const login = async () => {
    if (validateLogin()) {
      setIsLoading(true);
      const result = await LoginService(email, password);
      console.log(result);

      if (result.data.status === 200) {
        try {
          const result2 = await SupplierMaintananceModeChangeService(
            result.data.token,
            "SUPPLIER_MAINTENANCE_MODE"
          );
          console.log(result2.data);

          if (result2.data.status === 200) {
            setIsLoading(false);
            //toast show
            showSuccessToast(result.data.message);
            setTimeout(() => {
              const decodedToken = decodeJWT(result.data.token);

              // Extract USER_ID from the decoded payload
              const userId = decodedToken?.decodedPayload?.USER_ID;
              const isNewUser = decodedToken?.decodedPayload?.IS_NEW_USER;
              const isApproval = decodedToken?.decodedPayload?.APPROVAL_STATUS;
              const isRegComplete =
                decodedToken?.decodedPayload?.IS_REG_COMPLETE;
              const buyerId = decodedToken?.decodedPayload?.BUYER_ID;
              const isWlcSwn = decodedToken?.decodedPayload?.IS_WLC_MSG_SHOWN;
              const wlcMessage = decodedToken?.decodedPayload?.WELCOME_MSG;
              const initiatorStatus = decodedToken?.decodedPayload?.INITIATOR_STATUS

              setIsWlcMsgSwn(isWlcSwn);
              setWlcMessage(wlcMessage);
              setIsRegistrationInStore(isRegComplete);
              setBuyerId(buyerId);
              setProfileUidInStore(
                decodedToken?.decodedPayload?.PROFILE_UPDATE_UID
              );
              setProfileNewInfoUidInStore(
                decodedToken?.decodedPayload?.PROFILE_NEW_INFO_UID
              );
              setInitiatorStatus(decodedToken?.decodedPayload?.INITIATOR_STATUS)
              console.log("buyerId", decodedToken?.decodedPayload?.BUYER_ID);

              localStorage.setItem("buyerId", buyerId.toString());

              console.log(typeof isRegComplete);

              // const isNewUserS = isNewUser.toString();
              // localStorage.setItem('isNewUser', isNewUserS);

              // console.log(`userId: ${userId}`);

              setUserId(userId);
              console.log(typeof userId);
              localStorage.setItem("userId", userId.toString());

              const isBuyerS = result.data.isBuyer.toString(); // assuming
              console.log(isBuyerS);
              console.log(typeof isBuyerS);
              setIsBuyer(result.data.isBuyer);

              localStorage.setItem("isBuyer", isBuyerS);
              if (
                (result.data.isBuyer === 1 || result.data.isBuyer === 0) &&
                isApproval === "APPROVED"
              ) {
                setIsNewUser(isNewUser);

                setUserData(result.data);

                setLoginData(result.data);
                localStorage.setItem("token", result.data.token);

                // encodeAndSaveToLocalStorage('isBuyer', isBuyerS);

                // Save token to context
                setToken(result.data.token);

                //only for profilr page a register reuse and if supplier
                if (
                  result.data.isBuyer === 0 &&
                  decodedToken?.decodedPayload?.IS_NEW_USER === 0
                ) {
                  localStorage.setItem(
                    "isRegCompelte",
                    isRegComplete.toString()
                  );
                  setIsRegCompelte(isRegComplete.toString());
                  const submissionStatus =
                    decodedToken?.decodedPayload.SUBMISSION_STATUS;

                  localStorage.setItem("regToken", result.data.token);
                  setRegToken(result.data.token);

                  localStorage.setItem("submissionStatus", submissionStatus);
                  // encodeAndSaveToLocalStorage('submissionStatus', submissionStatus)

                  setSubmissionStatus(submissionStatus);
                }

                console.log(isBuyer);
              }
            }, 1200);
            const decodedToken = decodeJWT(result.data.token);

            if (
              result.data.isBuyer === 1 &&
              decodedToken?.decodedPayload?.IS_NEW_USER === 1
            ) {
              const token = result.data.token;
              setTimeout(() => {
                navigate("/change-password-new-user", { state: { token } });
              }, 1250);
            } else if (
              result.data.isBuyer === 0 &&
              decodedToken?.decodedPayload?.IS_NEW_USER === 1
            ) {
              console.log("new supplier pass word change a jabe");

              const token = result.data.token;
              setTimeout(() => {
                navigate("/change-password-new-user", { state: { token } });
                // navigate("/change-password-new-user");
              }, 1250);
            } else if (
              result.data.isBuyer === 0 &&
              decodedToken?.decodedPayload?.IS_NEW_USER === 0 &&
              decodedToken?.decodedPayload?.APPROVAL_STATUS === "IN PROCESS" &&
              decodedToken?.decodedPayload?.IS_REG_COMPLETE === 0
            ) {
              //if user is supplier and not approve yet then this code will execute
              //this token is only for registration perpuse
              //submission status for disabling registration field

              const isBuyerS = result.data.isBuyer.toString();
              setIsBuyer(result.data.isBuyer);

              localStorage.setItem("isBuyer", isBuyerS);

              const token = result.data.token;
              const submissionStatus =
                decodedToken?.decodedPayload.SUBMISSION_STATUS;
              const isRegComplete =
                decodedToken?.decodedPayload?.IS_REG_COMPLETE;

              localStorage.setItem("isRegCompelte", isRegComplete.toString());
              setIsRegCompelte(isRegComplete.toString());

              localStorage.setItem("regToken", token);
              localStorage.setItem("submissionStatus", submissionStatus);
              setRegToken(token);
              setSubmissionStatus(submissionStatus);
              const userId = decodedToken?.decodedPayload?.USER_ID;
              setUserId(userId);
              localStorage.setItem("userId", userId.toString());
              setTimeout(() => {
                navigate("/register");
              }, 1250);
            } else {
              if (result.data.isBuyer === 1) {
                setTimeout(() => {
                  navigate("/buyer-home");
                }, 1300);
              } else {
                setTimeout(() => {
                  if (result2.data.data.OBJECT_VALUE === "N") {
                    navigate("/supplier-home");
                  } else {
                    localStorage.removeItem("token");
                    localStorage.removeItem("isBuyer");
                    localStorage.removeItem("isRegCompelte");
                    localStorage.removeItem("submissionStatus");
                    localStorage.removeItem("regToken");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("bgId");

                    setToken(null);
                    setIsBuyer(null);
                    setUserId(null);
                    setRegToken(null);
                    setIsRegCompelte(null);
                    setSubmissionStatus(null);
                    setProfileUidInStore(null);
                    setProfileNewInfoUidInStore(null);
                    setIsWlcMsgSwn(null);
                    setIsRegistrationInStore(null);
                    setWlcMessage(null);
                    navigate("/maintenance");
                  }
                }, 1300);
              }
            }

            // else {
            //   console.log("maintenance on");

            //   setTimeout(() => {
            //     navigate("/maintenance");
            //   }, 1300);
            // }
          } else {
          }
        } catch (error) { }
      } else {
        //toast shows
        setIsLoading(false);
        showErrorToast(result.data.message);
        // toast.error(result.data.message, {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000
        // });
        // <ErrorToast message={result.data.message} />
      }
    } else {
      console.log("validation Failed");
    }
  };

  // Function to save username and password to local storage
  const saveCredentialsToLocalStorage = () => {
    try {
      console.log("save to");

      // Encode the values before saving to local storage
      const encodedEmail = btoa(email);
      const encodedPassword = btoa(password);

      // Save to local storage
      localStorage.setItem("encodedEmail", encodedEmail);
      localStorage.setItem("encodedPassword", encodedPassword);

      // Set the state to indicate that credentials are saved
      setIsSave(true);
    } catch (error) {
      console.error("Error saving credentials to local storage:", error);
    }
  };

  // Function to delete username and password from local storage
  const deleteCredentialsFromLocalStorage = () => {
    try {
      // Remove items from local storage
      console.log("delete to");

      localStorage.removeItem("encodedEmail");
      localStorage.removeItem("encodedPassword");

      // Clear the state
      setEmail("");
      setPassword("");
      setIsSave(false);
    } catch (error) {
      console.error("Error deleting credentials from local storage:", error);
    }
  };

  // Function to toggle "Remember Password" checkbox
  const toggleRememberPassword = () => {
    if (!isSave) {
      // If not saved, call the save method
      saveCredentialsToLocalStorage();
    } else {
      // If already saved, call the delete method
      deleteCredentialsFromLocalStorage();
    }
    // Toggle the state
    setIsSave(!isSave);
  };

  // Effect to load credentials from local storage on component mount
  // useEffect(() => {
  //     getCredentialsFromLocalStorage();
  // }, []); // empty dependency array ensures it runs only on mount

  // Function to retrieve and decode username and password from local storage
  const getCredentialsFromLocalStorage = () => {
    try {
      console.log("get to");

      // Retrieve items from local storage
      const encodedEmail = localStorage.getItem("encodedEmail");
      console.log(encodedEmail);

      const encodedPassword = localStorage.getItem("encodedPassword");
      console.log(encodedPassword);

      // Decode the values
      if (encodedEmail && encodedPassword) {
        const decodedEmail = atob(encodedEmail);
        const decodedPassword = atob(encodedPassword);

        // Set the state with decoded values
        setEmail(decodedEmail);
        setPassword(decodedPassword);
        setIsSave(true);
        if (emailRef.current && passwordRef.current) {
          emailRef.current.value = decodedEmail;
          passwordRef.current.value = decodedPassword;
        }
      }
    } catch (error) {
      console.error("Error getting credentials from local storage:", error);
    }
  };

  const autofillStyles = {
    WebkitTransition: "background-color 5000s ease-in-out 0s",
    backgroundColor: "#fff",
    color: "#000",
  };

  const handleEnterKeyPress = (
    event: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (event.key === "Enter") {
      login();
    }
  };

  return (
    <div className="  ">
      <ErrorToast />
      {/* <ToastContainer /> */}
      <div className=" flex flex-row space-x-32 ">
        {/* left side */}
        <div className="   w-1/2 h-screen   ">
          {/* <div className=' bg-[#ff0000] w-[500px] h-screen'></div>
                    <div className=" w-72 h-screen rounded-tr-full rounded-br-full  bg-[#ff0000]"></div> */}
          <img
            src="/images/ssgilbg.png"
            alt="ellips"
            className="h-screen max-w-full"
          />
        </div>
        {/* end left side */}

        {/* right side */}

        <div className="flex-1 h-screen flex justify-start items-center">
          <div className=" flex flex-col items-start">
            <InternetConnectionCheck />
            {/* {!isOnline ? (
                            <h1 className=' text-red-600 font-bold text-xl font-mon mb-10'>You Are Offline</h1>
                        )
                            :
                            null

                        } */}
            <h3 className=" text-3xl font-bold text-blackColor mb-6">
              Login Here
            </h3>
            <div className=" flex flex-col items-start space-y-4">
              <div className=" flex flex-col items-start space-y-2">
                <InputLebel titleText="User Email or User Id" />
                <CommonInputField
                  inputRef={emailRef}
                  onChangeData={handleEmailChange}
                  hint="Email address or User Id"
                  type="text"
                  onEnterPressed={handleKeyPress}
                />
                {loginError.email && (
                  <ValidationError title={loginError.email} />
                )}
              </div>
              <div className=" flex flex-col items-start space-y-2">
                <InputLebel titleText="Password" />
                <div className=" flex flex-row justify-between w-96 h-10 rounded-md  bg-inputBg border-[0.5px] border-borderColor  ">
                  <input
                    onKeyDown={handleKeyPress}
                    ref={passwordRef}
                    onChange={handlePasswordChange}
                    style={autofillStyles}
                    placeholder="Password"
                    type={!showPassword ? "password" : "text"}
                    className=" placeholder:text-[#C5C5C5] rounded-md  h-9 bg-inputBg  focus:outline-none px-4 flex-1"
                  />
                  <button
                    className="  "
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
                        className="pl-[2px] w-5 h-4 mr-4"
                      />
                    )}
                  </button>
                </div>
                {loginError.password && (
                  <ValidationError title={loginError.password} />
                )}
              </div>
              <div className=" w-96 flex flex-row  justify-between  items-center">
                <button
                  onClick={toggleRememberPassword}
                  className=" flex flex-row space-x-2 items-center"
                >
                  <div
                    className={` 
                                   ${isSave
                        ? "border-none  bg-blackishColor "
                        : "border-borderColor border-[1px] bg-white "
                      }    flex justify-center items-center h-4 w-4 rounded-sm`}
                  >
                    {isSave ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-3 h-3 text-whiteColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    ) : null}
                  </div>
                  <p className=" text-midBalck text-[12px] font-medium font-mon">
                    Remember Password
                  </p>
                </button>
                <Link to={"/forgot-password"}>
                  <p className=" text-midBalck text-[12px] font-medium font-mon">
                    Forgot Password?
                  </p>
                </Link>
              </div>
              {isLoading ? (
                <div className=" w-full flex justify-center items-center">
                  <CircularProgressIndicator />
                </div>
              ) : (
                <CommonButton
                  titleText="Login"
                  onClick={login}
                  height="h-10"
                  buttonId={"btn"}
                />
              )}

              {/* <button id="btn" onClick={login}></button> */}
            </div>
          </div>
        </div>
        {/* end right side */}
      </div>
    </div>
  );
}
