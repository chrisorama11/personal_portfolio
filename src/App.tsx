import React from "react";
import Window from "./components/Window";
import { useWindowManager } from "./windowing/useWindowManager";
import type { WinState, WinKind } from "./windowing/types";

import About from "./sections/About";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Terminal from "./sections/Terminal";
import Writing from "./sections/Writing";

const icons: { kind: WinKind; label: string }[] = [
  { kind: "about", label: "About Me" },
  { kind: "projects", label: "Projects" },
  { kind: "experience", label: "Experience" },
  { kind: "terminal", label: "Terminal" },
  { kind: "writing", label: "Writing" },
];

function IconButton({
  iconId,
  label,
  onClick,
}: {
  iconId: WinKind; // you can change to string if you prefer
  label: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="group flex w-28 flex-col items-center outline-none">
      <img
        src={`/icons/${iconId}.png`}
        alt={label}
        className="h-14 w-14 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] transition-transform duration-100 group-hover:scale-105 group-active:scale-95"
        loading="lazy"
        decoding="async"
      />
      <span
        className="mt-2 max-w-[7rem] text-center text-[11px] leading-tight text-white
                   rounded px-2 py-1
                   bg-black/35 backdrop-blur-[2px]
                   drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]
                   group-hover:bg-black/45
                   focus-visible:ring-2 focus-visible:ring-sky-300"
      >
        {label}
      </span>
    </button>
  );
}

// optional: default spawn positions per app
const DEFAULT_POS: Record<WinKind, { x: number; y: number }> = {
  about: { x: 64, y: 80 },
  projects: { x: 360, y: 90 },
  experience: { x: 120, y: 320 },
  terminal: { x: 560, y: 60 },
  writing: { x: 740, y: 320 },
};

export default function App() {
  const { wm, open, close, minimize, toggleFullscreen, focus } = useWindowManager();

  const renderContent = (w: WinState) => {
    switch (w.kind) {
      case "about": return <About />;
      case "projects": return <Projects />;
      case "experience": return <Experience />;
      case "terminal": return <Terminal onExit={() => close(w.id)} />;
      case "writing": return <Writing />;
    }
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center font-mono"
      style={{ backgroundImage: "url('/wallpaper.jpg')" }}
    >
      {/* Desktop icons */}
      {/* Mobile/tablet: centered grid; Desktop: left column stack like ryOS */}
      <div className="p-6">
        {/* sm and down */}
        <div className="grid grid-cols-3 gap-y-8 gap-x-6 place-items-center sm:hidden">
          {icons.map((icon) => (
            <IconButton
              key={icon.kind}
              iconId={icon.kind}
              label={icon.label}
              onClick={() => open(icon.kind)}
            />
          ))}
        </div>

        {/* md and up: vertical stack on the left */}
        <div className="hidden sm:block">
          <div className="absolute left-6 top-16 flex flex-col gap-7">
            {icons.map((icon) => (
              <IconButton
                key={icon.kind}
                iconId={icon.kind}
                label={icon.label}
                onClick={() => open(icon.kind)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Render ALL open windows */}
      {wm.order.map((id) => {
        const w = wm.byId[id];
        if (!w.open) return null;

        // Only Terminal: borderless frame + no inner padding
        const isTerminal = w.kind === "terminal";
        const frameClassName =
          isTerminal ? "bg-[#0b1f3a] border-0 shadow-none rounded-none text-neutral-200" : undefined;
        const contentClassName =
          isTerminal ? "overflow-hidden p-0 bg-transparent" : undefined;

        return (
          <Window
            key={id}
            title={w.title}
            zIndex={w.z}
            onClose={() => close(id)}
            onMinimize={() => minimize(id)}
            onToggleFullscreen={() => toggleFullscreen(id)}
            onFocus={() => focus(id)}
            contentClassName={contentClassName}
            frameClassName={frameClassName}
            initialX={DEFAULT_POS[w.kind].x}
            initialY={DEFAULT_POS[w.kind].y}
          >
            {renderContent(w)}
          </Window>
        );
      })}
    </div>
  );
}
