import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { TbHomeStats } from "react-icons/tb";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />

      <div className="bg-blue-100 mt-5 h-200 w-full ">
        <div className=" h-40 w-80 mt-5 ml-5">
          <h1 className="font-bold text-[36px]">
            Design Your Space, Virtually Real.
          </h1>
        </div>

        <div className=" h-20 w-60 mt-5 ml-5">
          <h1 className="font-mono text-[12px]">
            Bringing Your Dream Space to Life with Interactive, Customizable
            Furniture Design
          </h1>
        </div>

        <div className="  h-12 w-50  ml-2 flex justify-around">
          <button className="bg-blue-300 h-10 px-3  rounded-full text-[15px] border-1 border-gray-300 cursor-pointer">
            Furniture
          </button>
          <button className="bg-blue-300 h-10 px-3 rounded-full text-[15px] border-1 border-gray-300 cursor-pointer">
            AR Wall
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
