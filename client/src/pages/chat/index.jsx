import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Chat = () => {

  const {userInfo} = useAppStore();
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/profile');
  }

  useEffect(() => {
    if(!userInfo.profileSetup){
      toast("Please set up profile to continue!");
      navigate("/profile");
    }
  } , [userInfo , navigate]); 

  console.log("userInfo from chats page " , userInfo);


  return (
    <div>
      Chat page is here
      <Button onClick = {goToProfile}>
        Profile
      </Button>
    </div>
  )
}

export default Chat
