import { useState } from "react";
import { Radio } from "lucide-react";
import { SITE_FILL, SITES_DATA, type SiteId } from "@/lib/moon/model";
import { cn } from "@/components/moon/ui";

export function LunarMap({
  selected,
  onSelect,
  counts,
  compact = false,
}: {
  selected: SiteId | null;
  onSelect?: (id: SiteId) => void;
  counts?: Record<SiteId, number>;
  compact?: boolean;
}) {
  const [photo, setPhoto] = useState(true);

  return (
    <div className={cn("relative mx-auto w-full", compact ? "max-w-sm" : "max-w-xl")}>
      <div className="relative aspect-square overflow-hidden rounded-full shadow-glow">
        {photo ? (
          <img
            src="/art/lunar-south.jpg"
            alt="Orbital photo of the Moon's south polar craters"
            className="h-full w-full object-cover outline outline-1 -outline-offset-1 outline-white/10"
            onError={() => setPhoto(false)}
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_45%,var(--color-surface-2),var(--color-bg)_70%)]" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_55%,rgba(11,15,25,0.45)_100%)]" />
        <div className="pointer-events-none absolute top-[7%] left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-bg/70 px-2 py-1 font-display text-xs font-semibold tracking-widest text-accent uppercase">
          <Radio className="size-3" aria-hidden />
          Earth
        </div>
        {SITES_DATA.map((site) => {
          const active = selected === site.id;
          const count = counts?.[site.id] ?? 0;
          return (
            <button
              key={site.id}
              type="button"
              onClick={() => onSelect?.(site.id)}
              aria-pressed={active}
              aria-label={`${site.id}. ${site.name}`}
              className="absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ left: `${site.x}%`, top: `${site.y}%` }}
            >
              <span
                className={cn("pin-ring absolute size-11 rounded-full", active ? "opacity-100" : "opacity-70")}
                style={{ background: SITE_FILL[site.id] }}
              />
              <span
                className={cn(
                  "relative z-10 flex size-11 items-center justify-center rounded-full border font-display text-sm font-bold",
                  active ? "border-transparent text-bg" : "border-white/30 bg-bg/80 text-fg",
                )}
                style={active ? { background: SITE_FILL[site.id] } : undefined}
              >
                {site.id}
              </span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 z-20 flex size-5 items-center justify-center rounded-full bg-fg font-display text-xs font-bold text-bg">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-faint">
        South pole, classroom map. Earth sits above the limb. Not to scale.
      </p>
    </div>
  );
}
