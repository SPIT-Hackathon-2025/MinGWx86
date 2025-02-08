import React from "react";
import { BiArrowBack } from "react-icons/bi";
import { TbHomeStats } from "react-icons/tb";
import { useState } from "react";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };



  return (
    <div>
      <div className="bg-blue-100 h-32 w-full  flex justify-between static">
        <div className=" h-10 mt-15 px-5 ml-1 content-center text-[16px] font-bold tracking-wide  space-x-4 flex">
          <div>
            <TbHomeStats color="darkblue" size={35} />
          </div>
          <div className="mt-1">APNA GHAR</div>
        </div>
        <div className="  h-10 mt-15 px-5 mr-5 content-center">
          <button className="bg-blue-900 text-white rounded-full p-2 border-gray-600 border-1 cursor-pointer"
            onClick={toggleMenu}
          >
            <BiArrowBack />
          </button>
        </div>
      </div>

      {showMenu && <div className="h-80 w-60 bg-blue-200 absolute right-0 top-0 mt-32 grid grid-row-5 transform transition-transform duration-100 ease-in-out">

        <div className="mt-2 px-4 font-semibold cursor-pointer">Home</div>
        <div className="mt-2 px-4 font-semibold cursor-pointer">Funiture</div>
        <div className="mt-2 px-4 font-semibold cursor-pointer">AR Wall</div>
        <div className="mt-2 px-4 font-semibold cursor-pointer">About us</div>
        <div className="mt-2 px-4 font-semibold cursor-pointer">Contact us</div>
      </div>}

    </div>
  );
};

export default Navbar;
 