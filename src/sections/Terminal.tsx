// src/sections/Terminal.tsx
import React, { useEffect, useMemo, useRef, useState, ReactNode } from "react";

type Command = "help" | "whoami" | "experience" | "projects" | "clear" | "exit";
const PROMPT = "chris@retro-os:~$";

export default function Terminal({ onExit }: { onExit?: () => void }) {
  // lines are ReactNode so we can mix strings with styled elements (for gradient boot)
  const [lines, setLines] = useState<ReactNode[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number>(-1);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Apply gradient to any given node (used for boot block)
  const gradient = (node: ReactNode) => (
    <span className="bg-[linear-gradient(90deg,#3a7bd5_0%,#59e2d6_50%,#f08fc5_100%)] bg-clip-text text-transparent">
      {node}
    </span>
  );

  // Boot banner
  useEffect(() => {
    const boot: ReactNode[] = [
      asciiLogo(),
      "Chris George | Mechatronics & Biomedical Eng.",
      "----------------------------------------------------------------",
      "skills: python, c++, embedded systems, verification & validation",
      "education: final year mechatronics & biomedical engineering @ McMaster",
      "projects: RecycleRight • rubik’s cube solver • retro website",
      "hobbies: pickup basketball, watching movies",
      "links: github.com/chrisorama11  |  www.linkedin.com/in/cgeorge101",
      "Type `help` to see available commands.",
      "",
    ];
    // Entire boot block in gradient
    setLines(boot.map(gradient));
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight });
  }, [lines]);

  const commands = useMemo(
    () => ({
      help: (): ReactNode[] => [
        "Available commands:",
        "  whoami      - about me",
        "  experience  - internships & roles",
        "  projects    - selected projects",
        "  clear       - clear the screen",
        ...(onExit ? ["  exit        - close the terminal"] : []),
        "  help        - show this help",
      ],
      whoami: (): ReactNode[] => [
        "Chris George — Mechatronics & Biomedical Engineering @ McMaster.",
        "Focused on building clean, testable systems and polished frontends.",
        "",
        "Strengths:",
        "  • Verification & Validation, automated testing",
        "  • React/TypeScript, Tailwind, UI/UX details",
        "  • Algorithms and problem solving (Rubik’s solver WIP)",
        "",
        "Social:",
        "  • GitHub   : github.com/chrisorama11",
        "  • LinkedIn : linkedin.com/in/chrisorama",
      ],
      experience: (): ReactNode[] => [
        "Experience:",
        "  • Trimble Applanix — Verification & Validation Intern",
        "      - Tested geonavigation systems, automated unit tests.",
        "  • McMaster Centre for Software Certification — Co-op",
        "      - Simulink models, requirement falsification, tooling.",
      ],
      projects: (): ReactNode[] => [
        "Projects:",
        "  • RecycleRight — lightweight waste-sorting app (Top 100 GDSC).",
        "  • Rubik’s Cube Solver — heuristic/search-based solver (WIP).",
        "  • Retro Desktop UI — this website; classic Mac-style desktop + terminal.",
      ],
    }),
    [onExit]
  );

  type RunResult = ReactNode[] | "__CLEAR__" | "__EXIT__";

  function run(cmdRaw: string): RunResult {
    const trimmed = cmdRaw.trim();
    const cmd = trimmed as Command;
    if (!trimmed) return [];

    if (cmd === "clear") return "__CLEAR__";
    if (cmd === "exit") return "__EXIT__";

    if ((commands as any)[cmd]) return (commands as any)[cmd]();
    return [`sorry, that isn't a compatible command: ${cmdRaw}`];
  }

  function submit(cmdRaw: string) {
    const result = run(cmdRaw);

    if (result === "__CLEAR__") {
      setLines([]);
    } else if (result === "__EXIT__") {
      onExit?.();
    } else {
      setLines((prev) => [...prev, `${PROMPT} ${cmdRaw}`, ...result, ""]);
    }

    if (cmdRaw) {
      setHistory((h) => [cmdRaw, ...h]);
      setHistIdx(-1);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(input);
      setInput("");
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIdx = Math.min(histIdx + 1, history.length - 1);
      if (history[nextIdx]) {
        setHistIdx(nextIdx);
        setInput(history[nextIdx]);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIdx = Math.max(histIdx - 1, -1);
      setHistIdx(nextIdx);
      setInput(nextIdx === -1 ? "" : history[nextIdx]);
      return;
    }
  }

  return (
    <div
      className="h-full w-full font-mono text-[13px] leading-5 text-neutral-200 select-text"
      style={{ backgroundColor: "#211763" }} // <--bg colour
    >
      <div ref={scrollerRef} className="h-full overflow-y-auto p-4">
        {lines.map((line, i) => (
          <pre key={i} className="whitespace-pre-wrap break-words">
            {line}
          </pre>
        ))}

        <div className="flex items-center">
          <span className="text-neutral-400 mr-2">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            className="flex-1 bg-transparent outline-none text-neutral-100 caret-white"
            autoFocus
            aria-label="terminal input"
          />
        </div>
      </div>
    </div>
  );
}

function asciiLogo(): string {
    return `     _____ _______ _____ 
    / ____|__   __/ ____|
   | |       | | | |  __ 
   | |       | | | | |_ |
   | |____   | | | |__| |
    \\_____|  |_|  \\_____|
  `;
  }
  