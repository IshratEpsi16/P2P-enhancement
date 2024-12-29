import { useEffect, useState } from "react";
import CommonButton from "../../common_component/CommonButton";
import PageTitle from "../../common_component/PageTitle";
import { useManageSupplierProfileUpdateContext } from "../context/ManageSupplierProfileUpdateContext";
import useProfileUpdateStore from "../store/profileUpdateStore";
import InputLebel from "../../common_component/InputLebel";
import CheckIcon from "../../icons/CheckIcon";

import { Modal, Button } from "keep-react";
import { CloudArrowUp } from "phosphor-react";
import { Textarea } from "keep-react";
import SuccessModal from "../../common_component/SuccessModal";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import { useAuth } from "../../login_both/context/AuthContext";
import SupplierNewValueAddAprrovalService from "../service/SupplierNewValueAddAprrovalService";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import BankInterface from "../../registration/interface/BankInterface";
import BankInSiteApprovalService from "../../manage_supplier/service/site/BankInSiteApprovalService";
import fetchFileService from "../../common_service/fetchFileService";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";

// "ACTION_CODE": 1,
// "SUPPLIER_ID": 65,
// "STAGE_ID": 116,
// "STAGE_LEVEL": 3,
// "ID": 369,
// "TABLE_NAME": "XXP2P_SUPPLIER_SITE",
// "NOTE": "New approval Approved by 4"

export default function SupplierNewInfoAddDetails() {
  const { setManageSupplierProfileUpdatePageNo } =
    useManageSupplierProfileUpdateContext();

  // store
  const {
    bankItem,
    setBankItem,
    supplierIdInStore,
    stageIdInStore,
    stageLevelInStore,
    setSupplierIdInStore,
    setStageIdInStore,
    setStageLevelInStore,
    bankChequePathInStore,
    nidPassportPathInStore,
    signaturePathInStore,
    etinPathInStore,
    siteIdInStore,
  } = useProfileUpdateStore();
  // store

  const [isNid, setIsNid] = useState<boolean>(false);
  const [isPassport, setIsPassport] = useState<boolean>(false);

  const { token } = useAuth();

  useEffect(() => {
    console.log("bank item: ", bankItem);
    console.log("bank item: ", supplierIdInStore, siteIdInStore);

    getBankList();
  }, []);

  // bank list from supplier
  const [bankList, setBankList] = useState<BankInterface[] | []>([]);

  const getBankList = async () => {
    const result = await BankInSiteApprovalService(
      token!,
      supplierIdInStore!,
      siteIdInStore!
    );

    console.log("sup bank: ", result.data.data);

    setBankList(result.data.data);
  };

  // bank list from supplier

  //back to list page
  const back = () => {
    setManageSupplierProfileUpdatePageNo(3);
    setBankItem(null);
    // setIsBuyerSelectionDisable(false);
  };

  const [approveModal, setApproveModal] = useState<boolean>(false);
  const onCLickApprove = () => {
    // setActionCode(1);
    setApproveModal(!approveModal);
    if (!approveModal) {
      setApproveValue("");
    }
  };

  const [approveValue, setApproveValue] = useState<string>("");

  // Event handler to update the state when the textarea value changes
  const handleApproveValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 150) {
      setApproveValue(inputValue);
    } else {
      setApproveValue(inputValue.slice(0, 150));
    }
  };

  //reject modal

  const [rejectModal, setRejectModal] = useState<boolean>(false);
  const onCLickReject = () => {
    // setActionCode(0);
    setRejectModal(!rejectModal);
    if (!rejectModal) {
      setRejectValue("");
    }
  };

  const [rejectValue, setRejectValue] = useState<string>("");

  // Event handler to update the state when the textarea value changes
  const handleRejectValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;

    // Check if the input value exceeds the maximum character length (150)
    if (inputValue.length <= 150) {
      setRejectValue(inputValue);
    } else {
      // Truncate the input value to the first 150 characters
      setRejectValue(inputValue.slice(0, 150));
    }
  };

  //validation
  const [approveError, setApproveError] = useState<{ note?: string }>({});
  const [rejectError, setRejectError] = useState<{ note?: string }>({});
  const validateApprove = () => {
    const errors: { note?: string } = {};

    if (!approveValue.trim()) {
      errors.note = "Please Enter Note";
    }

    setApproveError(errors);

    return Object.keys(errors).length === 0;
  };
  const validateReject = () => {
    const errors: { note?: string } = {};

    if (!rejectValue.trim()) {
      errors.note = "Please Enter Note";
    }

    setApproveError(errors);

    return Object.keys(errors).length === 0;
  };

  //validation

  //setManageSupplierProfileUpdatePageNo

  // const approve = async () => {
  //   if (validateApprove()) {
  //     try {
  //       onCLickApprove();
  //       const result = await SupplierNewValueAddAprrovalService(
  //         token!,
  //         1,
  //         supplierIdInStore!,
  //         stageIdInStore!,
  //         stageLevelInStore!,
  //         bankItem?.PK_COLUMN_VALUE!,
  //         bankItem?.TABLE_NAME!,
  //         approveValue
  //       );
  //       console.log(result);

  //       setSupplierIdInStore(null);
  //       setStageIdInStore(null);
  //       setStageLevelInStore(null);
  //       setBankItem(null);

  //       showSuccessToast("Approved Successfully");
  //       setManageSupplierProfileUpdatePageNo(1);
  //     } catch (error) {
  //       showErrorToast("Approve Failed");
  //     }
  //   }
  // };

  // const deny = async () => {
  //   if (validateReject()) {
  //     onCLickReject();
  //     try {
  //       onCLickApprove();
  //       const result = await SupplierNewValueAddAprrovalService(
  //         token!,
  //         0,
  //         supplierIdInStore!,
  //         stageIdInStore!,
  //         stageLevelInStore!,
  //         bankItem?.PK_COLUMN_VALUE!,
  //         bankItem?.TABLE_NAME!,
  //         approveValue
  //       );
  //       console.log(result);

  //       setSupplierIdInStore(null);
  //       setStageIdInStore(null);
  //       setStageLevelInStore(null);
  //       setBankItem(null);

  //       showSuccessToast("Rejected Successfully");
  //       setManageSupplierProfileUpdatePageNo(1);
  //     } catch (error) {
  //       showErrorToast("Reject Failed");
  //     }
  //   }
  // };

  const [checkFileLoading, setCheckFileLoading] = useState<boolean>(false);
  const [nidFileLoading, setNidFileLoading] = useState<boolean>(false);
  const [signatureFileLoading, setSignatureFileLoading] =
    useState<boolean>(false);
  const handleViewFile = (
    filePath: string,
    fileName: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    fetchFileService(filePath, fileName, token!, setLoading);
  };

  return (
    <div className="bg-whiteColor m-8">
      <SuccessToast />
      {bankItem?.TABLE_NAME === "XXP2P_SUPPLIER_BANK" ? (
        <>
          <div className=" w-full flex flex-col items-start space-y-4">
            <div className=" w-full flex justify-between items-center">
              <PageTitle titleText="Bank Details" />
              <CommonButton
                onClick={back}
                width="w-24"
                titleText="Back"
                color="bg-midGreen"
              />
            </div>

            <div className="h-7"></div>

            <div className=" w-full flex flex-row justify-between items-start">
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Account Name"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.ACCOUNT_NAME}
                </p>
              </div>

              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Account Number"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.ACCOUNT_NUMBER}
                </p>
              </div>
            </div>

            <div className=" w-full flex flex-row justify-between items-start">
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Bank Name"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.BANK_NAME}
                </p>
              </div>

              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Branch Name"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.BRANCH_NAME}
                </p>
              </div>
            </div>

            <div className=" w-full flex flex-row justify-between items-start">
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Routing Number / Swift Code"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.ROUTING_SWIFT_CODE}
                </p>
              </div>

              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Currency"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.CURRENCY_NAME}
                </p>
              </div>
            </div>

            <div className=" w-full flex flex-row justify-between items-start">
              {/* <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Swift Code"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.SWIFT_CODE}
                </p>
              </div> */}

              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Blank Cheque Attachment"} />

                {/* <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">{bankItem?.TABLE_DATA.CURRENCY_CODE}</p> */}
                {checkFileLoading ? (
                  <div className=" w-96 flex justify-center items-center">
                    <CircularProgressIndicator />
                  </div>
                ) : (
                  <button
                    // href={`${bankChequePathInStore}/${bankItem.TABLE_DATA.CHEQUE_FILE_NAME}`}
                    onClick={() => {
                      handleViewFile(
                        bankChequePathInStore!,
                        bankItem.TABLE_DATA.CHEQUE_FILE_NAME!,
                        setCheckFileLoading
                      );
                    }}
                    className=" w-96 dashedButton my-4 "
                  >
                    {" "}
                    View{" "}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : bankItem?.TABLE_NAME === "XXP2P_SUPPLIER_CONTACT_PERSON_DTLS" ? (
        <>
          <div className=" w-full flex flex-col items-start space-y-4">
            <div className=" w-full flex justify-between items-center">
              <PageTitle titleText="Contact Details" />
              <CommonButton
                onClick={back}
                width="w-24"
                titleText="Back"
                color="bg-midGreen"
              />
            </div>

            <div className="h-7"></div>

            <div className=" w-full flex flex-row justify-between items-start">
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Name"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.NAME}
                </p>
              </div>

              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Position"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.POSITION}
                </p>
              </div>
            </div>

            <div className=" w-full flex flex-row justify-between items-start">
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Contact Number 1"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.MOB_NUMBER_1}
                </p>
              </div>

              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Contact Number 2"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.MOB_NUMBER_2}
                </p>
              </div>
            </div>

            <div className=" w-full flex flex-row justify-between items-start">
              <div className=" w-full flex flex-col items-start space-y-3">
                <div className=" w-full flex space-x-10 items-center">
                  <button className=" flex space-x-2 items-center cursor-default">
                    <div
                      className={`ml-[1px] w-4 h-4 flex justify-center items-center rounded-[4px]
                      ${
                        bankItem?.TABLE_DATA.IS_NID === 1
                          ? "bg-midGreen ring-0"
                          : "bg-whiteColor ring-[1px] ring-borderColor "
                      }`}
                    >
                      <CheckIcon className=" w-3 h-3 text-whiteColor" />
                    </div>

                    <p className=" smallText">NID Number</p>
                  </button>

                  <button className=" flex space-x-2 items-center cursor-default">
                    <div
                      className={`w-4 h-4 flex justify-center items-center rounded-[4px]
                      ${
                        bankItem?.TABLE_DATA.IS_NID === 0
                          ? "bg-midGreen ring-0"
                          : "bg-whiteColor ring-[1px] ring-borderColor "
                      }`}
                    >
                      <CheckIcon className=" w-3 h-3 text-whiteColor" />
                    </div>

                    <p className=" smallText">Passport Number</p>
                  </button>
                </div>

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.NID_PASSPORT_NUMBER}
                </p>
              </div>

              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Email"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.EMAIL}
                </p>
              </div>
            </div>

            <div className=" w-full flex flex-row justify-between items-start">
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"NID/Passport File"} />

                {/* <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">{bankItem?.TABLE_DATA.NID_PASSPORT_FILE_NAME}</p> */}
                {nidFileLoading ? (
                  <div className=" w-96 flex justify-center items-center">
                    <CircularProgressIndicator />
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      handleViewFile(
                        nidPassportPathInStore!,
                        bankItem.TABLE_DATA.NID_PASSPORT_FILE_NAME!,
                        setNidFileLoading
                      );
                    }}
                    className=" w-96 dashedButton my-4 "
                  >
                    {" "}
                    View{" "}
                  </button>
                )}
              </div>

              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Signature"} />

                {/* <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">{bankItem?.TABLE_DATA.MOB_NUMBER_2}</p> */}

                {signatureFileLoading ? (
                  <div className=" w-96 flex justify-center items-center">
                    <CircularProgressIndicator />
                  </div>
                ) : (
                  <button
                    // href={`${signaturePathInStore}/${bankItem.TABLE_DATA.SIGNATURE_FILE_NAME}`}
                    // target="blank"

                    onClick={() => {
                      handleViewFile(
                        signaturePathInStore!,
                        bankItem.TABLE_DATA.SIGNATURE_FILE_NAME!,
                        setSignatureFileLoading
                      );
                    }}
                    className=" w-96 dashedButton my-4 "
                  >
                    {" "}
                    View{" "}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : bankItem?.TABLE_NAME === "XXP2P_SUPPLIER_SITE" ? (
        <>
          <div className=" w-full flex flex-col items-start space-y-4">
            <div className=" w-full flex justify-between items-center">
              <PageTitle titleText="Site Details" />
              <CommonButton
                onClick={back}
                width="w-24"
                titleText="Back"
                color="bg-midGreen"
              />
            </div>

            <div className="h-7"></div>

            <div className=" w-full flex flex-row justify-between items-start">
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Country"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.COUNTRY_NAME}
                </p>
              </div>

              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Site Name"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.ADDRESS_LINE1}
                </p>
              </div>
            </div>

            <div className=" w-full flex flex-row justify-between items-start">
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Site Address"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.ADDRESS_LINE2}
                </p>
              </div>

              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"City/State"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.CITY_STATE}
                </p>
              </div>
            </div>

            <div className=" w-full flex flex-row justify-between items-start">
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Post/ZIP Code"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.ZIP_CODE}
                </p>
              </div>

              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Phone"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.MOBILE_NUMBER}
                </p>
              </div>
            </div>

            <div className=" w-full flex flex-row justify-between items-start">
              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Email"} />

                <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.EMAIL}
                </p>
              </div>

              <div className=" w-full flex flex-col items-start space-y-2">
                <InputLebel titleText={"Bank"} />

                {/* <p className="border-[0.5px] border-borderColor w-96 h-10 px-2 rounded-[4px] flex items-center font-mon">
                  {bankItem?.TABLE_DATA.MOB_NUMBER_2}
                </p> */}
                <p className="border-[0.5px] border-borderColor w-96 h-auto px-2 py-1 rounded-[4px] flex flex-wrap items-center font-mon">
                  {bankList.map((item, i) => (
                    <span
                      key={i}
                      className="border-[0.5px] border-[#6B7280] bg-[#E5E7EB] px-2 h-7 mr-1 flex items-center rounded break-words"
                      style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                    >
                      {item.BANK_NAME}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {/* approve modal */}
      {/* <div className=" w-full flex justify-end space-x-4 my-10 pr-24">
        <button onClick={onCLickReject} className=" denyButton w-36">
          Deny
        </button>
        <CommonButton
          titleText="Approve"
          height="h-10"
          width="w-36"
          onClick={onCLickApprove}
          color="bg-midGreen"
        />
      </div>
      <Modal
        icon={<CloudArrowUp size={28} color="#1B4DFF" />}
        size="md"
        show={approveModal}
        onClose={onCLickApprove}
      >
        <Modal.Header>Give A Note</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <Textarea
              id="comment"
              placeholder="Leave a comment..."
              withBg={true}
              color="gray"
              border={true}
              rows={4}
              value={approveValue}
              onChange={handleApproveValueChange}
            />
            <div className=" w-full flex justify-end smallText">
              {approveValue.length}/150
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="outlineGray"
            className=" h-8 font-mon"
            onClick={onCLickApprove}
          >
            Cancel
          </Button>
          <Button
            type=""
            className="h-8 bg-midGreen text-white font-mon"
            onClick={approve}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal> */}
      {/* approve modal */}
      {/* reject modal */}
      {/* <Modal
        icon={<CloudArrowUp size={28} color="#1B4DFF" />}
        size="md"
        show={rejectModal}
        onClose={onCLickReject}
      >
        <Modal.Header>Give A Note</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <Textarea
              id="comment"
              placeholder="Leave a comment..."
              withBg={true}
              color="gray"
              border={true}
              rows={4}
              value={rejectValue}
              onChange={handleRejectValueChange}
            />
            <div className=" w-full flex justify-end smallText">
              {rejectValue.length}/150
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="outlineGray"
            className=" h-8 font-mon"
            onClick={onCLickReject}
          >
            Cancel
          </Button>
          <Button
            type=""
            className="h-8 bg-midGreen text-white font-mon"
            onClick={deny}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal> */}
      {/* reject modal */}
    </div>
  );
}
