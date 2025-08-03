import React, { useState } from 'react';

import Window from './components/Window';

import About from './sections/About';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Terminal from './sections/Terminal';
import Writing from './sections/Writing';


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
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-y-10 gap-x-6 p-6 place-items-start">
        {icons.map((icon) => (
          <button
            key={icon.id}
            onClick={() => setActiveWindow(icon.id)}
            className="flex flex-col items-center gap-1 hover:opacity-80 w-20"
          >
            <img
              src={`/icons/${icon.id}.png`}
              alt={icon.label}
              className="w-12 h-12 object-contain"
            />
            <span className="text-xs text-white text-center">{icon.label}</span>
          </button>
        ))}
      </div>



      {activeWindow && (
        <Window title={activeWindow} onClose={() => setActiveWindow(null)}>
          {activeWindow === 'about' && <About />}
          {activeWindow === 'projects' && <Projects />}
          {activeWindow === 'experience' && <Experience />}
          {activeWindow === 'terminal' && <Terminal />}
          {activeWindow === 'writing' && <Writing />}
        </Window>
      )}


    </div>
  );
}

export default App;
