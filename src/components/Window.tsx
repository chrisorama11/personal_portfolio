import React from 'react';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function Window({ title, children, onClose }: WindowProps) {
  return (
    <div className="fixed top-1/2 left-1/2 w-[90vw] sm:w-[600px] h-[70vh] bg-white text-black rounded-md shadow-lg border border-gray-400 -translate-x-1/2 -translate-y-1/2 overflow-hidden flex flex-col">
      
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-gray-200 border-b border-gray-400">
        <div className="flex items-center gap-2">
          {/* Close */}
          <button
            className="w-3 h-3 bg-red-500 rounded-full"
            onClick={onClose}
          ></button>
          {/* Minimize */}
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          {/* Fullscreen */}
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        <div className="w-10" /> {/* Spacer for symmetry */}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-auto text-sm">
        {children}
      </div>
    </div>
  );
}
