import React from "react";

export default function NotFoundPage() {
  return (
    <div className=" w-full h-screen flex justify-center items-center">
      {/* <img
        src="/images/NoDataNew.png"
        alt="not-found"
        className=" w-1/2 h-1/2"
      /> */}


      <svg xmlns="http://www.w3.org/2000/svg" height='30px' width='30px' viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" /></svg>
      <h1 className=" text-black font-mon font-bold text-lg">No Data Found</h1>
    </div>
  );
}
