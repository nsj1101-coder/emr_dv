import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, iconColor = "text-blue-600 bg-blue-50" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[15px] font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">{value}</p>
          {change && (
            <p className={cn("mt-2 text-sm font-semibold", {
              "text-emerald-600": changeType === "positive",
              "text-red-600": changeType === "negative",
              "text-gray-500": changeType === "neutral",
            })}>
              {change}
            </p>
          )}
        </div>
        <div className={cn("rounded-2xl p-3.5", iconColor)}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}
