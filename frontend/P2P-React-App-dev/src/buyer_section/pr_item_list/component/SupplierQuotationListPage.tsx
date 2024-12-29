import { useEffect, useState } from "react";
import { useRfqCreateProcessContext } from "../../../buyer_rfq_create/context/RfqCreateContext";
import CommonButton from "../../../common_component/CommonButton";
import PageTitle from "../../../common_component/PageTitle";
import usePrItemsStore from "../../pr/store/prItemStore";
import RfiSupplierInterface from "../../../rfi_in_supplier_registration/interface/RfiSupplierInterface";
import { useAuth } from "../../../login_both/context/AuthContext";
import RfqInterfaceInPreparation from "../interface/RfqinterfaceInPreparation";
import SupplierQuotationListService from "../service/SupplierQuotationListService";
import LogoLoading from "../../../Loading_component/LogoLoading";
import isoToDateTime from "../../../utils/methods/isoToDateTime";
import fetchFileUrlService from "../../../common_service/fetchFileUrlService";

export default function SupplierQuotationListPage() {
  const { page, setPage } = useRfqCreateProcessContext();

  // store
  const { setRfqIdInStore, rfqIdInStore, setUserIdInStore, closeDateInStore } =
    usePrItemsStore();
  // store

  const { token, userId, setSupplierId } = useAuth();

  const [supplierList, setSupplierList] = useState<
    RfqInterfaceInPreparation[] | []
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profilePicOnePath, setProfilePicOnePath] = useState<string>("");
  const [profilePicTwoPath, setProfilePicTwoPath] = useState<string>("");

  useEffect(() => {
    console.log("rfqId: ", rfqIdInStore);
    console.log("closeDate: ", closeDateInStore);

    getSupplierList();
  }, []);

  const getSupplierList = async () => {
    setIsLoading(true);

    const result = await SupplierQuotationListService(
      token!,
      rfqIdInStore,
      0,
      1000
    );

    console.log(result.data.supplier_list);
    if (result.data.status === 200) {
      setProfilePicOnePath(result.data.profile_pic1_file_path);
      setProfilePicTwoPath(result.data.profile_pic2_file_path);
      setSupplierList(result.data.supplier_list);
    }
    setIsLoading(false);
  };

  const navigateTo = (rfqId: number, userId: number) => {
    console.log(rfqId);

    const currentDate = new Date();
    const closeDateTime = new Date(closeDateInStore);

    console.log("Current Date:", currentDate);
    console.log("Close Date:", closeDateTime);

    if (currentDate > closeDateTime) {
      console.log("The RFQ has closed.");
      setUserIdInStore(userId);
      setPage(8);
    } else {
      console.log("Navigation not allowed. The RFQ is still open.");
    }

    // setUserIdInStore(userId);
    // setPage(8);
  };

  const back = () => {
    setPage(1);
  };

  interface ImageUrls {
    [key: number]: string | null;
  }

  const [imageUrls, setImageUrls] = useState<ImageUrls>({});

  // ... other state and functions

  const getImage2 = async (
    filePath: string,
    fileName: string
  ): Promise<string | null> => {
    try {
      const url = await fetchFileUrlService(filePath, fileName, token!);
      return url;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  useEffect(() => {
    if (supplierList) {
      const fetchImages = async () => {
        const newImageUrls: ImageUrls = {};
        for (let index = 0; index < supplierList.length; index++) {
          const element = supplierList[index];
          const url = await getImage2(
            profilePicOnePath,
            element.PROFILE_PIC1_FILE_NAME
          );
          newImageUrls[element.USER_ID] = url;
        }
        setImageUrls(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [supplierList, profilePicOnePath]);

  return (
    <div className="mx-8 my-2">
      <div className="h-4"></div>
      <div className=" w-full flex items-center justify-between">
        <div className=" flex flex-col items-start">
          <PageTitle titleText="Supplier List" />
        </div>

        <CommonButton
          onClick={back}
          titleText="Back"
          width="w-24"
          color="bg-midGreen"
        />
      </div>

      <div className="h-10"></div>

      {isLoading ? (
        <LogoLoading />
      ) : (
        <>
          {supplierList.length === 0 ? (
            <div>
              <div className="h-12"></div>
              <div className=" w-full flex justify-center items-center">
                <img
                  src="/images/NoDataNew.png"
                  alt="nodata"
                  className=" w-[450px] h-[450px]"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table
                  className="min-w-full divide-y divide-gray-200 border-[0.2px] border-borderColor rounded-md"
                  style={{ tableLayout: "fixed" }}
                >
                  <thead className="sticky top-0 bg-[#F4F6F8] h-14">
                    <tr>
                      <th className="font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  ">
                        SL
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Profile Pic
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Organization Name
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Response Status
                      </th>
                      {/* Add more header columns as needed */}
                    </tr>
                  </thead>

                  <tbody>
                    {supplierList.map((supplier, index) => (
                      <tr
                        onClick={() => {
                          navigateTo(supplier.RFQ_ID, supplier.USER_ID);
                        }}
                        className={`cursor-pointer ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-100"
                        } divide-y divide-gray-200`}
                        key={index}
                      >
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                          {index + 1}
                        </td>
                        <td className="font-mon h-12 px-6 py-1 flex items-center text-left text-[14px] text-blackColor">
                          {/* {supplier.PROFILE_PIC1_FILE_NAME !== "N/A" && (
                            <img
                              src={`${profilePicOnePath}/${supplier.PROFILE_PIC1_FILE_NAME}`}
                              alt="avatar"
                              className="h-10 w-10 rounded-full bg-cover"
                            />
                          )} */}
                          <div className="w-full h-full flex items-center overflow-auto custom-scrollbar text-center">
                            {supplier.PROFILE_PIC1_FILE_NAME === "" ? (
                              <div className="w-9 h-9 rounded-full border-[1px] border-gray-400 flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-5 h-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-9 h-9 flex items-center justify-center border-[1px] border-gray-300 rounded-full">
                                <img
                                  // src={`${profilePicOnePath}/${supplier.PROFILE_PIC1_FILE_NAME}`}
                                  src={imageUrls[supplier.USER_ID]!}
                                  alt="avatar"
                                  className="h-8 w-8 rounded-full bg-cover"
                                />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {supplier.ORGANIZATION_NAME === ""
                            ? "N/A"
                            : supplier.ORGANIZATION_NAME}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor">
                          {supplier.RESPONSE_STATUS === 0
                            ? "Unopened"
                            : supplier.RESPONSE_STATUS === 1
                            ? "Accepted"
                            : supplier.RESPONSE_STATUS === 2
                            ? "Viewed"
                            : supplier.RESPONSE_STATUS === 3
                            ? "Rejected"
                            : supplier.RESPONSE_STATUS === 4
                            ? "Submitted"
                            : supplier.RESPONSE_STATUS === 5
                            ? "Saved"
                            : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
