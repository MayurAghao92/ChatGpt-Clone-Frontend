import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteChat } from "../store/chatSlice";
import { logoutUser, clearUser } from "../store/authSlice";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  previousChats,
  currentChatId,
  startNewChat,
  selectChat,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [deletingChatId, setDeletingChatId] = useState(null);

  // Close sidebar on ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [setSidebarOpen]);

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to delete this chat? This action cannot be undone."
      )
    ) {
      setDeletingChatId(chatId);
      try {
        await dispatch(deleteChat(chatId)).unwrap();
      } catch (error) {
        console.error("Failed to delete chat:", error);
        alert("Failed to delete chat. Please try again.");
      } finally {
        setDeletingChatId(null);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearUser());
      // Don't navigate away, just clear the user state
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const getInitials = (fullname) => {
    if (!fullname) return "U";
    const { firstname = "", lastname = "" } = fullname;
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  const getDisplayName = (fullname) => {
    if (!fullname) return "User";
    const { firstname = "", lastname = "" } = fullname;
    return `${firstname} ${lastname}`.trim() || "User";
  };

  return (
    <div
      data-sidebar
      className="h-full bg-zinc-900 flex flex-col shadow-2xl w-64"
    >
      {/* Top Section */}
      <div className="p-3 border-b border-zinc-700">
        <button
          onClick={startNewChat}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg border border-zinc-600 hover:bg-zinc-800 transition-all duration-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New chat
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3">
          <h3 className="text-xs font-medium text-zinc-400 mb-3 px-3">
            Recent Chats
          </h3>
          {previousChats.length === 0 ? (
            <div className="px-3 py-4 text-center text-zinc-500 text-sm">
              No previous chats
            </div>
          ) : (
            <div className="space-y-1">
              {previousChats.map((chat) => (
                <div
                  key={chat.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredChatId(chat.id)}
                  onMouseLeave={() => setHoveredChatId(null)}
                >
                  <div
                    className={`flex items-center w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-zinc-800 transform hover:scale-[1.02] ${
                      currentChatId === chat.id ? "bg-zinc-800 shadow-lg" : ""
                    }`}
                  >
                    <button
                      onClick={() => selectChat(chat.id)}
                      className="flex-1 text-left truncate pr-2"
                      title={chat.title}
                    >
                      {chat.title}
                    </button>

                    {hoveredChatId === chat.id && (
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        disabled={deletingChatId === chat.id}
                        className="flex-shrink-0 p-1 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors duration-200 ml-2"
                        title="Delete chat"
                      >
                        {deletingChatId === chat.id ? (
                          <svg
                            className="w-4 h-4 animate-spin"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom User Section */}
      <div className="p-3 border-t border-zinc-700">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-all duration-200">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-orange-400 to-orange-600 rounded-sm flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {getInitials(user?.fullname)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {getDisplayName(user?.fullname)}
            </div>
            <div className="text-xs text-zinc-400">Free</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs bg-red-400 hover:bg-red-700 px-2 py-1 rounded transition-all duration-200 transform hover:scale-105"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
