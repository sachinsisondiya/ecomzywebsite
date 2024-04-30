import { useState, useEffect,useRef } from "react";
import Spinner from "../components/Spinner";
import Product from "../components/Product";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import axios from 'axios';
import { useSelector,useDispatch } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import { setValue } from "../redux/Slices/CartSlice";




const Home = ({ orders,setorders,setfilterbox,filterbox,setadmin,setLoading,loading }) => {
  const API_URL = "https://ecomzyserver4.onrender.com/api/v1/data";
  
  

  const [posts, setPosts] = useState([]);
  const [incart, setIncart] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();
  const [userId,setUserId]=useState(null);
  const {cart} = useSelector((state) => state);
  console.log("this is user : ",user);
  const dispatch=useDispatch();
  
  const navigate = useNavigate();

  const filterIconRef = useRef(null);

  
  const handleClickOutside = (event) => {
    if (filterIconRef.current && !filterIconRef.current.contains(event.target)) {
      setfilterbox(false);
    }
  };

  useEffect(() => {

    document.addEventListener('mousedown', handleClickOutside);
    
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); 
  
  useEffect(() => {
    
    if (!isSignedIn) {
      navigate("/sign-in");
    }
  }, [isSignedIn, navigate]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(posts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPosts(items);
  };

  const fetchProductData = async () => {
    setLoading(true);

    try {

      const res = await axios.post(API_URL);
      console.log("this is response:", res);

      setPosts(res.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error occurred", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isLoaded && isSignedIn) {
        try {
          
          await sendUserDataToApi(user);
         
        } catch (error) {
          console.error("Error fetching or sending user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSignedIn, isLoaded, user]);

  const sendUserDataToApi = async (userData) => {
    try {

      if(userData.id==='user_2XyTmmwknnJTvkgWN0Y1YZgbZr3') setadmin(true);
      
      // user_2XyTmmwknnJTvkgWN0Y1YZgbZr3
      const payload = {
        userName: userData.username,
        lastName: userData.lastName,
        firstName: userData.firstName,
        email: userData.primaryEmailAddress?.emailAddress,
        phone: userData.primaryPhoneNumber?.phoneNumber,
        id: userData.id,
      };
     
      setUserId(userData.id);
      
      
      const response = await axios.post('https://ecomzyserver4.onrender.com/api/v1/signup', payload);

      console.log("User data sent to API. Response:", response.data);

       
      fetchcartdata(userData);
      
      const ordersresponse=await axios.post('https://ecomzyserver4.onrender.com/api/v1/fetchorders',{user:userData.id});

      console.log("this is order response ",ordersresponse.data.orderarray);

      setorders(ordersresponse.data.orderarray);
     
      console.log("this is orders ",orders);
      


    } catch (error) {
      console.error("Error sending user data to API:", error);
    }
  };

 

  const fetchcartdata=async (userData)=>{
   
    try{
       setLoading(true);
      const obj={
        user_id:userData.id
      }

      const responsecart=await axios.post('https://ecomzyserver4.onrender.com/api/v1/fetchcartproducts',obj);
      
     


      dispatch(setValue(responsecart.data.products));
      setLoading(false);
      
    }
    catch(error){
      setLoading(false);
      console.error("Error fetching cart to API:", error);

    }
  }

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(()=>{
    const fetchcart= async ()=>{
     
      if (isLoaded && isSignedIn) {
        try {
          
          await fetchcartdata(user);
         
        } catch (error) {
          console.error("Error fetching cart data : ", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }


    }

    fetchcart();
  },[cart]);

  
  
  const handleCategoryChange = async (category) => {
    setLoading(true);
  
    try {
      const obj = {
        category: category,
      };
  
      console.log("this is category obj ", obj);
  
      const response = await axios.post('https://ecomzyserver4.onrender.com/api/v1/fetchbycategory', obj);
  
      console.log("this is fetchbycategory response: ", response.data.products);
  
      // Use the callback form of setPosts to ensure you have the latest state
      setPosts((prevPosts) => {
        return response.data.products;
      });
  
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error in fetching by category", error);
    }
  };
  



  const handleItemClick = (item) => {

    const itemincart = cart.some((cartItem) => cartItem._id === item._id);

  
 

    console.log("this is set in cart ",itemincart);

    navigate("/product", { state: { item, incart:itemincart} });
  };

  return (
    <div className={!loading ? "w-screen  flex justify-center items-center " : "w-screen  flex justify-center h-screen items-center"}>
      {loading ? (
        <Spinner />
      ) : posts.length > 0 ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable  droppableId="posts">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid relative item-center justify-center sm:grid-cols-1  lg:grid-cols-2  w-full p-2 mx-auto gap-[20px] h-auto"
              >
                {posts.map((post, index) => (
                  <Draggable   key={post._id.toString()} draggableId={post._id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => handleItemClick(post)}
                      >
                        <Product   user_id={userId} post={post} setincart={setIncart} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="flex justify-center items-center">
          <p>No Data Found</p>
        </div>
      )}
      {filterbox &&  (
        <div ref={filterIconRef} className="absolute shadow-md w-[200px] h-[300px] bg-white rounded-md right-2 top-20 flex p-3 flex-col gap-[20px]">
          <div className="hover:bg-slate-900 hover:text-white rounded-md p-2 hover:cursor-pointer" onClick={()=>{handleCategoryChange("clothing")}}>Clothings</div>
          <div className="hover:bg-slate-900 hover:text-white rounded-md p-2 hover:cursor-pointer" onClick={()=>{handleCategoryChange("footware")}}>Footwares</div>
          <div className="hover:bg-slate-900 hover:text-white rounded-md p-2 hover:cursor-pointer" onClick={()=>{handleCategoryChange("accessories")}}>Accessories</div>
          <div className="hover:bg-slate-900 hover:text-white rounded-md p-2 hover:cursor-pointer" onClick={()=>{handleCategoryChange("electronics")}}>Electronics</div>
          <div className="hover:bg-slate-900 hover:text-white rounded-md p-2 hover:cursor-pointer" onClick={fetchProductData} >
          All
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
