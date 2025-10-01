import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024; // lg breakpoint
    }
    return false;
  });
  const [previousChats, setPreviousChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showChatNameInput, setShowChatNameInput] = useState(false);
  const [chatNameInput, setChatNameInput] = useState("");

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const chatAreaRef = useRef(null);
  const chatNameInputRef = useRef(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newMessage = {
      id: Date.now(),
      text: userInput,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "I understand your message. This is a simulated AI response. In a real implementation, this would connect to an AI service like OpenAI's GPT API to provide intelligent responses based on your input.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const startNewChat = () => {
    setShowChatNameInput(true);
    setChatNameInput("");
  };

  const handleChatNameSubmit = (e) => {
    e.preventDefault();
    if (!chatNameInput.trim()) return;

    const newChat = {
      id: Date.now(),
      title: chatNameInput.trim(),
      lastMessage: "Started new conversation",
      timestamp: new Date().toISOString(),
      createdAt: Date.now(), // Add creation timestamp for sorting
    };

    // Add new chat at the beginning (top) of the array
    setPreviousChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI assistant. How can I help you today?",
        sender: "ai",
        timestamp: new Date().toISOString(),
      },
    ]);

    // Reset chat name input state
    setShowChatNameInput(false);
    setChatNameInput("");

    // Don't close sidebar on desktop when starting new chat
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
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

  const selectChat = (chatId) => {
    setCurrentChatId(chatId);
    // Don't close sidebar on desktop when selecting chat
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI assistant. How can I help you today?",
        sender: "ai",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle window resize to manage sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
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

      {/* Sidebar Container - Hidden when chat name input is shown */}
      {!showChatNameInput && (
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            sidebarOpen ? "w-64" : "w-0"
          }`}
        >
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            previousChats={previousChats}
            currentChatId={currentChatId}
            startNewChat={startNewChat}
            selectChat={selectChat}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${showChatNameInput ? 'w-full' : ''}`}>
        <ChatHeader sidebarOpen={sidebarOpen && !showChatNameInput} setSidebarOpen={setSidebarOpen} />

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
                  Start a conversation by creating a new chat or asking a
                  question.
                </p>
              </div>

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
                  <div className="text-zinc-300 font-medium mb-1">Learning</div>
                  <div className="text-zinc-500">Explain a concept</div>
                </div>
                <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
                  <div className="text-zinc-300 font-medium mb-1">Planning</div>
                  <div className="text-zinc-500">Help me organize tasks</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <MessageList
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
            formatTime={formatTime}
          />
        )}

        <MessageInput
          userInput={userInput}
          setUserInput={setUserInput}
          handleSubmit={handleSubmit}
          handleKeyPress={handleKeyPress}
          isLoading={isLoading}
          textareaRef={textareaRef}
        />
      </div>

      {/* Mobile Backdrop - Only show when sidebar is open and chat name input is not shown */}
      {sidebarOpen && !showChatNameInput && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;