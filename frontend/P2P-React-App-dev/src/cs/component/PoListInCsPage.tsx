import React, { useEffect, useState } from "react";
import { useAuth } from "../../login_both/context/AuthContext";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import PoListByCsService from "../service/PoListByCsService";
import PoInterfaceInCs from "../interface/PoInterfaceInCs";
import useCsAndRfqStore from "../../cs_and_rfq/store/csAndRfqStore";
import useCsCreationStore from "../store/CsCreationStore";
import SuccessToast from "../../Alerts_Component/SuccessToast";
import PageTitle from "../../common_component/PageTitle";
import CommonButton from "../../common_component/CommonButton";
import { CSVLink } from "react-csv";
import moment from "moment";
import LogoLoading from "../../Loading_component/LogoLoading";

export default function PoListInCsPage() {
  const { token } = useAuth();

  const { setCsIdInCsAndRfq, csIdInCsAndRfq } = useCsAndRfqStore();
  const { setCsPageNo } = useCsCreationStore();

  const back = () => {
    setCsIdInCsAndRfq(null);
    setCsPageNo(1);
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [poList, setPoList] = useState<PoInterfaceInCs[] | []>([]);

  useEffect(() => {
    getPoList();
  }, []);

  const getPoList = async () => {
    try {
      setIsLoading(true);

      const result = await PoListByCsService(token!, csIdInCsAndRfq!);

      if (result.statusCode === 200) {
        setPoList(result.data.data);

        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      console.log(error);
      showErrorToast("PO Load Failed");
    }
  };

  let fileName = moment(Date()).format("DD/MM/YYYY");
  const headers = [
    { label: "USER_ID", key: "USER_ID" },
    { label: "SUPPLIER_NAME", key: "SUPPLIER_NAME" },
    { label: "PO_NUMBER", key: "PO_NUMBER" },
    { label: "PO_HEADER_ID", key: "PO_HEADER_ID" },
    { label: "PO_DATE", key: "PO_DATE" },
  ];

  return (
    <div className=" m-8 bg-white">
      <SuccessToast />

      <div className=" w-full flex justify-between items-center">
        <PageTitle titleText="PO List" />

        <div className=" flex items-center space-x-4">
          {poList.length === 0 ? null : (
            <CSVLink
              data={poList!}
              headers={headers}
              filename={`po_list_by_cs${fileName}.csv`}
            >
              <div className=" exportToExcel ">Export to Excel</div>
            </CSVLink>
          )}
          <CommonButton
            onClick={back}
            titleText="Back"
            color="bg-midGreen"
            width="w-24"
          />
        </div>
      </div>
      <div className="h-6"></div>
      {isLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : !isLoading && poList.length === 0 ? (
        <div className=" w-full flex justify-center items-center h-96">
          <p className="largeText">Data Not Found</p>
        </div>
      ) : (
        <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg">
            <thead className="bg-[#CAF4FF] sticky top-0 ">
              <tr>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  SL
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  User Id
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Supplier Name
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  PO Number
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  PO Header Id
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  PO Date
                </th>
              </tr>
            </thead>

            {poList.map((e, i) => (
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {i + 1}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                    <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                      {e.USER_ID}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.SUPPLIER_NAME}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.PO_NUMBER}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.PO_HEADER_ID}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {moment(e.PO_DATE).format("DD-MMMM-YYYY")}
                    </div>
                  </td>
                </tr>
              </tbody>
            ))}

            <tfoot className="bg-white sticky bottom-0">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center"></th>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
