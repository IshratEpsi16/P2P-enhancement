import React from "react";

export default function MaintananceModePage() {
  return (
    <div className="bg-white m-8 flex justify-center items-center  h-full   ">
      <div className="flex space-y-10 items-center flex-col">
        <img src="/images/logo.png" alt="logo" className="w-60 h-60" />
        <div className="flex flex-col justify-center items-center">
          <p className="text-midBlack text-2xl font-mon font-bold">
            We're under maintenance!
          </p>
          {/* <p className="text-midBlack text-lg font-mon font-bold">
            
          </p> */}
          <div className="h-3"></div>
          <p className="text-midBlack text-lg font-mon font-medium">
            Our website is currently undergoing schedule maintenance.
          </p>
          <p className="text-midBlack text-lg font-mon font-medium">
            We will be back soon! Thank you for being patient.
          </p>
          <p className="text-midBlack text-lg font-mon font-medium">
            Contact us for more information.
          </p>
        </div>
      </div>
    </div>
  );
}
