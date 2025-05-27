export const createChatSlice = (set , get) => ({
  selectedChatType : undefined,
  selectedChatData : undefined,
  selectedChatMessages : [],
  setSelectedChatType : (selectedChatType) => set({selectedChatType}),
  setSelectedChatData : (selectedChatData) => set({selectedChatData}),
  setSelectedChatMessages : (selectedChatMessages) => set({selectedChatMessages}),
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
})