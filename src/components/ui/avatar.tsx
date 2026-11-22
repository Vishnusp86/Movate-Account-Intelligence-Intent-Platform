import * as React from "react"
import { cn } from "@/lib/utils"

function Avatar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center font-medium text-xs text-slate-600",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarFallback }
