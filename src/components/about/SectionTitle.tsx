import React from 'react';

const SectionTitle = () => {
  return (
    <div className="text-center mb-8">
      <h1 id="about-heading" className="text-2xl md:text-4xl font-bold font-serif mb-4 tracking-tight">
        <span className="text-forest-900 dark:text-sage-100">About </span>
        <span className="text-lime-500 dark:text-lime-400">Me</span>
      </h1>
      <p className="text-forest-700 dark:text-sage-300 max-w-2xl mx-auto">
        Building intelligent automation solutions that eliminate manual work and scale businesses.
      </p>
    </div>
  );
};

export default SectionTitle;
