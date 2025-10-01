import React from "react";

const MessageInput = ({
  userInput,
  setUserInput,
  handleSubmit,
  handleKeyPress,
  isLoading,
  textareaRef,
}) => {
  return (
    <div className="bg-zinc-950 px-4 pb-6">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3 bg-zinc-800 rounded-3xl p-3 shadow-lg">
           

            <textarea
              ref={textareaRef}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent text-white placeholder-zinc-400 resize-none focus:outline-none py-2 px-2 max-h-32 text-sm sm:text-base"
              rows="1"
              disabled={isLoading}
              style={{ minHeight: "24px" }}
            />

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-700"
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
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>

              <button
                type="submit"
                disabled={!userInput.trim() || isLoading}
                className="p-2.5 bg-zinc-600 text-white rounded-full disabled:bg-zinc-700 disabled:text-zinc-500 hover:bg-zinc-500 transition-colors disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:transform-none"
              >
                {isLoading ? (
                  <svg
                    className="w-5 h-5 animate-spin"
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
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>

        <p className="text-xs text-zinc-500 text-center mt-3">
          Lexa AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

export default MessageInput;
