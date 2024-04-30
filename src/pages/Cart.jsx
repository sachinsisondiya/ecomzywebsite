import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import {BsCart4} from 'react-icons/bs'
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from 'axios'
import { setValue } from "../redux/Slices/CartSlice";
import Spinner from "../components/Spinner";
import { buyCourse } from "../operations/paymentservice";



const Cart = () => {

  const {cart} = useSelector((state) => state);
  console.log("Printing Cart");
  console.log("this is cart : ",cart);
  const { isSignedIn, user  } = useUser();
  const dispatch=useDispatch();

  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading,setloading]=useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    
    if (!isSignedIn) {
      navigate("/sign-in");
    }
  }, [isSignedIn, navigate]);
  
  useEffect(()=>{
    
    const fetchData=async ()=>{
    
      try{
        setloading(true);
          
        const {id}=user;

        const obj={
          user_id:id
        }

        const response=await axios.post('https://ecomzyserver4.onrender.com/api/v1/fetchcartproducts',obj);
        
        console.log("this is the cart data response : ",response);


        dispatch(setValue(response.data.products));

        setloading(false);
          
      }
      catch(error){
        setloading(false);
        console.error('Error fetching cart products:', error.message);
      }

    }

    fetchData();

  },[])

  const handleItemClick = (item) => {
    navigate("/product", { state: { item, incart:true } });
  };

  const handleBuyproduct = async() => {
        
    if(isSignedIn) {
        setloading(true);
        buyCourse( cart, user,true);
        
       
       setloading(false);
        return;
    }
}

  useEffect( () => {
    setTotalAmount( cart.reduce( (acc, curr) => acc + curr.price,0) );
  }, [cart])

  return (
    <div className="w-screen h-auto">

    

  {isLoading ? 
 <div className="w-full h-screen flex justify-center items-center">

 <Spinner/> 

 </div>
  
  
  :
    

    cart.length > 0  ? 
    (<div className="w-full flex flex-col gap-[20px] h-auto">
      
      <div className="w-full h-[50px]"></div>
      <div className="flex flex-wrap gap-[20px] items-center w-full h-full justify-center">
        { 
          cart.map( (item,index) => (

            <div
              key={item.id}
              onClick={() => handleItemClick(item)} 
            >

             <CartItem user_id={user.id}  item={item} itemIndex={index} />
             </div>
           ) )
        }
      </div>

      <div className="w-full h-auto p-3 flex flex-col gap-[20px]">

        <div className="flex p-[50px] flex-col w-full h-auto justify-center items-start ">
        <div className="w-full flex items-center sm:items-start flex-col gap-[20px]">
          <div className="w-full flex gap-[20px] items-center justify-center sm:justify-start">
          
          <div className="text-green-400 text-sm sm:text-xl w-auto">Your Cart</div>
          <div className="text-sm sm:text-xl text-slate-400">Summary</div>
          </div>
          
          <p className="">
            <span>Total Items: {cart.length}</span>
          </p>
          </div>
        </div>

        <div className="flex items-center xs:flex-row flex-col justify-center gap-[20px] xs:gap-[25px]">
          <p>Total Amount: ${totalAmount}</p>
          <button onClick={handleBuyproduct} className="p-2 hover:bg-slate-500 border transition-colors duration-200 rounded-[22px] hover:text-white">
            CheckOut Now
          </button>
        </div>

      </div>


    </div>) : 
    (<div  className="w-screen h-screen gap-[50px] flex flex-col items-center justify-center">
      <BsCart4 className="sm:w-[50px] w-[30px] h-[30px] sm:h-[50px]"/>
      <h1 className="sm:text-md text-sm">Cart Empty</h1>
      <Link to={"/"}>
        <button className="hover:bg-slate-500 sm:text-md text-sm transition-colors border duration-150 p-3 rounded-[23px] hover:text-white">
          Shop Now
        </button>
      </Link>
    </div>)
  }
    </div>
  );
};

export default Cart;
