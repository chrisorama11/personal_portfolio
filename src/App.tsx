import React, { useEffect } from "react";
import Window from "./components/Window";
import { useWindowManager } from "./windowing/useWindowManager";
import type { WinState, WinKind } from "./windowing/types";

import About from "./sections/About";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Terminal from "./sections/Terminal";
import Writing from "./sections/Writing";

/* ---------------------------------- */
/* Desktop icons config               */
/* ---------------------------------- */
const icons: { kind: WinKind; label: string }[] = [
  { kind: "about",      label: "About Me" },
  { kind: "projects",   label: "Projects" },
  { kind: "experience", label: "Experience" },
  { kind: "terminal",   label: "Terminal" },
  { kind: "writing",    label: "Writing" },
];


const BASE_POS: Record<WinKind, { x: number; y: number }> = {
  about:      { x: 320, y: 72 },  // placed to the right of icon column
  projects:   { x: 640, y: 96 },
  experience: { x: 420, y: 320 },
  terminal:   { x: 720, y: 64 },
  writing:    { x: 820, y: 320 },
};

// Mobile spawn spots (under the icon grid)
const MOBILE_POS: Record<WinKind, { x: number; y: number }> = {
  about:      { x: 16,  y: 360 },   // under the top icon grid, left-aligned
  projects:   { x: 16,  y: 360 },
  experience: { x: 16,  y: 360 },
  terminal:   { x: 16,  y: 360 },
  writing:    { x: 16,  y: 360 },
};

function resolvePos(kind: WinKind) {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const isMobile = vw < 640;

  if (isMobile) {
    // Spawn below the mobile icon grid
    return MOBILE_POS[kind];
  }

  // Desktop/tablet: keep windows out of the left icon column
  const base = BASE_POS[kind];
  const SAFE_LEFT = 200;                // margin right of the left icon column
  const MIN_X = SAFE_LEFT;
  const MAX_X = Math.max(0, vw - 360);  // keep some width buffer

  const x = Math.max(MIN_X, Math.min(base.x, MAX_X));
  const y = base.y;

  return { x, y };
}

/* ---------------------------------- */
/* IconButton (inline component)      */
/* ---------------------------------- */
function IconButton({
  iconId,
  label,
  onClick,
}: {
  iconId: WinKind;
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

export default function App() {
  const { wm, open, close, minimize, toggleFullscreen, focus } = useWindowManager();

  // Auto-open About on first load (every load; change to sessionStorage if you want once per session)
  useEffect(() => {
    open("about");
  }, [open]);

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

      {/* Render ALL open windows in stacking order */}
      {wm.order.map((id) => {
        const w = wm.byId[id];
        if (!w.open) return null;

        // Terminal: borderless frame + no inner padding
        const isTerminal = w.kind === "terminal";
        const frameClassName =
          isTerminal ? "bg-[#0b1f3a] border-0 shadow-none rounded-none text-neutral-200" : undefined;
        const contentClassName =
          isTerminal ? "overflow-hidden p-0 bg-transparent" : undefined;

        const pos = resolvePos(w.kind);
        const initialW = w.kind === "about" ? 840 : undefined;  // width px
        const initialH = w.kind === "about" ? 580 : undefined;  // height px

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
            initialX={pos.x}
            initialY={pos.y}
            initialW={initialW}
            initialH={initialH}
          >
            {renderContent(w)}
          </Window>
        );
      })}
    </div>
  );
}
