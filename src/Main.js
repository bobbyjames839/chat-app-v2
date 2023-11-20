import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from './Firebase-config';
import image from './login.jpg';
import Cookies from "universal-cookie";
import { signOut } from "firebase/auth";
import userEvent from '@testing-library/user-event';
import { useAuthState } from 'react-firebase-hooks/auth';
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore';

const cookies = new Cookies();

const Main = (props) => {

  const [room, setRoom] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const [messages, setMessages] = useState([]); 
  const msgRef = collection(db, 'messages');
  const roomInputRef = useRef(null);
  const [user] = useAuthState(auth);

  const joinRoom = () => {
    const div = document.getElementById('joinRoom');
    const input = document.getElementById('inputRoom');

    div.classList.add('join-room-moved');

    setTimeout(() => {
      setRoom(roomInputRef.current.value);
      div.classList.remove('join-room-moved');
      input.value = '';
    }, 1000)
  }

  useEffect(() => {
    const queryMessages = query(msgRef, where('room', '==', room));
    const unSubscribe = onSnapshot(queryMessages, (snapshot) => {
      let msgs = [];
      snapshot.forEach((doc) => {
        msgs.push({...doc.data(), id: doc.id});
      })
      setMessages(msgs)
    })
    return () => unSubscribe();
  }, [])

  const createMsg = async (e) => {
    e.preventDefault();
    if (newMsg === '') return;

    await addDoc(msgRef, {
      text: newMsg,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room: room,
    });
    setNewMsg('');
  }

  const logout = async () => {
    await signOut(auth);
    cookies.remove('auth-token');
    props.setIsAuth(false);
  }

  return (
    <div className=' flex items-center justify-center bg-cover bg-center h-screen w-screen' style={{backgroundImage: `url(${image})`}}>
      <button onClick={logout} className='text-white fixed top-[10px] right-[10px] border-[1.5px] border-white px-5 py-1 backdrop-blur-[2px] rounded text-[11px] hover:cursor-pointer'>Log Out</button>

      {room ? 
      
      <div className='backdrop-blur-[5px] text-white p-5 rounded border-2 border-white flex flex-col items-center loginSlide'>

        <div className='flex justify-between w-[380px]'>
          <p>You are in the room: <span className='text-[18px]'>{room}</span></p>
          <button className='bg-white text-black px-3 rounded' onClick={() => setRoom(null)}>Leave Room</button>
        </div>

        <div className='mb-3 flex flex-col mt-6 w-full py-2 border-t-[1.5px] border-b-[1.5px] border-white'>
          {messages.map((msg) => {
            return (
              <p className={msg.user === auth.currentUser.displayName ? 'my-1 px-2 rounded items-end w-fit bg-blue-300' : 'px-2 rounded my-1 items-start w-fit bg-blue-300'} key={msg.id}>{msg.text}</p>
            )
          })}
        </div>

        <div className='flex items-center mt-4'>
          <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} className='bg-inherit border-[1.5px] focus:outline-none border-white rounded w-[300px] px-2 py-1 mr-2' placeholder='Type message here...'/>
          <button onClick={createMsg} className='bg-white text-black rounded py-1 px-4 border-[1.5px] border-white'>Send</button>
        </div>

      </div>
      
      :
      
      <div className='backdrop-blur-[5px] text-white p-5 rounded border-2 border-white flex flex-col items-center' id='joinRoom'>
        <p className='text-[20px] text-gray-400'><span className='text-2xl text-white'>Hey, {user?.displayName},</span> you can message other people here</p>
        <p className='pt-10 w-full text-center'>Insert the name of the room you would like to join below.</p>
        <div className='flex justify-center pt-3 w-8/12'>
          <input id='inputRoom' ref={roomInputRef} className='bg-inherit border-[1.5px] px-2 w-8/12 py-1 mx-2 focus:outline-none border-white rounded' placeholder='Type here...'/>
          <button onClick={joinRoom} className='bg-white rounded text-black w-3/12 mx-2'>Join Room</button>
        </div>
      </div>}

    </div>
  )
}

export default Main