import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef } from "react"


const MessageContainer = () => {

  const scrollRef = useRef();
  const {selectedChatData , selectedChatType , userInfo , selectedChatMessages , setSelectedChatMessages} = useAppStore();


  useEffect(() => {

    const getMessages = async () => {
       try{
          const response = await apiClient.get(
            GET_ALL_MESSAGES , 
            {
              params : {
                id : selectedChatData._id,
              },
              withCredentials : true,
            }
          );

          if(response.data.messages){
            setSelectedChatMessages(response.data.messages);
          }
       }
       catch(error){
        console.log(error);
       }
    }
     
    if(selectedChatData._id){
      if(selectedChatType === 'contact') getMessages();
    }
   } 
   , 
   [selectedChatData ,
     selectedChatType ,
      selectedChatMessages
    ]
  );

  useEffect(() => {
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({behavior : 'smooth'});
    }
  } , [selectedChatMessages]);


  const renderDmMessages = (msg) => {
    return (
      <div className = {`${msg.sender === selectedChatData._id ? 'text-left' : 'text-right'}`}>
        {
          msg.msgType === 'text' && (
            <div className = {`${msg.sender !== selectedChatData._id ? 
              "bg-[#8417ff]/5  text-[#8217ff]/90 border-[#8417ff]/50" :  
              "bg-[#2a2b33]/5  text-white/90 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`} >
              {msg.content}
            </div>
          )
        }
        <div className = 'text-xs text-gray-600'>
          {moment(msg.timestamp).format("LT")}
        </div>
    </div>
    )
  }

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((msg , index) => {
      const msgDate = moment(msg.timestamp).format("YYYY-MM-DD");
      const showDate = msgDate !== lastDate;
      lastDate = msgDate;
      return (
        <div key = {msg._id}>
           {showDate && (
            <div className = 'text-center text-gray-500 my-2'>
              {moment(msg.timestamp).format("LL")}
            </div>
           )}
           {
            selectedChatType === 'contact' && renderDmMessages(msg)
           }
        </div>
      )
    })
  }

  return (
    <div className = 'flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full'>
      {renderMessages()}
      <div ref = {scrollRef}/>
    </div>
  )
}

export default MessageContainer