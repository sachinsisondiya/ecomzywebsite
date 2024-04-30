import React, { useState } from 'react';
import { BiCurrentLocation } from 'react-icons/bi';
import indianStates from '../Constants/Statename';
import axios from 'axios';
import { useUser } from "@clerk/clerk-react";
import {toast} from 'react-hot-toast'

export const ManageAddress = () => {


   const {user}=useUser();

  const [form, setForm] = useState({
    user:user.id,
    name: '',
    mobilenumber: '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    altphone: '',
    addresstype: '',
    latitude: null,
    longitude: null,
  });
  
  const [loader ,setloader]=useState(false);

  const handleLiveLocation = () => {
    setloader(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { coords } = position;
          const { latitude, longitude } = coords;

          const addressDetails = await reverseGeocode(latitude, longitude);

          setForm({
            ...form,
            pincode: addressDetails.postcode,
            locality: addressDetails.locality,
            address: addressDetails.road,
            city: addressDetails.city,
            state: addressDetails.state,
            landmark:addressDetails.landmark,
            latitude,
            longitude,
          });

          setloader(false);
        },
        (error) => {
          setloader(false);
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      setloader(false);
      console.error('Geolocation is not available in this browser.');
    }
  };

  const reverseGeocode = async (lat, lng) => {
    const apiKey = '4aac16bd0d694cffb51a19f528416c55'; 
    setloader(true);
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${lat}+${lng}&pretty=1`
    );
    const data = await response.json();
  
    if (data && data.results && data.results.length > 0) {
      const results = data.results[0];
      console.log("this is result : ",results.components);
      return {
        postcode: results.components.postcode || '',
        neighbourhood: results.components.neighbourhood || '',
        road: results.components.road || '',
        city: results.components.county || '',
        state: results.components.state || '',
        locality:results.components.state_district || '',
        landmark:results.components.road || '',
      };
      
    } else {
     
      console.error('Invalid geocoding data:', data);
      return {
        postcode: '',
        neighbourhood: '',
        road: '',
        city: '',
        state: '',
      };
    }

    setloader(false);


  };
  

  const submit = async (event) => {
   try{
    if(form.name && form.mobilenumber && form.pincode && form.locality && form.addresstype && form.address && form.altphone && form.state && form.landmark && form.city && form.altphone)
    {

    setloader(true);
    console.log('This is the final form:', form);
    
    const response=await axios.post('https://ecomzyserver4.onrender.com/api/v1/addAddress',form);

    console.log("this is the response of address ",response);

    setForm({
      name: '',
      mobilenumber: '',
      pincode: '',
      locality: '',
      address: '',
      city: '',
      state: '',
      landmark: '',
      altphone: '',
      addresstype: 'Home',
      latitude: null,
      longitude: null,
    });

    setloader(false);
  }
  else {

    if(!form.name){
      toast.error('enter the name');
    }
    if(!form.mobilenumber){
      toast.error('enter the mobilenumber');
    }
    if(!form.pincode){
      toast.error('enter the pincode');
    }
    if(!form.locality){
      toast.error('enter the locality');
    }
    if(!form.address){
      toast.error('enter the address');
    }
    if(!form.city){
      toast.error('enter the city');
    }
    if(!form.state){
      toast.error('enter the state');
    }
    if(!form.landmark){
      toast.error('enter the landmark');
    }
    if(!form.altphone){
      toast.error('enter the altphone');
    }
    if(!form.addresstype){
      toast.error('enter the addresstype');
    }
    

  }

  }
  catch(error){
     console.log("this is the error : ",error);
     setloader(false);
  }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white flex flex-col relative gap-[20px] p-3">
    {
      loader && (
        <div className='w-full absolute bg-white h-full opacity-70'>

      </div>)
    }
      <div className="text-sm md:text-lg sm:text-xl">Manage Address</div>

      <div className="flex border bg-sky-100 flex-col p-2 xs:p-3 gap-[20px]">
        <div className="text-[10px] xs:text-xs sm:text-sm text-blue-500 font-semibold">
          ADD A NEW ADDRESS
        </div>

        <div
          className="flex gap-[5px] xs:gap-[10px]  shadow-lg py-3 items-center text-[6px] md:text-sm lg:text-md w-[120px] xs:w-[150px] hover:cursor-pointer rounded-sm bg-blue-500 md:w-[200px] lg:w-[250px] px-1 xs:px-3"
          onClick={handleLiveLocation}
        >
          <BiCurrentLocation className="text-white w-4 h-4" />
          <div className="text-white">Use my current location</div>
        </div>

        <div className="flex sm:flex-row flex-col gap-[10px] md:gap-[20px]">
          <input
            onChange={handleOnChange}
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            className="border text-[10px] xs:text-xs md:text-sm w-full xs:w-[100px] md:w-[200px] p-2 md:p-3 outline-none"
          />
          <input
            onChange={handleOnChange}
            name="mobilenumber"
            type="tel"
            placeholder="10-digit mobile number"
            value={form.mobilenumber}
            className="border text-[8px] xs:text-xs md:text-sm w-full xs:w-[100px] md:w-[200px] p-2 md:p-3 outline-none"
          />
        </div>

        <div className="flex sm:flex-row flex-col gap-[10px] md:gap-[20px]">
          <input
            onChange={handleOnChange}
            name="pincode"
            placeholder="Pincode"
            type="text"
            value={form.pincode}
            className="border text-[8px] xs:text-xs md:text-sm w-full xs:w-[100px] md:w-[200px] p-2 md:p-3 outline-none"
          />
          <input
            onChange={handleOnChange}
            name="locality"
            placeholder="Locality"
            type="text"
            value={form.locality}
            className="border text-[8px] xs:text-xs md:text-sm w-full xs:w-[100px] md:w-[200px] p-2 md:p-3 outline-none"
          />
        </div>

        <div>
          <input
            onChange={handleOnChange}
            name="address"
            type="text"
            placeholder="Address(Area and Street)"
            value={form.address}
            className="border text-[8px] xs:text-xs md:text-sm p-4 md:w-[420px] w-full  h-[120px] md:h-[150px]"
          />
        </div>

        <div className="flex sm:flex-row flex-col gap-[10px] md:gap-[20px]">
          <input
            onChange={handleOnChange}
            name="city"
            placeholder="City/District/Town"
            value={form.city}
            className="border text-[8px] xs:text-xs md:text-sm w-full xs:w-[100px] md:w-[200px] p-2 md:p-3 outline-none"
          />
          <select
            onChange={handleOnChange}
            name="state"
            value={form.state}
            className="border text-[8px] xs:text-xs md:text-sm w-full xs:w-[100px] md:w-[200px] p-2 md:p-3 outline-none"
          >
            {indianStates.map((state, index) => (
              <option key={index} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="flex sm:flex-row flex-col gap-[10px] md:gap-[20px]">
          <input
            onChange={handleOnChange}
            name="landmark"
            type="text"
            placeholder="Landmark (Optional)"
            value={form.landmark}
            className="border text-[8px] xs:text-xs md:text-sm w-full xs:w-[100px] md:w-[200px] p-2 md:p-3 outline-none"
          />
          <input
            onChange={handleOnChange}
            name="altphone"
            type="tel"
            placeholder="Alternate Phone (Optional)"
            value={form.altphone}
            className="border text-[8px] xs:text-xs md:text-sm w-full xs:w-[100px] md:w-[200px] p-2 md:p-3 outline-none"
          />
        </div>

        <div className="flex flex-col gap-[10px] md:gap-[20px] p-3">
          <div className="text-[8px] xs:text-xs md:text-sm text-slate-500">
            Address Type
          </div>
          <div className="flex gap-[20px]">
            <div className="flex items-center gap-[10px]">
              <input
                onChange={handleOnChange}
                type="radio"
                name="addresstype"
                value="Home"
                id="home"
                checked={form.addresstype === 'Home'}
              />
              <label htmlFor="home" className="text-[8px] xs:text-xs md:text-sm">
                Home
              </label>
            </div>
            <div className="flex items-center gap-[10px]">
              <input
                onChange={handleOnChange}
                type="radio"
                name="addresstype"
                value="Work"
                id="work"
                checked={form.addresstype === 'Work'}
              />
              <label htmlFor="work" className="text-[8px] xs:text-xs md:text-sm">
                Work
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-[5px] sm:gap-[10px] md:gap-[20px]">
          <div
            className="w-[70px] hover:cursor-pointer sm:w-[100px] md:w-[150px] text-[10px] sm:text-sm md:text-xl md:p-3 bg-blue-500 text-white flex justify-center items-center rounded-sm"
            onClick={submit}
          >
            Save
          </div>
          <div className="text-blue-500 hover:cursor-pointer p-3 text-[10px] sm:text-sm md:text-xl w-[70px] sm:w-[100px] md:w-[150px] text-center">
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAddress;
