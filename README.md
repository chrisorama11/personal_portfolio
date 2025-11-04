## Chris George — Personal Portfolio

Personal site showcasing About, Experience, Projects, and MDX-powered Writing. Based off of Ryo Lu's RyOS: [https://github.com/ryokun6/ryos](url)

### Sections

Terminal-style hero for a playful, readable intro (src/sections/Terminal.tsx).
MDX writing with clean, sharable slugs (src/routes/writing/[slug].tsx).
Responsive layout with straightforward, accessible windows.

### Tech Stack

React + TypeScript + Vite
MDX for articles (.mdx)
Simple, framework-agnostic styling
Static hosting (Netlify-supported via _redirects)

### Structure

src/main.tsx — app entry
src/components/Window.tsx — shared window UI wrapper
src/sections/ — About.tsx, Experience.tsx, Projects.tsx, Writing.tsx, Terminal.tsx
src/routes/writing/[slug].tsx — dynamic route for MDX posts
src/writing/*.mdx — articles (content-first)
src/mdx.d.ts — MDX type declarations
vite.config.ts, tsconfig.json — build and TypeScript config
public/ — static assets (e.g., AboutHeadshot.jpg, rubikscube.jpg, _redirects)
Note: next.config.js exists but is not used; the project runs on Vite.
Writing (MDX)

Each post is a single .mdx file in src/writing/.
Optional frontmatter for metadata:
---
title: "On Taste"
date: 2025-08-14
description: "Notes on cultivating taste."
---
Slugs map from filenames via src/routes/writing/[slug].tsx.
Actively maintained; new posts land under src/writing/.
