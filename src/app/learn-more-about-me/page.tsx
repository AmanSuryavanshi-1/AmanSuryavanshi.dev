import { Metadata } from 'next';
// import AboutMe from '@/components/about/AboutMe';
// import myData from '@/components/about/AboutData';
import GithubProfile from '@/components/learn-more-about-me/Github/GithubProfile';
import { GithubCalendarComponent } from '@/components/learn-more-about-me/Github/GithubCalendar';
import MySkills from '@/components/skills/MySkills';
// import AboutContent from '@/components/about/AboutContent';
// import Qualifications from '@/components/about/Qualifications';
import SectionTitle from '@/components/about/SectionTitle';
import AboutContent from '@/components/learn-more-about-me/Content';
import ContentCard from '@/components/learn-more-about-me/ContentCard';
import ProfileImage from '@/components/learn-more-about-me/ProfileImage';
import CTA from '@/components/learn-more-about-me/CTA';

// Site Constants
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://amansuryavanshi-dev.vercel.app/";
const ABOUT_TITLE = "About Aman Suryavanshi - Web Developer & UI/UX Designer";
const ABOUT_DESCRIPTION = "Learn about Aman Suryavanshi, a passionate web developer and UI/UX designer specializing in creating beautiful, functional digital experiences using React, Next.js, and modern web technologies.";

// Metadata configuration
export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    url: `${SITE_URL}/about`,
    images: [
      {
        url: '/Images/about-preview.png',
        width: 1200,
        height: 630,
        alt: 'Aman Suryavanshi - Web Developer and UI/UX Designer',
      },
    ],
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    images: ['/Images/about-preview.png'],
    creator: '@_AmanSurya',
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};

// Structured data for the about page
const aboutStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/about#webpage`,
      url: `${SITE_URL}/about`,
      name: ABOUT_TITLE,
      description: ABOUT_DESCRIPTION,
      isPartOf: {
        "@id": `${SITE_URL}#website`
      },
      breadcrumb: {
        "@id": `${SITE_URL}/about#breadcrumb`
      },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/about#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@id": SITE_URL,
            name: "Home"
          }
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@id": `${SITE_URL}/about`,
            name: "About"
          }
        }
      ]
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/about#person`,
      name: "Aman Suryavanshi",
      givenName: "Aman",
      familyName: "Suryavanshi",
      url: `${SITE_URL}/about`,
      image: {
        "@type": "ImageObject",
        url: "/Images/about-preview.png",
        width: 1200,
        height: 630
      },
      description: ABOUT_DESCRIPTION,
      jobTitle: "Web Developer & UI/UX Designer",
      sameAs: [
        "https://github.com/AmanSuryavanshi-1",
        "https://www.linkedin.com/in/aman-suryavanshi-6b0aba347/"
      ],
      knowsAbout: [
        "Web Development",
        "UI/UX Design",
        "React",
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Frontend Development",
        "Responsive Design"
      ],
      worksFor: {
        "@type": "Organization",
        name: "Freelance"
      },
      skills: [
        "Frontend Development",
        "React.js",
        "Next.js",
        "TypeScript",
        "UI/UX Design",
        "Responsive Web Design",
        "Web Performance Optimization",
        "SEO"
      ]
    }
  ]
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutStructuredData)
        }}
      />

      <article className="prose prose-lg max-w-none" itemScope itemType="http://schema.org/Article">
        <h1 className="sr-only">{ABOUT_TITLE}</h1>
        <div itemProp="articleBody">
          {/* Personal Info and Qualifications */}
          {/* <AboutMe 
            personalInfo={myData.personalInfo}
            qualificationsData={myData.qualificationsData}
            // skillsData={myData.skillsData}
          /> */}
          <div className="container mx-auto px-4 py-16 max-w-6xl">
            <SectionTitle />

            {/* About Image and Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-2 mx-8">
                <ProfileImage />
              </div>
              <div className="lg:col-span-3">
                <AboutContent />
              </div>
            </div>
          </div>

          {/* Content Cards Section */}
          <div className="mb-12">
            <ContentCard />
          </div>
          {/* GitHub Section */}
          <GithubProfile />
          <GithubCalendarComponent />

          {/* Skills Section */}
          <MySkills />

          {/* CTA Section */}
          <CTA />

        </div>
      </article>
    </>
  );
}