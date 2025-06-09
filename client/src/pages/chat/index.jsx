import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ChatContainer from './components/chat-container';
import ContactsContainer from './components/contacts-container';
import EmptyChatContainer from './components/empty-chat-container';

const Chat = () => {

  const {userInfo , selectedChatType} = useAppStore();
  const navigate = useNavigate();

  // const goToProfile = () => {
  //   navigate('/profile');
  // }

  useEffect(() => {
    if(!userInfo.profileSetup){
      toast("Please set up profile to continue!");
      navigate("/profile");
    }
  } , [userInfo , navigate]); 

  // console.log("userInfo from chats page " , userInfo);


  return (
    <div className = "flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer/>
      {
        selectedChatType === undefined ? ( <EmptyChatContainer/> 
        ) : (
          <ChatContainer/>
        )
      }
    </div>
  )
}

export default Chat
