// Round 3 · Solar storm emergency (C4, C5, C6, C7, C8, C9, C10, C13, C16).
import { useEffect, useState } from "react";
import { Truck, X } from "lucide-react";
import { play } from "@/lib/moon/audio";
import {
  bestShelter,
  EXPLORERS,
  inventory,
  MISSION_CONTROL,
  readAct,
  RESCUE_DEADLINE,
  runRescue,
  SHELTER_INFO,
  shelterLayers,
  shelterPoints,
  type Area,
  type GameState,
  type Placement,
  type ShelterObject,
} from "@/lib/moon/game";
import { isOnline, TEAMS, TEAM_META, type RoomState, type TeamId } from "@/lib/moon/model";
import { sendAct, setGame } from "@/lib/moon/sync";
import { NextRoundButton, ReadCard, SpeakButton, WaitCard } from "@/components/moon/GameUI";
import { Button, Card, cn, Eyebrow } from "@/components/moon/ui";

const ALERT =
  "Solar weather alert! A solar storm is sending dangerous particles toward Mars. Three astronauts are out exploring. Mission Control, warn them and plan the rescue. There is only one rover.";
const WHY_MARS =
  "An alert from Earth would take 12 minutes to get here: longer than your 8-minute deadline! That is why our base watches its own radiation sensor.";

/* ---------------- class screen ---------------- */

export function Round3Main({ state, game, now }: { state: RoomState; game: GameState; now: number }) {
  if (game.stage === "alert") return <RescuePlan state={state} game={game} now={now} />;
  if (game.stage === "rescueResult") return <RescueResult game={game} />;
  if (game.stage === "shelter") return <ShelterBoard state={state} game={game} />;
  if (game.stage === "shelterResult") return <ShelterResult state={state} game={game} />;
  if (game.stage === "reveal") return <Reveal game={game} />;
  return null;
}

function RescuePlan({ state, game, now }: { state: RoomState; game: GameState; now: number }) {
  const wants = EXPLORERS.filter((t) => readAct<{ want: boolean }>(state.acts[t], "3:rover")?.want);
  const rover = game.r3.rover ?? (wants.length === 1 ? wants[0] : null);
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
      <Card className="rise">
        <Eyebrow>Round 3 · Part 1 · Rescue</Eyebrow>
        <div className="mt-1 flex items-start gap-3">
          <h2 className="flex-1 font-display text-3xl font-semibold">Solar weather alert!</h2>
          <SpeakButton text={ALERT} />
        </div>
        <p className="mt-2 text-muted">{ALERT}</p>
        <p className="mt-4 font-display text-sm font-semibold">Who gets the rover?</p>
        <ul className="mt-2 grid gap-2">
          {EXPLORERS.map((t) => {
            const pair = game.r3.times[t];
            const act = readAct<{ want: boolean }>(state.acts[t], "3:rover");
            const online = isOnline(state.seen[t], now);
            return (
              <li key={t}>
                <button
                  type="button"
                  aria-pressed={rover === t}
                  onClick={() => {
                    play("tap");
                    setGame({ ...game, r3: { ...game.r3, rover: t } });
                  }}
                  className={cn(
                    "flex w-full flex-wrap items-center gap-3 rounded-2xl px-4 py-3 text-left transition-transform active:scale-[0.98]",
                    rover === t ? "bg-accent/15 ring-2 ring-accent" : "bg-bg/50",
                  )}
                >
                  <span className="font-display text-base font-semibold">{TEAM_META[t].label} explorers</span>
                  {!online && pair && (
                    <span className="text-sm text-muted">
                      (played here) walk {pair[0]} min · rover {pair[1]} min
                    </span>
                  )}
                  <span className="ml-auto text-sm text-faint">
                    {act ? (act.want ? "asks for the rover" : "will walk") : online ? "deciding…" : ""}
                  </span>
                  {rover === t && <Truck className="size-5 text-accent" aria-label="has the rover" />}
                </button>
              </li>
            );
          })}
        </ul>
        <Button
          className="mt-4"
          disabled={!rover}
          onClick={() => {
            play("lock");
            setGame(runRescue({ ...game, r3: { ...game.r3, rover } }));
          }}
        >
          Run the rescue
        </Button>
      </Card>
      <div className="grid gap-4">
        <Card className="rise-2">
          <div className="flex flex-col items-center gap-1 rounded-2xl bg-warn/10 py-4">
            <p className="text-sm text-muted">Time to get everyone inside</p>
            <p className="font-display text-6xl font-semibold text-warn tabular-nums">{RESCUE_DEADLINE}:00</p>
            <p className="text-xs text-faint">game minutes</p>
          </div>
          <p className={cn("mt-3 rounded-lg px-3 py-2 text-sm", game.power >= 1 ? "bg-bg/50" : "bg-warn/15 text-warn")}>
            {game.power >= 1
              ? `Rover battery: ${game.power} ${game.power === 1 ? "unit" : "units"}. The rover needs 1.`
              : "The rover's battery is empty! Nobody can drive it."}
          </p>
        </Card>
        <Card className="rise-3">
          <ReadCard
            text="Explorers: share your walking and rover times out loud. Then the class decides who takes the only rover."
          />
        </Card>
      </div>
    </div>
  );
}

function RescueResult({ game }: { game: GameState }) {
  const r3 = game.r3;
  const late = EXPLORERS.filter((t) => r3.times[t] && r3.safe[t] === false);
  const pts = game.scores["3a"] ?? 0;
  return (
    <Card className="rise mx-auto w-full max-w-4xl">
      <Eyebrow>Round 3 · Rescue result · {pts} {pts === 1 ? "point" : "points"}</Eyebrow>
      <h2 className="mt-1 font-display text-2xl font-semibold">
        {late.length === 0 ? "Everyone made it inside in time!" : "Not everyone made it back in time."}
      </h2>
      {r3.rover && !r3.roverOk && (
        <p className="mt-2 rounded-lg bg-warn/15 px-3 py-2 text-sm text-warn">The rover's battery was empty, so it could not drive.</p>
      )}
      <ul className="mt-4 grid gap-3">
        {EXPLORERS.map((t) => {
          const pair = r3.times[t];
          if (!pair) return null;
          const byRover = r3.roverOk && r3.rover === t;
          const time = byRover ? pair[1] : pair[0];
          const ok = time <= RESCUE_DEADLINE;
          const pct = Math.min(100, (time / 12) * 100);
          return (
            <li key={t} className="grid gap-1">
              <div className="flex justify-between text-sm">
                <span className="font-display font-semibold">
                  {TEAM_META[t].label} · {byRover ? "rover" : "walked"}
                </span>
                <span className={ok ? "text-good" : "text-warn"}>
                  {time} min · {ok ? "safe" : "too late"}
                </span>
              </div>
              <div className="relative h-4 rounded-full bg-bg">
                <div className={cn("h-full rounded-full", ok ? "bg-good" : "bg-warn")} style={{ width: `${pct}%` }} />
                <span className="absolute top-[-4px] h-6 border-l-2 border-dashed border-warn" style={{ left: `${(RESCUE_DEADLINE / 12) * 100}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-faint">Dashed line: the 8-minute deadline.</p>
      <div className="mt-4">
        {late.length > 0 ? (
          <Button
            variant="warn"
            onClick={() => {
              play("nope");
              setGame({
                ...game,
                emergency: {
                  cause: r3.rover && !r3.roverOk
                    ? "The rover had no battery left from Round 2, so the farthest explorer could not get back in 8 minutes."
                    : "The rover went to someone who could have walked, so the farthest explorer could not get back in 8 minutes.",
                  tip: "Give the rover to the explorer who is farthest away, and keep 1 battery unit for it.",
                },
              });
            }}
          >
            Call for help
          </Button>
        ) : (
          <Button
            onClick={() => {
              play("tap");
              setGame({ ...game, stage: "shelter" });
            }}
          >
            Part 2: build the storm shelter
          </Button>
        )}
      </div>
    </Card>
  );
}

const SHELTER_ALERT =
  "A solar storm is still active! Your astronauts are inside the habitat's storm shelter, but three areas need extra protection. Choose 3 objects to protect areas A, B and C. Thicker protection stops more particles. Wider objects protect a larger area. All three areas need protection!";

function InventoryList({ game }: { game: GameState }) {
  const inv = inventory(game);
  const reason: Partial<Record<ShelterObject, string>> = {
    thick: inv.thick === 0 ? "Your Moon base site had less ice" : undefined,
    food: inv.food === 0 ? "Eaten during the dust storm" : undefined,
  };
  return (
    <ul className="grid gap-2 text-sm">
      {(Object.keys(SHELTER_INFO) as ShelterObject[]).map((o) => (
        <li
          key={o}
          className={cn("flex items-center justify-between gap-2 rounded-lg px-3 py-2", inv[o] > 0 ? "bg-bg/50" : "border border-dashed border-line text-faint")}
        >
          <span>
            <b>{SHELTER_INFO[o].label}</b> · {SHELTER_INFO[o].wide ? "2 neighbouring areas" : "1 area"} · {SHELTER_INFO[o].layers}{" "}
            {SHELTER_INFO[o].layers === 1 ? "layer" : "layers"}
          </span>
          <span className="tabular-nums">{inv[o] > 0 ? `× ${inv[o]}` : reason[o] ?? "none"}</span>
        </li>
      ))}
    </ul>
  );
}

function ShelterBoard({ state, game }: { state: RoomState; game: GameState }) {
  const sent = TEAMS.filter((t) => readAct<{ places: Placement[] }>(state.acts[t], "3:shelter"));
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <Card className="rise">
        <Eyebrow>Round 3 · Part 2 · Shelter</Eyebrow>
        <div className="mt-1 flex items-start gap-3">
          <h2 className="flex-1 font-display text-2xl font-semibold">Protect the astronauts!</h2>
          <SpeakButton text={SHELTER_ALERT} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{SHELTER_ALERT}</p>
        <p className="mt-4 font-display text-sm font-semibold">Your bags</p>
        <div className="mt-2">
          <InventoryList game={game} />
        </div>
      </Card>
      <Card className="rise-2">
        <p className="font-display text-base font-semibold">Shelters sent: {sent.length}</p>
        <ul className="mt-2 grid gap-2 text-sm">
          {TEAMS.map((t) => (
            <li key={t} className="flex justify-between rounded-lg bg-bg/50 px-3 py-2">
              <span>{TEAM_META[t].label}</span>
              <span className={sent.includes(t) ? "text-good" : "text-faint"}>{sent.includes(t) ? "Sent" : "Building…"}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-faint">No team devices? Use the station buttons above to build a shelter as one team.</p>
        <Button
          className="mt-4"
          disabled={sent.length === 0}
          onClick={() => {
            play("lock");
            const best = Math.max(0, ...sent.map((t) => shelterPoints(readAct<{ places: Placement[] }>(state.acts[t], "3:shelter")?.places ?? [])));
            setGame({ ...game, stage: "shelterResult", scores: { ...game.scores, "3b": best } });
          }}
        >
          Show the results
        </Button>
      </Card>
    </div>
  );
}

function ShelterResult({ state, game }: { state: RoomState; game: GameState }) {
  const rows = TEAMS.map((t) => {
    const places = readAct<{ places: Placement[] }>(state.acts[t], "3:shelter")?.places;
    return places ? { t, layers: shelterLayers(places), pts: shelterPoints(places) } : null;
  })
    .filter((x): x is { t: TeamId; layers: Record<Area, number>; pts: number } => !!x)
    .sort((a, b) => b.pts - a.pts);
  const possible = bestShelter(inventory(game));
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
      <Card className="rise">
        <Eyebrow>Round 3 · Shelter results</Eyebrow>
        <h2 className="mt-1 font-display text-2xl font-semibold">Habitat storm shelter: who protected best?</h2>
        <ul className="mt-4 grid gap-2">
          {rows.map((r, i) => (
            <li key={r.t} className={cn("flex items-center gap-3 rounded-2xl px-4 py-3", i === 0 ? "bg-accent/15 ring-2 ring-accent" : "bg-bg/50")}>
              <span className="flex-1 font-display font-semibold">{TEAM_META[r.t].label}</span>
              <span className="text-sm text-muted tabular-nums">
                A {Math.min(2, r.layers.A)} · B {Math.min(2, r.layers.B)} · C {Math.min(2, r.layers.C)}
              </span>
              <span className="font-display text-lg font-semibold tabular-nums">{r.pts} / 6</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 rounded-lg bg-good/10 px-3 py-2 text-sm">
          Best possible with your bags: <b>{possible} / 6</b>.
        </p>
        <Button className="mt-4" onClick={() => { play("tap"); setGame({ ...game, stage: "reveal" }); }}>
          What NASA does
        </Button>
      </Card>
      <Card className="rise-2">
        <p className="font-display text-sm font-semibold">Your bags came from…</p>
        <ul className="mt-2 grid gap-2 text-sm">
          <li className="rounded-lg bg-bg/50 px-3 py-2">
            <b>Round 1 · site {game.site ?? "C"}:</b> {game.water.thick} thick + {game.water.wide} wide water bags
          </li>
          <li className="rounded-lg bg-bg/50 px-3 py-2">
            <b>Round 2:</b> {game.foodBag ? "packed food bag kept" : "packed food bag eaten"}
          </li>
          <li className="rounded-lg bg-bg/50 px-3 py-2">
            <b>Always:</b> wide clothing bag, empty storage bag
          </li>
        </ul>
        <p className="mt-3 rounded-lg bg-warn/10 px-3 py-2 text-sm">Mission score uses the best team: {game.scores["3b"] ?? 0} points.</p>
      </Card>
    </div>
  );
}

function Reveal({ game }: { game: GameState }) {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <Card className="rise">
        <Eyebrow>Round 3 · NASA reveal</Eyebrow>
        <h2 className="mt-1 font-display text-2xl font-semibold">How real astronauts hide from solar storms</h2>
        <div className="mt-3 grid gap-3">
          <ReadCard text="NASA astronauts use storage compartments as emergency shelters. They place bags of food, water and supplies around themselves, especially where the spacecraft has less protection." />
          <ReadCard
            tone="accent"
            text="You were in a Mars habitat. NASA plans the same trick inside the Orion spacecraft for Moon missions. Shielding depends on the material, how much of it is between you and the particles, and which areas it covers."
          />
        </div>
        <div className="mt-4">
          <NextRoundButton game={game} />
        </div>
      </Card>
      <Card className="rise-2">
        <div className="rounded-2xl bg-bg/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <p className="flex-1 font-display text-xs font-semibold tracking-widest text-good uppercase">Real data · NASA OSDR</p>
            <span className="rounded-md border border-line px-2 text-xs">Saved</span>
          </div>
          <p className="mt-2 text-base leading-relaxed">
            On the International Space Station, radiation sensors measured about <b>0.2 milligray every day</b>. In 39 days that
            added up to about <b>8</b>. Shielding is how astronauts keep this number low.
          </p>
          <p className="mt-1 text-sm text-muted">A milligray (mGy) measures how much radiation the body takes in.</p>
          <p className="mt-1 text-xs text-faint">Environmental Data App, Rodent Research-1 (2014): 0.19–0.23 mGy/day, 7.96 mGy total.</p>
        </div>
        <div className="mt-3 rounded-2xl bg-bg/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <p className="flex-1 font-display text-xs font-semibold tracking-widest text-warn uppercase">The real storm · NASA DONKI</p>
            <span className="rounded-md border border-line px-2 text-xs">Saved</span>
          </div>
          <p className="mt-2 text-base leading-relaxed">
            September 10, 2017: a huge flare (X8.2) and a cloud of particles from the Sun. Curiosity's radiation sensor measured the
            jump on Mars.
          </p>
          <p className="mt-1 font-mono text-xs text-faint">2017-09-10T16:09:00-CME-001 · 2017-09-10T16:25:00-SEP-001</p>
        </div>
      </Card>
    </div>
  );
}

/* ---------------- team device ---------------- */

export function Round3Team({ state, game, team }: { state: RoomState; game: GameState; team: TeamId }) {
  if (game.stage === "alert") return team === MISSION_CONTROL ? <MissionControl /> : <Explorer state={state} game={game} team={team} />;
  if (game.stage === "shelter") return <ShelterBuilder state={state} game={game} team={team} />;
  if (game.stage === "shelterResult") {
    const places = readAct<{ places: Placement[] }>(state.acts[team], "3:shelter")?.places;
    return <WaitCard text={places ? `Your shelter scored ${shelterPoints(places)} out of 6.` : "The class screen is showing the shelter results."} />;
  }
  return <WaitCard text="The class screen is showing what happened." />;
}

function MissionControl() {
  return (
    <Card className="rise mx-auto w-full max-w-xl">
      <Eyebrow>Mission Control · private alert</Eyebrow>
      <div className="mt-3 grid gap-3">
        <ReadCard
          tone="warn"
          title="September 10, 2017"
          text="Curiosity's radiation sensor (RAD) detected a radiation increase at 19:50 UTC. You have 8 minutes to get all three explorers inside. Tell them now!"
        />
        <ReadCard title="Why Mission Control is here on Mars" text={WHY_MARS} />
        <div className="rounded-2xl bg-bg/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <p className="flex-1 font-display text-xs font-semibold tracking-widest text-muted uppercase">Real NASA record (DONKI)</p>
            <span className="rounded-md border border-line px-2 text-xs">Saved</span>
          </div>
          <p className="mt-1 font-mono text-xs leading-relaxed">
            2017-09-10T16:09:00-CME-001
            <br />
            2017-09-10T16:25:00-SEP-001
          </p>
        </div>
      </div>
    </Card>
  );
}

function Explorer({ state, game, team }: { state: RoomState; game: GameState; team: TeamId }) {
  const pair = game.r3.times[team];
  const sent = readAct<{ want: boolean }>(state.acts[team], "3:rover");
  if (!pair) return <WaitCard text="Listen to Mission Control." />;
  return (
    <Card className="rise mx-auto w-full max-w-xl">
      <Eyebrow>{TEAM_META[team].label} · explorers</Eyebrow>
      <div className="mt-3">
        <ReadCard text="You are exploring far from the base. How long would it take you to get back? Tell the other explorers your times. There is only one rover." />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-bg/50 py-3 text-center">
          <p className="text-sm text-muted">Walking</p>
          <p className="font-display text-4xl font-semibold tabular-nums">{pair[0]}</p>
          <p className="text-sm text-muted">minutes</p>
        </div>
        <div className="rounded-2xl bg-bg/50 py-3 text-center">
          <p className="text-sm text-muted">By rover</p>
          <p className="font-display text-4xl font-semibold tabular-nums">{pair[1]}</p>
          <p className="text-sm text-muted">minutes</p>
        </div>
      </div>
      <p className="mt-4 font-display text-sm font-semibold">Who gets the rover?</p>
      <div className="mt-2 grid gap-2">
        {[true, false].map((want) => (
          <button
            key={String(want)}
            type="button"
            aria-pressed={sent?.want === want}
            onClick={() => {
              play("send");
              sendAct(team, "3:rover", { want });
            }}
            className={cn(
              "min-h-12 rounded-2xl px-4 text-left font-display font-semibold transition-transform active:scale-[0.98]",
              sent?.want === want ? "bg-accent/15 ring-2 ring-accent" : "bg-bg/50",
            )}
          >
            {want ? "We need the rover" : "We can walk"}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-faint">The class screen makes the final choice.</p>
    </Card>
  );
}

const SPOTS: Record<"one" | "wide", Placement["spot"][]> = { one: ["A", "B", "C"], wide: ["AB", "BC"] };

function ShelterBuilder({ state, game, team }: { state: RoomState; game: GameState; team: TeamId }) {
  const inv = inventory(game);
  const saved = readAct<{ places: Placement[] }>(state.acts[team], "3:shelter")?.places ?? null;
  const [places, setPlaces] = useState<Placement[]>(saved ?? []);
  const [picking, setPicking] = useState<ShelterObject | null>(null);
  useEffect(() => {
    if (saved && places.length === 0) setPlaces(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved?.length]);
  const used = (o: ShelterObject) => places.filter((p) => p.obj === o).length;
  const layers = shelterLayers(places);
  const full = places.length >= 3;

  return (
    <Card className="rise mx-auto w-full max-w-xl">
      <Eyebrow>{TEAM_META[team].label} · shelter</Eyebrow>
      <div className="mt-3">
        <ReadCard text="Choose 3 bags. Each area needs 2 layers. Thick bags give 2 layers to 1 area. Wide bags give 1 layer to 2 neighbouring areas." />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {(["A", "B", "C"] as Area[]).map((a) => (
          <div key={a} className={cn("rounded-2xl py-2 text-center", layers[a] >= 2 ? "bg-good/15" : layers[a] === 1 ? "bg-warn/15" : "bg-bg/50")}>
            <p className="font-display text-xl font-semibold">{a}</p>
            <p className="text-xs text-muted">
              {layers[a]} {layers[a] === 1 ? "layer" : "layers"}
            </p>
          </div>
        ))}
      </div>
      {places.length > 0 && (
        <ul className="mt-3 grid gap-1.5 text-sm">
          {places.map((p, i) => (
            <li key={i} className="flex items-center justify-between rounded-lg bg-bg/50 px-3 py-1.5">
              <span>
                {SHELTER_INFO[p.obj].label} → {p.spot.split("").join(" + ")}
              </span>
              <button
                type="button"
                aria-label="Remove"
                onClick={() => setPlaces(places.filter((_, j) => j !== i))}
                className="inline-flex size-9 items-center justify-center rounded-full bg-surface-2"
              >
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 font-display text-sm font-semibold">Your bags</p>
      <div className="mt-2 grid gap-2">
        {(Object.keys(SHELTER_INFO) as ShelterObject[]).map((o) => {
          const left = inv[o] - used(o);
          const off = left <= 0 || full;
          return (
            <div key={o}>
              <button
                type="button"
                disabled={off}
                onClick={() => {
                  play("tap");
                  setPicking(picking === o ? null : o);
                }}
                className={cn(
                  "flex min-h-12 w-full items-center justify-between rounded-2xl px-4 text-left text-sm disabled:opacity-40",
                  picking === o ? "bg-accent/15 ring-2 ring-accent" : "bg-bg/50",
                )}
              >
                <b>{SHELTER_INFO[o].label}</b>
                <span className="text-muted">{inv[o] === 0 ? (o === "food" ? "eaten in the storm" : "none") : `${left} left`}</span>
              </button>
              {picking === o && (
                <div className="mt-2 flex gap-2">
                  {SPOTS[SHELTER_INFO[o].wide ? "wide" : "one"].map((spot) => (
                    <Button
                      key={spot}
                      variant="ghost"
                      onClick={() => {
                        play("tap");
                        setPlaces([...places, { obj: o, spot }]);
                        setPicking(null);
                      }}
                    >
                      {spot.split("").join(" + ")}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Button
        className="mt-4 w-full"
        disabled={places.length !== 3}
        onClick={() => {
          play("send");
          sendAct(team, "3:shelter", { places });
        }}
      >
        {saved ? "Update our shelter" : "Submit our shelter"}
      </Button>
      {saved && <p className="mt-2 text-sm text-good">Sent. You can change it until the class screen shows the results.</p>}
    </Card>
  );
}
