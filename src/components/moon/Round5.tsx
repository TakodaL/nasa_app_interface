// Round 5 · Solve the mystery (C17: answers are built by tapping, never typed).
import { useEffect, useState } from "react";
import { play } from "@/lib/moon/audio";
import {
  becauseText,
  CAUSES,
  DISTRACTORS,
  MYSTERY_CLUES,
  mysteryPoints,
  readAct,
  type Cause,
  type ClueId,
  type GameState,
} from "@/lib/moon/game";
import { TEAMS, TEAM_META, type RoomState, type TeamId } from "@/lib/moon/model";
import { sendAct, setGame } from "@/lib/moon/sync";
import { NextRoundButton, ReadCard, SpeakButton, WaitCard } from "@/components/moon/GameUI";
import { Button, Card, cn, Eyebrow } from "@/components/moon/ui";

const PROMPT =
  "Mars, 2012. Our rover has discovered these stones. Something may have carried them here a very long time ago. What happened?";
const ANSWER =
  "The evidence suggests that an ancient stream once flowed through this place. Water carried the pebbles and sand, which eventually formed a hardened deposit. NASA announced this evidence on 27 September 2012. Curiosity found signs of ancient flowing water, not a river flowing today.";

type Answer = { cause: Cause | null; because: ClueId[] };
const answerOf = (state: RoomState, t: TeamId) => readAct<Answer>(state.acts[t], "5");

export function Round5Main({ state, game }: { state: RoomState; game: GameState }) {
  const sent = TEAMS.filter((t) => answerOf(state, t));
  if (game.stage === "think" || game.stage === "share")
    return (
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <Card className="rise">
          <Eyebrow>Round 5 · Solve the mystery</Eyebrow>
          <div className="mt-1 flex items-start gap-3">
            <h2 className="flex-1 font-display text-2xl font-semibold leading-snug">"{PROMPT}"</h2>
            <SpeakButton text={PROMPT} />
          </div>
          {game.stage === "share" ? (
            <div className="mt-4 grid gap-2">
              {TEAMS.map((t) => (
                <ReadCard key={t} title={MYSTERY_CLUES[t].team} text={MYSTERY_CLUES[t].text} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">
              Each team sees only its own clue first and builds a first guess. Then teams read their clues out loud.
            </p>
          )}
        </Card>
        <Card className="rise-2">
          <p className="font-display text-base font-semibold">Answers sent: {sent.length}</p>
          <ul className="mt-2 grid gap-2 text-sm">
            {TEAMS.map((t) => (
              <li key={t} className="flex justify-between rounded-lg bg-bg/50 px-3 py-2">
                <span>{MYSTERY_CLUES[t].team}</span>
                <span className={sent.includes(t) ? "text-good" : "text-faint"}>{sent.includes(t) ? "Ready" : "Thinking…"}</span>
              </li>
            ))}
          </ul>
          {game.stage === "think" ? (
            <Button className="mt-4" onClick={() => { play("tap"); setGame({ ...game, stage: "share" }); }}>
              Share all the clues
            </Button>
          ) : (
            <Button
              className="mt-4"
              disabled={sent.length === 0}
              onClick={() => {
                play("lock");
                const best = Math.max(0, ...sent.map((t) => {
                  const a = answerOf(state, t);
                  return a ? mysteryPoints(a.cause, a.because) : 0;
                }));
                setGame({ ...game, stage: "results", scores: { ...game.scores, "5": best } });
              }}
            >
              Show the answers
            </Button>
          )}
        </Card>
      </div>
    );

  const rows = TEAMS.map((t) => {
    const a = answerOf(state, t);
    return a ? { t, a, pts: mysteryPoints(a.cause, a.because) } : null;
  })
    .filter((x): x is NonNullable<typeof x> => !!x)
    .sort((x, y) => y.pts - x.pts);
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <Card className="rise">
        <Eyebrow>Round 5 · Your hypotheses</Eyebrow>
        <ul className="mt-3 grid gap-2">
          {rows.map((r, i) => (
            <li key={r.t} className={cn("rounded-2xl px-4 py-3 text-sm leading-relaxed", i === 0 ? "bg-accent/15 ring-2 ring-accent" : "bg-bg/50")}>
              <b>{TEAM_META[r.t].label}:</b> moved by{" "}
              <b className={r.a.cause === "flowing water" ? "text-good" : "text-warn"}>{r.a.cause ?? "…"}</b>
              {r.a.because.map((c) => (
                <span key={c}>
                  {" "}
                  because <b className={DISTRACTORS.some((d) => d.id === c) ? "text-warn" : "text-good"}>{becauseText(c)}</b>
                </span>
              ))}
              <span className="float-right font-display text-lg font-semibold">{r.pts}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-faint">Points: 1 for "flowing water" + 1 for each real clue chosen (max 3). Green = a point.</p>
      </Card>
      <Card className="rise-2">
        <ReadCard title="What NASA found" text={ANSWER} tone="good" />
        <div className="mt-4">
          <NextRoundButton game={game} />
        </div>
      </Card>
    </div>
  );
}

export function Round5Team({ state, game, team }: { state: RoomState; game: GameState; team: TeamId }) {
  const saved = answerOf(state, team);
  const [cause, setCause] = useState<Cause | null>(saved?.cause ?? null);
  const [because, setBecause] = useState<ClueId[]>(saved?.because ?? []);
  useEffect(() => {
    if (saved && !cause) {
      setCause(saved.cause);
      setBecause(saved.because);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved?.cause]);
  if (game.stage === "results") {
    return <WaitCard text={saved ? `Your answer scored ${mysteryPoints(saved.cause, saved.because)} out of 3.` : "The class screen is showing the answers."} />;
  }
  const mine = MYSTERY_CLUES[team];
  const options: ClueId[] =
    game.stage === "share" ? [...TEAMS.map((t) => MYSTERY_CLUES[t].id), ...DISTRACTORS.map((d) => d.id)] : [mine.id, ...DISTRACTORS.map((d) => d.id)];

  return (
    <Card className="rise mx-auto w-full max-w-xl">
      <Eyebrow>
        {TEAM_META[team].label} · {mine.team}
      </Eyebrow>
      <div className="mt-3 grid gap-2">
        <ReadCard text={PROMPT} />
        <ReadCard title="Your clue" text={mine.text} tone="accent" />
      </div>
      <p className="mt-4 font-display text-sm font-semibold">We think the stones were moved by…</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {CAUSES.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cause === c}
            onClick={() => {
              play("tap");
              setCause(c);
            }}
            className={cn("min-h-11 rounded-full px-4 text-sm transition-transform active:scale-[0.96]", cause === c ? "bg-accent text-bg" : "bg-bg/50")}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="mt-4 font-display text-sm font-semibold">because… (pick 2)</p>
      <div className="mt-2 grid gap-2">
        {options.map((id) => {
          const on = because.includes(id);
          return (
            <button
              key={id}
              type="button"
              aria-pressed={on}
              disabled={!on && because.length >= 2}
              onClick={() => {
                play("tap");
                setBecause(on ? because.filter((x) => x !== id) : [...because, id]);
              }}
              className={cn(
                "min-h-11 rounded-2xl px-4 text-left text-sm transition-transform active:scale-[0.98] disabled:opacity-40",
                on ? "bg-accent/15 ring-2 ring-accent" : "bg-bg/50",
              )}
            >
              {becauseText(id)}
            </button>
          );
        })}
        {game.stage === "think" && <p className="text-xs text-faint">3 more clues unlock after the teams share theirs.</p>}
      </div>
      <Button
        className="mt-4 w-full"
        disabled={!cause || because.length === 0}
        onClick={() => {
          play("send");
          sendAct(team, "5", { cause, because });
        }}
      >
        {game.stage === "think" ? "Save our first guess" : "Send our answer"}
      </Button>
      {saved && <p className="mt-2 text-sm text-good">Saved. You can change it until the class screen shows the answers.</p>}
    </Card>
  );
}
