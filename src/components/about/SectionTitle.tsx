import React from 'react';

const SectionTitle = () => {
  return (
    <div className="text-center">
      <h1 id="about-heading" className="text-2xl md:text-4xl font-bold font-serif mb-4">
        <span className="text-forest-900">About </span>
        <span className="text-lime-500">Me</span>
      </h1>
      <p className="text-forest-700 max-w-2xl mx-auto">
        Building intelligent automation solutions that eliminate manual work and scale businesses.
      </p>
    </div>
  );
};

export default SectionTitle;
