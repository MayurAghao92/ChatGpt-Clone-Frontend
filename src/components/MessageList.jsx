import React from "react";

const MessageList = ({ messages, isLoading, messagesEndRef, formatTime }) => {
  return (
    <div className="flex-1 overflow-y-auto bg-zinc-950 px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message, index) => (
          <div
            key={message.id||index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            } animate-fadeIn`}
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div
              className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl px-4 py-3 shadow-lg ${
                message.sender === "user"
                  ? "bg-zinc-700 text-white rounded-3xl rounded-br-lg ml-12"
                  : "bg-zinc-800 text-zinc-100 rounded-3xl rounded-bl-lg mr-12"
              }`}
            >
              {/* Message content */}
              <div className="text-sm sm:text-base leading-relaxed mb-2">
                {message.text}
              </div>

              {/* Message timestamp and status */}
              <div
                className={`flex items-center gap-2 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span className="text-xs opacity-70 font-medium">
                  {formatTime(message.createdAt)}
                </span>

                {/* Read status for user messages */}
                {message.sender === "user" && (
                  <div className="flex">
                    <svg
                      className="w-4 h-4 opacity-70"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <svg
                      className="w-4 h-4 opacity-70 -ml-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-zinc-800 text-zinc-100 px-4 py-3 rounded-3xl rounded-bl-lg mr-12 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-xs text-zinc-400">AI is typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
                        