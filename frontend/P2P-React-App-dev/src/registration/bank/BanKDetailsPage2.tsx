import React, { useState, useRef, useEffect } from 'react'
import InputLebel from '../../common_component/InputLebel';
import CommonInputField from '../../common_component/CommonInputField';
import FilePickerInput from '../../common_component/FilePickerInput';
import CommonButton from '../../common_component/CommonButton';
import ApproveHierarchyTable from '../../common_component/ApproveHierarchyTable';

import {BankDetailsInterface,SupplierSiteInterface} from '../interface/RegistrationInterface';

import { useBankPageContext } from '../context/BankPageContext';

import { useAuth } from '../../login_both/context/AuthContext';
import { isTokenValid } from '../../utils/methods/TokenValidityCheck';
import { useNavigate } from 'react-router-dom';
import SuccessToast,{showSuccessToast} from '../../Alerts_Component/SuccessToast';
import ErrorToast,{showErrorToast} from '../../Alerts_Component/ErrorToast';
import SiteListService from '../service/site_creation/SiteListService';
import BankDetailsService from '../service/bank/BankDetailsService';
import PageTitle from '../../common_component/PageTitle';
import CircularProgressIndicator from '../../Loading_component/CircularProgressIndicator';
import AddUpdateBankDetailsService from '../service/bank/AddUpdateBankDetailsService';
import LogoLoading from '../../Loading_component/LogoLoading';
import ValidationError from '../../Alerts_Component/ValidationError';
import WarningModal from '../../common_component/WarningModal';
import SubmitRegistrationService from '../service/registration_submission/submitRegistrationService';
import HierachyListByModuleService from '../service/approve_hierarchy/HierarchyListByModuleService';
import HierarchyInterface from '../interface/hierarchy/HierarchyInterface';
import convertDateFormat from '../../utils/methods/convertDateFormat';
import SendEmailService from '../../manage_supplier/service/approve_reject/SendEmailService';
import ProfileUpdateSubmissionService from '../service/profile_update_submission/ProfileUpdateSubmissionService';
import countryListWithCode from '../../jsons/countryListWithCode';
import CommonDropDownSearch from '../../common_component/CommonDropDownSearch';
import BankListFromOracleServiceService from '../service/bank/BankListServiceFromOracleService';

const data = [
    { id: 1, name: 'Ismail Khan', date: "12/12/2022", action: "Approved", remark: "fgfdwu wu fuw fuwgef uuyw gf" },
    { id: 1, name: 'Ismail Khan', date: "12/12/2022", action: "Approved", remark: "fgfdwu wu fuw fuwgef uuyw gf" },
    { id: 1, name: 'Ismail Khan', date: "12/12/2022", action: "Approved", remark: "fgfdwu wu fuw fuwgef uuyw gf" },

];

interface BankData {
    HOME_COUNTRY: string;
    BANK_NAME: string;
  }

  interface BankFromOracle {
    value: string;
    label: string;
    
}

export default function BanKDetailsPage2() {
  return (
    <div>BanKDetailsPage2</div>
  )
}
