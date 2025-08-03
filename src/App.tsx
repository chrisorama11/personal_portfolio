import React, { useState } from 'react';

const icons = [
  { id: 'about', label: 'About Me' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'writing', label: 'Writing' },
];

function App() {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  return (
    <div
      className="w-screen h-screen bg-cover bg-center text-black font-mono"
      style={{ backgroundImage: "url('/wallpaper.jpg')" }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-6">
        {icons.map((icon) => (
          <button
            key={icon.id}
            onClick={() => setActiveWindow(icon.id)}
            className="flex flex-col items-center justify-center gap-1 hover:opacity-80"
          >
            <img
              src={`/icons/${icon.id}.png`}
              alt={icon.label}
              className="w-12 h-12"
            />
            <span className="text-xs text-white">{icon.label}</span>
          </button>
        ))}
      </div>

      {activeWindow && (
        <div className="fixed top-1/2 left-1/2 w-[400px] h-[300px] bg-white text-black p-4 shadow-xl border border-gray-400 -translate-x-1/2 -translate-y-1/2">
          <div className="flex justify-between items-center border-b pb-1 mb-2">
            <strong>{activeWindow.toUpperCase()}</strong>
            <button onClick={() => setActiveWindow(null)} className="text-red-500 hover:underline">X</button>
          </div>
          <div className="overflow-auto text-sm whitespace-pre-wrap">
            {activeWindow === 'terminal'
              ? 'ASCII terminal output would go here...'
              : `Placeholder content for ${activeWindow}.`}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
