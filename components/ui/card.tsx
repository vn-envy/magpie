import * as React from "react";
import { cn } from "@/lib/utils";

// Three-level elevation per the reference schema: #000 page → #0a0b0c panel
// → #111315 nested surface, separated by #222 borders. Titles stay dot-matrix
// (dashboard element); body copy uses the sans stack.
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[2px] border border-[#222222] bg-[#0a0b0c] text-zinc-100",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1 border-b border-[#1c1c1f] px-5 py-4", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1.5 font-dot text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 [&>span.shrink-0]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-5 py-4", className)} {...props}
  />;
}

export { Card, CardHeader, CardTitle, CardContent };
