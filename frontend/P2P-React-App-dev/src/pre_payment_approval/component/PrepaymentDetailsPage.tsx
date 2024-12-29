import React, { useState } from "react";
import PageTitle from "../../common_component/PageTitle";
import usePrepaymentApprovalStore from "../store/prepaymentApprovalStore";
import CommonButton from "../../common_component/CommonButton";
import WarningModal from "../../common_component/WarningModal";

export default function PrepaymentDetailsPage() {
  const { setPrepaymentApprovalPageNo } = usePrepaymentApprovalStore();

  const back = () => {
    setPrepaymentApprovalPageNo(1);
  };

  const reject = () => {};

  const approve = () => {};

  const [isRejectOpen, setIsRejectOpen] = useState<boolean>(false);
  const openRejectModal = () => {
    setIsRejectOpen(true);
  };
  const rejectModal = () => {
    setIsRejectOpen(false);
  };

  const [isApproveOpen, setIsApproveOpen] = useState<boolean>(false);

  const openApproveModal = () => {
    setIsApproveOpen(true);
  };
  const closeApproveModal = () => {
    setIsApproveOpen(false);
  };

  return (
    <div className=" m-8 bg-white">
      <WarningModal
        isOpen={isRejectOpen}
        closeModal={rejectModal}
        action={reject}
        message="Do you want to reject ?"
      />
      <WarningModal
        isOpen={isApproveOpen}
        closeModal={closeApproveModal}
        action={reject}
        message="Do you want to approve ?"
      />
      <div className=" w-full flex justify-between items-center">
        <PageTitle titleText="Prepayment Details" />
        <CommonButton
          onClick={back}
          titleText="Back"
          color="bg-midGreen"
          width="w-36"
        />
      </div>

      <div className=" my-4 w-full flex justify-between items-start border-[1px] border-borderColor bg-gray-100 rounded-md px-4 py-8">
        {/* column */}
        <div className=" space-y-6">
          <div className=" flex space-x-4">
            <p className=" w-24 text-sm font-mon text-graishColor">
              Supplier Id
            </p>
            <p className=" w-40 text-sm font-mon text-midBlack">Sup0001</p>
          </div>
          <div className=" flex space-x-4">
            <p className=" w-24 text-sm font-mon text-graishColor">
              Supplier Name
            </p>
            <p className=" w-40 text-sm font-mon text-midBlack">
              ABC Incorporation
            </p>
          </div>
        </div>
        {/* column */}
        {/* column */}
        <div className=" space-y-6">
          <div className=" flex space-x-4">
            <p className=" w-24 text-sm font-mon text-graishColor">OU Name</p>
            <p className=" w-40 text-sm font-mon text-midBlack">SCBL Cement</p>
          </div>
          <div className=" flex space-x-4">
            <p className=" w-24 text-sm font-mon text-graishColor">Amount</p>
            <p className=" w-40 text-sm font-mon text-midBlack">1000000 BDT</p>
          </div>
        </div>
        {/* column */}
        {/* column */}
        <div className=" space-y-6">
          <div className=" flex space-x-4">
            <p className=" w-24 text-sm font-mon text-graishColor">
              Create Date
            </p>
            <p className=" w-40 text-sm font-mon text-midBlack">DD/MM/YYYY</p>
          </div>
        </div>
        {/* column */}
      </div>

      <div className=" mt-2 flex space-x-4 items-center">
        <button
          onClick={openRejectModal}
          className=" w-40 flex justify-center items-center border-[1px] border-redColor rounded-md h-8 text-sm font-semibold font-mon text-redColor"
        >
          Reject
        </button>
        <button
          onClick={openApproveModal}
          className=" w-40 flex justify-center items-center bg-midGreen text-white font-mon font-semibold rounded-md h-8 text-sm "
        >
          Approve
        </button>
      </div>
    </div>
  );
}
