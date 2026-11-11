import { useEffect, useState, type ReactNode } from "react";
import { activeVotes, classScore, debrief, scoreSite, siteById, SITES, TEAM_META, type RoomState, type SiteId } from "@/lib/moon/model";
import { Button, Card, Eyebrow } from "@/components/moon/ui";
import { TeamIcon, teamTone } from "@/components/moon/Bits";

export function Report({ state, onAgain }: { state: RoomState; onAgain: () => void }) {
  if (!state.finalChoice) return null;
  const choice: SiteId = state.finalChoice;
  const site = siteById(choice);
  const result = classScore(choice, state);
  const card = scoreSite(site);
  const story = debrief(choice);
  const votes = activeVotes(state);
  const [drawn, setDrawn] = useState(0);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setDrawn(result.total));
    return () => window.cancelAnimationFrame(id);
  }, [result.total]);

  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const dash = (drawn / 100) * circ;

  return (
    <div className="relative grid gap-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden" aria-hidden>
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            className="confetti-bit"
            style={{
              left: `${6 + ((i * 7) % 88)}%`,
              background: i % 3 === 0 ? "var(--color-accent)" : i % 3 === 1 ? "var(--color-warn)" : "var(--color-good)",
              animationDelay: `${i * 40}ms`,
            }}
          />
        ))}
      </div>
      <Card className="rise relative overflow-hidden">
        <Eyebrow>Mission report</Eyebrow>
        <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <div className="relative size-36 shrink-0">
            <svg viewBox="0 0 120 120" className="size-full">
              <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--color-line)" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`}
                transform="rotate(-90 60 60)"
                className="transition-[stroke-dasharray] duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl font-semibold tabular-nums">{result.total}</span>
              <span className="text-xs text-muted">class score</span>
            </div>
          </div>
          <div>
            <p className="font-display text-xs tracking-widest text-muted uppercase">Site {choice}</p>
            <h2 className="mt-1 font-display text-3xl font-semibold md:text-4xl">{site.name}</h2>
            <p className="mt-2 text-sm text-muted">{site.tag}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.fullCrew && <Badge>Full crew reported</Badge>}
              {result.agree >= 3 && <Badge>Strong agreement</Badge>}
              {result.best && <Badge>Balanced science pick</Badge>}
              {!result.best && <Badge>Bold tradeoff</Badge>}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <h3 className="font-display text-base font-semibold">How this site scores</h3>
          <p className="mt-1 text-sm text-muted">
            Sun 25%, water 30%, landing 25%, Earth link 20%. Your class bonus was +{result.bonus}.
          </p>
          <div className="mt-4 grid gap-3">
            <Meter label="Sunlight" value={card.sun} />
            <Meter label="Water ice" value={card.ice} />
            <Meter label="Landing" value={card.landing} />
            <Meter label="Earth link" value={card.earth} />
          </div>
        </Card>
        <Card>
          <h3 className="font-display text-base font-semibold">What the crews said</h3>
          <ul className="mt-3 grid gap-2">
            {votes.length === 0 && <li className="text-sm text-muted">No team notes were filed.</li>}
            {votes.map(({ team, vote }) => (
              <li key={team} className="rounded-lg bg-bg/50 px-3 py-2">
                <p className="flex items-center gap-2 font-display text-sm font-semibold">
                  <TeamIcon team={team} className={`size-4 ${teamTone(team)}`} />
                  {TEAM_META[team].label}
                  <span className="text-muted">→ {vote.choice}</span>
                  {vote.choice === choice && <span className="text-xs text-good">matched</span>}
                </p>
                <p className="mt-1 text-sm text-muted">{vote.reason}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <h3 className="font-display text-base font-semibold text-good">What went well</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{story.cheer}</p>
        </Card>
        <Card>
          <h3 className="font-display text-base font-semibold text-warn">Watch out</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{story.watch}</p>
        </Card>
      </div>

      <Card>
        <h3 className="font-display text-base font-semibold">The other sites</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-3">
          {SITES.map((id) => {
            const other = siteById(id);
            const total = scoreSite(other).total;
            return (
              <li key={id} className="rounded-lg bg-bg/50 px-3 py-3">
                <p className="font-display text-sm font-semibold">
                  {id} · {other.short}
                </p>
                <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{total}</p>
                <p className="text-xs text-faint">{id === choice ? "Your base" : "Science balance"}</p>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-faint">
          Scores compare tradeoffs for this classroom round. They are inspired by published Artemis south-pole
          candidate regions, not a NASA flight decision.
        </p>
        <Button variant="ghost" className="mt-4" onClick={onAgain}>
          Run the round again
        </Button>
      </Card>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-accent/15 px-3 py-1 font-display text-xs font-semibold text-accent">
      {children}
    </span>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="tabular-nums text-muted">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-bg">
        <div className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
