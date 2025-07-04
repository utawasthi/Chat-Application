export const createChatSlice = (set , get) => ({
  selectedChatType : undefined,
  selectedChatData : undefined,
  selectedChatMessages : [],
  directMessagesContacts : [],

  isUploading : false,
  isDownloading : false,
  fileUploadProgress : 0,
  fileDonwloadProgress : 0,
  
  setIsUploading : (isUploading) => set({isUploading}),
  setIsDownloading : (isDownloading) => set({isDownloading}),
  setFileUploadProgress : (fileUploadProgress) => set({fileUploadProgress}),
  setFileDownloadProgress : (fileDownloadProgress) => set({fileDownloadProgress}),

  setSelectedChatType : (selectedChatType) => set({selectedChatType}),
  setSelectedChatData : (selectedChatData) => set({selectedChatData}),
  setSelectedChatMessages : (selectedChatMessages) => set({selectedChatMessages}),
  setDirectMessagesContacts : (directMessagesContacts) => set({directMessagesContacts}),

  closeChat : () => set({
    selectedChatData : undefined ,
    selectedChatType : undefined ,
    selectedChatMessages : [],
  }),

  addMsg : (msg) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages : [
        ...selectedChatMessages,
        {
          ...msg , 
          recipient : selectedChatType === "channel" ? msg.recipient : msg.recipient._id,
          sender : selectedChatType === "channel" ? msg.sender : msg.sender._id,
        }
      ]
    })
  }
});