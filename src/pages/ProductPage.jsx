import React, { useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { MdShoppingCart } from "react-icons/md";
import { MdRemoveShoppingCart } from "react-icons/md";
import { toast } from "react-hot-toast";
import {removeFromCartAsync,addToCartAsync} from "../redux/Slices/CartSlice";
import { useUser } from "@clerk/clerk-react";
import { buyCourse } from "../operations/paymentservice";



 const ProductPage = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const {  user,isSignedIn } = useUser();
    const navigate=useNavigate();
    const [item,setitem]=useState(location.state.item);
    const [incart,setincart]=useState(location.state.incart);
    // const {cart} = useSelector((state) => state);

    const handleBuyproduct = () => {
        
      if(isSignedIn) {
          buyCourse( [item], user,false);
          return;
      }
  }

    const addToCart = async (event) => {
      event.stopPropagation();
  
      try {
        dispatch(addToCartAsync(item,item._id, user.id));
        setincart(true);
        toast.success("Item added to Cart");
       
      }
      catch (error) {
                  
        console.error("Error adding to cart:", error.message);
  
      }
    };

    const removeFromCart = async (event) => {
      
      event.stopPropagation();
      
      try {
       console.log("this is product id ",item._id);
       console.log("this is userid : ",user.id);
        dispatch(removeFromCartAsync(item._id, user.id));
        setincart(false);
        toast.error("Item removed from Cart");
        
      }
      catch (error) {
  
        console.error("Error removing from cart:", error.message);
  
      }
    };
   
  return (
    <div className="profile-container  ">
   
    {item ? (
      <div className='w-screen h-auto relative  flex flex-col items-center'>
      <div className='w-full h-auto p-[70px] sm:p-[50px] flex justify-center items-center'>
      <img src={item.image} alt="productimage" className='sm:w-[300px] sm:h-[250px] ' />
      </div>
      
     <div className='flex p-3 flex-col items-center gap-[50px]'>

     <div className='text-slate-500'>{item.title}</div>
      <div className='w-10/12 text-center text-[12px] sm:text-md'>{item.description}</div>

     </div>
      
     
        <div className='text-green-400 text-xl p-[20px]'>₹ {item.price}</div>
       
      {
        incart ? 
        
       <MdRemoveShoppingCart className='absolute right-[10px] sm:right-[20px] top-[10px] sm:top-[20px] transition-colors duration-200 hover:cursor-pointer w-[30px] h-[30px] hover:text-green-400' onClick={removeFromCart}/>
        :
        

        <MdShoppingCart className='absolute right-[10px] sm:right-[20px] top-[10px] sm:top-[20px] transition-colors duration-200 hover:cursor-pointer w-[30px] h-[30px] hover:text-green-400' onClick={addToCart} />
      }

      <div onClick={handleBuyproduct} className='hover:bg-slate-400 border p-3 transition-colors duration-200 rounded-[22px] hover:text-white   hover:cursor-pointer'>
        Buy Now
      </div>
     <div className=' m-4  border rounded-full p-4 hover:cursor-pointer hover:text-white hover:bg-slate-400 transition-colors duration-200' onClick={()=>{navigate('/cart')}}>got to cart</div>
      </div>
    ) : (
        <div className='w-full h-screen flex justify-center items-center'>
        <p className='text-xl text-green-500'>No item data available.</p>
        </div>
      
    )}
  </div>
  )
}


export default ProductPage;
