import { useEffect, useState } from "react";
import {
  Mountain,
  Radio,
  Sun,
  Droplets,
  Volume2,
  VolumeX,
  type LucideIcon,
} from "lucide-react";
import { play, setMuted } from "@/lib/moon/audio";
import { isOnline, TEAM_META, TEAMS, type Role, type RoomState, type TeamId } from "@/lib/moon/model";
import { cn } from "@/components/moon/ui";

const ICONS: Record<TeamId, LucideIcon> = {
  energy: Sun,
  water: Droplets,
  terrain: Mountain,
  comms: Radio,
};

export function TeamIcon({ team, className }: { team: TeamId; className?: string }) {
  const Icon = ICONS[team];
  return <Icon className={className} aria-hidden />;
}

export function teamTone(team: TeamId): string {
  if (team === "energy") return "text-warn";
  if (team === "water") return "text-accent";
  if (team === "terrain") return "text-signal";
  return "text-good";
}

const STATIONS: { id: Role; label: string }[] = [
  { id: "main", label: "Class screen" },
  ...TEAMS.map((id) => ({ id, label: TEAM_META[id].label })),
];

export function StationStrip({
  role,
  onPick,
}: {
  role: Role;
  onPick: (role: Role) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="This device">
      {STATIONS.map((station) => {
        const active = station.id === role;
        return (
          <button
            key={station.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => {
              play("tap");
              onPick(station.id);
            }}
            className={cn(
              "min-h-11 rounded-full px-3 font-display text-xs font-semibold tracking-wide transition-[transform,background-color,color] duration-150 active:scale-[0.96]",
              active ? "bg-accent text-bg" : "bg-surface-2 text-muted",
            )}
          >
            {station.label}
          </button>
        );
      })}
    </div>
  );
}

export function SoundButton() {
  const [muted, setLocal] = useState(false);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("artemis-junior:mute") === "1";
      setLocal(stored);
      setMuted(stored);
    } catch {
      /* ignore */
    }
  }, []);
  return (
    <button
      type="button"
      aria-pressed={muted}
      aria-label={muted ? "Unmute mission sounds" : "Mute mission sounds"}
      className="flex size-11 items-center justify-center rounded-full bg-surface-2 text-fg"
      onClick={() => {
        const next = !muted;
        setLocal(next);
        setMuted(next);
        try {
          localStorage.setItem("artemis-junior:mute", next ? "1" : "0");
        } catch {
          /* ignore */
        }
        if (!next) play("tap");
      }}
    >
      {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
    </button>
  );
}

export function LinkPill({ link }: { link: "connecting" | "live" | "local" }) {
  const label = link === "live" ? "Class linked" : link === "local" ? "This screen only" : "Linking";
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 font-display text-xs tracking-wide text-muted">
      <span
        className={cn(
          "size-2 rounded-full",
          link === "live" && "bg-good",
          link === "local" && "bg-warn",
          link === "connecting" && "bg-faint",
        )}
        aria-hidden
      />
      {label}
    </span>
  );
}

export function Presence({
  state,
  now,
}: {
  state: RoomState;
  now: number;
}) {
  return (
    <ul className="flex flex-wrap gap-2">
      <PresenceChip label="Screen" on={isOnline(state.seen.main, now)} />
      {TEAMS.map((team) => (
        <PresenceChip key={team} label={TEAM_META[team].label} on={isOnline(state.seen[team], now)} />
      ))}
    </ul>
  );
}

function PresenceChip({ label, on }: { label: string; on: boolean }) {
  return (
    <li className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-bg/70 px-2 text-xs text-muted">
      <span className={cn("size-1.5 rounded-full", on ? "bg-good" : "bg-line")} aria-hidden />
      {label}
      <span className="sr-only">{on ? "online" : "not seen yet"}</span>
    </li>
  );
}

export function ClueStack({
  clues,
}: {
  clues: { title: string; body: string }[];
}) {
  const [open, setOpen] = useState(0);
  const [seen, setSeen] = useState(1);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="font-display text-sm font-semibold tracking-wide text-fg">Clues</h2>
        <p className="text-xs text-muted tabular-nums">
          {seen} of {clues.length} opened
        </p>
      </div>
      <div className="grid gap-2">
        {clues.map((clue, index) => {
          const expanded = open === index;
          return (
            <button
              key={clue.title}
              type="button"
              aria-expanded={expanded}
              onClick={() => {
                play("tap");
                setOpen(expanded ? -1 : index);
                setSeen((n) => Math.max(n, index + 1));
              }}
              className={cn(
                "rounded-lg px-3 py-3 text-left transition-[background-color,transform] duration-150 active:scale-[0.96]",
                expanded ? "bg-surface-2" : "bg-bg/50",
              )}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="font-display text-sm font-semibold text-fg">
                  {index + 1}. {clue.title}
                </span>
                <span className="text-xs text-accent">{expanded ? "Hide" : "Open"}</span>
              </span>
              {expanded && <span className="mt-2 block text-sm leading-relaxed text-muted">{clue.body}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
