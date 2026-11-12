// Round 4 · Pack your space lunch (Apollo 12 menu, C18).
import { useEffect, useState } from "react";
import { play } from "@/lib/moon/audio";
import { FOODS, LUNCH_LIMITS, lunchPoints, lunchTotals, readAct, type FoodId, type GameState } from "@/lib/moon/game";
import { TEAMS, TEAM_META, type RoomState, type TeamId } from "@/lib/moon/model";
import { sendAct, setGame } from "@/lib/moon/sync";
import { NextRoundButton, ReadCard, SpeakButton, WaitCard } from "@/components/moon/GameUI";
import { Button, Card, cn, Eyebrow } from "@/components/moon/ui";

const INTRO =
  "Astronauts need food to fuel their bodies. Some space foods are dried to remove water, so you must add water before eating them. Pack your food, but remember: the space in your bag and your water supply are limited!";
const LIMITS = `A good bag has ${LUNCH_LIMITS.energyMin} to ${LUNCH_LIMITS.energyMax} food-energy points, no more than ${LUNCH_LIMITS.space} space units and no more than ${LUNCH_LIMITS.water} water units.`;

type Bag = { foods: FoodId[] };
const bagOf = (state: RoomState, t: TeamId) => readAct<Bag>(state.acts[t], "4")?.foods ?? null;

export function Round4Main({ state, game }: { state: RoomState; game: GameState }) {
  const sent = TEAMS.filter((t) => bagOf(state, t));
  if (game.stage === "pack")
    return (
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <Card className="rise">
          <Eyebrow>Round 4 · Pack your space lunch · 3 minutes</Eyebrow>
          <div className="mt-1 flex items-start gap-3">
            <h2 className="flex-1 font-display text-2xl font-semibold">Pack a lunch bag for the Moon</h2>
            <SpeakButton text={INTRO} />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{INTRO}</p>
          <p className="mt-3 text-sm text-faint">These foods are from NASA's Apollo 12 crew menu. Teams can't see the numbers yet.</p>
        </Card>
        <Card className="rise-2">
          <p className="font-display text-base font-semibold">Bags sent: {sent.length}</p>
          <ul className="mt-2 grid gap-2 text-sm">
            {TEAMS.map((t) => (
              <li key={t} className="flex justify-between rounded-lg bg-bg/50 px-3 py-2">
                <span>{TEAM_META[t].label}</span>
                <span className={sent.includes(t) ? "text-good" : "text-faint"}>{sent.includes(t) ? "Sent" : "Packing…"}</span>
              </li>
            ))}
          </ul>
          <Button className="mt-4" disabled={sent.length === 0} onClick={() => { play("tap"); setGame({ ...game, stage: "improve" }); }}>
            Show the numbers (1 minute to improve)
          </Button>
        </Card>
      </div>
    );

  const rows = TEAMS.map((t) => {
    const foods = bagOf(state, t);
    if (!foods) return null;
    const tot = lunchTotals(foods);
    const res = lunchPoints(foods);
    return { t, tot, ...res };
  }).filter((x): x is NonNullable<typeof x> => !!x);
  const best = rows.length ? Math.max(...rows.map((r) => r.points)) : 0;

  return (
    <div className="grid gap-4">
      <Card className="rise">
        <Eyebrow>Round 4 · {game.stage === "improve" ? "Your bags revealed · 1 minute to improve" : "Final bags"}</Eyebrow>
        <div className="mt-1 flex items-start gap-3">
          <p className="flex-1 text-sm leading-relaxed text-muted">{LIMITS}</p>
          <SpeakButton text={LIMITS} />
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead>
              <tr className="text-muted">
                <th className="py-2 font-medium">Team</th>
                <th className="py-2 font-medium">Energy</th>
                <th className="py-2 font-medium">Space</th>
                <th className="py-2 font-medium">Water</th>
                <th className="py-2 font-medium">Points</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.t} className="border-t border-line">
                  <td className="py-2 font-display font-semibold">{TEAM_META[r.t].label}</td>
                  <td className={cn("py-2 tabular-nums", r.ok.energy ? "text-good" : "text-warn")}>{r.tot.energy}</td>
                  <td className={cn("py-2 tabular-nums", r.ok.space ? "text-good" : "text-warn")}>{r.tot.space}</td>
                  <td className={cn("py-2 tabular-nums", r.ok.water ? "text-good" : "text-warn")}>{r.tot.water}</td>
                  <td className="py-2 font-display font-semibold tabular-nums">{game.stage === "results" ? r.points : "?"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {game.stage === "improve" ? (
          <Button
            className="mt-4"
            onClick={() => {
              play("lock");
              setGame({ ...game, stage: "results", scores: { ...game.scores, "4": best } });
            }}
          >
            Final scores
          </Button>
        ) : (
          <div className="mt-4 grid gap-3">
            <p className="rounded-lg bg-good/10 px-3 py-2 text-sm">
              Points: 3 if every limit is met, 1 if one limit is missed, 0 otherwise. Mission score uses the best bag: <b>{best}</b>.
            </p>
            <div>
              <NextRoundButton game={game} />
            </div>
          </div>
        )}
      </Card>
      <Card className="rise-2">
        <p className="font-display text-sm font-semibold">The Apollo 12 foods</p>
        <ul className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
          {FOODS.map((f) => (
            <li key={f.id} className="rounded-lg bg-bg/50 px-3 py-2">
              <b>{f.label}</b> · {f.prep}
              <span className="block text-xs text-muted">
                {f.energy} energy · {f.space} space · {f.water} water
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function Round4Team({ state, game, team }: { state: RoomState; game: GameState; team: TeamId }) {
  const saved = bagOf(state, team);
  const [foods, setFoods] = useState<FoodId[]>(saved ?? []);
  useEffect(() => {
    if (saved && foods.length === 0) setFoods(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved?.length]);
  if (game.stage === "results") {
    return <WaitCard text={saved ? `Your bag scored ${lunchPoints(saved).points} out of 3.` : "The class screen is showing the results."} />;
  }
  const showNumbers = game.stage === "improve";
  const tot = lunchTotals(foods);
  return (
    <Card className="rise mx-auto w-full max-w-xl">
      <Eyebrow>
        {TEAM_META[team].label} · lunch bag {showNumbers ? "· improve it (1 minute)" : "· 3 minutes"}
      </Eyebrow>
      <div className="mt-3">
        <ReadCard text={showNumbers ? LIMITS : "Tap foods to pack or remove them. Space in your bag and water are limited!"} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {FOODS.map((f) => {
          const on = foods.includes(f.id);
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => {
                play("tap");
                setFoods(on ? foods.filter((x) => x !== f.id) : [...foods, f.id]);
              }}
              className={cn(
                "min-h-24 rounded-2xl px-3 py-2 text-left transition-transform active:scale-[0.97]",
                on ? "bg-accent/15 ring-2 ring-accent" : "bg-bg/50",
              )}
            >
              <span className="font-display text-sm font-semibold">
                {f.label}
                {on ? " ✓" : ""}
              </span>
              <span className="mt-1 block text-xs text-muted">{f.prep}</span>
              {showNumbers && (
                <span className="mt-1 block text-xs text-faint">
                  {f.energy} energy · {f.space} space · {f.water} water
                </span>
              )}
            </button>
          );
        })}
      </div>
      {showNumbers && (
        <p className="mt-3 text-sm tabular-nums">
          Your bag: {tot.energy} energy · {tot.space} space · {tot.water} water
        </p>
      )}
      <Button
        className="mt-4 w-full"
        disabled={foods.length === 0}
        onClick={() => {
          play("send");
          sendAct(team, "4", { foods });
        }}
      >
        {saved ? `Update our bag (${foods.length} foods)` : `Send our bag (${foods.length} foods)`}
      </Button>
    </Card>
  );
}
