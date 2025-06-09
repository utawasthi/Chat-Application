import { useAppStore } from '@/store';
import { HOST } from '@/utils/constants';
import {createContext , useContext , useEffect , useRef} from 'react'

import {io} from 'socket.io-client'

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({children}) => {
  const socket = useRef();
  const {selectedChatData , selectedChatType , addMsg , userInfo} = useAppStore();

  if(userInfo && !socket.current){
    socket.current = io(HOST , {
      withCredentials : true,
      query : {userId : userInfo.id},
    });
  }

  useEffect(() => {

    if(!socket.current) return;

    socket.current.on("connect" , () => {
      console.log("Connected to socket server");
    });

    const handleReceiveMsg = (msg) => {
      if(selectedChatType !== undefined && 
        (selectedChatData._id === msg.sender._id || 
          selectedChatData._id === msg.recipient._id
        )
      ){
        // console.log("message received-->", msg);
        addMsg(msg);
      }
    }

    socket.current.on("receiveMsg" , handleReceiveMsg);

    return () => {
      socket.current.disconnect();
    };
    
  } , [selectedChatType, selectedChatData, addMsg]);

  return (
    <SocketContext.Provider value = {socket.current}>
      {children}
    </SocketContext.Provider>
  )
}