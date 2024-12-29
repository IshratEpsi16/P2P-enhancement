import React, { useState, useRef, useEffect } from "react";
import { useCsApprovalContext } from "../context/CsApprovalContext";
import CommonButton from "../../common_component/CommonButton";
import InputLebel from "../../common_component/InputLebel";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import RejectModal from "../../common_component/RejectModal";

const list = [
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  ,
  1,
];
const pan = ["Home", "CS List", "CS Details"];
const firstTableList = [
  {
    name: "Operating Unit",
    value: "Sample Company Name Here",
  },
  {
    name: "Document Number",
    value: "2345236445",
  },
  {
    name: "Document Date",
    value: "DD/MM/YYYY",
  },
  {
    name: "Currency",
    value: "BDT",
  },
  {
    name: "Total Amount",
    value: "10000 BDT",
  },
  {
    name: "Comments",
    value:
      "Lorem ipsum dolor sit amet consectetur. Mauris at rhoncus sed ornare non.",
  },
];

const prHistoryList = [
  {
    name: "OrgName",
    value: "A",
  },
  {
    name: "PRNo/Line No",
    value: "PR1010/900",
  },
  {
    name: "Item Description",
    value: "X",
  },
  {
    name: "Expected Spec",
    value:
      "Lorem ipsum dolor sit amet consectetur. Ornare gravida arcu enim nulla dignissim mauris mi. Sem vel enim iaculis at justo.",
  },
  {
    name: "Exp. Brand Origin",
    value: "Z",
  },
  {
    name: "Need By date",
    value: "DD/MM/YYYY",
  },
  {
    name: "UOM",
    value: "Gram",
  },
  {
    name: "Expected quantity",
    value: 3000,
  },
  {
    name: "Attachment",
    value: "pdf0001.pdf",
  },
  {
    name: "Stock as per PR date",
    value: null,
  },
  {
    name: "Org wise stock",
    value: null,
  },
  {
    name: "Current stock",
    value: 0,
  },
  {
    name: "Last 1 Yr/6 Mon/3 Mon Consumption",
    value: "0 / 0 / 0",
  },
  {
    name: "LCM Enabled",
    value: "N",
  },
  {
    name: "Project name",
    value: null,
  },
  {
    name: "Task Name",
    value: null,
  },
];

const poHistory = [
  {
    ID: "10132003417",
    Date: "DD/MM/YYYY",
    Duration: 60,
  },
  {
    ID: "10132003418",
    Date: "DD/MM/YYYY",
    Duration: 60,
  },
  {
    ID: "10132003419",
    Date: "DD/MM/YYYY",
    Duration: 60,
  },
  {
    ID: "10132003420",
    Date: "DD/MM/YYYY",
    Duration: 60,
  },
  {
    ID: "10132003421",
    Date: "DD/MM/YYYY",
    Duration: 60,
  },
];

const rfqHeaders = [
  "Company Name",
  "Item Description",
  "Available Spec",
  "Available Brand",
  "Available Origin",
  "UOM",
  "Offered QTY",
  "Tolerance",
  "Rate/unit",
  "VAT %",
  "AIT",
  "Total Amount",
  "Packing Type",
  "Warranty",
  "Remarks",
  "Award",
];

const quotations = [
  "Sample name 1",
  "Branded Noted Pad",
  "Lorem ipsum dolor sit amet consectetur.",
  "Canada",
  "100",
  "DD/MM/YYYY",
  "Gram",
  "100",
  "20%",
  "15 BDT/ Gram",
  "20%",
  "20%",
  "25000",
  "Lorem ipsum dolor sit",
  "Lorem ipsum dolor sit amet consectetur.",

  "",
];

const ttt = `Terms that you have to follow.
Lorem ipsum dolor sit amet consectetur. Pretium vulputate phasellus cras placerat eget. Venenatis ultrices nulla pretium et consectetur erat quam. Fermentum sit hac lacus at neque justo aenean morbi dapibus. Tellus magna molestie laoreet cursus. Congue elit velit nullam turpis at eget fusce. Vel nunc turpis sed sit enim varius magnis adipiscing. Quis aliquet etiam lectus augue odio. Laoreet enim egestas id iaculis lectus lacus tincidunt. Suscipit blandit sagittis nibh commodo nisl.
Lorem ipsum dolor sit amet consectetur. Viverra pharetra consectetur sit tempus morbi nisl sed quis. Feugiat fermentum odio eleifend quam non tellus lectus.
`;

const loop = [1, 2, 3, 4, 5];

export default function CsDetailsPageForApprover() {
  const [limit, setLimit] = useState(5);
  const [pageNo, setPageNo] = useState(1);

  //cs term
  const [openClose, setOpenClose] = useState(false);
  const [termText, setTermText] = useState(ttt);

  const handleInputChange = (e: any) => {
    const inputText = e.target.value;
    if (inputText.length <= 1500) {
      setTermText(inputText);
    } else {
      setTermText(inputText.slice(0, 1500));
    }
  };

  const cancel = () => {
    setOpenClose(false);
  };

  const save = async () => {};
  //cs term
  // aita holo popper er jonno
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  //end poppoer

  //pagination
  const next = async () => {};
  const previous = async () => {};
  const download = async () => {};

  const submit = () => {
    // nextPage();
  };

  const termModalShow = () => {
    setOpenClose(true);
  };

  //context
  const { csApprovalPageNo, setCsApprovalPageNo } = useCsApprovalContext();
  const back = () => {
    setCsApprovalPageNo(1);
  };

  //context

  //accept or reject
  // const idRef = useRef<HTMLInputElement | null>(null);

  // const [isDialog, setIsDialog] = useState<boolean>(false);
  // const [csId, setCsId] = useState<string>('');
  // const [reason, setReason] = useState<string>('');

  // const handleReasonChange = (e: any) => {
  //     const inputText = e.target.value;
  //     if (inputText.length <= 200) {
  //         setReason(inputText);
  //     } else {
  //         setReason(inputText.slice(0, 200));
  //     }
  // }

  // const handleCsIdChange = (e: any) => {
  //     const inputText = e.target.value;
  //     setCsId(inputText);
  // }

  // const reject = () => {
  //     setIsDialog(true);
  // }

  // const cancelCs = () => {
  //     if (idRef.current) {
  //         idRef.current.value = "";
  //     }

  //     setReason('');

  //     setIsDialog(false);
  // }

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleReject = () => {
    // Handle rejection logic here
    closeDialog(); // Close the dialog after handling rejection
  };

  const approve = async () => {};

  return (
    <div className="m-8">
      {/* accept reject dialog */}
      <RejectModal
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onReject={handleReject}
        titleText="Reject CS"
        labelText="CS ID"
      />
      {/* {
                isDialog && (
                    <div className="fixed inset-0 flex justify-center items-center z-50 bg-opacity-50 bg-gray-700">
                        <div className=' w-96 rounded-md bg-white'>
                            <div className=' w-full h-10 bg-red-400 rounded-t-md flex justify-center items-center'>
                                <p className=' text-sm font-mon font-medium text-white'>Reject CS</p>
                            </div>
                            <div className=' h-4'></div>
                            <div className=' w-full flex flex-col items-end space-y-2'>
                                <div className='px-8 flex flex-row space-x-2 items-center'>
                                    <div className=' w-28'>
                                        <p className=' font-medium text-blackColor text-sm font-mon'>CS ID</p>
                                    </div>
                                    <input type='text' ref={idRef} onChange={handleCsIdChange} placeholder='0767453245676' className='px-2 text-xs w-48 h-8 rounded-md border-[1px] border-borderColor focus:outline-none placeholder:font-mon placeholder:text-xs' />
                                </div>

                            </div>
                            <div className=' h-2'></div>
                            <div className=' w-full flex flex-col items-end space-y-2'>
                                <div className='px-8 flex flex-row space-x-2 items-start'>
                                    <div className=' w-28'>
                                        <p className=' font-medium text-blackColor text-sm font-mon'>Reject Reason</p>

                                    </div>
                                    <textarea
                                        value={reason}
                                        onChange={handleReasonChange}
                                        className=' text-xs w-48 h-40 bg-inputBg mt-2 rounded-md shadow-sm focus:outline-none p-4 border-[1px] border-borderColor'
                                    />

                                </div>

                            </div>
                            <div className=' h-4'></div>
                            <div className=' w-full flex flex-row space-x-4 px-8 justify-end'>
                                <button onClick={cancelCs} className=' text-xs text-blackColor border-[1px] h-6 w-16 border-borderColor flex justify-center items-center rounded-md font-mon'>Cancel</button>
                                <button className=' text-xs bg-red-400 rounded-md h-6 w-16 text-white font-mon'>Reject</button>
                            </div>

                            <div className=' h-8'></div>

                        </div>
                    </div>
                )
            } */}
      {/* accept reject dialog */}
      <div className=" flex flex-col items-start">
        <PageTitle titleText="CS Preview" />
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className=" h-6"></div>
      <div className=" w-1/2 h-20 bg-offWhiteColor border-[1px] px-4 border-borderColor rounded-md flex justify-start items-center flex-row space-x-4">
        <InputLebel titleText={"Do you want to Approve?"} />
        <CommonButton
          onClick={approve}
          titleText={"Approve"}
          height="h-8"
          width="w-24"
          color="bg-midGreen"
        />
        <CommonButton
          onClick={openDialog}
          titleText={"Reject"}
          height="h-8"
          width="w-24"
          color="bg-red-500"
        />
      </div>
      <div className=" h-6"></div>
      <div className="flex  flex-row justify-between items-start">
        <CommonButton
          titleText={"CS Terms"}
          onClick={termModalShow}
          height="h-8"
          width="w-24"
        />
        <CommonButton
          titleText={"Export to Excel"}
          onClick={download}
          height="h-8"
          width="w-32"
          color="bg-midGreen"
        />
      </div>
      <div className=" h-6"></div>
      <div className=" flex flex-row space-x-2 items-center">
        <div className=" flex-1   border-[0.1px] border-borderColor   ">
          {firstTableList.map((f, i) => (
            <div>
              <div className=" flex flex-row  items-center">
                <div className=" h-10 w-44 bg-offWhiteColor flex justify-start pl-4 items-center">
                  <p className=" text-sm text-blackColor font-mon">{f.name}</p>
                </div>
                <div className=" h-10 w-[1px] bg-borderColor"></div>
                <div className="w-2"></div>
                <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
                  <p className=" text-sm text-blackColor font-mon text-start">
                    {f.value}
                  </p>
                </div>
              </div>
              <div className="w-full h-[1px] bg-borderColor"></div>
            </div>
          ))}
          <div className=" flex flex-row  items-center">
            <div className=" h-10 w-44 pl-4 bg-offWhiteColor flex justify-start items-center">
              <p className=" text-sm text-blackColor font-mon text-start">
                General Terms
              </p>
            </div>
            <div className=" h-10 w-[1px] bg-borderColor"></div>
            <div className="w-2"></div>
            <div className=" h-10 flex-1 bg-whiteColor flex justify-start items-center">
              <p className=" text-sm text-midGreen cursor-pointer underline font-mon text-start">
                View
              </p>
            </div>
          </div>
          {/* <div className='w-full h-[1px] bg-borderColor'></div> */}
        </div>
        <div className=" flex-1 overflow-x-auto">
          <div className="">
            <table
              className="min-w-full divide-y divide-gray-200"
              style={{ tableLayout: "fixed" }}
            >
              <thead className="sticky top-0  bg-lightGreen h-10">
                <tr>
                  <th className="font-mon px-6 py-1 text-left text-sm font-medium text-blackColor  ">
                    SL
                  </th>
                  <th className=" font-mon px-6 py-1 text-left text-sm font-medium text-blackColor  tracking-wider">
                    Date
                  </th>
                  <th className="font-mon px-6 py-1 text-left text-sm font-medium text-blackColor  tracking-wider">
                    Action
                  </th>
                  <th className="font-mon px-6 py-1 text-left text-sm font-medium text-blackColor  tracking-wider">
                    Performed By
                  </th>
                  <th className="font-mon px-6 py-1 text-left text-sm font-medium text-blackColor  tracking-wider">
                    Remarks
                  </th>

                  {/* Add more header columns as needed */}
                </tr>
              </thead>

              {/* Table rows go here */}
              {/* Table rows go here */}
              {list.slice(0, 5).map((e, i) => (
                <tbody
                  className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                  key={i}
                >
                  <td className="font-mon h-11 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap font-medium">
                    {i + 1}
                  </td>
                  <td className="font-mon h-11 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                    DD/MM/YYYY
                  </td>
                  <td className=" w-64 font-mon h-11 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                    <p className="text-sm font-mon font-medium text-midGreen">
                      Approved
                    </p>
                  </td>
                  <td className="font-mon h-11 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                    Ismail Khan
                  </td>
                  <td className="font-mon h-11 px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
                    jyedtg tif wief wief giwef
                  </td>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </div>
      <div className=" h-6"></div>
      <div className="overflow-x-auto">
        <table
          className="min-w-full divide-y divide-gray-200"
          style={{ tableLayout: "fixed" }}
        >
          <thead className="sticky top-0  bg-offWhiteColor h-14">
            <tr>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor   ">
                PR History
              </th>
              <th className=" font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                PO History
              </th>
              <th className="font-mon px-6 py-3 text-left text-sm font-medium text-blackColor  ">
                RFQ List
              </th>

              {/* Add more header columns as needed */}
            </tr>
          </thead>

          {/* Table rows go here */}

          <tbody className="bg-white divide-y divide-gray-200 ">
            <td className="font-mon bg-orange-50 w-72 px-6 py-3 whitespace-nowrap font-medium">
              <div className="flex flex-col items-start space-y-1 w-72">
                {prHistoryList.map((e, i) => (
                  <div
                    className="flex flex-row items-center space-x-2 w-72"
                    key={i}
                  >
                    <p className="text-sm font-mon font-medium text-blackColor">
                      {e.name}:
                    </p>
                    <p className=" text-sm font-mon font-medium text-blackColor whitespace-normal">
                      {e.value}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mb-4"></p>
            </td>

            <td className="font-mon w-72  px-6 py-3 text-left text-[14px] text-blackColor  whitespace-nowrap">
              <div className=" w-72  ">
                <button className=" w-full flex justify-center  flex-row space-x-1 items-center">
                  <div className=" h-4 w-4 rounded-[2px] bg-borderColor flex justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m6-6H6"
                      />
                    </svg>
                  </div>
                  <p className=" text-xs text-graishColor font-mon font-medium">
                    PO History
                  </p>
                </button>
                <div className=" h-4"></div>
                <div className=" w-full overflow-x-auto">
                  <div className="">
                    <table
                      className="min-w-full divide-y divide-gray-200"
                      style={{ tableLayout: "fixed" }}
                    >
                      <thead className="sticky top-0  bg-lightGreen h-10">
                        <tr>
                          <th className="font-mon px-6 py-1 text-left text-[12px] font-medium text-blackColor  ">
                            PO No
                          </th>
                          <th className=" font-mon px-6 py-1 text-left text-[12px] font-medium text-blackColor  tracking-wider">
                            PO Date
                          </th>
                          <th className="font-mon px-6 py-1 text-left text-[12px] font-medium text-blackColor  tracking-wider">
                            PO Rate
                          </th>

                          {/* Add more header columns as needed */}
                        </tr>
                      </thead>

                      {/* Table rows go here */}
                      {/* Table rows go here */}
                      {poHistory.map((e, i) => (
                        <tbody
                          className="bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                          key={i}
                        >
                          <td className="font-mon h-11 px-6 py-3 text-left text-xs text-blackColor  whitespace-nowrap ">
                            {e.ID}
                          </td>
                          <td className="font-mon h-11 px-6 py-3 text-left text-xs text-blackColor  whitespace-nowrap">
                            {e.Date}
                          </td>
                          <td className=" w-64 font-mon h-11 px-6 py-3 text-left text-xs text-blackColor  whitespace-nowrap">
                            {e.Duration}
                          </td>
                        </tbody>
                      ))}
                    </table>
                  </div>
                </div>
              </div>
            </td>
            <td className=" font-mon  px-6 pb-3  text-left text-[14px] text-blackColor  whitespace-nowrap">
              <div className=" flex flex-row  items-start">
                <div className=" flex items-start flex-col ">
                  {rfqHeaders.map((e, i) => (
                    <div>
                      <div className=" h-10 w-40 flex justify-start px-4 items-center bg-lightGreen">
                        <p className=" text-sm text-blackColor font-mon font-medium">
                          {e}
                        </p>
                      </div>
                      <div className="h-[1px] border border-borderColor"></div>
                    </div>
                  ))}
                </div>
                <div className=" flex flex-row items-start">
                  {loop.map((e, i) => (
                    <div className=" flex items-start flex-col ">
                      {quotations.map((e, i) => (
                        <div>
                          <div className=" h-10 w-72 border-r-[1px] border-borderColor flex justify-start px-4 items-center bg-whiteColor">
                            <p className="whitespace-normal text-sm font-mon  text-blackColor">
                              {e}
                            </p>
                          </div>
                          <div className="h-[1px] border border-borderColor"></div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </td>
          </tbody>
        </table>
      </div>
      <div className=" h-10"></div>
      <div className=" flex flex-row justify-end space-x-6">
        <CommonButton
          onClick={back}
          titleText={"Back"}
          width="w-28"
          height="h-8"
          color="bg-graishColor"
        />
        {/* <CommonButton onClick={submit} titleText={"Submit"} width='w-28' height='h-8' color='bg-midGreen' /> */}
      </div>
      <div className=" h-20"></div>
      <input
        type="checkbox"
        id="my-modal-11"
        className="modal-toggle"
        checked={openClose}
      />
      <div className="modal">
        <div className="modal-box relative w-3/4 overflow-x-hidden max-w-7xl flex flex-col justify-center items-center">
          {/* <label htmlFor="my-modal-11" onClick={(e)=>{setOpenCLose(false); setPicUrl('')}} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label> */}

          <div
            onChange={handleInputChange}
            className="w-full h-96 mx-20  bg-inputBg mt-2 rounded-md shadow-sm focus:outline-none p-8"
          >
            <p className=" text-sm font-mon text-black">{ttt}</p>
          </div>

          <div className="h-6"></div>
          <div className="w-full justify-start items-start">
            <InputLebel titleText={"Special Terms"} />
          </div>
          <div className="h-6"></div>
          {loop.slice(0, 3).map((e, i) => (
            <div className="w-full">
              <div className=" w-full flex flex-row">
                <div className="  w-44 flex justify-center bg-offWhiteColor items-center border-r-[0.2px] border-b-[0.2px]  border-borderColor">
                  <p className=" text-sm text-blackColor font-mon font-medium">
                    Company Name 1
                  </p>
                </div>
                <div className=" flex-1 border-b-[0.2px] border-borderColor flex justify-center items-center">
                  <p className=" pl-4 text-sm text-blackColor font-mon ">
                    Lorem ipsum dolor sit amet consectetur. Ante vivamus potenti
                    purus maecenas eget aliquam arcu. Amet tincidunt arcu morbi
                    luctus nulla.
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className=" h-12"></div>
          <div className=" w-full h-10 flex justify-center items-center flex-row space-x-4">
            <CommonButton
              onClick={cancel}
              titleText={"Cancel"}
              height="h-8"
              width="w-28"
            />
            <CommonButton
              onClick={save}
              titleText={"Save"}
              height="h-8"
              width="w-28"
              color="bg-midGreen"
            />
          </div>
          <div className=" h-12"></div>
        </div>
      </div>
    </div>
  );
}
