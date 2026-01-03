import { PortfolioData } from './types';
import { heroData } from './content/hero';
import { aboutData } from './content/about';
import { skillsData, landingSkillsData } from './content/skills';
import { projectsData } from './content/projects';
import { servicesData } from './content/services';
import { experienceData } from './content/experience';
import { workBanner } from './content/work-banner';
import { socials } from './content/socials';

// Re-export specific data for direct access if needed
export {
    heroData,
    aboutData,
    skillsData,
    landingSkillsData,
    projectsData,
    servicesData,
    experienceData,
    workBanner,
    socials
};

// Re-export types
export * from './types';

// Default export
export const portfolioData: PortfolioData = {
    hero: heroData,
    about: aboutData,
    skills: skillsData,
    landingSkills: landingSkillsData,
    projects: projectsData,
    services: servicesData,
    experience: experienceData,
    workBanner: workBanner,
    socials: socials
};
