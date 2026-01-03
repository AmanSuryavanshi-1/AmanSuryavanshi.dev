import { ExternalLink, LinkIcon, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface ProfileCardProps {
  userData: {
    avatar_url: string
    name: string
    login: string
    bio: string
    html_url: string
    blog?: string
    location?: string
  }
}

export function ProfileCard({ userData }: ProfileCardProps) {
  return (
    <Card className="group overflow-hidden rounded-3xl 
                     border-2 border-sage-200/60 dark:border-white/10 
                     bg-white/60 dark:bg-forest-900/40 
                     backdrop-blur-md 
                     hover:bg-white/80 dark:hover:bg-forest-800/50 
                     transition-all duration-300 
                     shadow-lg hover:shadow-xl 
                     h-full w-full">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex flex-col items-center flex-1 justify-center">
          {/* Avatar with glow effect */}
          <div className="relative group/image mb-4">
            <div className="absolute inset-0 rounded-full bg-lime-500 blur-md opacity-20 group-hover/image:opacity-40 transition-opacity duration-300" />
            <Image
              src={userData.avatar_url}
              alt="Avatar"
              width={100}
              height={100}
              className="w-24 h-24 rounded-full border-4 border-white dark:border-forest-700 shadow-lg transition-transform duration-500 group-hover/image:scale-105 object-cover relative z-10"
            />
          </div>

          {/* Name */}
          <h3 className="text-xl font-serif font-bold text-forest-900 dark:text-sage-100 mb-2 text-center group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors duration-300">
            {userData.name || userData.login}
          </h3>

          {/* Bio */}
          <p className="text-forest-700 dark:text-sage-300 text-center text-sm mb-3 leading-relaxed px-2">
            {userData.bio}
          </p>

          {/* Location */}
          {userData.location && (
            <div className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-forest-50 dark:bg-forest-800 border border-forest-200 dark:border-forest-600">
              <MapPin className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
              <span className="text-xs font-medium text-forest-700 dark:text-sage-300">
                {userData.location}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 w-full">
          <Button
            asChild
            className="w-full bg-forest-900 dark:bg-lime-600 text-white hover:bg-lime-600 dark:hover:bg-lime-500 font-medium transition-all duration-300 rounded-xl shadow-lg hover:shadow-lime-500/20 h-10 text-sm"
          >
            <a href={userData.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              View Profile
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>

          {userData.blog && (
            <Button
              asChild
              variant="outline"
              className="w-full bg-transparent border-2 border-forest-200 dark:border-forest-600 text-forest-900 dark:text-sage-200 hover:bg-forest-50 dark:hover:bg-forest-800 hover:border-forest-300 dark:hover:border-forest-500 font-medium transition-all duration-300 rounded-xl h-10 text-sm"
            >
              <a href={userData.blog} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                Website
                <LinkIcon className="w-3.5 h-3.5" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
