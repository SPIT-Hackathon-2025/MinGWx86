import React from 'react'
import { BiArrowBack } from "react-icons/bi";
import { TbHomeStats } from "react-icons/tb";

const Navbar = () => {
  return (
    <div>
      <div className='bg-blue-100 h-32 w-full  flex justify-between'>
      
      <div className=' h-10 mt-15 px-5 ml-1 content-center text-[16px] font-bold tracking-wide  space-x-4 flex'>  
     <div><TbHomeStats color="darkblue" size={35} /></div> 
      <div className='mt-1'>APNA GHAR</div> 
       </div>
      <div className='  h-10 mt-15 px-5 mr-5 content-center'><button className='bg-blue-900 text-white rounded-full p-2 border-gray-600 border-1 cursor-pointer'><BiArrowBack /></button></div>
       
      </div>
    </div>
  )
}

export default Navbar
