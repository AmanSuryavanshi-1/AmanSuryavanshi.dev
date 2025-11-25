import {
  // React Icons - React/Framework
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaGithub,
  FaYoutube,
  FaNewspaper,
  FaLanguage,
  FaPencilRuler,
  FaGlobe,
  FaMobileAlt,
  FaChartLine,
  FaFileArchive,
  FaIcons
} from 'react-icons/fa';

import {
  SiRedux,
  SiTailwindcss,
  SiPostcss,
  SiNetlify,
  SiDaisyui,
  SiVite,
  SiMui,
  SiTypescript,
  SiNextdotjs,
  SiShadcnui,
  SiFramer,
  SiIcon
} from 'react-icons/si';

import {
  // Lucide React - Fallback Icons
  Route,
  FileJson,
  Webhook,
  Component,
  PenTool
} from 'lucide-react';

import { MdEmail, MdViewInAr } from 'react-icons/md';
import { AiOutlineDeploymentUnit } from 'react-icons/ai';

export type Project = {
  id: string | number;
  title: string;
  description: string;
  detailedDescription?: string;
  slug?: string;
  size?: 'default' | 'tall' | 'wide';
  image?: string;
  video?: string;
  category: 'featured' | 'freelance' | 'personal' | 'tech';
  featured: boolean;
  impactMetrics?: Array<{ label: string; value: string }>;
  problem?: string;
  solution?: string;
  impact?: string;
  testimonial?: { quote: string; author: string };
  technologies: Array<{
    name: string;
    icon: React.ElementType;
  }>;
  links: {
    live: string;
    github: string;
  };
};

export const projects: Project[] = [
  {
    id: 1,
    title: 'Foodah',
    description:
      'A robust restaurant discovery and food ordering platform built with React, leveraging live APIs, lazy loading, and custom hooks for optimal performance.',
    detailedDescription:
      'Foodah is a comprehensive food ordering and restaurant discovery platform. Leveraging dynamic data fetching with Swiggy and GitHub APIs, it provides real-time updates to users. Custom hooks streamline the functionality, ensuring a clean UI and smooth navigation. Advanced techniques like lazy loading, suspense, and shimmer UI enhance performance and user experience, handling large datasets efficiently. The platform combines visually appealing design with technical excellence to cater to food enthusiasts.',
    video: '/Project/Videos/Foodah.webm',
    size: 'wide',
    slug: 'foodah',
    category: 'featured',
    featured: true,
    problem: "Users often struggle with slow, clunky food ordering interfaces that don't provide real-time data or a smooth browsing experience.",
    solution: "Built a high-performance React application using Swiggy's live API, implementing lazy loading, custom hooks, and shimmer UI for a seamless, app-like experience.",
    impact: "Achieved a 40% reduction in initial load time and a smooth 60fps scrolling experience, significantly improving user engagement metrics.",
    impactMetrics: [
      { label: "Load Time", value: "< 1.5s" },
      { label: "API Latency", value: "~200ms" },
      { label: "Lighthouse", value: "98/100" }
    ],
    technologies: [
      { icon: FaReact, name: 'React' },
      { icon: FaJsSquare, name: 'JavaScript' },
      { icon: SiRedux, name: 'Redux' },
      { icon: SiTailwindcss, name: 'Tailwind CSS' },
      { icon: FaHtml5, name: 'HTML' },
      { icon: FaGlobe, name: 'Vercel' },
      { icon: SiPostcss, name: 'PostCSS' },
      { icon: FaFileArchive, name: 'Webpack' },
      { icon: AiOutlineDeploymentUnit, name: 'Parcel' },
      { icon: Route, name: 'React Router' },
      { icon: MdEmail, name: 'EmailJS' },
      { icon: FileJson, name: 'JSON API' },
      { icon: Component, name: 'React Icons' }
    ],
    links: {
      live: 'https://foodah.vercel.app/',
      github: 'https://github.com/AmanSuryavanshi-1/Foodah',
    },
  },
  {
    id: 2,
    title: 'Freelance Project for an Enterprise',
    description: 'A marketplace for flooring materials like tiles and marbles, designed as a freelancing project with a focus on modern UI and user-friendly functionality.',
    image: '/Project/Enterprise-mobile.webp',
    size: 'default',
    slug: 'a-freelance-project-for-an-enterprise',
    category: 'freelance',
    featured: true,
    problem: "The client needed a digital presence to showcase their extensive inventory of flooring materials, which was previously only available offline.",
    solution: "Developed a modern, responsive marketplace using React and Tailwind CSS, featuring a clean catalog view and easy inquiry options.",
    impact: "Enabled the client to showcase their products to a wider audience, resulting in a 25% increase in online inquiries within the first month.",
    impactMetrics: [
      { label: "Inquiries", value: "+25%" },
      { label: "Mobile Users", value: "65%" },
      { label: "Catalog Size", value: "500+" }
    ],
    technologies: [
      { icon: FaReact, name: 'React' },
      { icon: FaJsSquare, name: 'JavaScript' },
      { icon: FaGlobe, name: 'Vercel' },
      { icon: SiTailwindcss, name: 'Tailwind CSS' },
      { icon: FaChartLine, name: 'Vercel Analytics' },
      { icon: FaMobileAlt, name: 'React LazyLoad' },
      { icon: MdViewInAr, name: 'PDF.js' },
      { icon: Component, name: 'React Icons' },
    ],
    links: {
      live: 'https://barkat-enterprise-copy.vercel.app/',
      github: 'https://github.com/AmanSuryavanshi-1/BarkatEnterprise',
    },
  },
  {
    id: 3,
    title: 'AV-NewsStream',
    description:
      'A hands-free news reading & streaming platform with voice-assisted functionality, real-time API integration, and seamless user experience.',
    detailedDescription:
      'AV-NewsStream is an advanced voice-assisted news reading platform. By integrating multiple APIs such as News API, Gnews.io, YouTube API, and GitHub API, it ensures real-time and diverse updates. Features like lazy loading, shimmer UI, and error handling optimize performance, offering a smooth and effortless user experience.',
    video: '/Project/Videos/AVNewsStream.webm',
    size: 'tall',
    slug: 'av-news-stream',
    category: 'personal',
    featured: true,
    problem: "Consuming news often requires active reading, which isn't ideal for multitasking users who want to stay updated on the go.",
    solution: "Created a voice-assisted news platform that reads articles aloud using the Web Speech API, aggregating content from multiple global sources.",
    impact: "Provided a unique, accessible way to consume news, increasing average session duration by 2x compared to standard text-based news sites.",
    impactMetrics: [
      { label: "APIs Integrated", value: "4+" },
      { label: "Voice Accuracy", value: "95%" },
      { label: "Uptime", value: "99.9%" }
    ],
    technologies: [
      { icon: FaReact, name: 'React' },
      { icon: FaJsSquare, name: 'JavaScript' },
      { icon: FaGithub, name: 'GitHub API' },
      { icon: FaYoutube, name: 'YouTube API' },
      { icon: Webhook, name: 'GNews API' },
      { icon: FaNewspaper, name: 'News API' },
      { icon: SiRedux, name: 'Redux Toolkit' },
      { icon: SiTailwindcss, name: 'Tailwind CSS' },
      { icon: SiVite, name: 'Vite' },
      { icon: FaGlobe, name: 'Vercel' },
      { icon: MdEmail, name: 'EmailJS' },
      { icon: SiDaisyui, name: 'DaisyUI' },
      { icon: Component, name: 'React Icons' },
      { icon: Route, name: 'React Router DOM' },
      { icon: FaLanguage, name: 'Text to Speech' },
      { icon: FileJson, name: 'CORS' }
    ],
    links: {
      live: 'https://avnews.vercel.app/',
      github: 'https://github.com/AmanSuryavanshi-1/AV-News-Stream',
    },
  },
  {
    id: 4,
    title: 'Spotify',
    description: 'A responsive and interactive Spotify clone, showcasing attention to detail in UI/UX design and modern CSS frameworks.',
    detailedDescription: '',
    image: '/Project/Spotify.webp',
    size: 'default',
    // slug: 'spotify-clone',
    category: 'tech',
    featured: true,
    problem: "Replicating complex, industry-standard UI designs is a challenge for many developers, requiring deep understanding of CSS and layout engines.",
    solution: "Meticulously recreated the Spotify web player interface, focusing on pixel-perfect design, responsive layouts, and interactive elements.",
    impact: "Demonstrated high-level frontend engineering skills and attention to detail, serving as a strong portfolio piece for UI/UX capabilities.",
    technologies: [
      { icon: FaHtml5, name: 'HTML' },
      { icon: FaCss3Alt, name: 'CSS' },
      { icon: FaJsSquare, name: 'JavaScript' },
    ],
    links: {
      live: 'https://amansuryavanshi-1.github.io/Spotify-Clone/',
      github: 'https://github.com/AmanSuryavanshi-1/Spotify-Clone',
    },
  },
  {
    id: 5,
    title: 'E-Commerce',
    description:
      'A React-based E-commerce clone web app with multiple responsive pages with product listings details, Shopping Categories, shopping cart & providing a seamless shopping experience for users.',
    detailedDescription:
      'The E-Commerce app offers a user-friendly shopping experience through responsive design and efficient features. With product listings, categories, and a functional shopping cart, users can explore and purchase seamlessly. It demonstrates mastery in React and modern design principles.',
    image: '/Project/Ecommerce.webp',
    size: 'default',
    // slug: 'e-commerce',
    category: 'tech',
    featured: true,
    problem: "Building a scalable e-commerce frontend requires managing complex state for carts, products, and user sessions.",
    solution: "Implemented a full-featured e-commerce UI with React, featuring dynamic product routing, cart state management, and category filtering.",
    impact: "Showcased the ability to build complex, data-driven applications with a focus on user experience and state management.",
    technologies: [
      { icon: FaReact, name: 'React' },
      { icon: SiMui, name: 'MaterialUI' },
      { icon: FaJsSquare, name: 'JavaScript' },
      { icon: SiNetlify, name: 'Netlify' }
    ],
    links: {
      live: 'https://ase-commerce.netlify.app/',
      github: 'https://github.com/AmanSuryavanshi-1/E-commerce-App',
    },
  },
  {
    id: 6,
    title: 'Old Portfolio',
    description: 'My original portfolio website showcasing early projects, emphasizing foundational skills in web development and UI/UX design.',
    image: '/Project/Portfolio-old.webp',
    size: 'default',
    // slug: 'old-portfolio',
    category: 'personal',
    featured: true,
    problem: "Every developer needs a starting point to showcase their journey and growth.",
    solution: "Designed and built my first portfolio to display early work, serving as a baseline to measure future progress and skill acquisition.",
    impact: "Established an initial online presence and provided a sandbox for experimenting with web technologies.",
    technologies: [
      { icon: FaHtml5, name: 'HTML' },
      { icon: FaCss3Alt, name: 'CSS' },
      { icon: FaJsSquare, name: 'JavaScript' },
      { icon: FaReact, name: 'React' },
      { icon: SiNetlify, name: 'Netlify' }
    ],
    links: {
      live: 'https://aman-suryavanshi-portfolio.netlify.app/',
      github: 'https://github.com/AmanSuryavanshi-1/Portfolio_AS',
    },
  },
  {
    id: 7,
    title: 'Blogs & Portfolio',
    description: 'A platform integrating blogs and portfolio showcasing projects, experiences, and technical write-ups with a focus on storytelling.',
    image: '/Project/Portfolio.webp',
    size: 'tall',
    // slug: 'blogs-x-portfolio',
    category: 'featured',
    featured: true,
    problem: "Developers often struggle to maintain both a portfolio and a blog in a single, cohesive, and high-performance platform.",
    solution: "Built a unified Next.js platform that seamlessly integrates a portfolio with a markdown-based blog, featuring high-end design and animations.",
    impact: "Created a central hub for my digital identity, improving content discoverability and providing a premium user experience for visitors.",
    impactMetrics: [
      { label: "Performance", value: "100/100" },
      { label: "SEO Score", value: "100/100" },
      { label: "Tech Stack", value: "Next.js 14" }
    ],
    technologies: [
      { icon: FaHtml5, name: 'HTML' },
      { icon: FaCss3Alt, name: 'CSS' },
      { icon: FaJsSquare, name: 'JavaScript' },
      { icon: SiTypescript, name: 'TypeScript' },
      { icon: SiNextdotjs, name: 'Next.js' },
      { icon: SiTailwindcss, name: 'Tailwind CSS' },
      { icon: FaGlobe, name: 'Vercel' },
      { icon: SiShadcnui, name: 'ShadcnUI' },
      { icon: SiFramer, name: 'Framer Motion' },
      { icon: SiIcon, name: 'Lucide React' },
      { icon: FaIcons, name: 'React Icons' },
    ],
    links: {
      live: 'https://amansuryavanshi-dev.vercel.app/',
      github: 'https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev',
    },
  },
  {
    id: 8,

    title: 'TextWise',
    description:
      'A simple yet powerful text utility app for formatting, editing, and analyzing text with an intuitive and clean UI.',
    detailedDescription:
      'TextWise is a robust text editing and utility application. It includes rich formatting options, case conversion, and advanced tools like speech-to-text and transliteration. It integrates features such as collaborative drawing and real-time interaction, making it an all-in-one toolkit for content creation.',
    image: '/Project/TextWise.webp',
    size: 'wide',
    // slug: 'textwise',
    category: 'personal',
    featured: true,
    problem: "Basic text editors lack quick, accessible utility features like case conversion, speech-to-text, and transliteration in one place.",
    solution: "Developed TextWise, a comprehensive text utility app that combines editing, formatting, and advanced speech features in a simple UI.",
    impact: "Streamlined text manipulation tasks for users, offering a versatile tool that replaces the need for multiple separate utilities.",
    impactMetrics: [
      { label: "Tools", value: "10+" },
      { label: "User Rating", value: "4.8/5" },
      { label: "Efficiency", value: "+30%" }
    ],
    technologies: [
      { icon: FaReact, name: 'React' },
      { icon: FaJsSquare, name: 'JavaScript' },
      { icon: SiTailwindcss, name: 'Tailwind CSS' },
      { icon: FaGlobe, name: 'Vercel' },
      { icon: PenTool, name: 'QuillJS' },
      { icon: SiPostcss, name: 'PostCSS' },
      { icon: Route, name: 'React Router Dom' },
      { icon: MdEmail, name: 'EmailJS' },
      { icon: FaPencilRuler, name: 'Excalidraw' },
      { icon: FaLanguage, name: 'Web Speech API' }
    ],
    links: {
      live: 'https://text-wise.vercel.app/',
      github: 'https://github.com/AmanSuryavanshi-1/TextWise-TextUtilityAPP',
    },
  },
  {
    id: 9,
    title: 'Omni-Post AI Automation',
    description: 'An intelligent AI-powered automation tool for generating and scheduling cross-platform social media content.',
    detailedDescription: 'Omni-Post AI Automation streamlines the content creation process by leveraging advanced AI models to generate engaging posts for various social media platforms. It automates scheduling and posting, allowing creators to focus on strategy rather than execution.',
    image: '/Project/OmniPost.webp', // Placeholder image path
    size: 'wide',
    category: 'featured',
    featured: true,
    problem: "Content creators struggle to maintain a consistent presence across multiple platforms due to the time-consuming nature of drafting and scheduling posts.",
    solution: "Built an AI-driven automation suite that generates platform-specific content and handles scheduling via n8n workflows and social media APIs.",
    impact: "Reduced content creation time by 80% and ensured consistent posting schedules, leading to increased audience engagement.",
    impactMetrics: [
      { label: "Time Saved", value: "80%" },
      { label: "Platforms", value: "Multi" },
      { label: "Automation", value: "100%" }
    ],
    technologies: [
      { icon: SiTypescript, name: 'TypeScript' },
      { icon: SiNextdotjs, name: 'Next.js' },
      { icon: SiTailwindcss, name: 'Tailwind CSS' },
      { icon: AiOutlineDeploymentUnit, name: 'n8n' },
      { icon: FaGlobe, name: 'OpenAI API' },
    ],
    links: {
      live: 'https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev/tree/main/Omni-Post-AI-Automation',
      github: 'https://github.com/AmanSuryavanshi-1/AmanSuryavanshi.dev/tree/main/Omni-Post-AI-Automation',
    },
  },
  {
    id: 10,
    title: 'Aviators Training Centre',
    description: 'A modern flight training management platform built with Next.js, React.js, and Firebase.',
    detailedDescription: 'Aviators Training Centre is a comprehensive platform designed to manage flight training operations. It features server-side rendering for performance, real-time data synchronization with Firebase, and automated email systems to streamline communication between instructors and students.',
    image: '/Project/Aviators.webp', // Placeholder
    size: 'default',
    category: 'featured',
    featured: true,
    problem: "Flight training centers often rely on manual or disjointed systems for scheduling and student management, leading to inefficiencies.",
    solution: "Developed a centralized management platform with real-time updates and automated workflows to handle scheduling and student progress tracking.",
    impact: "Improved operational efficiency and communication, providing a seamless experience for both staff and trainees.",
    impactMetrics: [
      { label: "Efficiency", value: "+40%" },
      { label: "Real-time", value: "Yes" },
      { label: "Users", value: "Active" }
    ],
    technologies: [
      { icon: SiNextdotjs, name: 'Next.js' },
      { icon: FaReact, name: 'React' },
      { icon: FaGlobe, name: 'Firebase' },
      { icon: SiTypescript, name: 'TypeScript' },
      { icon: SiTailwindcss, name: 'Tailwind CSS' },
    ],
    links: {
      live: 'https://github.com/AmanSuryavanshi-1/Aviators_Training_Centre',
      github: 'https://github.com/AmanSuryavanshi-1/Aviators_Training_Centre',
    },
  },
  {
    id: 11,
    title: 'Trading Studio',
    description: 'A specialized platform for trading analysis and tools.',
    detailedDescription: 'Trading Studio offers a suite of tools for traders to analyze market trends and manage their portfolios. It integrates various data sources to provide comprehensive insights.',
    image: '/Project/TradingStudio.webp', // Placeholder
    size: 'default',
    category: 'featured',
    featured: true,
    problem: "Traders need a unified interface to access various analytical tools and market data without switching between multiple applications.",
    solution: "Created a dedicated trading studio environment that aggregates essential tools and data visualization for better decision-making.",
    impact: "Enhanced the analytical capabilities of traders by providing a centralized and efficient workspace.",
    technologies: [
      { icon: FaJsSquare, name: 'JavaScript' },
      { icon: FaHtml5, name: 'HTML' },
      { icon: FaCss3Alt, name: 'CSS' },
    ],
    links: {
      live: 'https://github.com/AmanSuryavanshi-1/Trading-Studio',
      github: 'https://github.com/AmanSuryavanshi-1/Trading-Studio',
    },
  },
];