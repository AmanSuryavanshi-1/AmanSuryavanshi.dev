import React from 'react'
import Hero from "../components/hero/Hero"
import ExperienceCards from '@/components/ExperienceCards'
import WorkBanner from '@/components/WorkBanner'
import Services from '@/components/services/services'
import AboutMe from '../components/about/AboutMe'
import { portfolioData } from '@/data/portfolio'
import FeaturedProjectsSection from '@/components/home/FeaturedProjectsSection'
import Contact from '@/components/contact'
import MySkills from '@/components/skills/MySkills'

const page = () => {
  return (
    // <div className='bg-gradient-to-br from-primaryVariant to-bgVariant'>
    <div className='bg-sage-50 min-h-screen'>
      {/* Hero Section */}
      <Hero />

      <div className="flex flex-col gap-20">
        {/* Featured Projects */}
        <FeaturedProjectsSection />

        <WorkBanner />

        {/* About Section */}
        <div className='py-4'>
          <AboutMe
            personalInfo={portfolioData.about.personalInfo}
            qualificationsData={portfolioData.about.qualificationsData}
          // skillsData={myData.skillsData}
          />
        </div>

        {/* Skills Section */}
        <MySkills />

        {/* Experience Section - After Skills */}
        <ExperienceCards />

        {/* Services Section */}
        <Services />

        {/* Contact Section */}
        <Contact />
      </div>
    </div>
  )
}


export default page
