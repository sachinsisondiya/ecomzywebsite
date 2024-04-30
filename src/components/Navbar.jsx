import {FaShoppingCart} from "react-icons/fa"
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {CgProfile} from 'react-icons/cg'
import { useState } from "react";
import {GoHomeFill} from 'react-icons/go'
import {BsFilterRight} from 'react-icons/bs'
import { useLocation } from "react-router-dom";
import {AiFillFolderAdd} from 'react-icons/ai'
import { UserButton,useUser } from "@clerk/clerk-react";
// import { useRef,useEffect } from "react";
  

const Navbar = ({setfilterbox,filterbox,admin}) => {
  
  const {cart} = useSelector((state) => state);
  const location = useLocation();
  const isHomePage = location.pathname === "/home";
  const isProfilePage=location.pathname==='/profile'
  const isCart=location.pathname==='/cart'
  const increateproduct=location.pathname==='/createproduct'
  const inproductpage=location.pathname==='/product';
  const {isSignedIn}=useUser();
  


  
  
  
  return (
    <div 
    
    
    >

      <nav 
      
      className="flex    justify-between items-center h-20 w-full ">
        
        <NavLink to="/home" className='hover:scale-95 transition-all duration-200'>
          <div className="ml-5">
          <img src="../logo.png" className="h-7 sm:h-14"/>
          </div>
        </NavLink>
            

           
          <div className=" flex     sm:gap-[20px]   items-center   bg-slate-900 w-auto  sm:p-3 rounded-xl font-medium text-slate-100 mr-5 space-x-3 sm:space-x-6">
            

            

            <NavLink to="/home" >
              
              <GoHomeFill className="sm:w-6 w-4 h-4 sm:h-6 hover:text-green-400 hover:scale-90 transition-all duration-150  " />
            </NavLink>

           {!inproductpage &&
            <NavLink to="/cart">
              <div className="relative">
                  <FaShoppingCart className="text-2xl sm:w-6 w-4 h-4 sm:h-6 hover:text-green-400 hover:scale-90 transition-all duration-150"/>
                  {
                    cart.length > 0 &&
                    <span
                    className="absolute -top-1 -right-2 bg-green-600 text-xs w-5 h-5 flex 
                    justify-center items-center animate-bounce rounded-full text-white" 
                    >{cart.length}</span>
                  }
                  
              </div>
            </NavLink>}
           
           {!isProfilePage &&
            <NavLink to='/profile' >
               <CgProfile className="sm:w-6 w-4 h-4 sm:h-6 hover:text-green-400 hover:scale-90 transition-all duration-150 " />
            </NavLink>
            
            }

            {isHomePage && (
            <BsFilterRight 
              onClick={() => {
                setfilterbox(!filterbox);
              }}
              className="sm:w-7 w-5 h-5 sm:h-7 hover:text-green-400 hover:scale-90 transition-all duration-150 hover:cursor-pointer"
            />
          )}

          {isHomePage && admin &&   (
            <NavLink to='/createproduct'>
            <AiFillFolderAdd
              
              className="sm:w-7 w-5 h-5 sm:h-7 hover:text-green-400 hover:scale-90 transition-all duration-150 hover:cursor-pointer"
            />
            </NavLink>
          )}

          {
            (isProfilePage || isCart || increateproduct ) && isSignedIn &&

            <UserButton className='w-[10px] h-[10px]'/>
          }


          </div>
      </nav>
      
    </div>
  )
};

export default Navbar;
