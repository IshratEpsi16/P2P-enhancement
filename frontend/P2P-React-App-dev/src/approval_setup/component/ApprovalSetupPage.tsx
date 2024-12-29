import React, { useState, useRef, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonSearchField from "../../common_component/CommonSearchField";
import CommonButton from "../../common_component/CommonButton";
import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";
import { useApprovalSetupContext } from "../context/ApprovalSetupContext";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import { useAuth } from "../../login_both/context/AuthContext";
import TemplateInterface from "../interface/TemplateInterface";
import ModuleInterface from "../interface/ModuleInterface";
//keep react
import { Button, Modal } from "keep-react";

import DropDown from "../../common_component/DropDown";
import CommonInputField from "../../common_component/CommonInputField";
import EditIcon from "../../icons/EditIcon";
import ApprovalTemplateListService from "../service/ApprovalTemplateListService";
import LogoLoading from "../../Loading_component/LogoLoading";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import convertDateFormat from "../../utils/methods/convertDateFormat";
import ModuleListService from "../service/ModuleListService";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";
import CreateTemplateService from "../service/CreateTemplateService";
import {
  CloudArrowUp,
  PlusCircle,
  UploadSimple,
  TrashSimple,
} from "phosphor-react";
import DeleteModal from "../../common_component/DeleteModal";
import DeleteTemplateService from "../service/DeleteTemplateService";
import NewDeleteModal from "../../common_component/NewDeleteModal";
import CurrencyListService from "../../registration/service/bank/CurrencyListService";
import CommonOrgInterface from "../../common_interface/CommonOrgInterface";
import OrganizationListService from "../../role_access/service/OrganizationListService";
import useApprovalSetupStore from "../store/ApprovalSetupStore";

//keep react
const pan = ["Home", "Approval Setup"];

const options = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

const dept = [
  { label: 'Local', value: 'Local' },
  { label: 'Foreign', value: 'Foreign' },
];

const longShort = [
  { label: 'Long', value: 'Long' },
  { label: 'Short', value: 'Short' },
];

interface CurrencyFromOracle {
  value: string;
  label: string;
}

interface CurrencyData {
  CURRENCY_CODE: string;
  NAME: string;
}

export default function ApprovalSetupPage() {
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [total, setTotal] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [templateIdForDelete, setTemplateIdForDelete] = useState<number | null>(
    null
  );

  const { setApprovalSetupPageNo, setTemplateId } = useApprovalSetupContext();

  //delete

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const openDeleteModal = (templateId: number) => {
    console.log(templateId);

    setTemplateIdForDelete(templateId);
    setIsDeleteOpen(true);
  };
  const closeModal = () => {
    setTemplateId(null);
    setIsDeleteOpen(false);
  };

  const deleteTemplate = async () => {
    console.log(templateIdForDelete);

    try {
      const result = await DeleteTemplateService(token!, templateIdForDelete!);
      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
        getExistingTemplate();
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Something went wrong");
    }
  };

  //delete

  //pagination

  const [limit, setLimit] = useState(5);
  const [pageNo, setPageNo] = useState(1);
  const [offset, setOffSet] = useState(0);

  let newOffset: number;
  const next = async () => {
    newOffset = offset + limit;
    const newPage = pageNo + 1;
    setPageNo(newPage);
    setOffSet(newOffset);
    // getEmployee(newOffset);
  };
  const previous = async () => {
    newOffset = offset - limit;
    const newPage = pageNo - 1;
    setPageNo(newPage);
    setOffSet(newOffset);
    // getEmployee(newOffset);
  };

  // aita holo popper er jonno
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  //end poppoer

  //pagination

  const handleSearchInputChange = (val: string) => {
    setSearchInput(val);
  };

  const search = async () => {};

  // store

  const { setApprovalTemplateInStore } = useApprovalSetupStore()

  // store

  const navigateToCreateApproval = (templateId: number, tempList: TemplateInterface) => {
    setApprovalSetupPageNo(2);
    setTemplateId(templateId);
    setApprovalTemplateInStore(tempList);
  };

  //modal
  const [showModal, setShowModal] = useState(false);
  const openTemplateCreationModal = () => {
    setShowModal(!showModal);
  };
  //modal

  //create template code
  const templateNameRef = useRef<HTMLInputElement | null>(null);

  const [templateName, setTemplateName] = useState<string>("");

  const handleTemplateNameChange = (value: string) => {
    setTemplateName(value);
  };

  const [selectedTemplateFunction, setSelectedTemplateFunction] =
    useState<string>("");

  const [selectedDept, setSelectedDept] = useState<string>("");

  //drop
  const handleSelect = (value: string) => {
    console.log(`Selected: ${value}`);

    setSelectedTemplateFunction(value);

    // Do something with the selected value
  };

  const [selectedLong, setSelectedLong] = useState<string>("");

  const handleSelectLong = (value: string) => {
    console.log("longShort: ", value);
    setSelectedLong(value);
  };

  const handleSelectDept = (value: string) => {
    console.log("dept: ", value);
    setSelectedDept(value);
  };

  const [currencyListFromOracle, setCurrencyListFromOracle] = useState<
    CurrencyFromOracle[] | []
  >([]);

  useEffect(() => {
    getCurrency();
    getOrgList();
  }, []);

  const getCurrency = async () => {
    try {
      const result = await CurrencyListService(token!);
      console.log(result.data);

      if (result.data.status === 200) {
        const transformedData = result.data.data.map((item: CurrencyData) => ({
          value: item.CURRENCY_CODE,
          label: item.NAME,
        }));
        setCurrencyListFromOracle(transformedData);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Currency load failed");
    }
  };

  const [currencyCode, setCurrencyCode] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<{ code: string; name: string }>({
    code: '',
    name: '',
  });

  const handleSelectCurrency = (value: string) => {
    console.log(`Selected: ${value}`);
    setCurrencyCode(value);

    const selectedCurrency = currencyListFromOracle.find((currency) => currency.value === value);
    
    if (selectedCurrency) {
      setSelectedCurrency({ code: selectedCurrency.value, name: selectedCurrency.label, });

      console.log(`Selected Code: ${selectedCurrency.value}, Name: ${selectedCurrency.label}`);
    }
  }

  interface Org {
    value: string;
    label: string;
  }

  const [orgList, setOrgList] = useState<CommonOrgInterface[] | []>([]);
  const [convertedOrgList, setConvertedOrgList] = useState<Org[] | []>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [selectedOrg, setSelectedOrg] = useState<{ id: string; name: string }>({
    id: '',
    name: '',
  });

  const getOrgList = async () => {
    try {
      const result = await OrganizationListService(token!, userId!);

      if (result.data.status === 200) {
        const data = result.data.data;

        console.log('orgList: ', data);
        setOrgList(data);

        // Convert organization data to the dropdown format
        const convertedData = data.map((org: CommonOrgInterface) => ({
          value: org.ORGANIZATION_ID.toString(),
          label: org.NAME,
        }));

        setConvertedOrgList(convertedData);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast('Organization Load Failed');
    }
  };

  const handleSelectOrg = (value: string) => {
    const selectedOrg = orgList.find((org) => org.ORGANIZATION_ID.toString() === value);

    if (selectedOrg) {
      setSelectedOrg({
        id: selectedOrg.ORGANIZATION_ID.toString(),
        name: selectedOrg.NAME,
      });
      console.log(`Selected Org ID: ${selectedOrg.ORGANIZATION_ID}, Name: ${selectedOrg.NAME}`);
    }
  };


  //drop

  //get template list

  useEffect(() => {
    getExistingTemplate();
    getModuleList();
  }, []);

  //token

  const { token, userId } = useAuth();

  //template list

  const [templateList, setTemplateList] = useState<TemplateInterface[] | []>(
    []
  );

  const getExistingTemplate = async () => {
    setIsLoading(true);
    try {
      const result = await ApprovalTemplateListService(token!);
      if (result.data.status === 200) {
        setIsLoading(false);
        console.log("tempList: ", result.data.data);
        setTemplateList(result.data.data);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  //module list

  const [isModuleLoading, setIsModuleLoading] = useState<boolean>(false);
  const [moduleList, setModuleList] = useState([]);

  const getModuleList = async () => {
    setIsModuleLoading(true);
    try {
      const result = await ModuleListService(token!);
      if (result.data.status === 200) {
        setIsModuleLoading(false);

        const convertedData = result.data.data.map(
          (module: ModuleInterface) => ({
            value: module.MODULE_ID.toString(),
            label: module.MODULE_NAME,
          })
        );
        setModuleList(convertedData);
      } else {
        setIsModuleLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsModuleLoading(false);
    }
  };

  //create template code

  const [isCreateTemplateLoading, setIsCreateTemplateLoading] =
    useState<boolean>(false);

  const createTemplate = async () => {

    if(selectedLong === "Long") {
      if(selectedDept === "") {
        showErrorToast("Please select buyer department");
      } else if (selectedCurrency.code === "") {
        showErrorToast("Please select Currency");
      } else if (selectedCurrency.name === "") {
        showErrorToast("Please select Currency");
      } else if (minAmount === "") {
        showErrorToast("Please give minimum amount");
      } else if (maxAmount === "") {
        showErrorToast("Please give maximum amount");
      } else if (minAmount >= maxAmount) {
        showErrorToast("Minimum amount will not be more than or equal maximum amount.")
      } else if (selectedOrg.id === "") {
        showErrorToast("Please select Organization");
      }  else if (selectedOrg.name === "") {
        showErrorToast("Please select Organization");
      } else {
        setIsCreateTemplateLoading(true);
        try {
          const result = await CreateTemplateService(
            token!,
            templateName,
            selectedTemplateFunction,
            null,
            selectedLong,
            selectedDept,
            selectedCurrency.code, // currency code
            selectedCurrency.name, // currency name
            selectedOrg.id,
            selectedOrg.name,
            minAmount,
            maxAmount
          );
          if (result.data.status === 200) {
            setIsCreateTemplateLoading(false);
            setShowModal(false);
            getExistingTemplate();
          } else {
            setIsCreateTemplateLoading(false);
            showErrorToast(result.data.message);
          }
        } catch (error) {
          setIsLoading(false);
        }
      }
    } else {
      setIsCreateTemplateLoading(true);
      try {
        const result = await CreateTemplateService(
          token!,
          templateName,
          selectedTemplateFunction,
          null,
          selectedLong,
          "",
          "", // currency code
          "", // currency name
          "",
          "",
          "",
          ""
        );
        if (result.data.status === 200) {
          setIsCreateTemplateLoading(false);
          setShowModal(false);
          getExistingTemplate();
        } else {
          setIsCreateTemplateLoading(false);
          showErrorToast(result.data.message);
        }
      } catch (error) {
        setIsLoading(false);
      }
    }

    // setIsCreateTemplateLoading(true);
    // try {
    //   const result = await CreateTemplateService(
    //     token!,
    //     templateName,
    //     selectedTemplateFunction,
    //     null,
    //     selectedLong,
    //     selectedDept,
    //     selectedCurrency.code, // currency code
    //     selectedCurrency.name, // currency name
    //     selectedOrg.id,
    //     selectedOrg.name,
    //     minAmount,
    //     maxAmount
    //   );
    //   // if (result.data.status === 200) {
    //   //   setIsCreateTemplateLoading(false);
    //   //   setShowModal(false);
    //   //   getExistingTemplate();
    //   // } else {
    //   //   setIsCreateTemplateLoading(false);
    //   //   showErrorToast(result.data.message);
    //   // }
    // } catch (error) {
    //   setIsLoading(false);
    // }
  };

  const minAmountRef = useRef<HTMLInputElement>(null);
  const maxAmountRef = useRef<HTMLInputElement>(null);

  const [minAmount, setMinAMount] = useState<string>("");
  const [maxAmount, setMaxAmount] = useState<string>("");

  const handleMinAMount = (value: string) => {
    setMinAMount(value);
  };

  const handleMaxAMount = (value: string) => {
    setMaxAmount(value);
  };


  return (
    <div className=" m-8 bg-whiteColor">
      <SuccessToast />

      {/* <DeleteModal
        isOpen={isDeleteOpen}
        doDelete={deleteTemplate}
        closeModal={closeModal}
        message=" Delete Template ?"
      /> */}

      <NewDeleteModal
        isOpen={isDeleteOpen}
        action={deleteTemplate}
        closeModal={closeModal}
        message=" Delete Template ? "
      />

      {isLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : (
        <>
          <div className=" mb-4">
            <PageTitle titleText="Approval Setup" />
            <NavigationPan list={pan} />
          </div>

          <div className=" w-full flex items-center justify-between mb-4">
            <CommonSearchField
              onChangeData={handleSearchInputChange}
              search={search}
              placeholder="Search Here"
              inputRef={searchInputRef}
              width="w-60"
            />
            <CommonButton
              onClick={openTemplateCreationModal}
              titleText="Create"
              color="bg-midGreen"
              width="w-32"
            />
          </div>

          {!isLoading && templateList.length === 0 ? (
            <div className=" w-full flex justify-center items-center h-screen">
              <h1 className=" largeText">Please Create A Template</h1>
            </div>
          ) : (
            <>
              <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200 rounded-lg">
                  <thead className="bg-[#CAF4FF] sticky top-0 ">
                    <tr>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        SL
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Template Name
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Created At
                      </th>

                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Action
                      </th>
                    </tr>
                  </thead>

                  {templateList.map((template, index) => (
                    <tbody
                      key={template.AS_ID}
                      className="bg-white divide-y divide-gray-200"
                    >
                      <tr>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {index + 1}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                          <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                            {template.APPROVAL_STAGE_NAME}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {convertDateFormat(template.CREATION_DATE)}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            <button
                              onClick={() => {
                                navigateToCreateApproval(template.AS_ID, template);
                              }}
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={() => {
                                openDeleteModal(template.AS_ID);
                              }}
                            >
                              <TrashSimple size={24} color="red" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  ))}

                  <tfoot className="bg-white sticky bottom-0">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* <div className="overflow-x-auto">
                <table
                  className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor rounded-md"
                  style={{ tableLayout: "fixed" }}
                >
                  <thead className="sticky top-0 bg-[#F4F6F8] h-14">
                    <tr>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                        SL
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                        Template Name
                      </th>
                      <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  whitespace-nowrap">
                        Created At
                      </th>
                      <th className="font-mon px-6 py-3 text-center text-sm font-medium text-blackColor  whitespace-normal w-44">
                        Action
                      </th>

                     
                    </tr>
                  </thead>

               

                  {templateList.map((template, index) => (
                    <tbody
                      key={template.AS_ID}
                      className=" bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                    >
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                        {index + 1}
                      </td>
                      <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                        {template.APPROVAL_STAGE_NAME}
                      </td>
                      <td className="  font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                        {convertDateFormat(template.CREATION_DATE)}
                      </td>
                      <td className="  font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor whitespace-normal w-44 flex justify-center space-x-4 ">
                        <button
                          onClick={() => {
                            navigateToCreateApproval(template.AS_ID);
                          }}
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => {
                            openDeleteModal(template.AS_ID);
                          }}
                        >
                          <TrashSimple size={24} color="red" />
                        </button>
                      </td>
                    </tbody>
                  ))}

                  <tfoot>
                    <td className=""></td>

                    <td className="pl-6 py-3 whitespace-normal   ">
                      <div className=" flex space-x-2">
                        <ReusablePopperComponent
                          id={id}
                          open={open}
                          anchorEl={anchorEl}
                          handleClick={handleClick}
                          setLimit={setLimit}
                          limit={limit}
                        />
                        <ReusablePaginationComponent
                          pageNo={pageNo === 1 ? pageNo : offset + 1}
                          limit={
                            offset === 0
                              ? offset + limit
                              : newOffset! !== undefined
                              ? newOffset
                              : offset + limit
                          }
                          total={total!}
                          // list={list}
                          previous={previous}
                          next={next}
                        />
                      </div>
                    </td>
                  </tfoot>
                </table>
              </div> */}
            </>
          )}

          {/* modal code for add approval here */}

          <Modal
            icon={<CloudArrowUp size={28} color="#1B4DFF" />}
            size="xl"
            show={showModal}
            position="center"
          >
            <Modal.Header className=" font-mon">
              Create An Approval Template
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-3">
                <CommonInputField
                  type="text"
                  onChangeData={handleTemplateNameChange}
                  inputRef={templateNameRef}
                  hint="Enter Template Name"
                  height="py-2"
                  width="w-full"
                  bgColor="bg-whiteColor"
                />
                {isModuleLoading ? (
                  <div className=" flex w-full justify-center items-center">
                    <CircularProgressIndicator />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <DropDown
                        options={moduleList}
                        onSelect={handleSelect}
                        width="w-60"
                        height="h-11"
                        sval={selectedTemplateFunction}
                        hint="Select Template"
                      />

                      <DropDown
                        options={longShort}
                        onSelect={handleSelectLong}
                        width="w-60"
                        height="h-11"
                        sval={selectedLong}
                        hint="Select Approval Flow Type"
                      />
                    </div>

                    {/* {selectedLong === 'Long' && (
                      <> */}
                        <div className="flex items-center space-x-3">
                          <DropDown
                            options={dept}
                            onSelect={handleSelectDept}
                            width="w-60"
                            height="h-11"
                            sval={selectedDept}
                            disable={selectedLong === 'Short'}
                            hint="Select Dept"
                          />

                          <DropDown
                            options={currencyListFromOracle}
                            onSelect={handleSelectCurrency}
                            sval={currencyCode}
                            height="h-11"
                            width="w-60"
                            disable={selectedLong === 'Short'}
                            hint="Select Currency"
                          />
                        </div>

                        <div className="flex items-center space-x-3">
                          <CommonInputField
                            inputRef={minAmountRef}
                            onChangeData={handleMinAMount}
                            hint="Min Amount"
                            type="text"
                            width="w-60"
                            height="h-11"
                            bgColor="bg-whiteColor"
                            disable={selectedLong === 'Short'}
                          />
            

                          <CommonInputField
                            inputRef={maxAmountRef}
                            onChangeData={handleMaxAMount}
                            hint="Max Amount"
                            type="text"
                            width="w-60"
                            height="h-11"
                            bgColor="bg-whiteColor"
                            disable={selectedLong === 'Short'}
                          />
                        </div>

                        <div>
                          <DropDown
                            options={convertedOrgList}
                            onSelect={handleSelectOrg}
                            width="w-60"
                            height="h-11"
                            sval={selectedOrgId}
                            disable={selectedLong === 'Short'}
                            hint="Select Organization"
                          />
                        </div>
                      {/* </>
                    )} */}
                  </div>
                )}
              </div>
            </Modal.Body>
            <div className="w-full flex items-center justify-end">
              <Modal.Footer>
                <Button
                  type="outlineGray"
                  className=" font-mon h-8"
                  onClick={openTemplateCreationModal}
                >
                  Cancel
                </Button>
                {isCreateTemplateLoading ? (
                  <div className=" ">
                    <CircularProgressIndicator />
                  </div>
                ) : (
                  <Button
                    className=" bg-midGreen text-whiteColor font-mon h-8"
                    onClick={createTemplate}
                  >
                    Confirm
                  </Button>
                )}
              </Modal.Footer>
            </div>
          </Modal>

          {/* modal code for add approval here */}
        </>
      )}
    </div>
  );
}
