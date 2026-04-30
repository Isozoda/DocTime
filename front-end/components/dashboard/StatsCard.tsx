import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "secondary" | "warning" | "destructive";
}

const colorMap = {
  primary:     "bg-primary/10 text-primary",
  secondary:   "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  warning:     "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  destructive: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

const accentMap = {
  primary:     "from-primary/20 to-primary/5",
  secondary:   "from-emerald-500/20 to-emerald-500/5",
  warning:     "from-amber-500/20 to-amber-500/5",
  destructive: "from-red-500/20 to-red-500/5",
};

export function StatsCard({ title, value, icon: Icon, trend, color = "primary" }: StatsCardProps) {
  return (
    <div className="relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 transition-all duration-300 group">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40 group-hover:opacity-60 transition-opacity", accentMap[color])} />
      <div className="relative p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-none">{title}</p>
            <p className="text-3xl font-bold mt-3 tabular-nums tracking-tight">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1.5">{trend}</p>
            )}
          </div>
          <div className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
            colorMap[color]
          )}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
