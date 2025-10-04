import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./chatSlice";
import authSlice from "./authSlice";

export const store = configureStore({
  reducer: {
    chat: chatSlice,
    auth: authSlice,
  },
});
