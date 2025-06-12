import React from "react";

const AuthBackground = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-gray-900">
      {/* Simple content container */}
      <div className="w-full max-w-md px-4">{children}</div>
    </div>
  );
};

export default AuthBackground;
