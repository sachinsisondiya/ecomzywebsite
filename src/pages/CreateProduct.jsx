import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import CategoryList from '../Constants/Categorieslists';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';



const CreateProduct = () => {
  const { register, handleSubmit, setValue, reset, watch } = useForm();
  const [imageUrlPreview, setImageUrlPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [watchedFile,setwatchfile] = useState(null);
  
  const {user,isSignedIn}=useUser();
  


 const navigate=useNavigate();
 
 useEffect(() => {
    
  if (!isSignedIn) {
    navigate("/sign-in");
  }
}, [isSignedIn, navigate]);
  

  const onSubmit = async(data) => {
    try{
      if(data.category && data.description && data.price && data.title && data.url && user.id){
      setLoading(true);
    console.log(data);
    console.log("this is the user id : ",user.id);
    const obj={
      user:user.id,
      category:data.category,
      description:data.description,
      price:data.price,
      title:data.title,
      image:data.url
    }
    console.log("this is obj ",obj);
    const res= await axios.post('https://ecomzyserver4.onrender.com/api/v1/uploadProducts',obj);
    

    console.log("this is response : ",res);

    toast.success("product is uploaded");
    setLoading(false);

      }
    else{
      toast.error('kindly fill all the details properly');
    }


  }
  catch(error){
    console.log("this is the error ",error);
    setLoading(false);
    toast.error("An error occured ! kindly retry");
  }


    reset();
  };




  const uploadFile = async () => {
    try {
      
      const formData = new FormData();
      formData.append('imageFile', watchedFile); // Use watch('file') to get the File object
      console.log('FormData:', formData);
      setLoading(true);
      const response = await axios.post(
        'https://ecomzyserver4.onrender.com/api/v1/uploadImage',
        formData,  
      );
      
      setLoading(false);
      console.log('Image uploaded to Cloudinary:', response);
      const url = response.data.imageUrl;
      console.log("this is url : ",url);
      
      setValue('url', url);
    } 
    catch (error) {
    
      console.error('Error uploading image : ', error);
      
    }
  };


  const handleCategoryChange = (event) => {
    setValue('category', event.target.value);
  };

  const handleFileChange = (event) => {
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
      
      // setValue('file', file); 
    }
  };






  return (

    <>
    { loading ? 
     <div className='w-screen h-screen flex justify-center items-center'>
     <Spinner />
     </div>
    :
    <div className='w-screen flex justify-center p-3 '>

      <form
        className='w-full xs:w-10/12 sm:w-6/12 p-2 flex gap-[30px] flex-col '
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex flex-col gap-[20px] items-center justify-center'>
          <div className='w-[150px] flex justify-center items-center h-[150px] rounded-full bg-slate-300'>
            {imageUrlPreview ? (
              <img
                src={imageUrlPreview}
                alt='Preview'
                className='w-[150px] h-[150px] rounded-full'
              />
            ) : (
              <MdOutlineAddPhotoAlternate className='w-[30px] h-[30px] sm:w-[50px] sm:h-[50px]' />
            )}
          </div>

          <input {...register('file')} type='file' onChange={handleFileChange} className='sm:scale-100 scale-75' />

          <button
            type='button'
            onClick={uploadFile}
            className='bg-blue-500 text-white text-[10px] sm:text-sm md:text-md rounded-lg p-2'
          >
            Upload photo
          </button>
        </div>

        <input {...register('title')} type='text' placeholder='Title' className='p-2 text-center outline-none border rounded-md' />

        <input {...register('description')} type='text' placeholder='Description' className='text-center p-2 h-[100px] outline-none border rounded-md' />
        
        <input {...register('price')} type='number' placeholder='Price' className='p-2 w-6/12 text-center outline-none border mx-auto rounded-md' />
        
        <label htmlFor='category' className='text-center flex gap-[10px] items-center p-2'>
          <div>Category:</div>
         
          <select
            id='category'
            {...register('category')}
            onChange={handleCategoryChange}
            className='p-2 outline-none border rounded-md'
          >
            <option value='' disabled>Select a category</option>
            {CategoryList.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <button
          type='submit'
          className='bg-blue-500 w-[100px] mx-auto text-white p-2 rounded-md mt-4'
        >
          Submit
        </button>
      </form>
    </div>}
    </>
  );
};

export default CreateProduct;
