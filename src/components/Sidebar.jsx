import React, { useEffect } from "react";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  previousChats,
  currentChatId,
  startNewChat,
  selectChat,
}) => {
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

  return (
    <>
      {/* Backdrop for click outside */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        data-sidebar
        className={`fixed top-0 left-0 h-full bg-zinc-900 flex flex-col shadow-2xl z-50 transform transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          w-[70vw] sm:w-[60vw] lg:w-1/4 max-w-xs
        `}
      >
        {/* Top Section */}
        <div className="p-3 border-b border-zinc-700">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-zinc-200 tracking-wide">Menu</h2>
          </div>

          {/* New Chat Button */}
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
                  <button
                    key={chat.id}
                    onClick={() => selectChat(chat.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 truncate hover:bg-zinc-800 transform hover:scale-[1.02] ${
                      currentChatId === chat.id ? "bg-zinc-800 shadow-lg" : ""
                    }`}
                    title={chat.title}
                  >
                    {chat.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom User Section */}
        <div className="p-3 border-t border-zinc-700">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-all duration-200 cursor-pointer">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-sm flex items-center justify-center text-xs font-bold text-white">
              M
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Mayur Aghao</div>
              <div className="text-xs text-zinc-400">Free</div>
            </div>
            <button className="text-xs bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded transition-all duration-200 transform hover:scale-105">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
