import React from "react";

type Project = {
  title: string;
  date: string;
  blurb: string;
  imageSrc: string; 
  demoHref?: string;
  codeHref?: string;
  tags?: string[];
};

const PROJECTS: Project[] = [
  {
    title: "RecycleRight",
    date: "Jan 2023 - Jun 2023",
    blurb:
      "A compact web app that helps users sort waste correctly using a lightweight model. Reached Google Solutions Challenge Top 100.",
    imageSrc: "/recycle.png",
    demoHref: "https://youtu.be/ryhq0BObrWI",
    codeHref: "https://github.com/chrisorama11/gdsc-solution-challenge",
    tags: ["Python", "Flutter", "Embedded Systems", "Tensorflow"],
  },
  {
    title: "Neuroplayer",
    date: "In Progress",
    blurb:
      "A brain-computer interface music player that uses EEG signals to control playback and recommend songs based on mental state.",
    imageSrc: "/Neuroplayer.webp",
    codeHref: "https://github.com/chrisorama11/neuroplayer/",
    tags: ["Python", "Machine Learning", "EEG", "Signal Processing"],
  },
  {
    title: "Retro Desktop UI",
    date: "In Progress",
    blurb:
      "This site! A Mac-inspired desktop with draggable, resizable windows and a terminal view.",
    imageSrc: "/website.png",
    codeHref: "https://github.com/chrisorama11/personal_portfolio",
    tags: ["React","Tailwind", "UX"],
  },
];

const Projects = () => {
  return (
    <div className="h-full overflow-y-auto pr-2">
      <div className="space-y-6">
        {PROJECTS.map((p, i) => (
          <article
            key={p.title}
            className="flex flex-col md:flex-row gap-4 md:gap-6 bg-white/70 rounded-md border border-gray-200 p-3 md:p-4"
          >
            {/*Image*/}
            <div className="md:w-48 md:flex-shrink-0">
              <img
                src={p.imageSrc}
                alt={p.title}
                className="w-full h-auto max-h-40 object-contain rounded"
                loading ="lazy"
              />
            </div>

            {/*Text*/}
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-lg font-semibold">{p.title}</h3>
              <p className= "text-sm text-blue-600 mt-1">{p.date}</p>
              <p className="text-sm text-gray-700 mt-1">{p.blurb}</p>

              {/*Tags*/}
              {p.tags && p.tags.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded bg-gray-100 border border-gray-200"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}

              {/*Links*/}
              <div className="mt-3 flex flex-wrap gap-4">
                {p.demoHref && (
                  <a
                    href={p.demoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Live demo →
                  </a>
                )}
                {p.codeHref && (
                  <a
                    href={p.codeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:underline text-sm"
                  >
                    Source code →
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/*Bottom spacer*/}
      <div className="h-2" />
    </div>
  );
};

export default Projects;
