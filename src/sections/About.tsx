import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col items-center gap-4 text-sm">
      <img
        src="/AboutHeadshot.jpg"
        alt="Chris George headshot"
        className="max-h-60 w-auto object-contain self-center rounded shadow"
      />
      <p className="text-center">
        Hi! I’m Chris George — a Mechatronics and Biomedical Engineering student at McMaster University.
        I build things that think, move, and feel clean.
      </p>
    </div>
  );
};

export default About;
