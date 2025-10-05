import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  return (
    <div className="bg-zinc-900 border-b border-zinc-700 px-4 py-3 flex items-center">
      {/* Only show hamburger when sidebar is closed */}
      {!sidebarOpen && (
        <button
          data-sidebar-toggle
          onClick={() => setSidebarOpen(true)}
          className="p-1.5 rounded-lg hover:bg-zinc-800 transition-all duration-200 transform hover:scale-105 mr-3"
          title="Show Menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      <div className="flex-1 flex justify-center">
        <h1 className="text-lg font-medium">Lexa AI</h1>
      </div>      
    </div>
  );
};

export default ChatHeader;
