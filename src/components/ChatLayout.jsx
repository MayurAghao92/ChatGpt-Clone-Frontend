import Sidebar from "./Sidebar";
import { useState } from "react";

 function ChatLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Conditionally render the sidebar */}
      {sidebarOpen && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          previousChats={[]} // Replace with real data
          currentChatId={null}
          startNewChat={() => {}}
          selectChat={() => {}}
        />
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header with Menu Button */}
        <div className="p-4 bg-zinc-800 text-white">
          <button onClick={() => setSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Chat Content (children) */}
        <div className="flex-1 bg-zinc-950 text-white p-4 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ChatLayout;