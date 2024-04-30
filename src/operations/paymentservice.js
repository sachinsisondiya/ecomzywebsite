import { toast } from "react-hot-toast";
import axios from 'axios'
import logo from '../utils/logo.png'

// import { useUser } from "@clerk/clerk-react";
// import { useState } from "react";



function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror= () =>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}


export async function buyCourse( products, user,cartitem) {
    const toastId = toast.loading("Loading...");
    
   
    // const [userId,setuserId]=useState(user.id);

    try{
        //load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        
        console.log("this is response of script loaded : ",res);
        if(!res) {
            toast.error("RazorPay SDK failed to load");
            return;
        }
       
        const orderResponse =await axios.post('https://ecomzyserver4.onrender.com/api/v1/capturepayment',
        {products}
        );
       
       
        // console.log("this is razor pay key ",process.env.RAZORPAY_KEY);

        if(!orderResponse.data.success) {
            console.log("this is error ");
            throw new Error(orderResponse.data.message);
        }
        console.log("PRINTING orderResponse", orderResponse);
        //options
        console.log("this is currency : ",orderResponse.data.message.currency);
        const options = {
            key: "rzp_test_skJr1L04f8k9Ks",
            currency: orderResponse.data.message.currency,
            amount: `${orderResponse.data.message.amount}`,
            order_id:orderResponse.data.message.id,
            name:"Ecomzy",
            description: "Thank You for Purchasing our product",
            image:logo,
            prefill: {
                name:`${user.firstName}`,
                email:user.primaryEmailAddress?.emailAddress
            },
            handler: function(response) {

                console.log("this is response of handler ",response);
            
                verifyPayment({...response, products,user,cartitem});
            }
        }

        console.log("this is options ",options);
        //miss hogya tha 
        const paymentObject = new window.Razorpay(options);
        console.log("this is payment obj",paymentObject);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            toast.error("oops, payment failed");
            console.log("this is error");
            console.log("this is response ",response);
            console.log(response.error);
        })

    }
    catch(error) {
        console.log("PAYMENT API ERROR.....", error);
        toast.error("Could not make Payment");
    }
    toast.dismiss(toastId);
}


async function verifyPayment(bodyData) {

    

    console.log("this is body data",bodyData);

    const toastId = toast.loading("Verifying Payment....");
    
    try{
        // const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
        //     Authorization:`Bearer ${token}`,
        // })

        console.log("hello");

        const response=await axios.post('https://ecomzyserver4.onrender.com/api/v1/verifypayment',bodyData);
        
        console.log("the response of verify is ",response);
        
        if(!response.data.success) {
            throw new Error(response.data.message);
        }

        if(bodyData.cartitem){
            const response=await axios.post('https://ecomzyserver4.onrender.com/api/v1/erasecart',{user_id:bodyData.user.id});
            console.log("this is clear cart response : ",response);
        }
        toast.success("payment Successful, check your orders");
       
      
    }   
    catch(error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    
    toast.dismiss(toastId);
    
    window.location.href='/home';
 
}