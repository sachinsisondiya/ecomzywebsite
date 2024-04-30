import { Routes,useNavigate,Route,useLocation } from "react-router-dom";
import Navbar from "./components/Navbar"
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductPage from "./pages/ProductPage";
import Profile from "./pages/Profile";
import  DefaultPage  from "./pages/DefaultPage";
import { useState,useEffect } from "react";
import CreateProduct from "./pages/CreateProduct";
import {motion,useScroll,useSpring,useMotionValueEvent} from 'framer-motion'


import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,

} from "@clerk/clerk-react";

import { useUser } from "@clerk/clerk-react";


if(!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY)
{
  throw new Error("Missing Publishable Key");
}


const clerkkey= process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;


function ClerkWithRoutes(){

const navigate =useNavigate();
const [filterbox, setfilterbox] = useState(false);
const location=useLocation();
const inSignIn =location.pathname==='/sign-in';
const indefault=location.pathname==='/';
const [loading, setLoading] = useState(true);
const [admin,setadmin]=useState(false);
const {scrollYProgress}=useScroll();
const [orders,setorders]=useState({});


  const scalex=useSpring(scrollYProgress);

  const {scrollY}=useScroll();
  const [hidden,sethidden]=useState(false);


  useMotionValueEvent(scrollY,"change",(latest)=>{
    const previous=scrollY.getPrevious();
     
    if(latest>previous ){
      sethidden(true);
    }
    else{
      sethidden(false);
    }
    
  });

return (

  

<ClerkProvider publishableKey={clerkkey} navigate={(to)=>navigate(to)} >
<motion.div 
      style={{
        scaleX:scalex,
        transformOrigin:'left',
        position:"fixed",
        top:0
        }} 
        
        className="w-full h-[7px] sticky z-20  bg-blue-400">

      </motion.div>

<motion.div className="bg-slate-900 sticky"

variants={{
        visible:{y:0},
        hidden:{y:"-100%"}
      }}
      animate={hidden ? "hidden":"visible"}
      transition={{duration:0.35, ease:"easeInOut"}}
>

   {(!inSignIn || !indefault  ) && !loading &&

     <Navbar  setfilterbox={setfilterbox} admin={admin}    filterbox={filterbox} />
     }
      </motion.div>
       <Routes>
        <Route path='/' element={<DefaultPage/>} />
        <Route path='/createproduct' element={<CreateProduct/>} />
        <Route path="/home" element={<Home orders={orders} setorders={setorders} setfilterbox={setfilterbox} setLoading={setLoading}  loading={loading} setadmin={setadmin} filterbox={filterbox} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/profile"  element={<Profile orders={orders} />} />
        <Route
          path="/sign-in/*"
          element={
            <div className="flex w-screen h-screen items-center justify-center">
              <SignIn routing="path" path="/sign-in" />
            </div>
          }
          />
        <Route
          path="/sign-up/*"
          element={
            <div className="flex w-screen h-screen items-center justify-center">
              <SignUp routing="path" path="/sign-up" />
            </div>
          }
        />
         <Route
          path="/protected"
          element={
            <>
              <SignedIn>
                <Home setfilterbox={setfilterbox} filterbox={filterbox}/>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

      </Routes>




</ClerkProvider>



);



}

const App = () => {
  
  

  return (
    <ClerkWithRoutes />
  );
};

export default App;
