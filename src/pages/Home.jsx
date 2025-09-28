import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center  px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full text-center mt-10 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Welcome to Lexa AI
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Experience the power of AI conversation. Start chatting and explore
            endless possibilities.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="btn-primary text-lg px-8 py-3 w-full sm:w-auto">
            Start Chatting
          </button>
          <button className="border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 font-medium py-3 px-8 rounded-lg transition duration-200 w-full sm:w-auto">
            Learn More
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Natural Conversations
            </h3>
            <p className="text-gray-400 text-sm">
              Engage in human-like conversations with advanced AI
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Fast Responses
            </h3>
            <p className="text-gray-400 text-sm">
              Get instant, intelligent responses to your queries
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🔒</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-400 text-sm">
              Your conversations are protected and confidential
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
