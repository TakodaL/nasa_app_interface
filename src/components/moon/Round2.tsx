// Round 2 · The Martian dust storm (C2, C3, C4, C8, C13).
import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { play } from "@/lib/moon/audio";
import {
  DELAY_MINUTES,
  forecastText,
  planTotal,
  readAct,
  runDay,
  SYSTEM_INFO,
  SYSTEM_OF_TEAM,
  SYSTEMS,
  type GameState,
  type Level,
  type SystemId,
} from "@/lib/moon/game";
import { TEAMS, TEAM_META, type RoomState, type TeamId } from "@/lib/moon/model";
import { sendAct, setGame } from "@/lib/moon/sync";
import { NextRoundButton, ReadCard, SpeakButton, WaitCard } from "@/components/moon/GameUI";
import { Button, Card, cn, Eyebrow } from "@/components/moon/ui";

const TEAM_OF_SYSTEM = Object.fromEntries(TEAMS.map((t) => [SYSTEM_OF_TEAM[t], t])) as Record<SystemId, TeamId>;

function teamLevel(state: RoomState, game: GameState, sys: SystemId): Level | null {
  const v = readAct<{ level: Level }>(state.acts[TEAM_OF_SYSTEM[sys]], `2:day${game.r2.day}`);
  return v && [0, 1, 2].includes(v.level) ? v.level : null;
}

function effectivePlan(state: RoomState, game: GameState): Partial<Record<SystemId, Level>> {
  const plan: Partial<Record<SystemId, Level>> = {};
  for (const sys of SYSTEMS) {
    const set = game.r2.plan[sys];
    const team = teamLevel(state, game, sys);
    const v = set ?? team;
    if (v !== null && v !== undefined) plan[sys] = v;
  }
  return plan;
}

function status(sys: SystemId, level: Level): { text: string; bad: boolean } {
  if (sys === "life") return level === 0 ? { text: "Unsafe: the air is not clean", bad: true } : { text: "Safe: the air is clean", bad: false };
  if (sys === "heat") return level === 0 ? { text: "Too cold", bad: true } : { text: "Safe: warm enough", bad: false };
  if (sys === "food")
    return level === 0
      ? { text: "Growth paused · packed food bag eaten", bad: true }
      : { text: level === 1 ? "Limited growth · food bag kept" : "Normal growth · food bag kept", bad: false };
  return { text: ["No signal · no forecast", "Short message sent", "Long message sent"][level], bad: level === 0 };
}

/* ---------------- class screen ---------------- */

export function Round2Main({ state, game }: { state: RoomState; game: GameState }) {
  const r2 = game.r2;
  if (game.stage === "plan") return <PlanBoard state={state} game={game} />;
  if (game.stage === "result") return <DayResult game={game} />;
  if (game.stage === "warning")
    return (
      <Card className="rise mx-auto w-full max-w-3xl bg-warn/5">
        <Eyebrow>Round 2 · Day {r2.day}</Eyebrow>
        <div className="mt-2 flex items-start gap-3">
          <h2 className="flex-1 font-display text-3xl font-semibold">
            {r2.day >= 3 ? "The storm STILL has not ended!" : "WARNING! The dust storm has not ended!"}
          </h2>
          <SpeakButton text="The dust storm has not ended. Solar panels still cannot recharge the batteries. You must survive another day using only your remaining energy." />
        </div>
        <p className="mt-2 text-lg leading-relaxed text-muted">
          Solar panels still cannot recharge the batteries. You must survive another day using only your remaining energy.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-bg/50 px-4 py-3">
            <p className="text-sm text-muted">Battery left</p>
            <p className="font-display text-4xl font-semibold text-warn tabular-nums">{game.power} units</p>
            <p className="text-sm text-muted">Life support and Temperature need 1 each.</p>
          </div>
          <ReadCard title="Message from Earth" text={forecastText(r2)} tone={r2.forecast === "none" ? undefined : "good"} />
        </div>
        <p className="mt-3 text-sm text-muted">Energy you save today could help later in the mission.</p>
        <Button
          className="mt-4"
          onClick={() => {
            play("tap");
            setGame({ ...game, stage: "plan" });
          }}
        >
          Plan Day {r2.day}
        </Button>
      </Card>
    );
  if (game.stage === "done") return <RoundResult game={game} />;
  return null;
}

function PlanBoard({ state, game }: { state: RoomState; game: GameState }) {
  const plan = effectivePlan(state, game);
  const total = planTotal(plan);
  const ready = SYSTEMS.every((s) => plan[s] !== undefined) && total <= game.power;
  const over = total > game.power;
  return (
    <div className="grid gap-4">
      <Card className="rise">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <Eyebrow>Round 2 · Mars · Day {game.r2.day}</Eyebrow>
            <h2 className="mt-1 font-display text-2xl font-semibold">
              {game.r2.day === 1 ? "WE HAVE A PROBLEM! Plan our energy for Day 1" : `Plan our energy for Day ${game.r2.day}`}
            </h2>
            <p className="mt-1 text-sm text-muted">
              A massive dust storm is blocking sunlight on Mars. The solar panels make almost no electricity. Teams send their
              setting from their devices; tap a setting here for any team without a device.
            </p>
          </div>
          <SpeakButton text="A massive dust storm is blocking sunlight on Mars. Your solar panels are producing almost no electricity. Life support and temperature each need at least one unit per day. Save some energy for surprises." />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {SYSTEMS.map((sys) => {
            const info = SYSTEM_INFO[sys];
            const team = TEAM_OF_SYSTEM[sys];
            const fromTeam = teamLevel(state, game, sys);
            const v = plan[sys];
            return (
              <div key={sys} className="rounded-2xl bg-bg/50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display text-base font-semibold">{info.label}</p>
                  <p className="text-xs text-faint">
                    {TEAM_META[team].label} team · {fromTeam !== null ? `sent ${info.levels[fromTeam]}` : "not sent yet"}
                  </p>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {info.levels.map((label, i) => (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={v === i}
                      onClick={() => {
                        play("tap");
                        setGame({ ...game, r2: { ...game.r2, plan: { ...game.r2.plan, [sys]: i as Level } } });
                      }}
                      className={cn(
                        "min-h-12 rounded-lg font-display text-sm font-semibold transition-transform active:scale-[0.96]",
                        v === i ? "bg-accent text-bg" : "bg-surface-2 text-muted",
                      )}
                    >
                      {label} · {i}
                    </button>
                  ))}
                </div>
                {v !== undefined && <p className="mt-2 text-xs leading-relaxed text-muted">{info.effects[v]}</p>}
              </div>
            );
          })}
        </div>
      </Card>
      <Card className="rise-2">
        <p className="font-display text-base font-semibold">
          Battery: {total} of {game.power} units planned · {Math.max(0, game.power - total)} left
        </p>
        <div className="mt-2 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.max(game.power, 1)}, minmax(0, 1fr))` }}>
          {Array.from({ length: Math.max(game.power, 1) }, (_, i) => (
            <span key={i} className={cn("h-6 rounded-md", i < total ? (over ? "bg-warn" : "bg-accent") : "border border-line")} />
          ))}
        </div>
        {over && <p className="mt-2 text-sm text-warn">Too many units: the plan uses more energy than the battery has.</p>}
        <p className="mt-3 text-sm text-muted">
          Remember: Life support and Temperature need at least 1 unit every day. Nobody knows how long the storm will last.
        </p>
        <Button
          className="mt-3"
          disabled={!ready}
          onClick={() => {
            play("lock");
            setGame(runDay(game, plan as Record<SystemId, Level>));
          }}
        >
          Start Day {game.r2.day}
        </Button>
      </Card>
    </div>
  );
}

function DayResult({ game }: { game: GameState }) {
  const r2 = game.r2;
  const plan = r2.lastPlan as Record<SystemId, Level>;
  const failed = r2.failedOn === r2.day;
  const sent = (plan.comms ?? 0) > 0;
  const [arrived, setArrived] = useState(false);
  const [go, setGo] = useState(false);
  useEffect(() => {
    setArrived(false);
    setGo(false);
    const raf = window.requestAnimationFrame(() => setGo(true));
    const id = window.setTimeout(() => setArrived(true), 10000);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(id);
    };
  }, [r2.day]);
  const moreDays = !failed && r2.day < r2.stormDays;

  return (
    <div className="grid gap-4">
      <Card className="rise">
        <Eyebrow>Round 2 · Day {r2.day} result</Eyebrow>
        <h2 className="mt-1 font-display text-2xl font-semibold">
          {failed ? `The astronauts could not get through Day ${r2.day}` : `The astronauts survived Day ${r2.day}!`}
        </h2>
        <ul className="mt-4 grid gap-2">
          {SYSTEMS.map((sys) => {
            const lv = plan[sys] ?? 0;
            const st = status(sys, lv);
            return (
              <li key={sys} className="flex flex-wrap items-center gap-3 rounded-lg bg-bg/50 px-3 py-3">
                <span className="w-40 font-display text-sm font-semibold">
                  {SYSTEM_INFO[sys].label} · {lv}
                </span>
                <span className={cn("flex-1 text-sm", st.bad ? "text-warn" : "text-good")}>{st.text}</span>
                {lv === 2 && sys !== "comms" && <span className="text-xs text-faint">HIGH gave no extra help today</span>}
              </li>
            );
          })}
        </ul>
        <p className="mt-3 font-display text-base font-semibold">Battery: {planTotal(plan)} used today · {game.power} left</p>
      </Card>

      {sent && r2.day === 1 && (
        <Card className="rise-2">
          <div className="flex items-center gap-2">
            <Radio className="size-5 text-accent" aria-hidden />
            <p className="font-display text-base font-semibold">Message to Earth</p>
          </div>
          <p className="mt-1 text-sm text-muted">
            Mars is far away. A message takes about {DELAY_MINUTES} minutes to reach Earth, and the answer takes {DELAY_MINUTES}{" "}
            minutes to come back. (It can be from 3 to 22 minutes, depending on where the planets are.)
          </p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-bg">
            <div
              className="h-full rounded-full bg-accent transition-[width] ease-linear"
              style={{ width: go ? "100%" : "0%", transitionDuration: go ? "10000ms" : "0ms" }}
            />
          </div>
          <div className="mt-3">
            {arrived ? (
              <ReadCard title="Reply from Earth" text={forecastText(r2)} tone="good" />
            ) : (
              <p className="text-sm text-faint">Waiting for the reply ({DELAY_MINUTES} min there, {DELAY_MINUTES} min back)…</p>
            )}
          </div>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        {failed ? (
          <Button
            variant="warn"
            onClick={() => {
              play("nope");
              const life = (plan.life ?? 0) === 0;
              setGame({
                ...game,
                emergency: {
                  cause: life
                    ? `Life support had 0 energy on Day ${r2.day}, so the air became unsafe.`
                    : `Heating had 0 energy on Day ${r2.day}, so the habitat got too cold.`,
                  tip: "Keep a little energy saved, because storms can last longer than expected.",
                },
              });
            }}
          >
            Call for help
          </Button>
        ) : moreDays ? (
          <Button
            onClick={() => {
              play("tap");
              setGame({ ...game, stage: "warning", r2: { ...r2, day: r2.day + 1, plan: {} } });
            }}
          >
            Continue
          </Button>
        ) : (
          <Button
            onClick={() => {
              play("lock");
              setGame({ ...game, stage: "done" });
            }}
          >
            See the round result
          </Button>
        )}
      </div>
    </div>
  );
}

function RoundResult({ game }: { game: GameState }) {
  const pts = game.scores["2"] ?? 0;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="rise">
        <Eyebrow>Round 2 result · {pts} {pts === 1 ? "point" : "points"}</Eyebrow>
        <h2 className="mt-1 font-display text-2xl font-semibold">
          {pts === 3 ? `The astronauts survived every day of the ${game.r2.stormDays}-day storm!` : "The storm was too long this time."}
        </h2>
        <p className="mt-4 font-display text-sm font-semibold">Taking into Round 3</p>
        <ul className="mt-2 grid gap-2 text-sm">
          <li className="rounded-lg bg-bg/50 px-3 py-2">
            <b>{game.power} battery {game.power === 1 ? "unit" : "units"}</b> left
            {game.power >= 1 ? ": enough for the rover." : <span className="text-warn">: the rover will have no power.</span>}
          </li>
          <li className="rounded-lg bg-bg/50 px-3 py-2">
            {game.foodBag ? (
              <>
                <b>Packed food bag kept</b>: you never turned Food off.
              </>
            ) : (
              <span className="text-warn">Packed food bag eaten during the storm.</span>
            )}
          </li>
        </ul>
        <div className="mt-4">
          <NextRoundButton game={game} />
        </div>
      </Card>
      <Card className="rise-2">
        <ReadCard
          title="NASA reveal: what really happened in 2018?"
          text="In June 2018 a huge dust storm covered almost all of Mars. On June 10, Opportunity's solar panels made only 21 watt-hours, and NASA lost contact that same day. They tried to reach it more than 1,000 times. NASA ended the mission in February 2019."
          tone="accent"
        />
        <p className="mt-3 text-sm leading-relaxed text-warn">
          In the game, messages took 12 minutes. In June 2018 Mars was close to Earth, so they took only about 4 minutes. When
          Mars is far away, they take over 20.
        </p>
        <p className="mt-3 text-xs text-faint">Sources: NASA Science, "Shades of Martian darkness"; JPL, "Opportunity hunkers down during dust storm".</p>
      </Card>
    </div>
  );
}

/* ---------------- team device ---------------- */

export function Round2Team({ state, game, team }: { state: RoomState; game: GameState; team: TeamId }) {
  const sys = SYSTEM_OF_TEAM[team];
  const info = SYSTEM_INFO[sys];
  const key = `2:day${game.r2.day}`;
  const sent = readAct<{ level: Level }>(state.acts[team], key);
  const [pick, setPick] = useState<Level | null>(sent?.level ?? null);
  useEffect(() => {
    setPick(sent?.level ?? null);
    // reset when the day changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (game.stage !== "plan") {
    return (
      <WaitCard
        text={
          game.stage === "warning"
            ? `The storm has not ended. Get ready to choose your ${info.label.toLowerCase()} setting for Day ${game.r2.day}.`
            : "The class screen is showing what happened."
        }
      />
    );
  }
  return (
    <Card className="rise mx-auto w-full max-w-xl">
      <Eyebrow>
        {TEAM_META[team].label} team · {info.label} · Day {game.r2.day}
      </Eyebrow>
      <div className="mt-3">
        <ReadCard
          text={`${info.control}: how much energy will you give it? The whole base has ${game.power} battery units for today, shared by all four teams.`}
        />
      </div>
      <div className="mt-3 grid gap-2">
        {info.levels.map((label, i) => (
          <button
            key={label}
            type="button"
            aria-pressed={pick === i}
            onClick={() => {
              play("tap");
              setPick(i as Level);
            }}
            className={cn(
              "rounded-2xl px-4 py-3 text-left transition-transform active:scale-[0.98]",
              pick === i ? "bg-accent/15 ring-2 ring-accent" : "bg-bg/50",
            )}
          >
            <span className="font-display text-base font-semibold">
              {label} · {i} {i === 1 ? "unit" : "units"}
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-muted">{info.effects[i]}</span>
          </button>
        ))}
      </div>
      <Button
        className="mt-4 w-full"
        disabled={pick === null}
        onClick={() => {
          if (pick === null) return;
          play("send");
          sendAct(team, key, { level: pick });
        }}
      >
        {sent ? "Update the class plan" : "Send to the class plan"}
      </Button>
      {sent && <p className="mt-2 text-sm text-good">Sent: {info.levels[sent.level]}. Talk with the other teams!</p>}
    </Card>
  );
}
