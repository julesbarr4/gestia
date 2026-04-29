import { cn } from "@/lib/utils";

export function Logo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        style={{ width: size, height: size }}
        className="relative inline-flex items-center justify-center rounded-[7px] bg-[var(--ink)] text-[var(--ivory)]"
      >
        <span
          style={{
            fontFamily: "var(--font-instrument-serif), serif",
            fontSize: size * 0.7,
            lineHeight: 1,
            fontStyle: "italic",
          }}
        >
          g
        </span>
      </span>
      <span
        className="font-medium tracking-[-0.01em] text-[var(--ink)]"
        style={{ fontSize: size * 0.62 }}
      >
        Gestia
      </span>
    </span>
  );
}
