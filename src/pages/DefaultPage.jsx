import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import {useUser} from '@clerk/clerk-react'
import Spinner from '../components/Spinner';

const DefaultPage = () => {
  const navigate=useNavigate();
  const {isSignedIn}=useUser();
  
  useEffect(() => {
    function callback() {
      if (isSignedIn) {
        navigate('/home');
      } else {
        navigate('/sign-in');
      }
    }

    callback();
  }, []);


  return (
    <div>
         {isSignedIn && <div className='w-screen h-screen flex justify-center items-center'>
         
            <Spinner />
         
         </div>}

    </div>
   
    
  )
}

export default DefaultPage;
