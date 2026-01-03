import React from 'react';
import {
    // Lucide React
    MessageCircle, ArrowRight, Sparkles,
    Workflow, Bot, Brain, Zap, Code2, Layout, Database, Server, Rocket, Search, Globe, Puzzle, Palette, Terminal, FileText, Users, Cpu, Layers, LineChart, GitBranch, Lock, Smartphone, MessageSquare, Mic,
    Route, FileJson, Webhook, Component, PenTool, Cloud, Code, GraduationCap, School, CheckCircle, Briefcase, Clock, Monitor, Feather, Settings, Figma, TrendingUp, Film, ImageIcon, Edit3, Book, BookOpen, Package, Linkedin, Github, Instagram
} from 'lucide-react';

import {
    // React Icons
    FaReact, FaHtml5, FaCss3Alt, FaJsSquare, FaGithub, FaYoutube, FaNewspaper, FaLanguage, FaPencilRuler, FaGlobe, FaMobileAlt, FaChartLine, FaFileArchive, FaIcons, FaDocker, FaNodeJs
} from 'react-icons/fa';

import {
    // React Icons SI
    SiRedux, SiTailwindcss, SiPostcss, SiNetlify, SiDaisyui, SiVite, SiMui, SiTypescript, SiNextdotjs, SiShadcnui, SiFramer, SiIcon, SiFirebase, SiSanity, SiN8N, SiOpenai, SiAirtable, SiTelegram, SiPostgresql, SiNginx, SiDigitalocean, SiGreensock
} from 'react-icons/si';

import { MdEmail, MdViewInAr } from 'react-icons/md';
import { AiOutlineDeploymentUnit } from 'react-icons/ai';
import { FaXTwitter } from 'react-icons/fa6';

export const TechIconMap: Record<string, React.ElementType> = {
    // Lucide Icons (mapped by name or capability)
    "Workflow": Workflow,
    "Bot": Bot,
    "Brain": Brain,
    "Zap": Zap,
    "Code2": Code2,
    "Layout": Layout,
    "Database": Database,
    "Server": Server,
    "Rocket": Rocket,
    "Search": Search,
    "Globe": Globe,
    "Puzzle": Puzzle,
    "Palette": Palette,
    "Terminal": Terminal,
    "FileText": FileText,
    "Users": Users,
    "Cpu": Cpu,
    "Layers": Layers,
    "LineChart": LineChart,
    "GitBranch": GitBranch,
    "Lock": Lock,
    "Smartphone": Smartphone,
    "MessageSquare": MessageSquare,
    "Mic": Mic,
    "Route": Route,
    "FileJson": FileJson,
    "Webhook": Webhook,
    "Component": Component,
    "PenTool": PenTool,
    "Cloud": Cloud,
    "Code": Code,
    "GraduationCap": GraduationCap,
    "School": School,
    "CheckCircle": CheckCircle,
    "Briefcase": Briefcase,
    "Clock": Clock,
    "Monitor": Monitor,
    "Feather": Feather,
    "Settings": Settings,
    "Figma": Figma,
    "TrendingUp": TrendingUp,
    "Film": Film,
    "ImageIcon": ImageIcon,
    "Edit3": Edit3,
    "Book": Book,
    "BookOpen": BookOpen,
    "Package": Package,
    "Linkedin": Linkedin,
    "Github": Github,
    "Instagram": Instagram,
    "Sparkles": Sparkles,
    "Target": ArrowRight, // Mapping 'Target' to ArrowRight as fallback if Target isn't imported, checking original... Original has ArrowRight, Sparkles. I don't see Target in imports but it is used in philosophy. I will use ArrowRight or check if I missed Target. I'll stick to ArrowRight or maybe I should import Target if it exists in Lucide. Target exists in Lucide. I'll add it.

    // Tech Stack
    "React": FaReact,
    "React 18": FaReact,
    "Next.js": SiNextdotjs,
    "Next.js 14": SiNextdotjs,
    "Next.js 15": SiNextdotjs,
    "TypeScript": SiTypescript,
    "JavaScript": FaJsSquare,
    "JavaScript ES6+": FaJsSquare,
    "Firebase": SiFirebase,
    "Firestore": Database,
    "Sanity": SiSanity,
    "Sanity CMS": SiSanity,
    "n8n": SiN8N,
    "Tailwind CSS": SiTailwindcss,
    "Tailwind": SiTailwindcss,
    "Shadcn UI": SiShadcnui,
    "Framer Motion": SiFramer,
    "Resend": MdEmail,
    "Cal.com API": FaGlobe,
    "Airtable API": SiAirtable,
    "Telegram Bot API": SiTelegram,
    "Vercel": FaGlobe,
    "Docker": FaDocker,
    "Node.js": FaNodeJs,
    "Vite": SiVite,
    "React Router": Route,
    "PDFJS": MdViewInAr,
    "EmailJS": MdEmail,
    "React LazyLoad": FaMobileAlt,
    "Vercel Analytics": FaChartLine,
    "PostCSS": SiPostcss,
    "React Icons": FaIcons,
    "Redux Toolkit": SiRedux,
    "Redux": SiRedux,
    "Express": Server,
    "DaisyUI": SiDaisyui,
    "Alan AI": FaLanguage,
    "NewsAPI": FaNewspaper,
    "GNews": Webhook,
    "YouTube API": FaYoutube,
    "REST API": Cloud,
    "Parcel": AiOutlineDeploymentUnit,
    "Swiggy API": FaGlobe,
    "GitHub API": FaGithub,
    "OpenAI API": SiOpenai,
    "GPT-4": SiOpenai,
    "LinkedIn API": FaGlobe,
    "Twitter API": FaGlobe,
    "PostgreSQL": SiPostgresql,
    "Nginx": SiNginx,
    "MDX": FileJson,
    "Prism.js": FaPencilRuler,
    "GROQ": Database,
    "Web Speech API": FaLanguage,
    "LocalStorage API": Database,
    "LocalStorage": Database,
    "Material-UI": SiMui,
    "PWA": FaMobileAlt,
    "HTML": FaHtml5,
    "CSS": FaCss3Alt,
    "API Integration": Webhook,
    "SPA": FaGlobe,
    "Performance": FaChartLine,
    "Automation": AiOutlineDeploymentUnit,
    "CRM": Database,
    "Client Work": FaGlobe,
    "Personal": FaGlobe,
    "OAuth2": FaGlobe,
    "Full-Stack": Server,
    "Real-time": FaGlobe,
    "Voice": FaLanguage,
    "News": FaNewspaper,
    "E-Commerce": FaGlobe,
    "B2B": FaGlobe,
    "JAMstack": FaGlobe,
    "PDF": MdViewInAr,
    "Utility": PenTool,
    "Text Processing": FaPencilRuler,

    // Socials
    "FaXTwitter": FaXTwitter,
};

export const getIcon = (name: string): React.ElementType => {
    return TechIconMap[name] || FaGlobe;
};
