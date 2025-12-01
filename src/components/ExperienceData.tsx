export interface Stat {
  icon: string;
  value: number;
  suffix: string;
  label: string;
  desc: string;
}

export interface TimelineItem {
  year: string;
  role: string;
  company: string;
  desc: string;
}

export interface ExperienceData {
  stats: Stat[];
  timeline: TimelineItem[];
}

const experienceData: ExperienceData = {
  stats: [
    {
      icon: 'Briefcase',
      value: 5,
      suffix: '+',
      label: 'Years Experience',
      desc: 'In web development'
    },
    {
      icon: 'FolderGit2',
      value: 50,
      suffix: '+',
      label: 'Projects Completed',
      desc: 'Successful deliveries'
    },
    {
      icon: 'Users',
      value: 30,
      suffix: '+',
      label: 'Happy Clients',
      desc: 'Worldwide'
    },
    {
      icon: 'Award',
      value: 15,
      suffix: '+',
      label: 'Certifications',
      desc: 'Professional credentials'
    }
  ],
  timeline: [
    {
      year: '2024 - Present',
      role: 'Senior Full Stack Developer',
      company: 'Tech Company',
      desc: 'Leading development of modern web applications using Next.js, React, and TypeScript. Implementing best practices and mentoring junior developers.'
    },
    {
      year: '2022 - 2024',
      role: 'Full Stack Developer',
      company: 'Digital Agency',
      desc: 'Developed and maintained multiple client projects using React, Node.js, and various modern frameworks. Focused on performance optimization and user experience.'
    },
    {
      year: '2020 - 2022',
      role: 'Frontend Developer',
      company: 'Startup Inc',
      desc: 'Built responsive web applications and collaborated with design teams to create intuitive user interfaces. Specialized in React and modern CSS frameworks.'
    },
    {
      year: '2019 - 2020',
      role: 'Junior Developer',
      company: 'Web Solutions',
      desc: 'Started career in web development, learning modern frameworks and contributing to various projects. Gained experience in full-stack development.'
    }
  ]
};

export default experienceData;
