import React from 'react';

export interface HeroData {
    name: string;
    title: string;
    subtitle: string;
    tagline: string;
    description: string;
    descriptionHighlight: string;
    stats: string[];
    buttons: {
        primary: {
            label: string;
            href: string;
        };
        secondary: {
            label: string;
            href: string;
        };
    };
    meta: {
        name: string;
        description: string;
    };
}

export interface AboutData {
    hero: {
        badge: string;
        title: string;
        subtitle: string;
        pitch: string;
        skills: { icon: string; label: string }[];
    };
    bentoGrid: {
        badge: string;
        title: string;
        origins: {
            title: string;
            subtitle: string;
            description: string;
            icon: string;
        };
        tStack: {
            title: string;
            subtitle: string;
            descriptionPart1: string;
            descriptionPart2: string;
            highlight: string;
            icon: string;
            layers: { label: string; detail: string; type: 'depth' | 'breadth' }[];
        };
        philosophy: {
            title: string;
            icon: string;
            items: { icon: string; label: string; detail: string }[];
        };
        systemArchitecture: {
            title: string;
            subtitle: string;
            icon: string;
            tags: { label: string; icon: string }[];
        };
        proofOfWork: {
            title: string;
            subtitle: string;
            icon: string;
            items: {
                title: string;
                project: string;
                year: string;
                metrics: string[];
                url: string;
                color: string;
            }[];
        };
    };
    timeline: {
        badge: string;
        title: string;
        items: {
            id: string;
            year: string;
            title: string;
            description: string;
            category: 'education' | 'milestone' | 'career' | 'project';
            highlight?: boolean;
        }[];
    };
    title: string;
    intro: string;
    journey: string[];
    philosophy: string;
    differentiators: string[];
    cta: {
        title: string;
        subtitle: string;
        actionLabel: string;
    };
    keywords: string[];
    personalInfo: {
        name: string;
        title: string;
        description: string;
        phone: string;
        email: string;
        education: string;
        address: string;
        languages: string[];
    };
    qualificationsData: {
        qualifications: {
            EducationData: Array<{
                title: string;
                institution: string;
                year: string;
                icon: string;
            }>;
            CertificationData: Array<{
                title: string;
                institution: string;
                year: string;
                icon: string;
            }>;
        };
    };
}

export interface SkillItem {
    label?: string;
    name?: string;
    value?: string;
    details?: string;
    projectTitle?: string;
    projectUrl?: string;
    relatedProjects?: {
        title: string;
        url: string;
    }[];
}

export interface SkillGroup {
    title: string;
    items: SkillItem[];
}

export interface SkillCategory {
    id: string;
    title: string;
    icon: string;
    description: string;
    groups: SkillGroup[];
    footer?: string;
}

export interface SpecializedAchievement {
    title: string;
    icon: string;
    items: string[];
}

export interface ProficiencyLevel {
    title: string;
    skills: string[];
}

export interface SkillsData {
    mainTitle: string;
    subTitle: string;
    coreSpecialty: {
        title: string;
        icon: string;
        description: string;
        skills: SkillItem[];
        impact: string;
    };
    categories: SkillCategory[];
    specializedAchievements: SpecializedAchievement[];
    proficiencySummary: {
        expert: ProficiencyLevel;
        advanced: ProficiencyLevel;
        intermediate: ProficiencyLevel;
        familiar: ProficiencyLevel;
    };
    currentlyLearning: string[];
}

// Landing Page Skills - Solution Architect Stack
export interface LandingSkillItem {
    name: string;
    level: 'Expert' | 'Advanced' | 'Production' | 'Intermediate';
    projects: string;
    relatedProjects?: {
        title: string;
        url: string;
    }[];
}

export interface LandingSkillCategory {
    title: string;
    skills: LandingSkillItem[];
}

export interface LandingSkillsData {
    categories: LandingSkillCategory[];
    keywords: string[];
}

export interface Project {
    id: string;
    title: string;
    tagLine: string;
    category: 'featured' | 'freelance' | 'personal' | 'tech' | 'utility' | 'web' | 'automation';
    type: string;
    shortDescription: string;
    description: string; // Full description
    challenge: string;
    solution: string;
    impact: readonly string[];
    technicalOverview: string;
    techStack: readonly string[];
    badges: readonly string[];
    imageUrl: string;
    liveUrl: string;
    codeUrl: string;
    blogUrl?: string | null;
    featured: boolean;
    metrics?: Record<string, string>;

    // Compatibility / Computed Fields
    image: string; // mapped from imageUrl
    video?: string;
    videoYouTubeId?: string; // YouTube video ID for embed
    links: {
        live: string;
        github: string;
        // Simplified structure for automation
    };
    // Used in UI but constructed from techStack strings + IconMap
    technologies?: Array<{
        name: string;
        icon: React.ElementType;
    }>;
    impactMetrics?: Array<{ label: string; value: string }>; // mapped from metrics
    detailedDescription?: string; // mapped from description
    documentation?: readonly {
        title: string;
        url: string;
    }[];
    gallery?: readonly {
        src: string;
        alt: string;
        type: 'image' | 'video';
    }[];
}

export interface ServiceData {
    id: number;
    title: string;
    subtitle: string;
    problem: string;
    solution: string;
    outcomes: string[];
    tech: string[];
    idealClient: string;
    icon: string; // Changed from React.ReactNode to string for JSON compatibility
    image: string;
    relatedProjects?: {
        title: string;
        url: string;
    }[];
}

export interface ExperienceProject {
    title: string;
    url?: string;
    github?: string;
}

export interface ExperienceItem {
    role: string;
    type: string;
    period: string;
    duration: string;
    achievements: string[];
    keyProjects: ExperienceProject[];
}

export interface PortfolioData {
    hero: HeroData;
    about: AboutData;
    skills: SkillsData;
    landingSkills: LandingSkillsData;
    projects: Project[];
    services: ServiceData[];
    experience: ExperienceItem[];
    workBanner: Array<{
        id: number;
        label: string;
        icon: string;
    }>;
    socials: Array<{
        platform: string;
        url: string;
        icon: string;
    }>;
}
