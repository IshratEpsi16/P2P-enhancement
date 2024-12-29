// import React, { useState, useEffect } from "react";
// import {
//   MyInfoInterface,
//   MyMenuInterface,
//   MyPermissionInterface,
// } from "../../my_info/interface/MyInfoInterface";
// import { isTokenValid } from "../../utils/methods/TokenValidityCheck";
// import { useAuth } from "../../login_both/context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
// import MyInfoService from "../../my_info/service/MyInfoService";
// import EditIcon from "../../icons/EditIcon";
// import ClipIcon from "../../icons/ClipIcon";
// import Avatar from "@mui/material/Avatar";
// import { OrganizationInterface } from "../../role_access/interface/OrganizationInterface";
// import OrganizationListService from "../../role_access/service/OrganizationListService";
// import ProfilePictureUploadService from "../service/ProfilePictureUploadService";
// import { showSuccessToast } from "../../Alerts_Component/SuccessToast";
// import LogoLoading from "../../Loading_component/LogoLoading";
// export default function BuyerProfilePage() {
//   const [myInfo, setMyInfo] = useState<MyInfoInterface | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const [menuList, setMenuList] = useState<MyMenuInterface[] | []>([]);

//   const [permissionList, setPermissionList] = useState<
//     MyPermissionInterface[] | []
//   >([]);

//   const { token, setToken, setIsBuyer, setUserId } = useAuth();

//   const navigate = useNavigate();

//   useEffect(() => {
//     const isTokenExpired = !isTokenValid(token!);
//     // console.log(isTokenExpired);
//     if (isTokenExpired) {
//       setTimeout(() => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("isBuyer");
//         localStorage.removeItem("userId");
//         localStorage.removeItem("bgId");
//         // deleteFromLocalStorage("isBuyer");
//         setToken(null);
//         setIsBuyer(null);
//         setUserId(null);
//         navigate("/");
//       }, 999);

//       showErrorToast("Session Expired, Please Login");

//       setTimeout(() => {}, 1100);

//       console.log("expired");
//     } else {
//       getMyInfo();
//       getOrganization();
//     }

//     console.log(token);

//     // Perform any other initialization based on the token

//     // getMenu(); // You can uncomment this line if needed
//   }, []);

//   const getMyInfo = async () => {
//     setIsLoading(true);
//     const result = await MyInfoService(token!);
//     if (result.data.status) {
//       setMyInfo(result.data);
//       setMenuList(result.data.Menu);

//       setPermissionList(result.data.Permission);

//       setIsLoading(false);
//     } else {
//       setIsLoading(false);
//     }
//   };

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [imageError, setImageError] = useState<string | null>(null);

//   // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//   //   const file = event.target.files && event.target.files[0];
//   //   if (file) {
//   //     setSelectedFile(file);
//   //     const reader = new FileReader();
//   //     reader.onload = () => {
//   //       if (typeof reader.result === "string") {
//   //         setImageUrl(reader.result);
//   //         setImageError(null);
//   //       } else {
//   //         setImageError("Failed to load the image");
//   //       }
//   //     };
//   //     reader.readAsDataURL(file);
//   //     upload(file);
//   //   }
//   // };\

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files && event.target.files[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         // Checking if file size is greater than 2 MB
//         alert("File size exceeds 2MB limit. Please select a smaller file.");
//         // event.target.value = null; // Clearing the file input
//         setSelectedFile(null); // Clearing the selected file state
//         setImageUrl(null); // Clearing the image URL state
//         setImageError(null); // Clearing any previous errors
//         return; // Exiting the function
//       }
//       setSelectedFile(file);
//       const reader = new FileReader();
//       reader.onload = () => {
//         if (typeof reader.result === "string") {
//           setImageUrl(reader.result);
//           setImageError(null);
//         } else {
//           setImageError("Failed to load the image");
//         }
//       };
//       reader.readAsDataURL(file);
//       upload(file);
//     }
//   };

//   const upload = async (pic: File) => {
//     //add loading
//     try {
//       const result = await ProfilePictureUploadService(token!, pic);
//       if (result.data.status === 200) {
//         //end loadiong
//         showSuccessToast("Uploaded Successfully");
//       } else {
//         //end loading
//         showErrorToast("Something Went Wrong");
//       }
//     } catch (error) {
//       //end loading
//       showErrorToast("Something Went Wrong");
//     }
//   };

//   //org

//   const [organizationList, setOrganizationList] = useState<
//     OrganizationInterface[] | []
//   >([]);

//   const getOrganization = async () => {
//     const result = await OrganizationListService(token!);
//     if (result.data.status === 200) {
//       setOrganizationList(result.data.data);
//     }
//   };

//   //org

//   return (
//     <div className="w-full   bg-white   ">
//       <ErrorToast />
//       {isLoading ? (
//         <div className=" flex w-full justify-center items-center">
//           <LogoLoading />
//         </div>
//       ) : (
//         <>
//           <div className="bg-gray-100 ">
//             <div className="px-8   relative   ">
//               <div className=" w-full h-36 ">
//                 <img
//                   src="/images/ssgil.png"
//                   alt=""
//                   className=" w-full h-full"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="w-full px-8 flex justify-center items-center">
//             <input
//               id="file-input"
//               accept="image/*"
//               type="file"
//               className="hidden"
//               onChange={handleFileChange}
//             />
//             <label htmlFor="file-input" className="relative bottom-20">
//               <img
//                 src={
//                   selectedFile
//                     ? imageUrl || URL.createObjectURL(selectedFile)
//                     : `${myInfo?.profile_pic_buyer}/${myInfo?.data.PROFILE_PIC_FILE_NAME}`
//                 }
//                 alt="avatar"
//                 className="w-20 h-20 p-[1px] bg-contain border-[1px] border-midGreen rounded-full mt-8"
//               />
//             </label>
//             <label
//               htmlFor="file-input"
//               className="relative bottom-10 right-[70px] ml-12  w-6 h-6 rounded-full bg-amber-500 flex justify-center items-center"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="w-4 h-3 text-black"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
//                 />
//               </svg>
//             </label>
//           </div>

//           <div className=" relative px-8 pb-10   bottom-10  w-full bg-white  shadow-sm  ">
//             <div className=" flex  justify-between items-center w-full  ">
//               <div>
//                 <p className=" smallText ">Full Name</p>
//                 <p className=" py-1 px-2 my-1 border-[1px] border-borderColor rounded-md w-64 bg-[#FCFCFC] text-midBlack">
//                   {myInfo?.data.FULL_NAME}
//                 </p>
//               </div>
//               <div>
//                 <p className=" smallText ">User Name</p>
//                 <p className=" py-1 px-2 my-1 border-[1px] border-borderColor rounded-md  w-64 bg-[#FCFCFC] text-midBlack">
//                   {myInfo?.data.USER_NAME}
//                 </p>
//               </div>
//               <div>
//                 <p className=" smallText ">User Id</p>
//                 <p className=" py-1 px-2 my-1 border-[1px] border-borderColor rounded-md  w-64 bg-[#FCFCFC] text-midBlack">
//                   {myInfo?.data.USER_ID}
//                 </p>
//               </div>
//             </div>
//             <div className=" flex  mt-4 justify-between items-center w-full  ">
//               <div>
//                 <p className=" smallText ">Employee ID</p>
//                 <p className=" py-1 px-2 my-1 border-[1px] border-borderColor rounded-md w-64 bg-[#FCFCFC] text-midBlack">
//                   {myInfo?.data.EMPLOYEE_ID === null ||
//                   myInfo?.data.EMPLOYEE_ID === ""
//                     ? "N/A"
//                     : myInfo?.data.EMPLOYEE_ID}
//                 </p>
//               </div>
//               <div>
//                 <p className=" smallText ">BUSINESS GROUP ID</p>
//                 <p className=" py-1 px-2 my-1 border-[1px] border-borderColor rounded-md  w-64 bg-[#FCFCFC] text-midBlack">
//                   {myInfo?.data.BUSINESS_GROUP_ID}
//                 </p>
//               </div>
//               <div>
//                 <p className=" smallText ">Email</p>
//                 <p className=" py-1 px-2 my-1 border-[1px] border-borderColor rounded-md  w-64 bg-[#FCFCFC] text-midBlack">
//                   {myInfo?.data.EMAIL_ADDRESS}
//                 </p>
//               </div>
//             </div>
//             <div className=" flex  mt-4 justify-between items-center w-full">
//               <div>
//                 <p className=" smallText ">Mobile Number</p>
//                 <p className=" py-1 px-2 my-1 border-[1px] border-borderColor rounded-md  w-64 bg-[#FCFCFC] text-midBlack">
//                   {`0${myInfo?.data.MOBILE_NUMBER}`}
//                 </p>
//               </div>
//             </div>
//             <p className="  text-lg font-mon font-bold my-6">Organizations</p>

//             <div className="grid grid-cols-3 gap-12 items-center">
//               {organizationList.map((e, i) => (
//                 <div
//                   key={e.ORGANIZATION_ID}
//                   className=" flex flex-row space-x-2 items-center w-48 px-1   "
//                 >
//                   <button
//                     onClick={() => {}}
//                     className={`w-4 h-4 rounded-md
//                                             ${
//                                               e.IS_ASSOCIATED === 1
//                                                 ? "bg-midGreen border-none"
//                                                 : " border-[0.5px] border-borderColor bg-whiteColor"
//                                             }
//                                              flex justify-center items-center   `}
//                   >
//                     {
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         strokeWidth={1.5}
//                         stroke="currentColor"
//                         className="w-3 h-3 text-white"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M4.5 12.75l6 6 9-13.5"
//                         />
//                       </svg>
//                     }
//                   </button>
//                   <p className=" text-blackColor text-sm font-mon font-medium text-start flex-1">
//                     {e.NAME}({e.SHORT_CODE})
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import {
  MyInfoInterface,
  MyMenuInterface,
  MyPermissionInterface,
} from "../../my_info/interface/MyInfoInterface";
import { isTokenValid } from "../../utils/methods/TokenValidityCheck";
import { useAuth } from "../../login_both/context/AuthContext";
import { useNavigate } from "react-router-dom";
import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import MyInfoService from "../../my_info/service/MyInfoService";
import EditIcon from "../../icons/EditIcon";
import ClipIcon from "../../icons/ClipIcon";
import Avatar from "@mui/material/Avatar";
import { OrganizationInterface } from "../../role_access/interface/OrganizationInterface";
import OrganizationListService from "../../role_access/service/OrganizationListService";
import ProfilePictureUploadService from "../service/ProfilePictureUploadService";
import { showSuccessToast } from "../../Alerts_Component/SuccessToast";
import LogoLoading from "../../Loading_component/LogoLoading";
import InputLebel from "../../common_component/InputLebel";
import CommonInputField from "../../common_component/CommonInputField";
import ValidationError from "../../Alerts_Component/ValidationError";
import OwnPasswordChangeService from "../service/OwnPasswordChangeService";
export default function BuyerProfilePage() {
  const [myInfo, setMyInfo] = useState<MyInfoInterface | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [menuList, setMenuList] = useState<MyMenuInterface[] | []>([]);

  const [permissionList, setPermissionList] = useState<
    MyPermissionInterface[] | []
  >([]);

  const [userID, setUserID] = useState<number | null>(null);

  const { token, setToken, setIsBuyer, setUserId, userId } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const isTokenExpired = !isTokenValid(token!);
    // console.log(isTokenExpired);
    if (isTokenExpired) {
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("isBuyer");
        localStorage.removeItem("userId");
        localStorage.removeItem("bgId");
        // deleteFromLocalStorage("isBuyer");
        setToken(null);
        setIsBuyer(null);
        setUserId(null);
        navigate("/");
      }, 999);

      showErrorToast("Session Expired, Please Login");

      setTimeout(() => {}, 1100);

      console.log("expired");
    } else {
      getMyInfo();
      getOrganization();
    }

    console.log(token);

    // Perform any other initialization based on the token

    // getMenu(); // You can uncomment this line if needed
  }, []);

  const getMyInfo = async () => {
    setIsLoading(true);
    const result = await MyInfoService(token!);
    if (result.data.status) {
      setMyInfo(result.data);
      setMenuList(result.data.Menu);

      console.log("permission: ", result.data);
      setUserID(result.data.data.USER_ID);

      setPermissionList(result.data.Permission);

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const hasOperatingUnitPermission = permissionList.some(
    (permission) => permission.PERMISSION_NAME === "EmpOUAccess"
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files && event.target.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       if (typeof reader.result === "string") {
  //         setImageUrl(reader.result);
  //         setImageError(null);
  //       } else {
  //         setImageError("Failed to load the image");
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //     upload(file);
  //   }
  // };\

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // Checking if file size is greater than 2 MB
        alert("File size exceeds 2MB limit. Please select a smaller file.");
        // event.target.value = null; // Clearing the file input
        setSelectedFile(null); // Clearing the selected file state
        setImageUrl(null); // Clearing the image URL state
        setImageError(null); // Clearing any previous errors
        return; // Exiting the function
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImageUrl(reader.result);
          setImageError(null);
        } else {
          setImageError("Failed to load the image");
        }
      };
      reader.readAsDataURL(file);
      upload(file);
    }
  };

  const upload = async (pic: File) => {
    //add loading
    try {
      const result = await ProfilePictureUploadService(token!, pic);
      if (result.data.status === 200) {
        //end loadiong
        showSuccessToast("Uploaded Successfully");
      } else {
        //end loading
        showErrorToast("Something Went Wrong");
      }
    } catch (error) {
      //end loading
      showErrorToast("Something Went Wrong");
    }
  };

  //org

  const [organizationList, setOrganizationList] = useState<
    OrganizationInterface[] | []
  >([]);

  const getOrganization = async () => {
    const result = await OrganizationListService(token!, userId!);
    if (result.data.status === 200) {
      setOrganizationList(result.data.data);
    }
  };

  //org

  // password change start

  const oldRef = useRef<HTMLInputElement | null>(null);
  const newRef = useRef<HTMLInputElement | null>(null);
  const confirmRef = useRef<HTMLInputElement | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleOldPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(event.target.value);
  };

  const handleNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmNewPassword(event.target.value);
  };

  const [passwordError, setPasswordError] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
    validationError?: string;
  }>({});

  const validate = () => {
    const errors: {
      oldPassword?: string;
      newPassword?: string;
      confirmNewPassword?: string;
      validationError?: string;
    } = {};

    const passwordRegex =
      /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[0-9a-zA-Z!@#$%^&*()_+]{8,}$/;

    if (oldPassword === "") {
      errors.oldPassword = "Please Enter Old Password";
    }
    if (!newPassword.trim()) {
      errors.newPassword = "Please Enter New Password";
      setPasswordError(errors);
      return false;
    }
    if (!confirmNewPassword.trim()) {
      errors.confirmNewPassword = "Please Enter Confirm Password";
      setPasswordError(errors);
      return false;
    }

    if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = "Password does not match";
      setPasswordError(errors);
      return false;
    }

    if (!passwordRegex.test(newPassword)) {
      errors.validationError =
        "Password must contain at least 1 number, 1 uppercase letter, and 1 special character";
      setPasswordError(errors);
      return false;
    }

    if (newPassword.length !== 0 && newPassword.length < 6) {
      errors.confirmNewPassword = "Password length must be 6 or more";
      setPasswordError(errors);
      return false;
    }

    setPasswordError(errors);
    return Object.keys(errors).length === 0;
  };

  const changePassword = async () => {
    if (validate()) {
      setIsLoading(true);

      const result = await OwnPasswordChangeService(
        token!,
        oldPassword,
        newPassword
      );

      console.log("password: ", result.data);

      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
      } else {
        showErrorToast(result.data.message);
      }

      setIsLoading(false);
    }
  };

  // password change end

  return (
    <div className="w-full bg-white">
      <ErrorToast />
      {isLoading ? (
        <div className=" flex w-full justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <>
          <div className="h-7"></div>

          {/* <div
            className="mx-8 relative rounded-xl"
            style={{
              boxShadow:
                "rgba(145, 158, 171, 0.2) 0px 0px 4px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
            }}
          >
            <div className="">
              <div className=" bg-gray-100 rounded-t-3xl ">
                <div className="h-80 ">
                  <img
                    src="/images/seven_rings_banner.png"
                    alt=""
                    className="rounded-t-lg h-full w-full flex justify-center items-center"
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-12 rounded-b-xl">
              <span className="bg-white h-12 w-full"></span>
            </div>

            <div className="absolute bottom-[-60px] left-6 w-full px-8 flex justify-start items-center">
              <input
                id="file-input"
                accept="image/*"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="file-input" className="relative bottom-20">
                <img
                  src={
                    selectedFile
                      ? imageUrl || URL.createObjectURL(selectedFile)
                      : `${myInfo?.profile_pic_buyer}/${myInfo?.data.PROFILE_PIC_FILE_NAME}`
                  }
                  alt="avatar"
                  className="w-20 h-20 bg-contain border-[2px] border-midGreen rounded-full mt-8"
                />
              </label>
              <label
                htmlFor="file-input"
                className="relative bottom-10 right-[70px] ml-12 cursor-pointer w-6 h-6 rounded-full bg-amber-500 flex justify-center items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-3 text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </label>
            </div>
          </div> */}

          {/* <div className="h-32"></div> */}

          <div className=" relative px-8 pb-10   bottom-10  w-full bg-white  shadow-sm  ">
            {/* <div className=" flex  justify-between items-center w-full  ">
              <div>
                <p className=" smallText ">Full Name</p>
                <p className=" py-1 px-2 my-1 border-[1px] border-borderColor rounded-md w-64 bg-[#FCFCFC] text-midBlack">
                  {myInfo?.data.FULL_NAME}
                </p>
              </div>
              <div>
                <p className=" smallText ">User Name</p>
                <p className=" py-1 px-2 my-1 border-[1px] border-borderColor rounded-md  w-64 bg-[#FCFCFC] text-midBlack">
                  {myInfo?.data.USER_NAME}
                </p>
              </div>
              <div>
                <p className=" smallText ">User Id</p>
                <p className=" py-1 px-2 my-1 border-[1px] border-borderColor rounded-md  w-64 bg-[#FCFCFC] text-midBlack">
                  {myInfo?.data.USER_ID}
                </p>
              </div>
            </div>
            <div className=" flex  mt-4 justify-between items-center w-full  ">
              <div>
                <p className=" smallText ">Employee ID</p>
                <p className=" py-1 px-2 my-1 border-[1px] border-borderColor rounded-md w-64 bg-[#FCFCFC] text-midBlack">
                  {myInfo?.data.EMPLOYEE_ID === null ||
                  myInfo?.data.EMPLOYEE_ID === ""
                    ? "N/A"
                    : myInfo?.data.EMPLOYEE_ID}
                </p>
              </div>
              <div>
                <p className=" smallText ">BUSINESS GROUP ID</p>
                <p className=" py-1 px-2 my-1 border-[1px] border-borderColor rounded-md  w-64 bg-[#FCFCFC] text-midBlack">
                  {myInfo?.data.BUSINESS_GROUP_ID}
                </p>
              </div>
              <div>
                <p className=" smallText ">Email</p>
                <p className=" py-1 px-2 my-1 border-[1px] border-borderColor rounded-md  w-64 bg-[#FCFCFC] text-midBlack">
                  {myInfo?.data.EMAIL_ADDRESS}
                </p>
              </div>
            </div>
            <div className=" flex  mt-4 justify-between items-center w-full">
              <div>
                <p className=" smallText ">Mobile Number</p>
                <p className=" py-1 px-2 my-1 border-[1px] border-borderColor rounded-md  w-64 bg-[#FCFCFC] text-midBlack">
                  {`0${myInfo?.data.MOBILE_NUMBER}`}
                </p>
              </div>
            </div> */}

            <div className="h-6"></div>

            <p className="text-blackColor font-semibold text-lg font-mon">
              My Profile
            </p>

            <div className="h-5"></div>

            <div className="border-[.5px] border-gray-200 px-4 py-3 rounded-xl flex items-center justify-start space-x-4 shadow-sm">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-start space-x-3">
                  <div>
                    {myInfo?.data.PROFILE_PIC_FILE_NAME === "" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-20 h-20 text-gray-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    ) : (
                      <img
                        src={
                          selectedFile
                            ? imageUrl || URL.createObjectURL(selectedFile)
                            : `${myInfo?.profile_pic_buyer}/${myInfo?.data.PROFILE_PIC_FILE_NAME}`
                        }
                        alt="avatar"
                        className="h-[60px] w-[60px] border-[2px] border-midGreen rounded-full"
                      />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="font-semibold">
                      <p>{myInfo?.data.FULL_NAME}</p>
                    </div>

                    <div className=" flex flex-row items-center space-x-4 mt-1">
                      <p className="text-black text-[12px] font-mon font-semibold bg-[#dbf6e5] px-2 py-1 rounded-md">
                        {myInfo?.data.USER_TYPE}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mr-8 border-[.5px] border-gray-300 text-gray-500 px-4 py-1 rounded-full flex items-center space-x-1 cursor-pointer">
                  <input
                    id="file-input"
                    accept="image/*"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <label htmlFor="file-input">
                    <div className="flex items-center space-x-1 cursor-pointer">
                      <p>Edit</p>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                      </svg>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="h-5"></div>

            <div className="border-[.5px] border-gray-200 px-4 py-3 rounded-xl shadow-sm">
              <p className=" text-black font-semibold font-mon">
                Personal Information
              </p>

              <div className="h-4"></div>

              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  {/* <div>
                    <p className="text-gray-400">Full Name</p>
                    <p>{myInfo?.data.FULL_NAME}</p>
                  </div> */}

                  <div>
                    <p className="text-gray-400">User ID</p>
                    <p>{myInfo?.data.USER_ID}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Business Group ID</p>
                    <p>{myInfo?.data.BUSINESS_GROUP_ID}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Mobile Number</p>
                    <p>{`0${myInfo?.data.MOBILE_NUMBER}`}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-gray-400">User Name</p>
                    <p>{myInfo?.data.USER_NAME}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Employee ID</p>
                    <p>
                      {myInfo?.data.EMPLOYEE_ID === null ||
                      myInfo?.data.EMPLOYEE_ID === ""
                        ? "N/A"
                        : myInfo?.data.EMPLOYEE_ID}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">Email</p>
                    <p>{myInfo?.data.EMAIL_ADDRESS}</p>
                  </div>
                </div>

                <div></div>
              </div>
            </div>

            <div className="h-5"></div>

            <div className="border-[.5px] border-gray-200 px-4 py-3 shadow-sm rounded-lg">
              <p className="font-bold">Password Change</p>

              <div className="h-2"></div>

              <div className="flex items-end justify-between space-x-4">
                <div className="flex flex-col items-start space-y-2">
                  {/* <InputLebel titleText={"Old Password"} /> */}
                  <p className="font-semibold text-sm">Old Password</p>
                  <input
                    type="text"
                    ref={oldRef}
                    value={oldPassword}
                    onChange={handleOldPassword}
                    placeholder="******"
                    className="appearance-none bg-transparent border-[0.5px] border-borderColor rounded-[4px] focus:outline-none px-2 h-10 placeholder:font-mon placeholder:text-sm text-midBlack placeholder:text-[#C5C5C5] w-60"
                  />

                  <div className="h-4">
                    {passwordError.oldPassword && (
                      <ValidationError title={passwordError.oldPassword} />
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start space-y-2">
                  {/* <InputLebel titleText={"New Password"} /> */}

                  <p className="font-semibold text-sm">New Password</p>
                  <input
                    type="text"
                    ref={newRef}
                    value={newPassword}
                    onChange={handleNewPassword}
                    placeholder="******"
                    className="appearance-none bg-transparent border-[0.5px] border-borderColor rounded-[4px] focus:outline-none px-2 h-10 placeholder:font-mon placeholder:text-sm text-midBlack placeholder:text-[#C5C5C5] w-60"
                  />

                  <div className="h-4">
                    {passwordError.newPassword && (
                      <ValidationError title={passwordError.newPassword} />
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start space-y-2">
                  {/* <InputLebel titleText={"Confirm Password"} /> */}

                  <p className="font-semibold text-sm">Confirm Password</p>
                  <input
                    type="text"
                    ref={confirmRef}
                    value={confirmNewPassword}
                    onChange={handleConfirmPassword}
                    placeholder="******"
                    className="appearance-none bg-transparent border-[0.5px] border-borderColor rounded-[4px] focus:outline-none px-2 h-10 placeholder:font-mon placeholder:text-sm text-midBlack placeholder:text-[#C5C5C5] w-60"
                  />

                  <div className="h-4">
                    {passwordError.confirmNewPassword && (
                      <ValidationError
                        title={passwordError.confirmNewPassword}
                      />
                    )}
                  </div>
                </div>

                <div className="">
                  <button
                    onClick={changePassword}
                    className="px-4 h-10 bg-[#FDE49E] font-semibold rounded-md text-black text-[14px]"
                  >
                    Change Password
                  </button>

                  <div className="h-6"></div>
                </div>
              </div>

              <div className="h-4 ml-2">
                {passwordError.validationError && (
                  <ValidationError title={passwordError.validationError} />
                )}
              </div>
            </div>

            <div className="h-10"></div>

            <p className="  text-lg font-mon font-bold my-6">Organizations</p>

            <div className="grid grid-cols-3 gap-12 items-center">
              {organizationList.map((e, i) => (
                <div
                  key={e.ORGANIZATION_ID}
                  className=" flex flex-row space-x-2 items-center w-48 px-1   "
                >
                  <button
                    onClick={() => {}}
                    className={`w-4 h-4 rounded-md ${
                      e.IS_ASSOCIATED === 1
                        ? "bg-midGreen border-none"
                        : " border-[0.5px] border-borderColor bg-whiteColor"
                    } flex justify-center items-center ${
                      !hasOperatingUnitPermission ? "cursor-not-allowed" : ""
                    }`}
                    disabled={!hasOperatingUnitPermission}
                  >
                    {
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-3 h-3 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    }
                  </button>
                  <p className=" w-40 text-blackColor text-sm font-mon font-medium text-start flex-1">
                    {e.NAME}({e.SHORT_CODE})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
