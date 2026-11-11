import { useState, type ReactElement, type ReactNode } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  blackoutDays,
  kelvinToC,
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
  const leader = [...SITES_DATA].sort((a, b) => b.sun - a.sun)[0];
  return (
    <div className="grid gap-3">
      <div>
        <h3 className="font-display text-base font-semibold">Sunlight each year</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Taller bar, more time in the Sun. Tap a bar. {leader.short} leads with {leader.sun}%.
        </p>
      </div>
      <Bars dataKey="sun" unit="% sunlit" domain={[0, 100]} selected={selected} onSelect={onSelect} />
      <div className="grid grid-cols-3 gap-2">
        {SITES_DATA.map((site) => (
          <button
            key={site.id}
            type="button"
            onClick={() => {
              play("tap");
              onSelect(site.id);
            }}
            className={cn(
              "rounded-lg px-2 py-2 text-left",
              selected === site.id ? "bg-surface-2" : "bg-bg/40",
            )}
          >
            <span className="block font-display text-xs text-muted">{site.id}</span>
            <span className="block font-display text-lg font-semibold tabular-nums">{site.nightDays}d</span>
            <span className="block text-xs text-faint">longest night</span>
          </button>
        ))}
      </div>
      {focus && (
        <p className="text-sm leading-relaxed text-fg">
          {focus.name} is sunlit {focus.sun}% of the year. The longest dark stretch is about {focus.nightDays}{" "}
          Earth days. {focus.nightDays <= 4 ? "Batteries have an easier job." : "Pack a serious night plan."}
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
        <h3 className="font-display text-base font-semibold">Ice clues</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Higher means stronger evidence of water ice in nearby cold traps. Colder traps hold ice longer.
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
      <Bars dataKey="ice" unit="ice clues" domain={[0, 100]} selected={selected} onSelect={onSelect} />
      <div className="grid gap-2">
        {SITES_DATA.map((site) => (
          <button
            key={site.id}
            type="button"
            onClick={() => {
              play("tap");
              onSelect(site.id);
            }}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left",
              selected === site.id ? "bg-surface-2" : "bg-bg/40",
            )}
          >
            <span>
              <span className="font-display text-sm font-semibold">
                {site.id} · {site.short}
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                {site.psr} shadowed crater{site.psr === 1 ? "" : "s"} nearby
              </span>
            </span>
            <span className="text-right">
              <span className="block font-display text-lg font-semibold tabular-nums">{site.kelvin} K</span>
              <span className="block text-xs text-faint tabular-nums">{kelvinToC(site.kelvin)} °C</span>
            </span>
          </button>
        ))}
      </div>
      {focus && (
        <p className="text-sm leading-relaxed text-fg">
          {focus.name} scores {focus.ice} for ice clues. Its coldest trap is {focus.kelvin} K, about{" "}
          {kelvinToC(focus.kelvin)} °C. {focus.kelvin <= 40 ? "That is cold enough to lock ice in place." : "Warmer traps let ice slip away."}
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
          <h3 className="font-display text-base font-semibold">Slope vs landing room</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Low slope is safer. More pads means more room for a lander, habitat, and solar field.
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
          Slope is how steep the ground is. A wheelchair ramp is about 5°. A steep trail can be 15°. Under 8°
          is friendlier for a first Moon base.
        </p>
      )}
      <p className="font-display text-xs tracking-widest text-muted uppercase">Average slope · lower is better</p>
      <Bars dataKey="slope" unit="° slope" domain={[0, 15]} selected={selected} onSelect={onSelect} />
      <p className="font-display text-xs tracking-widest text-muted uppercase">Flat landing pads · more is better</p>
      <Bars dataKey="pads" unit="pads" domain={[0, 5]} selected={selected} onSelect={onSelect} />
      {focus && (
        <p className="text-sm leading-relaxed text-fg">
          {focus.name} averages {focus.slope}° and has {focus.pads} good pads.{" "}
          {focus.slope <= 8 && focus.pads >= 4
            ? "This is the friendly landing."
            : focus.slope >= 11
              ? "Steep and tight. A hard first landing."
              : "Landable, if the pilot aims with care."}
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
        <h3 className="font-display text-base font-semibold">Earth in view</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Percent of time Earth sits above the horizon. When it drops, the direct radio goes quiet.
        </p>
      </div>
      <Bars dataKey="earth" unit="% Earth visible" domain={[0, 100]} selected={selected} onSelect={onSelect} />
      <div className="grid gap-2">
        {SITES_DATA.map((site) => {
          const quiet = blackoutDays(site.earth);
          return (
            <button
              key={site.id}
              type="button"
              onClick={() => {
                play("tap");
                onSelect(site.id);
              }}
              className={cn(
                "rounded-lg px-3 py-3 text-left",
                selected === site.id ? "bg-surface-2" : "bg-bg/40",
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-display text-sm font-semibold">
                  {site.id} · {site.short}
                </span>
                <span className="font-display text-lg font-semibold tabular-nums">{site.earth}%</span>
              </span>
              <span className="mt-2 block h-2 overflow-hidden rounded-full bg-bg">
                <span className="block h-full rounded-full bg-good" style={{ width: `${site.earth}%` }} />
              </span>
              <span className="mt-2 block text-xs text-muted">
                About {quiet} quiet {quiet === 1 ? "day" : "days"} each lunar month
              </span>
            </button>
          );
        })}
      </div>
      {focus && (
        <p className="text-sm leading-relaxed text-fg">
          From {focus.name}, Earth is visible {focus.earth}% of the time.{" "}
          {focus.earth >= 90
            ? "Calls home almost never drop."
            : focus.earth >= 65
              ? "Most days have a window to talk."
              : "Plan for longer blackouts or a relay."}
        </p>
      )}
    </div>
  );
}
