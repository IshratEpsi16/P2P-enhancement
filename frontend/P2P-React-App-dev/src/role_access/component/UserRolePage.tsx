import React, { useRef, useState, useEffect } from "react";
import { useRoleAccessContext } from "../context/RoleAccessContext";
import ReusablePopperComponent from "../../common_component/ReusablePopperComponent";
import ReusablePaginationComponent from "../../common_component/ReusablePaginationComponent";

import CommonSearchField from "../../common_component/CommonSearchField";
import NavigationPan from "../../common_component/NavigationPan";
import PageTitle from "../../common_component/PageTitle";
import DropDown from "../../common_component/DropDown";
import {
  UserRoleListInterface,
  UserRoleData,
} from "../interface/UserRoleListInterface";
import UserRoleListService from "../service/UserRoleListService";
import { useAuth } from "../../login_both/context/AuthContext";
import TableSkeletonLoader from "../../Loading_component/skeleton_loader/TableSkeletonLoader";
import NoDataFound from "../../utils/methods/component/NoDataFound";
import { CSVLink } from "react-csv";
import moment from "moment";
import LogoLoading from "../../Loading_component/LogoLoading";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import userRoleStore from "../store/userRoleStore";
const pan = ["Home", "User Roles"];

const options = [
  { value: "", label: "ALL" },
  { value: "buyer", label: "Buyer" },
  { value: "supplier", label: "Supplier" },
  { value: "admin", label: "Admin" },
];
const role = ["Buyer", "Viewer", "Auditor"];

export default function UserRolePage() {
  const { roleAccessPageNo, setRoleAccessPageNo, setUserId } =
    useRoleAccessContext();
  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(5);
  const [pageNo2, setPageNo2] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(0);
  const rfqSearchRef = useRef<HTMLInputElement | null>(null);
  const [searchKey, setSearchKey] = useState<string>("");
  const [userRoleList, setUserRoleList] = useState<UserRoleData[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roleData, setRoleData] = useState<UserRoleListInterface | null>(null);
  const [selectedDropDown, setSelectedDropDown] = useState<string>("");

  const { token, setSupplierId } = useAuth();

  useEffect(() => {
    getData(offset, limit);
  }, []);

  const dividePage = (number: number, lmt: number) => {
    console.log(number);
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }

    const re = Math.ceil(number / lmt);

    setTotal(re);
  };

  const getData = async (offs: number, lmt: number) => {
    setIsLoading(true);
    // console.log(`pre limit: ${limit}`);
    // console.log(`pre offset: ${offs}`);

    const result = await UserRoleListService(token!, offs, lmt, searchKey);
    console.log(result.data);

    if (result.data.status === 200) {
      setRoleData(result.data);
      setUserRoleList(result.data.data);
      console.log(result.data.data);
      // setPreLimit(limit);
      // setPreOffSet(offs + limit);
      console.log("total: ", result.data.total);

      dividePage(result.data.total, limit);
      setIsLoading(false);
    } else {
      console.log("fetch failed");
    }
  };

  //drop
  const handleSelect = (value: string) => {
    console.log(`Selected: ${value}`);
    setSearchKey(value);
    setSelectedDropDown(value);
    getData(0, 5);
    // Do something with the selected value
  };
  //drop

  //search

  const handleSearchValChange = (val: string) => {
    setSearchKey(val);
  };
  //search

  //pagination

  const search = async () => {
    if (pageNo2 !== 1) {
      setPageNo2(1);
    }
    getData(0, 5);
  };

  //store

  const { setSelectedUserRole } = userRoleStore();

  const navigateToItem = (uId: number, sData: UserRoleData) => {
    setRoleAccessPageNo(2);
    setUserId(uId);
    setSupplierId(uId);
    setSelectedUserRole(sData);
  };

  //csv header
  let fileName = moment(Date()).format("DD/MM/YYYY");
  const headers = [
    { label: "SUPPLIER ID", key: "SUPPLIER_ID" },
    { label: "USER NAME", key: "USER_NAME" },
    { label: "EMPLOYEE NAME", key: "FULL_NAME" },
    { label: "USER TYPE", key: "USER_TYPE" },
    { label: "ROLE NAMES", key: "ROLE_NAMES" },
  ];

  //pagination

  const renderPageNumbers = () => {
    const totalPages = total ?? 0;
    const pageWindow = 5;
    const halfWindow = Math.floor(pageWindow / 2);
    let startPage = Math.max(1, pageNo2 - halfWindow);
    let endPage = Math.min(totalPages, startPage + pageWindow - 1);

    if (endPage - startPage + 1 < pageWindow) {
      startPage = Math.max(1, endPage - pageWindow + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => {
            setPageNo2(i);
            setOffSet((i - 1) * limit);
            getData((i - 1) * limit, limit);
          }}
          className={`w-6 h-6 text-[12px] border rounded-md ${
            pageNo2 === i ? "border-sky-400" : "border-transparent"
          }`}
          disabled={pageNo2 === i}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const next = async () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNo2((pre) => pre + 1);
    console.log(limit);
    // getHistory("", "", newOff, limit);
    getData(newOff, limit);
  };

  const previous = async () => {
    let newOff = offset - limit;
    console.log(newOff);
    if (newOff < 0) {
      newOff = 0;
      console.log(newOff);
    }

    setOffSet(newOff);
    setPageNo2((pre) => pre - 1);
    console.log(limit);

    // getHistory("", "", newOff, limit);
    getData(newOff, limit);
  };

  //pagination

  return (
    <div className=" m-8 bg-white">
      <div className=" flex flex-col items-start">
        <PageTitle titleText="User Roles" />
        {/* <NavigationPan list={pan} /> */}
      </div>

      {isLoading ? (
        <LogoLoading />
      ) : (
        <>
          <div className="h-4"></div>
          <div className=" flex flex-row justify-between items-center">
            <div className="w-1/2  flex flex-row space-x-4 items-center">
              <DropDown
                options={options}
                onSelect={handleSelect}
                width="w-60"
                sval={selectedDropDown}
              />
              <CommonSearchField
                onChangeData={handleSearchValChange}
                search={search}
                placeholder="Search Here"
                inputRef={rfqSearchRef}
                width="w-60"
              />
              {/* <DateRangePicker

                        placeholder='Date From - To'
                        value={rfqDates} onChange={handleRfqDateChange}

                    /> */}
            </div>
            {userRoleList.length === 0 ? null : (
              <CSVLink
                data={userRoleList!}
                headers={headers}
                filename={`user_role_list_${fileName}.csv`}
              >
                <div className=" exportToExcel">Export To Excel</div>
              </CSVLink>
            )}
          </div>
          <div className=" h-6"></div>
          {!isLoading && userRoleList?.length === 0 ? (
            <NoDataFound />
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
                        Supplier ID
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        User Name
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Full Name
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                        Role
                      </th>
                    </tr>
                  </thead>

                  {userRoleList.map((e, i) => (
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr
                        onClick={() => {
                          navigateToItem(e.USER_ID, e);
                        }}
                        className="cursor-pointer bg-white divide-y divide-gray-200 hover:bg-[#F4F6F8]"
                        key={e.USER_ID}
                      >
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {/* {pageNo === 1 ? pageNo + i : offset + 1 + i} */}
                            {i + 1}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                          <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                            {e.SUPPLIER_ID ? e.SUPPLIER_ID : "---"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {e.USER_NAME ? e.USER_NAME : "---"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {e.FULL_NAME ? e.FULL_NAME : "---"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {e.USER_TYPE ? e.USER_TYPE : "---"}
                          </div>
                        </td>
                        <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                          <div className="w-full overflow-auto custom-scrollbar text-center">
                            {e.ROLE_NAMES ? e.ROLE_NAMES : "---"}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  ))}

                  <tfoot className=" bg-offWhiteColor sticky bottom-0 ">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center">
                        {pageNo2 !== 1 && (
                          <button
                            // disabled={pageNo === 1 ? true : false}
                            onClick={previous}
                            className=" px-4 py-2 rounded-md flex space-x-2 items-center border-[0.5px] border-borderColor "
                            style={{
                              boxShadow:
                                "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                            }}
                          >
                            <div className="w-4 h-4 ">
                              <ArrowLeftIcon className=" w-full h-full " />
                            </div>
                            <p className=" text-[12px] font-mon">Previous</p>
                          </button>
                        )}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking- ">
                        {renderPageNumbers()}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center">
                        {pageNo2 !== total && (
                          <button
                            // disabled={pageNo === total ? true : false}
                            onClick={next}
                            className=" px-4 py-2 rounded-md flex space-x-2 items-center shadow-md border-[0.5px] border-borderColor "
                            style={{
                              boxShadow:
                                "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                            }}
                          >
                            <p className=" text-[12px] font-mon">Next</p>
                            <div className="w-4 h-4 ">
                              <ArrowRightIcon className=" w-full h-full " />
                            </div>
                          </button>
                        )}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}
        </>
      )}
      <div className="h-20"></div>
    </div>
  );
}
