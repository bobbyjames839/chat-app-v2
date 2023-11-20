import React from 'react';
import { auth, provider } from './Firebase-config';
import image from './login.jpg';
import Cookies from "universal-cookie";
import { signInWithPopup } from "firebase/auth";

const cookies = new Cookies();

const Login = (props) => {

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      cookies.set('auth-token', result.user.refreshToken);
      props.setIsAuth(true);
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className='flex items-center justify-center bg-cover bg-center h-screen w-screen' style={{backgroundImage: `url(${image})`}}>
      <div className='loginSlide flex flex-col items-center p-3 backdrop-blur-md border-[1.5px] text-white border-white rounded-xl'>
        <p className='text-4xl'>Hello again!</p>
        <p className='tracking-wide text-[18px]'>Welcome back, you've been missed.</p>
        <p className='bg-green-500 hover:bg-green-700 hover:cursor-pointer duration-200 text-[14px] font-bold mt-6 px-20 py-[5px] rounded-xl' onClick={login}>Sign in</p>
      </div>
    </div>
  )
}

export default Login