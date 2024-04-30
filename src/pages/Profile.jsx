import React, { useState,useEffect } from 'react'

import {ImFolderUpload} from 'react-icons/im'
import {CgProfile} from 'react-icons/cg'

import {IoIosArrowForward} from 'react-icons/io'
import Orderpage from '../components/Orderpage'
import Profileinfo from '../components/Profileinfo'
import MannageAddress from '../components/MannageAddress'
import Pancard from '../components/Pancard'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'


const Profile = ({orders}) => {
 const {user}=useUser();


 console.log("this is user : ",user);
 
 const [mydp,setmydp]=useState(user ? user.imageUrl:"");
 const [userName,setusername]=useState(user ? user.firstName:"");
 
 const [orderspage,setorderspage]=useState(false);

 const [profleInfo,setprofileinfo]=useState(true);

 const [manageAddress,setmanageaddresses]=useState(false);

 const [pancardinfo,setpancardinfo]=useState(false);

 

 const {isSignedIn} =useUser();

 const navigate=useNavigate();
 
 useEffect(() => {
    
  if (!isSignedIn) {
    navigate("/sign-in");
  }
}, [isSignedIn, navigate]);


 

  return (
    <div className='overflow-x-hidden bg-slate-100 py-2 md:p-3'>

    <div className='flex w-screen gap-[5px] sm:gap-[20px] items-start'>
    
    <div className='flex scale-x-90 sm:scale-100 w-[130px] sm:w-[150px] md:w-[200px] lg:w-[300px] gap-[30px] flex-col'>
   
    <div className='bg-white w-full p-1 sm:p-3 items-center shadow-lg  flex  gap-[20px] '>
    {mydp ? <img src={mydp } className='md:w-[50px] w-[30px] h-[30px]  md:h-[50px] rounded-full '/>:<CgProfile className='md:w-[50px] w-[30px] h-[30px]  md:h-[50px]'/>}
      
      <span className='flex flex-col'>
      <div className='lg:text-[15px] md:text-sm text-xs'>Hello, </div>
      <div className='lg:text-[15px] md:text-sm text-xs text-slate-400'>{userName ? userName :""}</div>
      </span>
    </div>

    <div className='options bg-white flex flex-col   w-full shadow-lg'>
     <div className='flex hover:cursor-pointer justify-between items-center p-3 '>
     <div className='flex  gap-[12px] md:gap-[20px] items-center'>
     <ImFolderUpload className='lg:w-[30px] w-[15px] h-[12px] lg:h-[30px] text-blue-500' />

    <div className='hover:text-blue-500 text-[8px] lg:text-[15px] text-slate-400 '
    onClick={()=>{
      setprofileinfo(false);
      setmanageaddresses(false);
      
      setorderspage(true);
      setpancardinfo(false);
      
      
      }}
     >MY ORDERS</div>
    </div>

    <IoIosArrowForward className='lg:w-[20px] w-[10px] h-[10px] lg:h-[20px]  text-slate-400' />
      
     </div>
     <div className='h-[1px] bg-slate-300'></div>
     <div className='accountsetting-heading flex gap-[10px] md:gap-[20px] items-center p-3 '>
     <CgProfile className='lg:w-[30px] w-[15px] h-[12px] lg:h-[30px] text-blue-500'/>
     <div className='text-slate-400 text-[8px] lg:text-[15px]'> ACCOUNT SETTINGS</div>

     
     </div>
     <div className={profleInfo?'pl-[35px] sm:pl-[40px] md:pl-[47px] lg:px-[60px] text-[8px] lg:text-[15px]  py-[10px] bg-sky-100 hover:text-blue-500 hover:cursor-pointer ':'pl-[35px] sm:pl-[40px] md:pl-[47px] lg:px-[60px] text-[8px] lg:text-[15px]  py-[10px] hover:text-blue-500 hover:cursor-pointer hover:bg-sky-100'} onClick={()=>{
      setprofileinfo(true)
      setmanageaddresses(false);
      
      setorderspage(false);
      setpancardinfo(false);
      
      
      }
      
      }>Profile Information</div>

     <div className='pl-[35px] sm:pl-[40px] md:pl-[47px] lg:px-[60px] text-[8px] lg:text-[15px]  py-[10px] hover:text-blue-500 hover:cursor-pointer hover:bg-sky-100' onClick={()=>{
      setmanageaddresses(true)
      setprofileinfo(false)
     
      setorderspage(false);
     
      setpancardinfo(false);
     
     
     
     
     }}>Manage Address</div>
     <div className='pl-[35px] sm:pl-[40px] md:pl-[47px] lg:px-[60px] text-[8px] lg:text-[15px] py-[10px] hover:text-blue-500 hover:cursor-pointer hover:bg-sky-100' onClick={()=>{
       setmanageaddresses(false)
      setprofileinfo(false)
     
      setorderspage(false);
     
      setpancardinfo(true);
      
     
     
     
     
     }}>PAN Card Information</div>
     <div className='h-[1px] bg-slate-300'></div>

     

     <div className='h-[1px] bg-slate-300'></div>

     
     
     <div className='h-[1px]  bg-slate-300'></div>
     
    </div>
    

    </div>

    <div className={!orderspage ?'w-6/12 xs:w-7/12 sm:w-8/12  ':" "}>
    { profleInfo && (
      <Profileinfo />
    )

    }

    {
      manageAddress && (
        <MannageAddress />
      )
    }

    {

      pancardinfo && (
        <Pancard />
      )
    }

    {

orderspage && (
  <Orderpage orders={orders}/>
)
}


    </div>
    

    </div>
    

    </div>
  )
}


export default Profile;