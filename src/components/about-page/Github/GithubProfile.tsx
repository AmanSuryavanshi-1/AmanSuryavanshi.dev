"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Users } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ProfileCard } from './ProfileCard'
import { StatCard } from './StatCard'
import { LatestRepoCard } from './LatestRepoCard'

interface GitHubUser {
  avatar_url: string
  name: string
  login: string
  public_repos: number
  followers: number
  following: number
  bio: string
  html_url: string
  location: string
  blog?: string
}

interface GitHubRepository {
  name: string
  description: string
  html_url: string
  stargazers_count: number
  topics: string[] | null
  languages_url: string
  pushed_at: string
  homepage: string | null
  language: string | null
}

export default function GithubProfile() {
  const [userData, setUserData] = useState<GitHubUser | null>(null)
  const [latestRepo, setLatestRepo] = useState<GitHubRepository | null>(null)
  const [repoTopics, setRepoTopics] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const userResponse = await fetch('https://api.github.com/users/AmanSuryavanshi-1')
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data')
        }
        const userData: GitHubUser = await userResponse.json()
        setUserData(userData)

        // Fetch latest repository with topics
        const reposResponse = await fetch(
          'https://api.github.com/users/AmanSuryavanshi-1/repos?sort=updated&direction=desc',
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        )
        if (!reposResponse.ok) {
          throw new Error('Failed to fetch repositories')
        }
        const repos: GitHubRepository[] = await reposResponse.json()
        const latestRepo = repos[0] || null
        setLatestRepo(latestRepo)

        // Set topics from the latest repo
        if (latestRepo && latestRepo.topics && latestRepo.topics.length > 0) {
          setRepoTopics(latestRepo.topics)
        } else {
          setRepoTopics(['ReactJS'])
        }
      } catch (error) {
        console.error('Error fetching GitHub data:', error)
        setRepoTopics(['ReactJS'])
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserData()
  }, [])

  // Adding Shimmer UI for loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        {/* Skeleton for the title */}
        <Skeleton className="w-48 h-12 mx-auto mb-8 rounded-lg" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-1">
            {/* Profile Card Skeleton */}
            <Skeleton className="w-full h-[400px] rounded-2xl" />
          </div>
          <div className="lg:col-span-2 space-y-5">
            {/* Stat Cards Skeleton */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((_, index) => (
                <Skeleton key={index} className="h-[80px] rounded-2xl" />
              ))}
            </div>

            {/* Latest Repo Card Skeleton */}
            <Skeleton className="w-full h-[280px] rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!userData) return null

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl sm:text-2xl md:text-3xl mb-6 flex justify-center items-center font-bold font-serif text-forest-900">
        My <span className="text-lime-500 px-2">GitHub</span> Profile
      </motion.h2>

      {/* Updated Grid Structure - Removed Location StatCard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Profile Card (now includes location) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 flex"
        >
          <ProfileCard userData={userData} />
        </motion.div>

        {/* Right Column: Stats + Latest Project */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 flex flex-col gap-5"
        >
          {/* Stats Row - Now only 3 cards */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard icon={BookOpen} title="Repositories" value={userData.public_repos} />
            <StatCard icon={Users} title="Followers" value={userData.followers} />
            <StatCard icon={Users} title="Following" value={userData.following} />
          </div>

          {/* Latest Project Card - Will fill remaining space */}
          <div className="flex-1">
            {latestRepo && (
              <LatestRepoCard repo={latestRepo} topics={repoTopics} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
