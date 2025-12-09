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
    <div>
      {/* Hero Section */}
      <Hero />
      {/* Featured Projects */}
      <FeaturedProjectsSection />
      <WorkBanner />
      {/* About Section */}
      <div className='py-16'>
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
  )
}


export default page
