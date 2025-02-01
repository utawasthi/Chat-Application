import { create } from "zustand";
import  createAuthSlice  from "./slices/auth-slice";
import { createChatSlice } from "./slices/chat-slice";

// ...a ---> rest operator that captures all the arguments passed by zustand's create method (set , get and api)

export const useAppStore = create((...a) => ({
  ...createAuthSlice(...a),
  ...createChatSlice(...a),
}));