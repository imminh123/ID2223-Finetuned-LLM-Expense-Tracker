import React from "react";
import ChatUI from "./ChatUI";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="w-full max-w-md bg-base-100 shadow-xl rounded-lg p-4">
        <ChatUI />
      </div>
    </div>
  );
};

export default App;