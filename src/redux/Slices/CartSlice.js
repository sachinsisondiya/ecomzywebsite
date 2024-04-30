import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const CartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    add: (state, action) => {
      state.push(action.payload);
    },
    
    remove: (state, action) => {
     return state.filter((item) => item.id === action.payload);
    },
    setValue: (state, action) => {
      state.splice(0, state.length, ...action.payload);
    },
  },
});


export const { add, remove, setValue } = CartSlice.actions;

    
export const addToCartAsync = (post,product_id, user_id) => async (dispatch) => {
  try {
    const obj = {
      product: product_id,
      user_id: user_id,
    };
    
    console.log("this is obj add to cart",obj);
    
    const response = await axios.post("https://ecomzyserver4.onrender.com/api/v1/addtocart", obj);

    console.log("this is response of addtocart : ",response);
    
    dispatch(add(post));
    
  } 
  catch (error) {
    console.error("Error adding to cart:", error.message);
  }
};


export const removeFromCartAsync = (product_id,user_id) => async (dispatch) => {
  try{
    
    const obj={
      productId:product_id,
      user_id:user_id
    }
    
    console.log("the obj is remove cart : ",obj);

    const response = await axios.post(`https://ecomzyserver4.onrender.com/api/v1/removefromcart`,obj);
                                                         
    console.log("The Response of removecart: ",response);
    
    dispatch(remove(product_id));


  } 
  catch(error){
    console.error("Error removing from cart:", error.message);
  }

};



export default CartSlice.reducer;