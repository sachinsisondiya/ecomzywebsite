
import { toast } from "react-hot-toast";
import {AiTwotoneDelete} from 'react-icons/ai'
import { useDispatch, useSelector } from "react-redux";
import {removeFromCartAsync} from "../redux/Slices/CartSlice";



const CartItem = ({item,user_id}) => {
  const {cart} = useSelector((state) => state);
  const dispatch = useDispatch();
  // const [loading,setloading]=useState(false);


  const removeFromCart = async (event) => {
    event.stopPropagation();
    const toastid=toast.loading("loading"); 
    try {
    
     console.log("this is toast id : ",toastid);
     console.log("this is product id ",item._id);
      dispatch(removeFromCartAsync(item._id, user_id));
      // setincart(false);
      toast.error("Item removed from Cart");
      console.log("this is cart : ",cart);

      toast.dismiss(toastid);
    }
    catch (error) {
      toast.dismiss(toastid);
      toast.error("error occured");
      console.error("Error removing from cart:", error.message);

    }
  };

  return (
    <div className=" w-[300px] h-[500px] sm:w-[500px] sm:h-[600px] border hover:cursor-pointer hover:scale-105 transition-all duration-150 p-[30px] flex flex-col items-center justify-center  outline rounded-xl">

      <div className="flex flex-col gap-[20px]" >

      
          <img className="w-[200px] h-[200px] mx-auto   " src={item.image} />
      
        
          <h1 className="text-slate-400" >{item.title}</h1>
          <h1 className="w-full text-sm">{item.description.split(" ").slice(0,10).join(" ") + "..."}</h1>
          <div className="flex gap-[20px] items-center justify-center">
            <p className="text-green-500">${item.price}</p>
            <div
            onClick={removeFromCart}>
              <AiTwotoneDelete/>
            </div>
          </div>

          <div className="buy_now_button hover:cursor-pointer hover:text-white transition-colors duration-200 hover:bg-slate-500 w-[100px] h-auto text-center p-2 rounded-[22px] border  ">buy now</div>

        


      </div>

    </div>
  );
};

export default CartItem;
