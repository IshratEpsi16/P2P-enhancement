import React from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import CommonButton from "../../common_component/CommonButton";
const pan = ["Home", "RFQ Unlocking"];
const list = [1, 2, 3];
export default function RfqUnlockPage() {
  const unlock = () => {};
  return (
    <div className="m-8">
      <div className=" flex flex-col items-start">
        <PageTitle titleText="RFQ Unlocking" />
        {/* <NavigationPan list={pan} /> */}
      </div>
      <div className="h-10"></div>
      <div className=" flex flex-col items-start space-y-2">
        <h1 className=" text-sm text-blackColor font-mon font-medium">
          RFQ Description
        </h1>
        <div className=" flex flex-row items-center space-x-4 ">
          <p className=" text-blackishColor text-sm font-mon">RFQ No:</p>
          <p className=" text-blackColor text-sm font-mon font-medium">
            REF09685723
          </p>
        </div>
        <div className=" flex flex-row items-center space-x-4 ">
          <p className=" text-blackishColor text-sm font-mon">Publish Date:</p>
          <p className=" text-blackColor text-sm font-mon font-medium">
            12/12/2022
          </p>
        </div>
        <div className=" flex flex-row items-center space-x-4 ">
          <p className=" text-blackishColor text-sm font-mon">Close Date:</p>
          <p className=" text-blackColor text-sm font-mon font-medium">
            17/12/2022
          </p>
        </div>
      </div>
      <div className=" h-5"></div>
      <div className=" flex flex-row space-x-6 items-start">
        <div className="  py-14">
          <div className=" flex flex-col items-center">
            <div className=" h-6 w-6 bg-midGreen rounded-full"></div>
            {/* jodi ekjon vot dey taile sudhu ay round dekhabo loop ghurbe na */}
            {
              list.slice(0, 2).map((e, i) => (
                <div className=" flex flex-col items-center">
                  <div className=" h-32 w-[1px] bg-midGreen"></div>
                  <div className=" h-6 w-6 bg-midGreen rounded-full"></div>
                </div>
              ))

              //vote list er chaite ay loop 1 bar kom ghurbe
            }
            <div className=" flex flex-col items-center">
              <div className=" h-32 w-[1px] bg-graishColor"></div>
              <div className=" h-6 w-6 bg-graishColor rounded-full"></div>
              {/* heirarchy te sobar vote hoya gele aitai hide hbe */}
            </div>
          </div>
        </div>
        <div className=" flex flex-col items-start space-y-3">
          {list.map((e, i) => (
            <div className=" w-96 bg-skyBlue rounded-md border-[0.5px] border-borderColor p-4 flex flex-col items-start space-y-1">
              <p className=" text-xs font-mon text-blackColor">
                Sabbir Mahmud has unlocked at 2:16 PM
              </p>
              <div className="h-1"></div>
              <p className="text-xs font-mon text-blackColor font-medium">
                Sabbir Mahmud
              </p>
              <p className="text-xs font-mon text-blackColor ">Designation</p>
              <p className="text-xs font-mon text-blackColor ">Department</p>
              <p className="text-xs font-mon text-blackColor ">Time: 2:16 pm</p>
            </div>
          ))}
          <div className=" h-36 w-96 bg-whiteColor border-[0.5px] rounded-md border-borderColor flex justify-center items-center">
            <div className=" flex flex-row space-x-6 items-center">
              <p className="text-xs font-mon text-blackColor font-medium">
                Do you want to unlock the RFQ?
              </p>
              <CommonButton
                onClick={unlock}
                titleText={"Unlock"}
                height="h-8"
                width="w-20"
                color="bg-blue-500"
              />
            </div>
            {/* heirarchy te sobar vote hoya gele aitai hide hbe */}
          </div>
        </div>
      </div>
      <div className=" h-20"></div>
    </div>
  );
}
