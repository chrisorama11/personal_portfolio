import React, { useEffect, useMemo, useRef, useState, ReactNode } from "react";

type Command = "help" | "whoami" | "experience" | "projects" | "clear" | "exit";
const PROMPT = "chris@retro-os:~$";

export default function Terminal({ onExit }: { onExit?: () => void }) {
  const [lines, setLines] = useState<ReactNode[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number>(-1);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const gradient = (node: ReactNode) => (
    <span className="bg-[linear-gradient(90deg,#3a7bd5_0%,#59e2d6_50%,#f08fc5_100%)] bg-clip-text text-transparent">
      {node}
    </span>
  );

  useEffect(() => {
    const boot: ReactNode[] = [
      asciiLogo(),
      "CTG | Mechatronics & Biomedical Eng. @ McMaster",
      "----------------------------------------------------------------",
      "OS: Retro MacOS (web)      Shell: faux-sh",
      "Editor: VS Code            Font: Menlo / IBM Plex Mono",
      "Interests: embedded systems, learning nre things, the raptors",
      "Projects: RecycleRight • Neuroplayer • Retro Desktop UI",
      "Links: github.com/chrisorama11  |  https://www.linkedin.com/in/cgeorge101/",
      "",
      "Type `help` to see available commands.",
      "",
    ];
    setLines(boot.map(gradient)); // whole boot block in gradient
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
        "CTG — Mechatronics & Biomedical Engineering @ McMaster.",
        "I build clean, testable systems and polished front-ends.",
        "",
        "Strengths:",
        "  • Verification & Validation, automation",
        "  • React/TypeScript, Tailwind, UI/UX craft",
        "  • Algorithms (Rubik’s solver WIP)",
        "",
        "Social:",
        "  • GitHub   : github.com/chrisorama11",
        "  • LinkedIn : linkedin.com/in/cgeorge101/",
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
        "  • Retro Desktop UI — classic Mac-style desktop + terminal.",
      ],

      divya: (): ReactNode[] => [
        "Hi what's up Divya hope you are doing well!"
      ],

      tommy: (): ReactNode[] => [
        "Hi <Tommy></Tommy> hope you and Elvis are having a grand old time!"
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
    if (result === "__CLEAR__") setLines([]);
    else if (result === "__EXIT__") onExit?.();
    else setLines((prev) => [...prev, `${PROMPT} ${cmdRaw}`, ...result, ""]);
    if (cmdRaw) { setHistory((h) => [cmdRaw, ...h]); setHistIdx(-1); }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); submit(input); setInput(""); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); const i = Math.min(histIdx + 1, history.length - 1); if (history[i]) { setHistIdx(i); setInput(history[i]); } return; }
    if (e.key === "ArrowDown") { e.preventDefault(); const i = Math.max(histIdx - 1, -1); setHistIdx(i); setInput(i === -1 ? "" : history[i]); return; }
  }

  return (
    <div
      className="h-full w-full font-mono text-[13px] leading-5 text-neutral-200 select-text"
      style={{ backgroundColor: "#0b1f3a" }} // change this HEX for shell background
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
  return [
    "   _____ _______ _____ ",
    "  / ____|__   __/ ____|",
    " | |       | | | |  __ ",
    " | |       | | | | |_ |",
    " | |____   | | | |__| |",
    "  \\_____|  |_|  \\_____|",
    "",
  ].join("\n");
}
