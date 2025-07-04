import apiClient from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import {MdFolderZip} from 'react-icons/md';
import {IoMdArrowRoundDown} from 'react-icons/io';
import { IoCloseSharp } from "react-icons/io5";

const MessageContainer = () => {

  const scrollRef = useRef();
  const prevLastMsgId = useRef(null);
  const {
    selectedChatData ,
    selectedChatType , 
    selectedChatMessages , 
    setSelectedChatMessages,
    setIsDownloading,
    fileDownloadProgress,
    setFileDownloadProgress,
  } = useAppStore();

  const [showImage , setShowImage] = useState(false);
  const [imageURL , setImageURL] = useState(null);


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
    if (
      selectedChatMessages.length === 0 ||
      !scrollRef.current
    ) return;

    const lastMsg = selectedChatMessages[selectedChatMessages.length - 1];

    // Only scroll if a *new* message arrived
    if (lastMsg._id !== prevLastMsgId.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      prevLastMsgId.current = lastMsg._id;
    }

  }, [selectedChatMessages]);


  const checkIfImage = (filePath) => {
    if (!filePath) return false;
    const extensionRegex = /\.(jpeg|jpg|png|gif|bmp|webp|svg)$/i;
    return extensionRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    const response = await apiClient.get(
      `${HOST}/${url}` ,
      {
        responseType : 'blob', // blob = binary large object that browser can understand 
        onDownloadProgress : (progressEvent) => {
          const {loaded , total} = progressEvent;
          const percentCompleted = Math.round((loaded * 100) / total);
          setFileDownloadProgress(percentCompleted)
        }
      } 
    );

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download' , url.split('/').pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
  }


  const renderDmMessages = (msg) => {
    // console.log("message dekho bhayon --> ",msg);
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
        {
          msg.msgType === 'file' && (
            <div 
              className = {`${msg.sender !== selectedChatData. _id ? 
              "bg-[#8417ff]/5  text-[#8217ff]/90 border-[#8417ff]/50" :  
              "bg-[#2a2b33]/5  text-white/90 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`} 
            >
              
              {checkIfImage(msg.fileUrl) ? 
              <div className="cursor-pointer"
                   onClick = {() => {
                    setShowImage(true);
                    setImageURL(msg.fileUrl);
                   }} 
              >
                <img src = {`${HOST}/${msg.fileUrl}`} height={300} width={300}/>
              </div> 
              : 
              <div className = 'flex items-center justify-center gap-4'>
                <span 
                  className = 'text-white/8 text-3xl bg-black/20 rounded-full p-3'>
                  <MdFolderZip/>
                </span>
                <span>{msg.fileUrl.split("/").pop()}</span>
                <span 
                  className = 'bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                  onClick = {() => downloadFile(msg.fileUrl)}
                 >
                  <IoMdArrowRoundDown/>
                 </span>
              </div>}

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
      {
        showImage && <div className = 'fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col'>
          <div>
            <img src = {`${HOST}/${imageURL}`}
                className = 'h-[80vh] w-full bg-cover'
            />
          </div>
          <div className = "flex gap-5 fixed top-0 mt-5">
             <button
                className = 'bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                onClick = {() => downloadFile(imageURL)}
             >
             <IoMdArrowRoundDown/>
             </button>
             <button
                className = 'bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                onClick = { () => {
                   setShowImage(false);
                   setImageURL(null);
                  }
                }
             >
               <IoCloseSharp/>
             </button>
          </div>
        </div>
      }
    </div>
  )
}

export default MessageContainer