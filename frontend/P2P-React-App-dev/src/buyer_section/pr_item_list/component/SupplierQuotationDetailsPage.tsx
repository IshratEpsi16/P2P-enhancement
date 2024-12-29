import { useEffect, useState } from "react";
import { useRfqCreateProcessContext } from "../../../buyer_rfq_create/context/RfqCreateContext";
import CommonButton from "../../../common_component/CommonButton";
import PageTitle from "../../../common_component/PageTitle";
import usePrItemsStore from "../../pr/store/prItemStore";
import RfiSupplierInterface from "../../../rfi_in_supplier_registration/interface/RfiSupplierInterface";
import { useAuth } from "../../../login_both/context/AuthContext";
import RfqInterfaceInPreparation from "../interface/RfqinterfaceInPreparation";
import SupplierQuotationListService from "../service/SupplierQuotationListService";
import SupplierQuotationDetailsService from "../service/SupplierQuotationDetailsService";
import SupplierQuotationDetailsInterface from "../interface/SupplierQuotationDetailsInterface";
import moment from "moment";
import LogoLoading from "../../../Loading_component/LogoLoading";

export default function SupplierQuotationDetailsPage() {
  const { page, setPage } = useRfqCreateProcessContext();

  // store
  const { setRfqIdInStore, rfqIdInStore, setUserIdInStore, userIdInStore } =
    usePrItemsStore();
  // store

  const { token, userId, setSupplierId } = useAuth();

  const [quotationList, setQuotationList] = useState<
    SupplierQuotationDetailsInterface[] | []
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log("rfqId: ", rfqIdInStore);
    console.log("userId: ", userIdInStore);

    getSupplierDetails();
  }, []);

  const getSupplierDetails = async () => {
    setIsLoading(true);

    const result = await SupplierQuotationDetailsService(
      token!,
      rfqIdInStore,
      userIdInStore,
      0,
      1000
    );

    console.log(result.data.line_items);
    if (result.data.status === 200) {
      setQuotationList(result.data.line_items);
    }
    setIsLoading(false);
  };

  const navigateTo = (rfqId: number, userId: number) => {
    console.log(rfqId);
  };

  const back = () => {
    setPage(7);
  };

  return (
    <div className="mx-8 my-2">
      <div className="h-4"></div>
      <div className=" w-full flex items-center justify-between">
        <div className=" flex flex-col items-start">
          <PageTitle titleText="RFQ Quotation Details" />
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
          {quotationList.length === 0 ? (
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
                        Expected Quantity
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Offered Quantity
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Tolerance
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Unit Price
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Freight Charge Amount
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Expected Brand Name
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Expected Origin
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        UOM
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Creation Date
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Need By Date
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Promise Date
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Available Brand Name
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Available Origin
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Available Specs
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        LCM Enable Flag
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Warranty Ask By Buyer
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Warranty By Supplier
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Buyer Vat Applicable
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Supplier Vat Applicable
                      </th>
                      <th className=" font-mon px-6 py-3 text-left text-sm font-semibold text-blackColor  whitespace-nowrap">
                        Warranty Details
                      </th>

                      {/* Add more header columns as needed */}
                    </tr>
                  </thead>

                  <tbody>
                    {quotationList.map((supplier, index) => (
                      <tr
                        onClick={() => {
                          navigateTo(supplier.RFQ_ID, supplier.USER_ID);
                        }}
                        className={` ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-100"
                        } divide-y divide-gray-200`}
                        key={index}
                      >
                        <td className="font-mon h-12 px-6 py-3 text-left text-[14px] text-blackColor font-medium">
                          {index + 1}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.EXPECTED_QUANTITY === null
                            ? "---"
                            : supplier.EXPECTED_QUANTITY}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.OFFERED_QUANTITY === null
                            ? "---"
                            : supplier.OFFERED_QUANTITY}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.TOLERANCE === "" ? (
                            "---"
                          ) : (
                            <p>{supplier.TOLERANCE}%</p>
                          )}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.UNIT_PRICE === ""
                            ? "---"
                            : supplier.UNIT_PRICE}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.FREIGHT_CHARGE === ""
                            ? "---"
                            : supplier.FREIGHT_CHARGE}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.EXPECTED_BRAND_NAME === ""
                            ? "---"
                            : supplier.EXPECTED_BRAND_NAME}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.EXPECTED_ORIGIN === ""
                            ? "---"
                            : supplier.EXPECTED_ORIGIN}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.UNIT_MEAS_LOOKUP_CODE === ""
                            ? "---"
                            : supplier.UNIT_MEAS_LOOKUP_CODE}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.CREATION_DATE === ""
                            ? "---"
                            : moment(supplier.CREATION_DATE).format(
                                "DD-MMM-YYYY"
                              )}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.NEED_BY_DATE === ""
                            ? "---"
                            : moment(supplier.NEED_BY_DATE).format(
                                "DD-MMM-YYYY"
                              )}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.PROMISE_DATE === ""
                            ? "---"
                            : moment(supplier.PROMISE_DATE).format(
                                "DD-MMM-YYYY"
                              )}
                        </td>

                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.AVAILABLE_BRAND_NAME === ""
                            ? "---"
                            : supplier.AVAILABLE_BRAND_NAME}
                        </td>

                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.COUNTRY_NAME === ""
                            ? "---"
                            : supplier.COUNTRY_NAME}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.AVAILABLE_SPECS === ""
                            ? "---"
                            : supplier.AVAILABLE_SPECS}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.LCM_ENABLE_FLAG === "Y" ? (
                            <div
                              className={` h-4 w-4 rounded-md border-none bg-midGreen flex justify-center items-center`}
                            >
                              <img
                                src="/images/check.png"
                                alt="check"
                                className=" w-2 h-2"
                              />
                            </div>
                          ) : (
                            <div
                              className={` h-4 w-4  rounded-md border-[0.1px] border-borderColor bg-white flex justify-center items-center`}
                            >
                              <img
                                src="/images/check.png"
                                alt="check"
                                className=" w-2 h-2"
                              />
                            </div>
                          )}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.WARRANTY_ASK_BY_BUYER === "Y" ? (
                            <div
                              className={` h-4 w-4 rounded-md border-none bg-midGreen flex justify-center items-center`}
                            >
                              <img
                                src="/images/check.png"
                                alt="check"
                                className=" w-2 h-2"
                              />
                            </div>
                          ) : (
                            <div
                              className={` h-4 w-4  rounded-md border-[0.1px] border-borderColor bg-white flex justify-center items-center`}
                            >
                              <img
                                src="/images/check.png"
                                alt="check"
                                className=" w-2 h-2"
                              />
                            </div>
                          )}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.WARRANTY_BY_SUPPLIER === "Y" ? (
                            <div
                              className={` h-4 w-4 rounded-md border-none bg-midGreen flex justify-center items-center`}
                            >
                              <img
                                src="/images/check.png"
                                alt="check"
                                className=" w-2 h-2"
                              />
                            </div>
                          ) : (
                            <div
                              className={` h-4 w-4  rounded-md border-[0.1px] border-borderColor bg-white flex justify-center items-center`}
                            >
                              <img
                                src="/images/check.png"
                                alt="check"
                                className=" w-2 h-2"
                              />
                            </div>
                          )}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.BUYER_VAT_APPLICABLE === "Y" ? (
                            <div
                              className={` h-4 w-4 rounded-md border-none bg-midGreen flex justify-center items-center`}
                            >
                              <img
                                src="/images/check.png"
                                alt="check"
                                className=" w-2 h-2"
                              />
                            </div>
                          ) : (
                            <div
                              className={` h-4 w-4  rounded-md border-[0.1px] border-borderColor bg-white flex justify-center items-center`}
                            >
                              <img
                                src="/images/check.png"
                                alt="check"
                                className=" w-2 h-2"
                              />
                            </div>
                          )}
                        </td>
                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.SUPPLIER_VAT_APPLICABLE === "Y" ? (
                            <div
                              className={` h-4 w-4 rounded-md border-none bg-midGreen flex justify-center items-center`}
                            >
                              <img
                                src="/images/check.png"
                                alt="check"
                                className=" w-2 h-2"
                              />
                            </div>
                          ) : (
                            <div
                              className={` h-4 w-4  rounded-md border-[0.1px] border-borderColor bg-white flex justify-center items-center`}
                            >
                              <img
                                src="/images/check.png"
                                alt="check"
                                className=" w-2 h-2"
                              />
                            </div>
                          )}
                        </td>

                        <td className="font-mon h-12 px-6 py-3 text-center text-[14px] text-blackColor">
                          {supplier.SUPPLIER_WARRANTY_DETAILS === ""
                            ? "---"
                            : supplier.SUPPLIER_WARRANTY_DETAILS}
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
