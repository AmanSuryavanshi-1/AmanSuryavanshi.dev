import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  icon: React.ElementType
  title: string
  value: number | string
}

export function StatCard({ icon: Icon, title, value }: StatCardProps) {
  return (
    <Card className="group overflow-hidden rounded-2xl 
                     border border-sage-200/60 dark:border-white/10 
                     bg-white/60 dark:bg-forest-900/40 
                     backdrop-blur-sm 
                     hover:bg-white/80 dark:hover:bg-forest-800/50 
                     transition-all duration-300 
                     shadow-sm hover:shadow-md hover:-translate-y-1">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-forest-100 dark:bg-forest-800 text-forest-900 dark:text-sage-200 group-hover:bg-lime-500 group-hover:text-white transition-colors duration-300">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-forest-600 dark:text-sage-400 mb-0.5">
            {title}
          </h4>
          <p className="text-lg font-bold text-forest-900 dark:text-sage-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors duration-300">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
