import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
}

export function Badge({ children, className, variant = "default", size = "md" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold",
        {
          "bg-gray-100 text-gray-700 border border-gray-200": variant === "default",
          "bg-emerald-50 text-emerald-700 border border-emerald-200": variant === "success",
          "bg-amber-50 text-amber-700 border border-amber-200": variant === "warning",
          "bg-red-50 text-red-700 border border-red-200": variant === "danger",
          "bg-blue-50 text-blue-700 border border-blue-200": variant === "info",
        },
        {
          "rounded-md px-2 py-0.5 text-xs": size === "sm",
          "rounded-lg px-3 py-1 text-sm": size === "md",
          "rounded-lg px-4 py-1.5 text-base": size === "lg",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
