import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
  <img src="AboutHeadshot.jpg" alt="Chris George" className="w-48 h-32 rounded-lg object-cover" />
  <div>
    <h1 className="text-xl font-bold">Chris George</h1>
    <p className="text-sm text-gray-700 dark:text-gray-500 mt-1">
      Hi, welcome to my little slice of the internet! I'm Chris, a Biomedical and Mechatronics Engineering student at McMaster University.


    </p>
    <p className="text-sm mt-2 italic">Always learning. Always building.</p>
    <div className="mt-3 flex gap-4">
      <a href="https://github.com/chrisorama11" target="_blank" rel="noreferrer" className="text-[#5FED83] hover:underline">GitHub</a>
      <a href="https://www.linkedin.com/in/cgeorge101/" target="_blank" rel="noreferrer" className="text-[#0A66C2] hover:underline">LinkedIn</a>
      <a href="mailto:georgc9@mcmaster.ca" className="hover:underline">Email</a>
    </div>
  </div>
</div>

  );
};

export default About;
