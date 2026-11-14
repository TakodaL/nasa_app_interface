// Screens shared by every round: mission setup (C12), meters (C2), read-aloud (C14),
// emergency help (C13) and the end of mission (C10).
import { useEffect, useState, type ReactNode } from "react";
import { LifeBuoy, Package, Rocket, Star, Volume2, Zap } from "lucide-react";
import { play } from "@/lib/moon/audio";
import {
  INTRO_MINUTES,
  missionTotals,
  nextRound,
  retryRound,
  ROUND_INFO,
  SCORE_LABEL,
  SCORE_MAX,
  scoreKeysFor,
  type GameState,
  type RoundId,
} from "@/lib/moon/game";
import { resetRoom, setGame, startGame } from "@/lib/moon/sync";
import { Button, Card, cn, Eyebrow } from "@/components/moon/ui";
import { SourcesToggle } from "@/components/moon/Sources";

/** C14: reads `text` aloud with the browser's own speech. Hidden when the browser can't speak. */
export function SpeakButton({ text, className }: { text: string; className?: string }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);
  if (!ok) return null;
  return (
    <button
      type="button"
      aria-label="Read aloud"
      onClick={() => {
        const synth = window.speechSynthesis;
        synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.95;
        u.lang = document.documentElement.lang || "en-US";
        synth.speak(u);
      }}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-2 text-fg transition-transform active:scale-[0.96]",
        className,
      )}
    >
      <Volume2 className="size-5" aria-hidden />
    </button>
  );
}

/** A card with a title, body text and a speaker button. */
export function ReadCard({ title, text, tone, children }: { title?: string; text: string; tone?: "warn" | "good" | "accent"; children?: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-2xl px-4 py-3",
        tone === "warn" ? "bg-warn/15" : tone === "good" ? "bg-good/15" : tone === "accent" ? "bg-accent/10" : "bg-bg/50",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {title && <p className="font-display text-sm font-semibold text-fg">{title}</p>}
          <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
        </div>
        <SpeakButton text={[title, text].filter(Boolean).join(". ")} />
      </div>
      {children}
    </div>
  );
}

/** C2: Power and Supplies, shown from Round 2 on. */
export function MeterBar({ game }: { game: GameState }) {
  const bags = game.water.thick + game.water.wide + (game.foodBag ? 1 : 0);
  return (
    <div className="flex flex-wrap gap-2" aria-label="Mission meters">
      <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-surface-2 px-3 font-display text-sm font-semibold">
        <Zap className="size-4 text-warn" aria-hidden />
        Power {game.power}
      </span>
      <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-surface-2 px-3 font-display text-sm font-semibold">
        <Package className="size-4 text-good" aria-hidden />
        Supplies {bags} {bags === 1 ? "bag" : "bags"}
      </span>
    </div>
  );
}

/** Shown on team devices when there is nothing for them to do right now. */
export function WaitCard({ text }: { text: string }) {
  return (
    <Card className="rise">
      <ReadCard title="Look at the big screen" text={text} />
    </Card>
  );
}

/** C12: the teacher ticks the rounds before starting. */
export function SetupDeck() {
  const [picked, setPicked] = useState<RoundId[]>([1, 2, 3, 4, 5]);
  const minutes = ROUND_INFO.filter((r) => picked.includes(r.id)).reduce((s, r) => s + r.minutes, 0) + INTRO_MINUTES;
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
      <Card className="rise">
        <Eyebrow>Mission setup</Eyebrow>
        <h2 className="mt-1 font-display text-xl font-semibold">Choose the rounds</h2>
        <p className="mt-1 text-sm text-muted">Untick a round to make the session shorter. The time updates as you go.</p>
        <ul className="mt-4 grid gap-2">
          {ROUND_INFO.map((r) => {
            const on = picked.includes(r.id);
            return (
              <li key={r.id}>
                <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg bg-bg/50 px-3">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => {
                      play("tap");
                      setPicked((p) => (on ? p.filter((x) => x !== r.id) : [...p, r.id].sort()));
                    }}
                    className="size-5 accent-[var(--color-accent)]"
                  />
                  <span className="flex-1 text-sm">
                    <span className="font-display font-semibold">Round {r.id}</span> · {r.title}
                    <span className="text-faint"> · {r.place}</span>
                  </span>
                  <span className="text-sm text-muted tabular-nums">{r.minutes} min</span>
                </label>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm">
          <span>Estimated time (with intro and end)</span>
          <span className="font-display font-semibold tabular-nums">About {minutes} min</span>
        </div>
      </Card>
      <Card className="rise-2">
        <ReadCard
          title="How it works"
          text="Teams join with the class code on any phone, tablet or laptop. Any team without a device is played on this screen. Nobody types a name, makes an account or types answers, and each game is cleared when it ends."
        />
        <Button className="mt-4 w-full" disabled={picked.length === 0} onClick={() => { play("lock"); startGame(picked); }}>
          <Rocket className="size-4" />
          Start the mission
        </Button>
        <div className="mt-4">
          <SourcesToggle />
        </div>
      </Card>
    </div>
  );
}

/** Big "next" button for the class screen at the end of a round. */
export function NextRoundButton({ game, label }: { game: GameState; label?: string }) {
  const last = game.index >= game.rounds.length - 1;
  return (
    <Button
      className="w-full sm:w-auto"
      onClick={() => {
        play("send");
        setGame(nextRound(game));
      }}
    >
      {label ?? (last ? "End of mission" : `Next: Round ${game.rounds[game.index + 1]}`)}
    </Button>
  );
}

/** C13: shown instead of ending the game when the astronauts are not safe. */
export function EmergencyScreen({ game }: { game: GameState }) {
  const round = game.rounds[game.index];
  const keys = scoreKeysFor(round);
  const pts = keys.reduce((s, k) => s + (game.scores[k] ?? 0), 0);
  return (
    <Card className="rise mx-auto w-full max-w-3xl">
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <span className="inline-flex size-20 items-center justify-center rounded-full bg-warn/15">
          <LifeBuoy className="size-10 text-warn" aria-hidden />
        </span>
        <div className="flex items-start gap-3">
          <h2 className="font-display text-3xl font-semibold">Emergency help is on the way!</h2>
          <SpeakButton
            text={`Emergency help is on the way! A rescue ship brought your astronauts home safely. This time, the mission was lost. What went wrong: ${game.emergency?.cause ?? ""}. What NASA would do: ${game.emergency?.tip ?? ""}`}
          />
        </div>
        <p className="max-w-xl text-lg leading-relaxed text-muted">
          A rescue ship brought your astronauts home safely. This time, the mission was lost.
        </p>
        <div className="grid w-full gap-3 text-left sm:grid-cols-2">
          <div className="rounded-2xl bg-warn/10 px-4 py-3">
            <p className="font-display text-sm font-semibold text-warn">What went wrong</p>
            <p className="mt-1 text-base leading-relaxed">{game.emergency?.cause}</p>
          </div>
          <div className="rounded-2xl bg-good/10 px-4 py-3">
            <p className="font-display text-sm font-semibold text-good">What NASA would do</p>
            <p className="mt-1 text-base leading-relaxed">{game.emergency?.tip}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => { play("tap"); setGame(retryRound(game)); }}>Try Round {round} again</Button>
          <Button variant="ghost" onClick={() => { play("send"); setGame({ ...nextRound(game) }); }}>
            Continue the mission
          </Button>
        </div>
        <p className="text-sm text-muted">
          Round {round} points: {pts}. No points are taken away.
        </p>
      </div>
    </Card>
  );
}

/** C10: one mission score from the rounds played, then stars. */
export function EndScreen({ game }: { game: GameState }) {
  const t = missionTotals(game);
  return (
    <div className="grid gap-4">
      <Card className="rise">
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <Eyebrow>Mission complete</Eyebrow>
          <div className="flex gap-2" role="img" aria-label={`${t.stars} of 3 stars`}>
            {[1, 2, 3].map((i) => (
              <Star key={i} className={cn("size-14", i <= t.stars ? "fill-warn text-warn" : "text-line")} aria-hidden />
            ))}
          </div>
          <p className="font-display text-5xl font-semibold tabular-nums">
            {t.points} / {t.max}
          </p>
          <p className="text-muted">mission points</p>
        </div>
      </Card>
      <Card className="rise-2">
        <h3 className="font-display text-base font-semibold">Your mission</h3>
        <ul className="mt-3 grid gap-2">
          {ROUND_INFO.map((r) =>
            scoreKeysFor(r.id).map((k) =>
              game.rounds.includes(r.id) ? (
                <li key={k} className="flex items-center justify-between rounded-lg bg-bg/50 px-3 py-2 text-sm">
                  <span>{SCORE_LABEL[k]}</span>
                  <span className="font-display font-semibold tabular-nums">
                    {game.scores[k] ?? 0} / {SCORE_MAX[k]}
                  </span>
                </li>
              ) : (
                <li key={k} className="flex items-center justify-between rounded-lg border border-dashed border-line px-3 py-2 text-sm text-faint">
                  <span>{SCORE_LABEL[k]}</span>
                  <span>Skipped</span>
                </li>
              ),
            ),
          )}
        </ul>
        <p className="mt-3 text-sm text-muted">Next time the storm and the explorers' times will be different.</p>
        <Button className="mt-4" onClick={() => { play("tap"); resetRoom(); }}>
          Play again
        </Button>
        <div className="mt-4">
          <SourcesToggle />
        </div>
      </Card>
    </div>
  );
}
