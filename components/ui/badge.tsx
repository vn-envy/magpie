import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "trusted" | "quarantined" | "recovered" | "accent" | "outline";

const styles: Record<Variant, string> = {
  default: "border-zinc-700 bg-zinc-900 text-zinc-300",
  trusted: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  quarantined: "border-red-500/40 bg-red-500/10 text-red-400",
  recovered: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  accent: "border-[#D71921] bg-[#D71921]/10 text-[#ff5252]",
  outline: "border-zinc-700 bg-transparent text-zinc-400",
};

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[3px] border px-2 py-0.5 font-dot text-[10px] font-bold uppercase tracking-[0.15em]",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
