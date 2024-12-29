import React, { useState, useEffect } from "react";
import PageTitle from "../../../common_component/PageTitle";
import NavigationPan from "../../../common_component/NavigationPan";
import Popper from "@mui/material/Popper";
import ReusablePopperComponent from "../../../common_component/ReusablePopperComponent";
import ReusablePaginationComponent from "../../../common_component/ReusablePaginationComponent";
import { useRfqCreateProcessContext } from "../../../buyer_rfq_create/context/RfqCreateContext";
import CommonButton from "../../../common_component/CommonButton";
import { useAuth } from "../../../login_both/context/AuthContext";
const pan = ["Home", "Approved PR"];

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export default function ApprovedPrPage() {
  const [limit, setLimit] = useState(5);
  const [pageNo, setPageNo] = useState(1);
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

  //context
  const { page, setPage } = useRfqCreateProcessContext();

  const submitAndNext = () => {
    setPage(2);
  };

  //auth token

  const { loginData, token, setLoginData } = useAuth();

  useEffect(() => {
    // Use the token from the loginData if available
    // const updatedToken = loginData?.token || token;

    // // Set a default message value if it's undefined
    // const updatedMessage = loginData?.message || "Default Message";

    // // Set a default status value if it's undefined
    // const updatedStatus = loginData?.status || 200;  // Change the default value accordingly

    // // Update the context with the token, message, and status only if the token is not null
    // if (updatedToken !== null) {
    //     setLoginData({
    //         ...loginData,
    //         token: updatedToken,
    //         message: updatedMessage,
    //         status: updatedStatus,
    //     });
    // }

    console.log(token);

    // Perform any other initialization based on the token

    // getMenu(); // You can uncomment this line if needed
  }, [loginData?.token, token, setLoginData]);

  return (
    <div className=" m-8  ">
      <div className=" flex flex-col items-start">
        <PageTitle titleText="Approved PR List" />
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className="h-10"></div>

      <div className=" overflow-x-auto">
        <table className=" border-[0.5px] border-gray-200  ">
          <thead className=" bg-[#F4F6F8] shadow-sm h-14">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                SL
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                PR Number
              </th>
              <th className="w-64 px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                Approval Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                Creation Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                Initiator
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-blackColor font-mon   tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className=" divide-y divide-borderColor ">
            {list.slice(0, limit).map((e, index) => {
              return (
                <tr key={index} className="bg-white hover:bg-offWhiteColor">
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    <div className=" flex flex-row space-x-2 items-center">
                      <button className=" h-4 w-4 border-[0.1px] border-borderColor rounded-md"></button>
                      <p>PR098675656</p>
                    </div>
                  </td>
                  <td className="w-64  px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    Supplier Description abc abc abc abc abc abc abc
                  </td>
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    Approved
                  </td>
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    DD/MM/YYYY
                  </td>
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    Sample Name Here
                  </td>
                  <td className="px-6 py-4 text-[14px] text-blackColor font-mon whitespace-nowrap">
                    30000
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="h-14 bg-whiteColor border-t-[1px] border-borderColor">
              <td></td>
              <td>
                <ReusablePopperComponent
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  handleClick={handleClick}
                  setLimit={setLimit}
                  limit={limit}
                />
              </td>
              <td className=" py-3      ">
                <ReusablePaginationComponent
                  pageNo={pageNo}
                  limit={limit}
                  // list={list}
                  previous={previous}
                  next={next}
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className=" h-12"></div>
      <div className=" flex justify-end items-end">
        <CommonButton
          onClick={submitAndNext}
          titleText={"Continue"}
          height="h-8"
          width="w-36"
          color="bg-midGreen"
        />
      </div>

      <div className=" h-20"></div>
    </div>
  );
}
