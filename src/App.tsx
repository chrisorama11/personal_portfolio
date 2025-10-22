import React, { useEffect, useMemo, useRef, useState } from "react";
import Window from "./components/Window";
import { useWindowManager } from "./windowing/useWindowManager";
import type { WinState, WinKind } from "./windowing/types";
import { useLocation } from "react-router-dom";

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

type DockItem = {
  kind: WinKind;
  label: string;
  active: boolean;
  bouncing: boolean;
};


const BASE_POS: Record<WinKind, { x: number; y: number }> = {
  about:      { x: 320, y: 72 },  // tuned defaults for desktop layout
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
  const SAFE_LEFT = 200;                // keep a left gutter so windows don't hug the edge
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

/* ---------------------------------- */
/* Dock (desktop/tablet view)         */
/* ---------------------------------- */
function Dock({
  items,
  onOpen,
  onBounceComplete,
}: {
  items: DockItem[];
  onOpen: (kind: WinKind) => void;
  onBounceComplete: (kind: WinKind) => void;
}) {
  return (
    <div className="hidden sm:flex fixed bottom-6 left-1/2 -translate-x-1/2 items-end gap-4 rounded-3xl border border-white/25 bg-white/20 px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-lg">
      {items.map((item) => (
        <button
          key={item.kind}
          onClick={() => onOpen(item.kind)}
          className="group relative flex flex-col items-center outline-none"
          aria-label={item.label}
        >
          <span className="pointer-events-none absolute -top-8 whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100">
            {item.label}
          </span>
          <img
            src={`/icons/${item.kind}.png`}
            alt={item.label}
            className={`h-14 w-14 transform rounded-lg bg-white/40 p-2 shadow-md transition duration-150 group-hover:-translate-y-1 group-hover:scale-[1.08] ${item.bouncing ? "animate-[bounce_0.9s_ease-out_1]" : ""}`}
            loading="lazy"
            decoding="async"
            onAnimationEnd={() => onBounceComplete(item.kind)}
          />
          <span
            className={`mt-1 h-1.5 w-1.5 rounded-full bg-white/80 transition-opacity duration-150 group-hover:opacity-100 ${
              item.active ? "opacity-100" : "opacity-0"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const { wm, open, close, minimize, toggleFullscreen, focus } = useWindowManager();
  const location = useLocation();
  const [bounceMap, setBounceMap] = useState<Record<WinKind, boolean>>({
    about: false,
    projects: false,
    experience: false,
    terminal: false,
    writing: false,
  });
  const prevOpenRef = useRef<Record<WinKind, boolean>>({
    about: false,
    projects: false,
    experience: false,
    terminal: false,
    writing: false,
  });

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const requestedKind = useMemo<WinKind | null>(() => {
    const openParam = searchParams.get("open");
    if (!openParam) return null;
    return icons.some((icon) => icon.kind === openParam) ? (openParam as WinKind) : null;
  }, [searchParams]);

  const requestedPostSlug = searchParams.get("post") ?? undefined;

  // Auto-open About on first load unless a specific window was requested via query params
  useEffect(() => {
    if (requestedKind) return;
    open("about");
  }, [open, requestedKind]);

  useEffect(() => {
    if (requestedKind) {
      open(requestedKind);
    }
  }, [requestedKind, open]);

  useEffect(() => {
    const current: Record<WinKind, boolean> = {
      about: Boolean(wm.byId["about"]?.open),
      projects: Boolean(wm.byId["projects"]?.open),
      experience: Boolean(wm.byId["experience"]?.open),
      terminal: Boolean(wm.byId["terminal"]?.open),
      writing: Boolean(wm.byId["writing"]?.open),
    };
    const newlyOpened: WinKind[] = [];
    (Object.keys(current) as WinKind[]).forEach((kind) => {
      if (!prevOpenRef.current[kind] && current[kind]) {
        newlyOpened.push(kind);
      }
    });
    if (newlyOpened.length > 0) {
      setBounceMap((prev) => {
        const next = { ...prev };
        newlyOpened.forEach((kind) => {
          next[kind] = true;
        });
        return next;
      });
    }
    prevOpenRef.current = current;
  }, [wm.byId]);

  const dockItems: DockItem[] = icons.map((icon) => {
    const win = wm.byId[icon.kind];
    const isActive = Boolean(win?.open);
    return {
      kind: icon.kind,
      label: icon.label,
      active: isActive,
      bouncing: bounceMap[icon.kind],
    };
  });

  const handleBounceComplete = (kind: WinKind) => {
    setBounceMap((prev) => {
      if (!prev[kind]) return prev;
      return { ...prev, [kind]: false };
    });
  };

  const renderContent = (w: WinState) => {
    switch (w.kind) {
      case "about": return <About />;
      case "projects": return <Projects />;
      case "experience": return <Experience />;
      case "terminal": return <Terminal onExit={() => close(w.id)} />;
      case "writing": return <Writing initialSlug={requestedPostSlug} />;
    }
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center font-mono"
      style={{ backgroundImage: "url('/wallpaper.jpg')" }}
    >
      {/* Desktop icons */}
      {/* Mobile/tablet: centered grid; Desktop: dock along bottom */}
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

        {/* md and up: vertical icon stack on the left */}
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

      <Dock items={dockItems} onOpen={open} onBounceComplete={handleBounceComplete} />

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
