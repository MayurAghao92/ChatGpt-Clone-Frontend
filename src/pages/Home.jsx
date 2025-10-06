import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import {
  fetchChats,
  createNewChat,
  sendMessage,
  setActiveChat,
  setMessages,
  addUserMessage,
  addAiMessage,
  setSendingStarted,
  setSendingFinished,
  initializeActiveChatFromStorage,
  clearActiveChat,
} from "../store/chatSlice";
import { validateSession } from "../store/authSlice";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

const Home = () => {
  // Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chats, activeChatId, messages, isLoading, isSending } = useSelector(
    (state) => state.chat
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Local state for UI only
  const [userInput, setUserInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChatNameInput, setShowChatNameInput] = useState(false);
  const [chatNameInput, setChatNameInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [wasAuthenticated, setWasAuthenticated] = useState(isAuthenticated);

  // Refs

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const chatAreaRef = useRef(null);
  const chatNameInputRef = useRef(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Always validate session on page load to maintain authentication
        await dispatch(validateSession());
      } catch (error) {
        // Silently handle validation failure
      }

      // Initialize active chat from storage
      dispatch(initializeActiveChatFromStorage());

      // If user is authenticated after validation, fetch chats
      if (isAuthenticated) {
        try {
          await dispatch(fetchChats()).unwrap();
        } catch (error) {
          console.error("Failed to fetch chats:", error);
        }
      }
    };

    initializeApp();
  }, [dispatch]);

  // Separate effect to fetch chats when authentication state changes
  useEffect(() => {
    if (isAuthenticated && chats.length === 0) {
      dispatch(fetchChats());
    }
  }, [isAuthenticated, chats.length, dispatch]);

  // Restore chat messages when activeChatId is set and chats are loaded
  useEffect(() => {
    if (
      activeChatId &&
      chats.length > 0 &&
      isAuthenticated &&
      messages.length === 0
    ) {
      const chatExists = chats.find((chat) => chat.id === activeChatId);
      if (chatExists) {
        loadChatMessages(activeChatId);
      } else {
        // localStorage.removeItem("activeChatId");
        dispatch(clearActiveChat());
      }
    }
  }, [activeChatId, chats, isAuthenticated, messages.length, dispatch]);

  const loadChatMessages = useCallback(
    async (chatId) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chat/messages/${chatId}`,
          {
            withCredentials: true,
          }
        );
        const messages = response.data.messages;
        const formattedMessages = messages.map((msg) => ({
          id: msg._id,
          text: msg.content,
          sender: msg.role === "user" ? "user" : "ai",
          createdAt: msg.createdAt,
        }));
        dispatch(setMessages(formattedMessages));
      } catch (error) {
        console.error("Error loading chat messages:", error);
      }
    },
    [dispatch]
  );

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!activeChatId) return;

    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["polling", "websocket"],
      forceNew: true,
      reconnection: true,
      timeout: 20000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    // Listen for AI responses
    newSocket.on("ai-response", (data) => {
      console.log("Received AI response:", data);
      if (data.chat === activeChatId) {
        dispatch(addAiMessage({ message: data.content }));
        dispatch(setSendingFinished());
      }
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
      setSocket(null);
    };
  }, [dispatch, activeChatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus on chat name input when it becomes visible
  useEffect(() => {
    if (showChatNameInput && chatNameInputRef.current) {
      chatNameInputRef.current.focus();
    }
  }, [showChatNameInput]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmedInput = userInput.trim();
      if (!trimmedInput || !activeChatId || isSending || !socket) return;

      dispatch(setSendingStarted());
      dispatch(addUserMessage({ chatId: activeChatId, message: trimmedInput }));
      setUserInput("");

      // Emit message to socket
      socket.emit("ai-message", {
        chat: activeChatId,
        message: trimmedInput,
      });
    },
    [userInput, activeChatId, isSending, socket, dispatch]
  );

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const startNewChat = () => {
    setShowChatNameInput(true);
    setChatNameInput("");

    // Removed automatic sidebar closing - let user close it manually
  };

  const handleChatNameSubmit = async (e) => {
    e.preventDefault();
    if (!chatNameInput.trim()) return;

    try {
      await dispatch(createNewChat(chatNameInput.trim()));
      setShowChatNameInput(false);
      setChatNameInput("");

      // Removed automatic sidebar closing - let user close it manually
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleChatNameKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleChatNameSubmit(e);
    } else if (e.key === "Escape") {
      setShowChatNameInput(false);
      setChatNameInput("");
    }
  };

  const cancelChatNameInput = () => {
    setShowChatNameInput(false);
    setChatNameInput("");
  };

  const selectChat = useCallback(
    async (chatId) => {
      dispatch(setActiveChat(chatId));
      dispatch(setMessages([])); // Clear existing messages first
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chat/messages/${chatId}`,
          {
            withCredentials: true,
          }
        );
        // Use response.data.messages directly instead of calling getMessages again
        const messages = response.data.messages;
        // Transform messages to match frontend format
        const formattedMessages = messages.map((msg) => ({
          id: msg._id,
          text: msg.content,
          sender: msg.role === "user" ? "user" : "ai",
          createdAt: msg.createdAt,
        }));
        dispatch(setMessages(formattedMessages));
      } catch (error) {
        console.error("Error loading chat messages:", error);
      }
      // Removed automatic sidebar closing - let user close it manually
    },
    [dispatch]
  );

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle window resize to manage sidebar state
  useEffect(() => {
    const handleResize = () => {
      // Only close sidebar on mobile, don't auto-open on desktop
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
      // Removed the auto-opening logic for desktop
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle clicking outside sidebar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector("[data-sidebar]");
      const toggleButton = document.querySelector("[data-sidebar-toggle]");

      if (sidebarOpen && sidebar && toggleButton) {
        // Check if click is outside sidebar and not on toggle button
        if (
          !sidebar.contains(event.target) &&
          !toggleButton.contains(event.target)
        ) {
          setSidebarOpen(false);
        }
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  // Handle authentication state changes - reload if user logs out while in a chat
  useEffect(() => {
    if (wasAuthenticated && !isAuthenticated && activeChatId) {
      // User was authenticated, now they're not, and they were in a chat - reload the page
      window.location.reload();
    }
    setWasAuthenticated(isAuthenticated);
  }, [isAuthenticated, wasAuthenticated, activeChatId]);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Chat Name Input Modal */}
      {showChatNameInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md border border-zinc-700">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Name your new chat
            </h3>
            <form onSubmit={handleChatNameSubmit}>
              <input
                ref={chatNameInputRef}
                type="text"
                value={chatNameInput}
                onChange={(e) => setChatNameInput(e.target.value)}
                onKeyDown={handleChatNameKeyPress}
                placeholder="Enter chat name..."
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={50}
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={cancelChatNameInput}
                  className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!chatNameInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed lg:relative top-0 left-0 h-full z-50 lg:z-auto transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
      >
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          previousChats={chats}
          currentChatId={activeChatId}
          startNewChat={startNewChat}
          selectChat={selectChat}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <ChatHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {messages.length === 0 ? (
          <div className="flex-1 flex items-center bg-zinc-950 justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="mb-8">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome to Lexa AI
                </h2>
                <p className="text-zinc-400 text-sm">
                  {isAuthenticated
                    ? "Start a conversation by creating a new chat or asking a question."
                    : "Sign in to start chatting with Lexa AI."}
                </p>
              </div>

              {isAuthenticated ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                    <div className="text-zinc-300 font-medium mb-1">
                      Creative Writing
                    </div>
                    <div className="text-zinc-500">Help me write a story</div>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                    <div className="text-zinc-300 font-medium mb-1">
                      Code Assistant
                    </div>
                    <div className="text-zinc-500">Debug my JavaScript</div>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                    <div className="text-zinc-300 font-medium mb-1">
                      Learning
                    </div>
                    <div className="text-zinc-500">Explain a concept</div>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                    <div className="text-zinc-300 font-medium mb-1">
                      Planning
                    </div>
                    <div className="text-zinc-500">Help me organize tasks</div>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-700">
                  <h3 className="text-lg font-medium text-white mb-3">
                    Get Started with Lexa AI
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4">
                    Create an account or sign in to start having intelligent
                    conversations with our AI assistant.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => navigate("/login")}
                      className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="px-4 py-2 text-sm border border-zinc-600 hover:bg-zinc-800 text-white rounded-lg transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <MessageList
            messages={messages}
            isLoading={isSending}
            messagesEndRef={messagesEndRef}
            formatTime={formatTime}
          />
        )}

        {/* Only show MessageInput when a chat is active AND user is authenticated */}
        {activeChatId && isAuthenticated && (
          <MessageInput
            userInput={userInput}
            setUserInput={setUserInput}
            handleSubmit={handleSubmit}
            handleKeyPress={handleKeyPress}
            isLoading={isSending}
            textareaRef={textareaRef}
          />
        )}
      </div>
    </div>
  );
};



export default Home;
