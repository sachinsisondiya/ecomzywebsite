import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const Orderpage = ({ orders }) => {

   console.log("orders",orders);
   const navigate=useNavigate();
   const {cart} = useSelector((state) => state);

   const handleItemClick = (item) => {

    const itemincart = cart.some((cartItem) => cartItem._id === item._id);

  
 

    console.log("this is set in cart ",itemincart);

    navigate("/product", { state: { item, incart:itemincart} });
  };

  return (
    <div className='h-[500px]    w-full sm:w-[300px] md:w-[500px] overflow-y-scroll'>
      {
        orders.length === 0 ? 
        <div className='flex  justify-center items-center w-full h-full'> Empty order list</div> :
        (
          <div className='flex py-[20px] flex-col gap-[50px] w-full items-center'>
            
            {orders.map((order, index) => (
              <div className='border hover:cursor-pointer  flex flex-col relative  border-stone-700 w-[200px] md:h-[400px] sm:w-[300px] md:w-[500px] rounded-xl box-sizing px-2 xs:p-5' onClick={() => handleItemClick(order)} key={index}>
              <p className="text-gray-700 font-semibold text-sm sm:text-lg text-left truncate w-40 mt-1">{order.title}</p>
              <p className="w-40 text-gray-400 font-normal text-[10px] text-left">{order.description.split(" ").slice(0,10).join(" ") + "..."}</p>
              <div className='w-[100px] h-[100px] sm:w-[200px] my-[30px] sm:my-[10px] sm:h-[200px] object-cover mx-auto'>
              <img src={order.image} className="h-full w-full " />
              </div>
              

              <div className='sm:text-md absolute bottom-2 right-2 text-[8px]'> arriving in 15 days</div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

export default Orderpage;
