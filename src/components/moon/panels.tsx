import { useState, type ReactElement, type ReactNode } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  ICE_LABEL,
  SITES_DATA,
  SITE_FILL,
  type Site,
  type SiteId,
} from "@/lib/moon/model";
import { play } from "@/lib/moon/audio";
import { cn } from "@/components/moon/ui";

const tick = { fill: "var(--color-muted)", fontSize: 12, fontFamily: "Outfit, sans-serif" };

function Frame({ children }: { children: ReactNode }) {
  return (
    <ClientOnly fallback={<div className="h-56 rounded-lg bg-bg/40" />}>
      <div className="h-56 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          {children as ReactElement}
        </ResponsiveContainer>
      </div>
    </ClientOnly>
  );
}

function Tip({
  active,
  payload,
  unit,
}: {
  active?: boolean;
  payload?: { value?: number; payload?: Site }[];
  unit: string;
}) {
  if (!active || !payload?.[0]?.payload) return null;
  const site = payload[0].payload;
  return (
    <div className="rounded-lg bg-surface px-3 py-2 text-sm shadow-card">
      <p className="font-display font-semibold text-fg">{site.name}</p>
      <p className="text-muted tabular-nums">
        {payload[0].value} {unit}
      </p>
    </div>
  );
}

function Bars({
  dataKey,
  unit,
  domain,
  selected,
  onSelect,
}: {
  dataKey: keyof Site;
  unit: string;
  domain: [number, number];
  selected: SiteId | null;
  onSelect: (id: SiteId) => void;
}) {
  return (
    <Frame>
      <BarChart data={SITES_DATA} barCategoryGap="28%">
        <CartesianGrid vertical={false} stroke="var(--color-line)" />
        <XAxis dataKey="short" tick={tick} axisLine={false} tickLine={false} />
        <YAxis domain={domain} tick={tick} axisLine={false} tickLine={false} width={36} />
        <Tooltip cursor={{ fill: "rgba(62,224,255,0.06)" }} content={<Tip unit={unit} />} />
        <Bar
          dataKey={dataKey}
          radius={[8, 8, 0, 0]}
          onClick={(row: { id?: SiteId }) => {
            if (row.id) {
              play("tap");
              onSelect(row.id);
            }
          }}
        >
          {SITES_DATA.map((site) => (
            <Cell
              key={site.id}
              fill={SITE_FILL[site.id]}
              fillOpacity={!selected || selected === site.id ? 1 : 0.35}
            />
          ))}
        </Bar>
      </BarChart>
    </Frame>
  );
}

export function EnergyPanel({
  selected,
  onSelect,
}: {
  selected: SiteId | null;
  onSelect: (id: SiteId) => void;
}) {
  const focus = SITES_DATA.find((s) => s.id === selected) ?? null;
  return (
    <div className="grid gap-3">
      <div>
        <h3 className="font-display text-base font-semibold">Sun visibility</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Taller bar, more time in the Sun. Tap a bar to compare.
        </p>
      </div>
      <Bars dataKey="sun" unit="% sun visibility" domain={[0, 100]} selected={selected} onSelect={onSelect} />
      {focus && (
        <p className="text-sm leading-relaxed text-fg">
          {focus.name} sees the Sun {focus.sun}% of the time.{" "}
          {focus.sun >= 45 ? "That is the most of the three." : focus.sun >= 38 ? "That is in the middle." : "That is the least of the three."}
        </p>
      )}
    </div>
  );
}

export function WaterPanel({
  selected,
  onSelect,
}: {
  selected: SiteId | null;
  onSelect: (id: SiteId) => void;
}) {
  const focus = SITES_DATA.find((s) => s.id === selected) ?? null;
  return (
    <div className="grid gap-3">
      <div>
        <h3 className="font-display text-base font-semibold">Ice evidence</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Ranked from NASA's map of permanently shadowed areas. More shadow does not automatically mean more water,
          but it is more probable.
        </p>
      </div>
      <div className="rounded-lg bg-bg/50 p-3">
        <div className="mb-3 flex items-end justify-between gap-3">
          <p className="font-display text-xs tracking-widest text-accent uppercase">Crater shadow</p>
          <p className="text-xs text-faint">Sun misses the floor</p>
        </div>
        <div className="relative h-24 overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-14 rounded-t-[50%] border-t border-line bg-surface-2" />
          <div className="absolute bottom-3 left-1/2 h-8 w-20 -translate-x-1/2 rounded-t-full bg-accent/30" />
          <span className="absolute top-1 left-3 font-display text-xs text-warn">Sunlight</span>
          <span className="absolute right-3 bottom-5 font-display text-xs text-accent">Cold trap</span>
        </div>
      </div>
      <div className="grid gap-2">
        {[...SITES_DATA]
          .sort((a, b) => b.iceRank - a.iceRank)
          .map((site) => (
            <button
              key={site.id}
              type="button"
              onClick={() => {
                play("tap");
                onSelect(site.id);
              }}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-left",
                selected === site.id ? "bg-surface-2" : "bg-bg/40",
              )}
            >
              <span className="font-display text-sm font-semibold">
                {site.id} · {site.short}
              </span>
              <span className="font-display text-sm font-semibold">{ICE_LABEL[site.iceRank]}</span>
            </button>
          ))}
      </div>
      {focus && (
        <p className="text-sm leading-relaxed text-fg">
          Water ice at {focus.name}: {ICE_LABEL[focus.iceRank].toLowerCase()} of the three.
        </p>
      )}
    </div>
  );
}

export function TerrainPanel({
  selected,
  onSelect,
}: {
  selected: SiteId | null;
  onSelect: (id: SiteId) => void;
}) {
  const focus = SITES_DATA.find((s) => s.id === selected) ?? null;
  const [help, setHelp] = useState(false);
  return (
    <div className="grid gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-semibold">Slope and landing area</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Average slope describes the region overall, not every landing spot. A larger suitable area gives more
            places to choose from.
          </p>
        </div>
        <button
          type="button"
          aria-expanded={help}
          onClick={() => setHelp((v) => !v)}
          className="min-h-11 shrink-0 rounded-full bg-surface-2 px-3 font-display text-xs font-semibold text-warn"
        >
          What is slope?
        </button>
      </div>
      {help && (
        <p className="rounded-lg bg-warn/10 px-3 py-3 text-sm leading-relaxed text-fg">
          Slope is how steep the ground is. A wheelchair ramp is about 5°. All three regions have suitable, safe
          landing areas.
        </p>
      )}
      <p className="font-display text-xs tracking-widest text-muted uppercase">Average slope · lower is gentler</p>
      <Bars dataKey="slope" unit="° average slope" domain={[0, 10]} selected={selected} onSelect={onSelect} />
      <p className="font-display text-xs tracking-widest text-muted uppercase">Suitable landing area · km²</p>
      <Bars dataKey="area" unit="km² to land" domain={[0, 600]} selected={selected} onSelect={onSelect} />
      {focus && (
        <p className="text-sm leading-relaxed text-fg">
          {focus.name} has an average slope of {focus.slope}° and {focus.area} km² of suitable landing area.{" "}
          {focus.area >= 500
            ? "That is far more room to choose a landing spot."
            : focus.slope <= 5.6
              ? "The gentlest slope, but very little room to choose from."
              : "A gentle slope with some room to choose from."}
        </p>
      )}
    </div>
  );
}

export function CommsPanel({
  selected,
  onSelect,
}: {
  selected: SiteId | null;
  onSelect: (id: SiteId) => void;
}) {
  const focus = SITES_DATA.find((s) => s.id === selected) ?? null;
  return (
    <div className="grid gap-3">
      <div>
        <h3 className="font-display text-base font-semibold">Earth visibility</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Percent of time Earth is in view. When mountains or craters block it, the base cannot call home directly.
        </p>
      </div>
      <Bars dataKey="earth" unit="% Earth visibility" domain={[0, 100]} selected={selected} onSelect={onSelect} />
      {focus && (
        <p className="text-sm leading-relaxed text-fg">
          From {focus.name}, Earth is visible {focus.earth}% of the time.{" "}
          {focus.earth >= 74 ? "The most of the three." : focus.earth >= 68 ? "Close behind the leader." : "The least of the three."}
        </p>
      )}
    </div>
  );
}
