"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Users, MapPin } from 'lucide-react'
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
      <section className="flex items-center justify-center min-h-[40vh] w-full px-4 py-16">
        <div className="w-full max-w-5xl">
          {/* Skeleton for the title */}
          <Skeleton className="w-48 h-12 mx-auto mb-8 rounded-lg" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="md:col-span-1">
              {/* Profile Card Skeleton */}
              <Skeleton className="w-full h-[300px] rounded-2xl" />
            </div>
            <div className="md:col-span-3 space-y-6">
              {/* Stat Cards Skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((_, index) => (
                  <Skeleton key={index} className="h-[80px] rounded-2xl" />
                ))}
              </div>

              {/* Latest Repo Card Skeleton */}
              <Skeleton className="w-full h-[200px] rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!userData) return null

  return (
    <section className="flex items-center justify-center w-full px-4 py-16">
      <div className="w-full max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl md:text-3xl mb-6 md:mb-8 flex justify-center items-center font-bold font-serif text-forest-900">
          My <span className="text-lime-500 px-2"> GitHub</span> Profile
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 h-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1 h-full"
          >
            <div className="h-full">
              <ProfileCard userData={userData} />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-3 space-y-6 h-full"
          >
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-5">
              <StatCard icon={BookOpen} title="Repositories" value={userData.public_repos} />
              <StatCard icon={Users} title="Followers" value={userData.followers} />
              <StatCard icon={Users} title="Following" value={userData.following} />
              <StatCard icon={MapPin} title="Location" value={userData.location || 'India'} />
            </div>

            {latestRepo && (
              <LatestRepoCard repo={latestRepo} topics={repoTopics} />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
