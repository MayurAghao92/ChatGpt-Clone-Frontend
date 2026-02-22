import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Thunks
export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chat`, {
        withCredentials: true,
      });
      // Extract the chats array from the response
      return response.data.chats || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chats",
      );
    }
  },
);

export const createNewChat = createAsyncThunk(
  "chat/createNewChat",
  async (title, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chat`,
        { title },
        { withCredentials: true },
      );
      return response.data.chat;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create chat",
      );
    }
  },
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatId, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chat/${chatId}/message`,
        { message },
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message",
      );
    }
  },
);

export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/chat/${chatId}`, {
        withCredentials: true,
      });
      return { chatId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete chat",
      );
    }
  },
);

// Helper functions for localStorage
const saveActiveChatId = (chatId) => {
  if (chatId) {
    localStorage.setItem("activeChatId", chatId);
  } else {
    localStorage.removeItem("activeChatId");
  }
};

const getStoredActiveChatId = () => {
  return localStorage.getItem("activeChatId");
};

// Slice
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    activeChatId: null, // Don't load from localStorage here
    messages: [],
    isLoading: false,
    isSending: false,
    error: null,
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChatId = action.payload;
      saveActiveChatId(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload || [];
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addUserMessage: (state, action) => {
      const { message } = action.payload;
      state.messages.push({
        id: Date.now(),
        text: message,
        sender: "user",
        timestamp: new Date().toISOString(),
      });
    },
    addAiMessage: (state, action) => {
      const { message } = action.payload;
      state.messages.push({
        id: Date.now() + Math.random(),
        text: message,
        sender: "ai",
        timestamp: new Date().toISOString(),
      });
    },
    setSendingStarted: (state) => {
      state.isSending = true;
    },
    setSendingFinished: (state) => {
      state.isSending = false;
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
    removeChatFromState: (state, action) => {
      const chatId = action.payload;
      state.chats = state.chats.filter((chat) => chat.id !== chatId);
      if (state.activeChatId === chatId) {
        state.activeChatId = null;
        state.messages = [];
      }
    },
    clearActiveChat: (state) => {
      state.activeChatId = null;
      state.messages = [];
      localStorage.removeItem("activeChatId");
    },
    initializeActiveChatFromStorage: (state) => {
      const storedChatId = getStoredActiveChatId();
      if (storedChatId) {
        state.activeChatId = storedChatId;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure we always have an array
        state.chats = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.chats = []; // Ensure it's still an array on error
        state.error = action.payload;
      })
      .addCase(createNewChat.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewChat.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.chats.unshift(action.payload);
          state.activeChatId = action.payload.id;
          state.messages = [];
          saveActiveChatId(action.payload.id);
        }
      })
      .addCase(createNewChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        if (action.payload?.response) {
          state.messages.push({
            id: Date.now(),
            text: action.payload.response,
            sender: "ai",
            timestamp: new Date().toISOString(),
          });
        }
        state.isSending = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      })
      .addCase(deleteChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.isLoading = false;
        const { chatId } = action.payload;
        state.chats = state.chats.filter((chat) => chat.id !== chatId);
        if (state.activeChatId === chatId) {
          state.activeChatId = null;
          state.messages = [];
          localStorage.removeItem("activeChatId");
        }
        state.error = null;
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setActiveChat,
  setMessages,
  clearMessages,
  addUserMessage,
  addAiMessage,
  setSendingStarted,
  setSendingFinished,
  addMessage,
  clearActiveChat,
  initializeActiveChatFromStorage,
} = chatSlice.actions;

export default chatSlice.reducer;
