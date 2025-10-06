import React, { useState, useRef } from "react";

const MessageInput = ({
  userInput,
  setUserInput,
  handleSubmit,
  handleKeyPress,
  isLoading,
  textareaRef,
}) => {
  // Add file upload state and logic
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "text/plain",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB limit

      if (!validTypes.includes(file.type)) {
        alert(`File type not supported: ${file.type}`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`File too large: ${file.name}`);
        return false;
      }
      return true;
    });
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedFiles.length > 0) {
      console.log("Files selected:", selectedFiles);
      // TODO: Handle file upload
      setSelectedFiles([]);
    }
    handleSubmit(e);
  };

  return (
    <div className="bg-zinc-950 px-4 pb-6">
      <div className="max-w-4xl mx-auto">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* File preview */}
        {selectedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-zinc-800 rounded px-2 py-1 text-xs"
              >
                <span className="truncate max-w-20">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-400"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="relative">
          <div className="flex items-end gap-3 bg-zinc-800 rounded-3xl p-3 shadow-lg">
            {/* ...existing textarea... */}
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
              {/* Add click handler to existing file button */}
              <button
                type="button"
                onClick={handleFileButtonClick}
                disabled={isLoading}
                className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-700"
              >
                {/* ...existing file icon... */}
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

              {/* ...existing send button... */}
              <button
                type="submit"
                disabled={!userInput.trim() || isLoading}
                className="p-2.5 bg-zinc-600 text-white rounded-full disabled:bg-zinc-700 disabled:text-zinc-500 hover:bg-zinc-500 transition-colors disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 disabled:transform-none"
              >
                {/* ...existing button content... */}
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

        {/* ...existing help text... */}
        <p className="text-xs text-zinc-500 text-center mt-3">
          Lexa AI can make mistakes. Check important info.
          {selectedFiles.length > 0 &&
            ` • ${selectedFiles.length} file(s) selected`}
        </p>
      </div>
    </div>
  );
};

export default MessageInput;
