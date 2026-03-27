import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-zinc-200 backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}

