import React from "react";

export default function Terminal() {
    return (
      <pre className="text-xs overflow-auto h-full whitespace-pre-wrap">
  {`$ whoami
  chris.george
  
  $ projects
  - RecycleRight (Top 100 Google Dev Challenge)
  - Rubik's Cube Solver (Python, simulation logic)
  
  $ experience
  - Trimble Applanix: V&V Intern
  - McMaster Software Cert: Simulink + Testing
  `}
      </pre>
    );
  }
  