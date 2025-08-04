import React from "react";

type ExperienceItem = {
  company: string;
  role: string;
  period: string;     // e.g. "Jan 2024 – Aug 2024"
  location?: string;
  logoSrc?: string;   // e.g. "/logos/trimble.png"
  link?: string;      // company/site link
  bullets: string[];
  tech?: string[];    // badges
};

const EXPERIENCE: ExperienceItem[] = [
  {
    company: "Trimble Applanix",
    role: "Verification & Validation Enigneering Intern",
    period: "May 2024 – Aug 2025",
    location: "Richmond Hill, ON",
    logoSrc: "trimble.png",
    link: "https://applanix.trimble.com/en",
    bullets: [
      "Built automated unit/functional tests for geonavigation systems.",
      "Developed tooling to validate dynamic and static testing.",
      "Led dynamic tests to ensure new firmwares and products maintained centimeter level precision."
    ],
    tech: ["Python", "Pytest", "GitLab"],
  },
  {
    company: "McMaster Centre for Software Certification",
    role: "Co-op Research Assistant",
    period: "May 2023 – Aug 2023",
    location: "Hamilton, ON",
    logoSrc: "McMaster.png",
    link: "https://www.eng.mcmaster.ca/mcscert/",
    bullets: [
      "Worked with Simulink models for safety-critical control systems.",
      "Implemented a novel tool for Simulink model requirement falsification."
    ],
    tech: ["MATLAB/Simulink", "Python", "Control Systems"],
  },
];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 border border-gray-200">
      {children}
    </span>
  );
}

export default function Experience() {
  return (
    <div className="h-full overflow-y-auto pr-2">
      <ol className="space-y-6">
        {EXPERIENCE.map((exp) => (
          <li
            key={`${exp.company}-${exp.role}-${exp.period}`}
            className="bg-white/70 rounded-md border border-gray-200 p-3 md:p-4"
          >
            <div className="flex items-start gap-4">
              {/* Logo */}
              {exp.logoSrc ? (
                <div className="w-14 h-14 shrink-0 rounded bg-white border border-gray-200 grid place-items-center">
                  <img
                    src={exp.logoSrc}
                    alt={`${exp.company} logo`}
                    className="max-w-[40px] max-h-[40px] object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : null}

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className="text-base md:text-lg font-semibold">{exp.role}</h3>
                  <span className="text-gray-500">•</span>
                  {exp.link ? (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {exp.company}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-800">{exp.company}</span>
                  )}
                </div>

                <div className="mt-0.5 text-xs text-gray-500">
                  <span>{exp.period}</span>
                  {exp.location ? <span> • {exp.location}</span> : null}
                </div>

                {/* Bullets */}
                <ul className="mt-2 list-disc pl-5 space-y-1.5 text-sm text-gray-800">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>

                {/* Tech chips */}
                {exp.tech && exp.tech.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {exp.tech.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* spacer so last card isn't tight to the edge */}
      <div className="h-2" />
    </div>
  );
}
