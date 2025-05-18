import React from "react";

const AuthBackground = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 z-0"></div>

      {/* Decorative elements */}
      <div className="absolute inset-0 z-10">
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1.5px,transparent_1.5px)] bg-[size:20px_20px]"></div>

        {/* Top-left decorative circle */}
        <div className="absolute -left-20 -top-20 w-96 h-96 bg-emerald-400 rounded-full opacity-20 blur-xl"></div>

        {/* Bottom-right decorative circle */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-300 rounded-full opacity-20 blur-xl"></div>

        {/* Center decorative element */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-2 border-emerald-200 rounded-full opacity-10"></div>

        {/* Additional tiny circles scattered around */}
        <div className="absolute top-[15%] right-[20%] w-12 h-12 bg-white rounded-full opacity-10"></div>
        <div className="absolute bottom-[15%] left-[20%] w-8 h-8 bg-white rounded-full opacity-10"></div>
        <div className="absolute top-[80%] right-[35%] w-6 h-6 bg-white rounded-full opacity-10"></div>
        <div className="absolute top-[30%] left-[25%] w-10 h-10 bg-white rounded-full opacity-10"></div>
      </div>

      {/* Content container with frosted glass effect for modern feel */}
      <div className="z-20 w-full max-w-md px-4 relative">
        <div className="absolute inset-0 bg-white bg-opacity-5 backdrop-blur-sm rounded-xl"></div>
        {children}
      </div>
    </div>
  );
};

export default AuthBackground;
