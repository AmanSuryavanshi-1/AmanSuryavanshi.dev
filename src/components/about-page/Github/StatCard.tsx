import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  icon: React.ElementType
  title: string
  value: number | string
}

export function StatCard({ icon: Icon, title, value }: StatCardProps) {
  return (
    <Card className="group overflow-hidden rounded-2xl border border-white/60 bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-forest-900/5 text-forest-900 group-hover:bg-lime-500 group-hover:text-white transition-colors duration-300">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900/60 mb-0.5">
            {title}
          </h4>
          <p className="text-lg font-bold text-forest-900 group-hover:text-lime-600 transition-colors duration-300">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
