import type { AppointmentStatus } from "@/types/appointment";
import { cn } from "@/lib/utils";

const statusMap: Record<AppointmentStatus, { label: string; className: string }> = {
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800",
  },
};

interface StatusBadgeProps {
  status: AppointmentStatus;
  labelOverride?: string;
}

export function StatusBadge({ status, labelOverride }: StatusBadgeProps) {
  const { label, className } = statusMap[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border border-border",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", className)}>
      {labelOverride ?? label}
    </span>
  );
}
