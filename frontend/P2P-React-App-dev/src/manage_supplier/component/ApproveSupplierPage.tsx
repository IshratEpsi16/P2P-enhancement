import React from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import { useManageSupplierContext } from "../interface/ManageSupplierContext";
import CommonButton from "../../common_component/CommonButton";
import { Accordion } from "keep-react";
import { CaretDown, CaretUp } from "phosphor-react";
const pan = ["Home", "Suppliers", "Approve Supplier"];
export default function ApproveSupplierPage() {
  const { setManageSupplierPageNo } = useManageSupplierContext();
  const back = () => {
    setManageSupplierPageNo(1);
  };

  const cancel = () => {};

  const additionalInfo = () => {};

  const approve = () => {};

  return (
    <div className=" m-8">
      <div className=" flex justify-between items-center">
        <div className=" flex flex-col items-start">
          <PageTitle titleText="Approve Supplier" />
          {/* <NavigationPan list={pan} /> */}
        </div>
        <CommonButton
          onClick={back}
          titleText="Back"
          width="w-24"
          height="h-8"
          color="bg-midGreen"
        />
      </div>
      <div className="h-4"></div>
      <p className=" mediumText mb-2">
        Approve Mostafizur Rahman Registration Request
      </p>
      <p className=" smallText">Username: Mostafizur Rahman</p>
      <p className=" smallText">Mail: mostafizur@gmail.com</p>
      <div className="h-4"></div>
      <p className=" mediumText mb-4">Approve Process</p>
      <div className=" w-full px-8 h-40 bg-inputBg ring-[0.2px] ring-borderColor rounded-sm justify-start items-center flex">
        <ul className="steps  steps-horizontal w-full">
          <li className="step step-primary extraSmallText ">
            Register Request
          </li>
          <li className="step step-primary extraSmallText">
            Admin View the request
          </li>
          <li className="step extraSmallText ">
            Admin request for more documents
          </li>
          <li className="step extraSmallText">
            Admin Approved (New ID Created for Supplier)
          </li>
        </ul>
      </div>
      <div className="h-4"></div>
      <Accordion
        openIcon={<CaretUp />}
        closeIcon={<CaretDown />}
        iconPosition="right"
        flush={true}
      >
        <Accordion.Panel>
          <Accordion.Title>
            <p className=" largeText">Basic Info</p>
          </Accordion.Title>
          <Accordion.Content>
            <div className=" w-full flex space-x-4 items-center mb-2">
              <p className=" w-44 smallText">Name of Organization</p>
              <p className=" flex-1 smallText">Sample Name Here</p>
            </div>
            <div className=" w-full flex space-x-4 items-center mb-2">
              <p className=" w-44 smallText">Address</p>
              <p className=" flex-1 smallText">
                4517 Washington Ave. Manchester, Kentucky 39495
              </p>
            </div>
            <div className=" w-full flex space-x-4 items-center mb-2">
              <p className=" w-44 smallText">Incorporated in</p>
              <p className=" flex-1 smallText">Bangladesh</p>
            </div>
            <div className=" w-full flex space-x-4 items-center mb-2">
              <p className=" w-44 smallText">Item Category</p>
              <p className=" flex-1 smallText"></p>
            </div>
            <div className=" w-full flex space-x-4 items-center mb-2">
              <p className=" w-44 smallText">Type of Organization</p>
              <p className=" flex-1 smallText">Proprietorship</p>
            </div>
          </Accordion.Content>
        </Accordion.Panel>

        <Accordion.Panel>
          <Accordion.Title>
            <p className=" largeText">Important Documents</p>
          </Accordion.Title>
          <Accordion.Content>
            <div className=" w-full flex space-x-4 items-center mb-2">
              <p className=" w-44 smallText">
                Trade License/Export License Number
              </p>
              <p className=" flex-1 smallText">Sample Name Here</p>
            </div>
            <div className=" w-full flex space-x-4 items-center mb-2">
              <p className=" w-44 smallText">
                Trade License/Export License File
              </p>
              <p className=" flex-1 smallText">
                4517 Washington Ave. Manchester, Kentucky 39495
              </p>
            </div>
            <div className=" w-full flex space-x-4 items-center mb-2">
              <p className=" w-44 smallText">
                Trade License/Export License Start Date
              </p>
              <p className=" flex-1 smallText">Bangladesh</p>
            </div>
            <div className=" w-full flex space-x-4 items-center mb-2">
              <p className=" w-44 smallText">
                Trade License/Export License Number End date
              </p>
              <p className=" flex-1 smallText"></p>
            </div>
            <div className=" w-full flex space-x-4 items-center mb-2">
              <p className=" w-44 smallText">E-TIN Number</p>
              <p className=" flex-1 smallText">Proprietorship</p>
            </div>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>
            <p className=" largeText">Deceleration they agreed with</p>
          </Accordion.Title>
          <Accordion.Content>
            <div className=" w-full flex space-x-4 items-start mb-2">
              <p className=" w-44 smallText">Declaration</p>
              <div className=" flex-1 smallText">
                <p className=" smallText mb-4">
                  We hereby certify that all of the information stated herein,
                  and the documents furnished are true, correct, and complete.
                  Further, we acknowledge that the relationship between us and
                  SCBL in connection with selling of our products/services to
                  SCBL will be governed by the purchase contract(s) to be
                  entered into between the parties.
                </p>
                <p className=" smallText">
                  We hereby confirm that our company is owned by following
                  persons and not related directly/ indirectly by any Director
                  or staff members of your company.{" "}
                </p>
              </div>
            </div>
            <p className="smallText mb-2">Owner</p>
            <div className=" w-full flex space-x-4 items-center mb-2">
              <p className=" w-44 smallText">Signature with Date & Seal </p>
              <p className=" flex-1 smallText">pdf00006.pdf</p>
            </div>
            <div className=" w-full flex space-x-4 items-center mb-2">
              <p className=" w-44 smallText">Company Seal</p>
              <p className=" flex-1 smallText">pdf00007.pdf</p>
            </div>
            <div className=" w-full flex space-x-4 items-center mb-2">
              <p className=" w-44 smallText">Name of Signatory</p>
              <p className=" flex-1 smallText">Rifat Rahman</p>
            </div>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>
            <p className=" largeText">Contact Persons</p>
          </Accordion.Title>
          <Accordion.Content>
            <p>
              Yes, the Notification component in the Keep React allows you to
              include extra content alongside the primary message. The
              additionalContent prop can be used to display supplementary
              information, such as buttons, links, or icons, within the
              notification to provide users with more context and options.
            </p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>
            <p className=" largeText">Site Creation</p>
          </Accordion.Title>
          <Accordion.Content>
            <p>
              Yes, the Notification component in the Keep React allows you to
              include extra content alongside the primary message. The
              additionalContent prop can be used to display supplementary
              information, such as buttons, links, or icons, within the
              notification to provide users with more context and options.
            </p>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title>
            <p className=" largeText">Bank Details</p>
          </Accordion.Title>
          <Accordion.Content>
            <p>
              Yes, the Notification component in the Keep React allows you to
              include extra content alongside the primary message. The
              additionalContent prop can be used to display supplementary
              information, such as buttons, links, or icons, within the
              notification to provide users with more context and options.
            </p>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
      <div className="h-20"></div>
      <div className=" flex w-full space-x-4">
        <button onClick={cancel} className=" w-48 denyButton">
          Deny
        </button>
        <CommonButton
          titleText="Request Additional Info"
          width="w-48"
          height="h-10"
          onClick={additionalInfo}
        />
        <CommonButton
          titleText="Approve"
          width="w-48"
          height="h-10"
          color="bg-midGreen"
          onClick={approve}
        />
      </div>
      <div className="h-20"></div>
    </div>
  );
}
