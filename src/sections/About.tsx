import React from "react";

type Fact = { label: string; value: string };

const FACTS: Fact[] = [
  { label: "Location", value: "Toronto, ON" },
  { label: "Graduation", value: "Spring 2026" },
  { label: "Open To", value: "Full-time positions" },
];

function LinkBar({ className = "" }: { className?: string }) {
  return (
    <div className={`mt-3 flex flex-wrap gap-4 text-sm ${className}`}>
      <a
        href="https://github.com/chrisorama11"
        target="_blank"
        rel="noreferrer"
        className="text-[#5FED83] hover:underline"
      >
        GitHub
      </a>
      <a
        href="https://www.linkedin.com/in/cgeorge101/"
        target="_blank"
        rel="noreferrer"
        className="text-[#0A66C2] hover:underline"
      >
        LinkedIn
      </a>
      <a href="mailto:georgc9@mcmaster.ca" className="hover:underline">
        Email
      </a>
    </div>
  );
}

export default function About() {
  return (
    <section className="h-full overflow-y-auto pr-2">
      <div className="flex flex-col md:flex-row gap-5 items-start">
        {/* Left column: Headshot + (desktop) links */}
        <div className="shrink-0 rounded-lg bg-white/60 backdrop-blur-[2px] p-3 md:p-4 flex md:block items-center shadow-sm">
          <img
            src="/AboutHeadshot.jpg"
            alt="Headshot of Chris"
            className="h-40 w-40 object-cover rounded-md"
            loading="lazy"
            decoding="async"
          />
          {/* Desktop: show links under the picture */}
          <LinkBar className="hidden md:flex md:flex-col md:gap-2 md:mt-3" />
        </div>

        {/* Right column: Text */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-bold">Chris George</h1>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-600">
            Hi, welcome to my little slice of the internet! I’m Chris, a Biomedical
            and Mechatronics Engineering student at McMaster University. I'm constantly trying to learn new things, 
            in both my professional and personal life. When I'm not learning or building, you can probably find me watching a movie!
          </p>

          {/* Mobile: keep links under the text */}
          <LinkBar className="flex md:hidden" />

          {/* Facts */}
          <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {FACTS.map((f) => (
              <div key={f.label} className="flex gap-2">
                <dt className="text-gray-500 w-24">{f.label}</dt>
                <dd className="text-gray-800 dark:text-gray-600">{f.value}</dd>
              </div>
            ))}
          </dl>

          {/* Currently */}
          <div className="mt-5 rounded-md bg-white/50 backdrop-blur-[2px] p-3 shadow-sm">
            <h2 className="text-sm font-semibold">Currently</h2>
            <ul className="mt-1 list-disc pl-5 text-sm text-gray-800 dark:text-gray-600 space-y-1">
              <li>
                Building: <span className="font-medium">GBA Emulator</span> and{" "}
                <span className="font-medium">Retro Desktop Portfolio</span>.
              </li>
            </ul>
          </div>

          {/* How this site works */}
          <div className="mt-6 rounded-md bg-white/40 backdrop-blur-[2px] p-3 shadow-sm">
            <h2 className="text-sm font-semibold">How this site works</h2>
            <p className="mt-1 text-sm text-gray-800 dark:text-gray-600">
              This portfolio is built to feel like a retro Mac desktop.
              Click an icon to open a window for that section—About, Projects, Experience, or Writing.
              You can move, resize, minimize, and fullscreen windows.
              There’s also a terminal: type <code>help</code> to see commands.
            </p>
          </div>
        </div>
      </div>

      {/* bottom spacer */}
      <div className="h-2" />
    </section>
  );
}
