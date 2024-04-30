import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
const Pancard = () => {

  const [form,setform]=useState({
    cardnumber:"",
    fullname:"",
    commitment:false


  });

  const [loading,setloading]=useState(false);
 
  const {user}=useUser();

  const [watchedFile,setwatchfile] = useState(null);
  const [imageUrlPreview, setImageUrlPreview] = useState(null);

  const handlefilechange=(event)=>{
    
    console.log('File selected:', event.target.files[0]);
    const file = event.target.files[0];
    if (file instanceof File) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImageUrlPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      console.log("this is image url preview : ",file);
      setwatchfile(file);
     
    }
  }

 


  const handleformattributeonchange = (event) => {
    const { name, value, type, checked } = event.target;
  
    if (type === 'checkbox') {
      setform((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } 
    else {
      setform((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  
    console.log("the form is : ", form);
  };
  
  const submitform =async ()=>{
    try{
      
      if(form.commitment && form.cardnumber && form.fullname){
        setloading(true);
    const formData = new FormData();
      formData.append('imageFile', watchedFile);
    
      
      const response = await axios.post(
        'https://ecomzyserver4.onrender.com/api/v1/uploadImage',
        formData,  
      );

      console.log('Image uploaded to Cloudinary:', response);
      const url = response.data.imageUrl;
      console.log("this is url : ",url);
      const obj={
        user:user.id,
        number:form.cardnumber,
        fullname:form.fullname,
        aggreement:form.commitment,
        imageUrl:url
      }

      const response_=await axios.post('https://ecomzyserver4.onrender.com/api/v1/addpancard',obj);

      console.log("this is response : ",response_);
      toast.success("pancard informtion is uploaded");
      setloading(false);
    }
    else{
      toast.error('kindly fill all the inputs');
    }
     
      setform({
        cardnumber: "",
        fullname: "",
        commitment: false
    });

    
    }
      catch(error){
        console.log("this is the error ",error);
        toast.error("An error occured ! kindly retry");
      }


  }


  return (
    <div className='bg-white p-5 relative flex flex-col gap-[50px]'>
       
       { loading? <div className='w-full cover absolute h-full bg-white top-0 left-0 z-10 opacity-80 '></div>:<div></div>}

        <div className='text-[11px] xs:text-xs sm:text-sm md:text-md'>
            PAN Card Information
        </div>

       <div className='flex flex-col gap-[20px]'>
       
       <input type="text" onChange={handleformattributeonchange} value={form.cardnumber} name="cardnumber" className='sm:w-[200px]  md:w-[300px] text-[8px] sm:text-xs border rounded-sm outline-none p-3' placeholder='PAN Card Number'/>
       <input type="text" onChange={handleformattributeonchange} value={form.fullname} name="fullname" className='sm:w-[200px]  md:w-[300px] text-[8px] sm:text-xs border rounded-sm outline-none p-3' placeholder='Full Name'/>
       <div className='border h-[100px] sm:h-auto flex sm:static relative flex-col gap-[20px]   w-full p-3 sm:w-[250px] md:w-[300px] rounded-sm  '>
        <div className='text-[8px] sm:text-xs text-slate-400'>Upload PAN Card (Only JPEG file is allowed)</div>
       <input type="file" name="card" onChange={handlefilechange} className='absolute sm:static hover:cursor-pointer scale-50 left-[-70px] top-[40px] sm:scale-75 md:scale-90 lg:scale-100' />
       </div>
       
       
       </div>

       <div className='flex gap-[20px] items-start'>
       <input
  type="checkbox"
  className="hover:cursor-pointer scale-50 sm:scale-90 md:scale-100"
  name="commitment"
  checked={form.commitment}
  onChange={handleformattributeonchange}
/>
       <div className='text-[8px] xs:text-xs md:text-sm'>I do hereby declare that PAN furnished/stated above is correct and belongs to me, registered as an account holder with www.ecomzy.com. I further declare that I shall solely be held responsible for the consequences, in case of any false PAN declaration.</div>
       </div>

       <div className='hover:cursor-pointer w-[80px] xs:w-[100px] text-[10px] xs:text-xs sm:text-sm rounded-sm text-white h-[30px] sm:h-[50px] bg-blue-500 flex justify-center items-center' onClick={submitform}>Upload</div>

       <div className='text-blue-500 text-[10px] xs:text-xs sm:text-sm'>Read Terms & Conditions of PAN Card Information</div>

    </div>
  )
}

export default Pancard;
