import { useState } from "react";
import { Send } from "lucide-react";
import { play } from "@/lib/moon/audio";
import { castVote } from "@/lib/moon/sync";
import {
  activeVotes,
  REASONS,
  siteById,
  SITES_DATA,
  SITE_FILL,
  type RoomState,
  type SiteId,
  type TeamId,
} from "@/lib/moon/model";
import { Button, cn } from "@/components/moon/ui";

export function VoteDock({
  team,
  state,
  choice,
  onChoice,
}: {
  team: TeamId;
  state: RoomState;
  choice: SiteId | null;
  onChoice: (id: SiteId) => void;
}) {
  const [chip, setChip] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const mine = activeVotes(state).find((row) => row.team === team)?.vote;
  if (state.locked && state.finalChoice) {
    const site = siteById(state.finalChoice);
    return (
      <div className="sticky bottom-3 z-20 rounded-3xl bg-good/15 p-4 shadow-card">
        <p className="font-display text-xs font-semibold tracking-widest text-good uppercase">Base locked</p>
        <p className="mt-1 font-display text-xl font-semibold text-fg">{site.name}</p>
        <p className="mt-1 text-sm text-muted">The class screen filed the mission report. Nice work, crew.</p>
      </div>
    );
  }

  const chipText = REASONS[team].find((item) => item.id === chip)?.text ?? "";
  const reason = [chipText, note.trim()].filter(Boolean).join(" — ");

  return (
    <div className="sticky bottom-3 z-20 glass rounded-3xl p-4">
      <p className="font-display text-xs font-semibold tracking-widest text-accent uppercase">Our recommendation</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {SITES_DATA.map((site) => {
          const on = choice === site.id;
          return (
            <button
              key={site.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                play("tap");
                onChoice(site.id);
                setSent(false);
              }}
              className={cn(
                "min-h-16 rounded-lg px-2 py-2 text-left transition-[transform,background-color] duration-150 active:scale-[0.96]",
                on ? "text-bg" : "bg-bg/60 text-fg",
              )}
              style={on ? { background: SITE_FILL[site.id] } : undefined}
            >
              <span className="font-display text-sm font-bold">{site.id}</span>
              <span className={cn("mt-1 block text-xs leading-tight", on ? "text-bg/80" : "text-muted")}>
                {site.short}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 grid gap-2">
        {REASONS[team].map((item) => {
          const on = chip === item.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                play("tap");
                setChip(on ? null : item.id);
                setSent(false);
              }}
              className={cn(
                "min-h-11 rounded-lg px-3 py-2 text-left text-sm transition-[background-color,transform] duration-150 active:scale-[0.96]",
                on ? "bg-accent/15 text-fg" : "bg-bg/50 text-muted",
              )}
            >
              {item.text}
              <span className="mt-0.5 block text-xs text-faint">Leans {item.leans}</span>
            </button>
          );
        })}
      </div>
      <label className="mt-3 block text-xs text-muted" htmlFor="team-note">
        Add your team’s words
        <input
          id="team-note"
          value={note}
          maxLength={70}
          onChange={(event) => {
            setNote(event.target.value);
            setSent(false);
          }}
          placeholder="Optional, one short line"
          className="mt-1 min-h-11 w-full rounded-lg border border-line bg-bg px-3 text-sm text-fg placeholder:text-faint"
        />
      </label>
      {error && <p className="mt-2 text-sm text-warn">{error}</p>}
      {sent && mine && (
        <p className="mt-2 text-sm text-good">
          Sent. The class screen has {siteById(mine.choice).short}. You can update until the base is locked.
        </p>
      )}
      <Button
        className="mt-3 w-full"
        disabled={!choice || !reason}
        onClick={() => {
          if (!choice || !reason) {
            play("nope");
            setError("Pick a site and a reason first.");
            return;
          }
          const ok = castVote(team, choice, reason);
          if (!ok) {
            play("nope");
            setError("The class already locked the base.");
            return;
          }
          play("send");
          setError("");
          setSent(true);
        }}
      >
        <Send className="size-4" />
        {mine ? "Update the class" : "Send to the class"}
      </Button>
    </div>
  );
}
