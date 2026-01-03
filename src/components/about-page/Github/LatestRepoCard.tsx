import { Code, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface LatestRepoCardProps {
  repo: {
    name: string
    description: string
    html_url: string
    homepage: string | null
    stargazers_count: number
    language: string | null
  }
  topics: string[]
}

export function LatestRepoCard({ repo, topics }: LatestRepoCardProps) {
  return (
    <Card className="group overflow-hidden rounded-3xl 
                     border-2 border-sage-200/60 dark:border-white/10 
                     bg-white/60 dark:bg-forest-900/40 
                     backdrop-blur-md 
                     hover:bg-white/80 dark:hover:bg-forest-800/50 
                     transition-all duration-300 
                     shadow-lg hover:shadow-xl 
                     h-full flex flex-col">
      <CardContent className="p-5 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-forest-200/50 dark:border-forest-700/50 pb-3 mb-3">
          <div className="p-2 rounded-xl bg-lime-100 dark:bg-lime-500/20 text-lime-700 dark:text-lime-400 group-hover:bg-lime-500 group-hover:text-white transition-colors duration-300">
            <Code className="w-4 h-4" />
          </div>
          <h4 className="text-base font-bold text-forest-900 dark:text-sage-100">
            Latest Project
          </h4>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
            <p className="text-lg font-serif font-bold text-forest-900 dark:text-sage-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors duration-300 truncate max-w-full sm:max-w-[70%]">
              {repo.name}
            </p>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium px-2.5 py-1 rounded-full 
                         bg-forest-100 dark:bg-forest-800 
                         text-forest-700 dark:text-sage-300 
                         hover:bg-forest-900 hover:text-white 
                         dark:hover:bg-lime-600 dark:hover:text-white
                         transition-all duration-300 flex items-center gap-1.5 shrink-0"
            >
              Repo <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-forest-700 dark:text-sage-300 text-sm mb-3 leading-relaxed line-clamp-3">
            {repo.description || 'No description available for this repository.'}
          </p>

          <div className="mt-auto space-y-3">
            {/* Topics */}
            {topics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {topics.map((topic, index) => (
                  <span
                    key={`${topic}-${index}`}
                    className="px-2.5 py-1 rounded-lg 
                               bg-forest-50 dark:bg-forest-800 
                               border border-forest-200 dark:border-forest-600 
                               text-xs font-medium text-forest-700 dark:text-sage-300 
                               whitespace-nowrap"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}

            {/* Stars */}
            {repo.stargazers_count > 0 && (
              <div className="text-sm font-medium text-forest-900 dark:text-sage-200 flex items-center gap-1">
                <span className="text-lime-600 dark:text-lime-400">★</span> {repo.stargazers_count} stars
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-3 mt-3 border-t border-forest-200/50 dark:border-forest-700/50">
          <Button
            asChild
            className="w-full bg-forest-900 dark:bg-lime-600 text-white hover:bg-lime-600 dark:hover:bg-lime-500 font-medium transition-all duration-300 rounded-xl shadow-lg hover:shadow-lime-500/20 h-10 text-sm"
          >
            <a href={repo.homepage || repo.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              View Project Details
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
