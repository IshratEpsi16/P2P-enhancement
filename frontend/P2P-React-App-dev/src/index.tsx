import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./login_both/context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import { MenuProvider } from "./my_info/context/MenuContext";
import CircularProgressIndicator from "./Loading_component/CircularProgressIndicator";
import CacheBuster from "react-cache-buster";
import { version } from "../package.json";
import { RfqCreateProcessProvider } from "./buyer_rfq_create/context/RfqCreateContext";
import { RfqPageProvider } from "./rfq/context/RfqPageContext";
import { ManageSupplierProvider } from "./manage_supplier/interface/ManageSupplierContext";
import { RoleAccessProvider } from "./role_access/context/RoleAccessContext";
import { ApprovalSetupProvider } from "./approval_setup/context/ApprovalSetupContext";
import { ManageSupplierProfileUpdateProvider } from "./manage_supplier_profile_update/context/ManageSupplierProfileUpdateContext";
import { RfiManageSupplierProvider } from "./rfi_in_supplier_registration/context/RfiManageSupplierContext";
import { ContactPageProvider } from "./registration/context/ContactPageContext";
import { MouPageProvider } from "./supplier_ou_manage/context/MouPageContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const isProduction = process.env.REACT_APP_ENV === "production";
console.log(isProduction);

root.render(
  <CacheBuster
    currentVersion={"1.0.0"}
    isEnabled={isProduction} //If false, the library is disabled.
    isVerboseMode={false} //If true, the library writes verbose logs to console.
    loadingComponent={<CircularProgressIndicator />} //If not pass, nothing appears at the time of new version check.
    metaFileDirectory={"."} //If public assets are hosted somewhere other than root on your server.
  >
    <AuthProvider>
      <MenuProvider>
        <RfqCreateProcessProvider>
          <RfqPageProvider>
            <ManageSupplierProvider>
              <RoleAccessProvider>
                <ApprovalSetupProvider>
                  <ManageSupplierProfileUpdateProvider>
                    <RfiManageSupplierProvider>
                      <ContactPageProvider>
                        <MouPageProvider>
                          <App />
                        </MouPageProvider>
                      </ContactPageProvider>
                    </RfiManageSupplierProvider>
                  </ManageSupplierProfileUpdateProvider>
                </ApprovalSetupProvider>
              </RoleAccessProvider>
            </ManageSupplierProvider>
          </RfqPageProvider>
        </RfqCreateProcessProvider>
      </MenuProvider>
    </AuthProvider>
  </CacheBuster>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
