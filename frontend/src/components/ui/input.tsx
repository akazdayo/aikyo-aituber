import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-white/15 bg-slate-950/60 px-3 py-1 text-sm text-slate-100 shadow-sm outline-none transition-[box-shadow,color] selection:bg-emerald-400 selection:text-black",
        "placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        "file:inline-flex file:h-7 file:cursor-pointer file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:text-xs file:font-medium file:text-slate-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
