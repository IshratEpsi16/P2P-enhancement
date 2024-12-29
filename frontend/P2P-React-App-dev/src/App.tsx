// import React, { useEffect, useState } from 'react';

// import './App.css';
// import LoginPage from './login_both/component/LoginPage';
// import CreateAccountPage from './create_account/component/CreateAccountPage';
// import InvitationPage from './invitation/component/InvitationPage';
// import BasicInformationPage from './registration/component/BasicInformationPage';
// import DeclarationPage from './registration/component/DeclarationPage';
// import ContactPersonPage from './registration/component/ContactPersonPage';
// import ApplicationPage from './registration/component/ApplicationPage';
// import DocumentsPage from './registration/component/DocumentsPage';
// import { DocumentPageProvider } from './registration/context/DocumentPageContext';
// import PageOne from './registration/component/document_page_component/PageOne';
// import PageTwo from './registration/component/document_page_component/PageTwo';
// import RegistrationPage from './registration/component/RegistrationPage';
// import BuyerHomePage from './buyer_home/component/BuyerHomePage';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import SupplierHomePage from './supplier_home/component/SupplierHomePage';
// import CreateRolePage from './role_access/component/CreateRolePage';
// import { useAuth } from './login_both/context/AuthContext';
// import NotFoundPage from './not_found/component/NotFoundPage';
// import CircularProgressIndicator from './Loading_component/CircularProgressIndicator';
// import ForgotPasswordPage from './password_recovery/component/ForgotPasswordPage';
// import VerifyOtpPage from './password_recovery/component/VerifyOtpPage';
// import ChangePasswordPage from './password_recovery/component/ChangePasswordPage';
// import NewUserPasswordChangePage from './password_recovery/component/NewUserPasswordChangePage';

// // const PrivateRoute = ({ element:any, ...rest }) => {
// //   const { token } = useAuth();

// //   return <Route {...rest} element={token ? Element : <Navigate to="/login" />} />;
// // };
// function App() {
//   // const { token, isBuyer, isNewUser } = useAuth();
//   // const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   setLoading(false); // Set loading to false once the component mounts
//   // }, []);

//   // useEffect(() => {
//   //   console.log('Token in App:', token);
//   //   // console.log('isBuyer in App:', isBuyer);
//   // }, [token, isBuyer, isNewUser]);

//   // if (loading) {
//   //   // You can render a loading indicator here
//   //   return <div className=' w-full h-screen flex justify-center items-center'>
//   //     <CircularProgressIndicator />

//   //   </div>;
//   // }

//   // // // Check if token and isBuyer are not null
//   // // if (token !== null && isBuyer !== null) {
//   // //   // Redirect based on isBuyer value
//   // //   const redirectPath = isBuyer === 1 ? '/buyer-home' : '/supplier-home';
//   // //   return <Navigate to={redirectPath} />;
//   // // }

//   // return (

//   //   <Router>
//   //     <Routes>
//   //       <Route path='/forgot-password' element={<ForgotPasswordPage />} />
//   //       <Route path='/change-password' element={<ChangePasswordPage />} />
//   //       <Route path='/verify-otp' element={<VerifyOtpPage />} />

//   //       <Route path='/' element={token === null ? <LoginPage /> : isBuyer === 1 ? <Navigate to="/buyer-home" /> : <Navigate to="/supplier-home" />} />

//   //       {token ? (
//   //         isBuyer === 1 ? (
//   //           <>
//   //             <Route path='/supplier-home' element={<Navigate to="/not-found" />} />
//   //             <Route path='/register' element={<Navigate to="/not-found" />} />
//   //             <Route path='/buyer-home' element={<BuyerHomePage />} />
//   //             <Route path='/invite' element={<InvitationPage />} />
//   //             <Route path='/create-account' element={<CreateAccountPage />} />
//   //             <Route path='/buyer-dashboard' element={<BuyerHomePage />} />
//   //             <Route path='/create-role-access' element={<CreateRolePage />} />
//   //             <Route path='/change-password-new-user' element={<NewUserPasswordChangePage />} />

//   //           </>
//   //         ) :
//   //           (
//   //             <>
//   //               <Route path='/supplier-home' element={<SupplierHomePage />} />
//   //               <Route path='/register' element={<RegistrationPage />} />
//   //               <Route path='/buyer-home' element={<Navigate to="/not-found" />} />
//   //               <Route path='/invite' element={<Navigate to="/not-found" />} />
//   //               <Route path='/create-account' element={<Navigate to="/not-found" />} />
//   //               <Route path='/buyer-dashboard' element={<Navigate to="/not-found" />} />
//   //               <Route path='/create-role-access' element={<Navigate to="/not-found" />} />
//   //             </>
//   //           )
//   //       ) : (
//   //         // If not logged in, allow access only to the login page
//   //         <Route path='*' element={<Navigate to="/" />} />
//   //       )}
//   //       <Route path='/not-found' element={<NotFoundPage />} />
//   //     </Routes>
//   //   </Router>

//   // );

//   const { token, isBuyer, isNewUser } = useAuth();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(false); // Set loading to false once the component mounts
//   }, []);

//   useEffect(() => {
//     console.log('Token in App:', token);
//   }, [token, isBuyer, isNewUser]);

//   if (loading) {
//     // You can render a loading indicator here
//     return (
//       <div className='w-full h-screen flex justify-center items-center'>
//         <CircularProgressIndicator />
//       </div>
//     );
//   }

//   if (isNewUser === 1) {
//     return (
//       <Router>
//         <Routes>
//           <Route path='/change-password-new-user' element={<NewUserPasswordChangePage />} />
//           {/* Add other routes as needed */}
//         </Routes>
//       </Router>
//     );
//   }

//   return (

//     <Router>
//       <Routes>
//         <Route path='/forgot-password' element={<ForgotPasswordPage />} />
//         <Route path='/change-password' element={<ChangePasswordPage />} />
//         <Route path='/verify-otp' element={<VerifyOtpPage />} />

//         <Route path='/' element={token === null ? <LoginPage /> : isBuyer === 1 ? <Navigate to="/buyer-home" /> : <Navigate to="/supplier-home" />} />

//         {token ? (
//           isBuyer === 1 ? (
//             <>
//               <Route path='/supplier-home' element={<Navigate to="/not-found" />} />
//               <Route path='/register' element={<Navigate to="/not-found" />} />
//               <Route path='/buyer-home' element={<BuyerHomePage />} />
//               <Route path='/invite' element={<InvitationPage />} />
//               <Route path='/create-account' element={<CreateAccountPage />} />
//               <Route path='/buyer-dashboard' element={<BuyerHomePage />} />
//               <Route path='/create-role-access' element={<CreateRolePage />} />
//               <Route path='/change-password-new-user' element={<NewUserPasswordChangePage />} />

//             </>
//           ) :
//             (
//               <>
//                 <Route path='/supplier-home' element={<SupplierHomePage />} />
//                 <Route path='/register' element={<RegistrationPage />} />
//                 <Route path='/buyer-home' element={<Navigate to="/not-found" />} />
//                 <Route path='/invite' element={<Navigate to="/not-found" />} />
//                 <Route path='/create-account' element={<Navigate to="/not-found" />} />
//                 <Route path='/buyer-dashboard' element={<Navigate to="/not-found" />} />
//                 <Route path='/create-role-access' element={<Navigate to="/not-found" />} />
//               </>
//             )
//         ) : (
//           // If not logged in, allow access only to the login page
//           // <Route path='*' element={<Navigate to="/" />} />
//           <Route path='*' element={<LoginPage />} />
//         )}
//         <Route path='/not-found' element={<NotFoundPage />} />
//       </Routes>
//     </Router>

//   );

// }

// export default App;

import React, { useEffect, useState } from "react";

import LoginPage from "./login_both/component/LoginPage";
import CreateAccountPage from "./create_account/component/CreateAccountPage";
import InvitationPage from "./invitation/component/InvitationPage";
import BasicInformationPage from "./registration/component/BasicInformationPage";
import DeclarationPage from "./registration/component/DeclarationPage";

import ApplicationPage from "./registration/component/ApplicationPage";
import DocumentsPage from "./registration/component/DocumentsPage";
import { DocumentPageProvider } from "./registration/context/DocumentPageContext";
import PageOne from "./registration/component/document_page_component/PageOne";
import PageTwo from "./registration/component/document_page_component/PageTwo";
import RegistrationPage from "./registration/component/RegistrationPage";
import BuyerHomePage from "./buyer_home/component/BuyerHomePage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SupplierHomePage from "./supplier_home/component/SupplierHomePage";
import CreateRolePage from "./role_access/component/CreateRolePage";
import { useAuth } from "./login_both/context/AuthContext";
import NotFoundPage from "./not_found/component/NotFoundPage";
import CircularProgressIndicator from "./Loading_component/CircularProgressIndicator";
import ForgotPasswordPage from "./password_recovery/component/ForgotPasswordPage";
import VerifyOtpPage from "./password_recovery/component/VerifyOtpPage";
import ChangePasswordPage from "./password_recovery/component/ChangePasswordPage";
import NewUserPasswordChangePage from "./password_recovery/component/NewUserPasswordChangePage";
import MaintananceModePage from "./system_setup/component/MaintananceModePage";
import { RfqCreateProcessProvider } from "./buyer_rfq_create/context/RfqCreateContext";

function App() {
  const { token, isBuyer, isNewUser, isRegCompelte } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false); // Set loading to false once the component mounts
  }, []);

  useEffect(() => {
    console.log("Token in App:", token);
    console.log(isBuyer, isRegCompelte);
    console.log(typeof isRegCompelte);
    console.log("1" === isRegCompelte);
  }, [token, isBuyer, isNewUser, isRegCompelte]);

  if (loading) {
    // You can render a loading indicator here
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <CircularProgressIndicator />
      </div>
    );
  }

  if (isNewUser === 1) {
    return (
      <Router>
        <Routes>
          <Route
            path="/change-password-new-user"
            element={<NewUserPasswordChangePage />}
          />
          {/* Add other routes as needed */}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>
    );
  }

  //if supplier is approve , can not access register, and no question for buyer to access
  if (isBuyer === 0 && isRegCompelte === "0") {
    return (
      <Router>
        <Routes>
          <Route
            path="/register/:id?"
            element={
              <DocumentPageProvider>
                <RegistrationPage />
              </DocumentPageProvider>
            }
          />
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />

        {/* <Route path='/register/:id?' element={<DocumentPageProvider><RegistrationPage /></DocumentPageProvider>} /> */}

        <Route
          path="/"
          element={
            token === null ? (
              <LoginPage />
            ) : isBuyer === 1 ? (
              <Navigate to="/buyer-home" />
            ) : (
              <Navigate to="/supplier-home" />
            )
          }
        />

        {token ? (
          isBuyer === 1 ? (
            <>
              <Route
                path="/supplier-home"
                element={<Navigate to="/not-found" />}
              />
              <Route path="/register" element={<Navigate to="/not-found" />} />
              <Route path="/buyer-home/:bmId?" element={<BuyerHomePage />} />
              <Route path="/invite" element={<InvitationPage />} />
              <Route path="/create-account" element={<CreateAccountPage />} />
              <Route path="/buyer-dashboard" element={<BuyerHomePage />} />
              <Route path="/create-role-access" element={<CreateRolePage />} />

              <Route
                path="/change-password-new-user"
                element={<Navigate to="/not-found" />}
              />
            </>
          ) : (
            <>
              <Route
                path="/supplier-home/:smId?"
                element={<SupplierHomePage />}
              />
              {/* <Route path='/register' element={<RegistrationPage />} /> */}
              {/* apatoto baire nissi for ajer work register k */}
              <Route
                path="/buyer-home"
                element={<Navigate to="/not-found" />}
              />
              <Route path="/invite" element={<Navigate to="/not-found" />} />
              {/* <Route path='/create-account' element={<Navigate to="/not-found" />} /> */}
              <Route
                path="/buyer-dashboard"
                element={<Navigate to="/not-found" />}
              />
              <Route
                path="/create-role-access"
                element={<Navigate to="/not-found" />}
              />
              {/* <Route
                path="/change-password-new-user"
                element={<Navigate to="/not-found" />}
              /> */}

              <Route
                path="/change-password-new-user"
                element={<NewUserPasswordChangePage />}
              />
              <Route path="/register" element={<Navigate to="/not-found" />} />
            </>
          )
        ) : (
          // If not logged in, allow access only to the login page
          <Route path="*" element={<Navigate to="/" />} />
        )}
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="/maintenance" element={<MaintananceModePage />} />
      </Routes>
    </Router>
  );
}

export default App;
