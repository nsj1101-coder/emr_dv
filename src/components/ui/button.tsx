import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "xl";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          {
            "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm": variant === "primary",
            "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400": variant === "secondary",
            "border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500": variant === "outline",
            "text-gray-600 hover:bg-gray-100 focus:ring-gray-400": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm": variant === "danger",
            "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm": variant === "success",
          },
          {
            "h-9 px-3.5 text-sm rounded-lg": size === "sm",
            "h-11 px-5 text-[15px]": size === "md",
            "h-13 px-6 text-base": size === "lg",
            "h-14 px-8 text-lg": size === "xl",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button };
