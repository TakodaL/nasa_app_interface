// Mission structure for Rounds 1–5 (Rounds 1–5 document, changes C1–C19).
// Everything a round needs that is not Round 1's site vote lives here:
// the rounds the teacher picked, the two meters, each round's step, points,
// and what each team sent from its device.
// Only the class screen writes `GameState`; teams write `TeamAct`s.

import type { SiteId, TeamId } from "@/lib/moon/model";

const TEAM_IDS: TeamId[] = ["energy", "water", "terrain", "comms"];

/* ------------------------------------------------------------------ */
/* Rounds                                                              */
/* ------------------------------------------------------------------ */

export type RoundId = 1 | 2 | 3 | 4 | 5;

export const ROUND_INFO: { id: RoundId; title: string; place: string; minutes: number }[] = [
  { id: 1, title: "Choose your Moon base", place: "Moon", minutes: 8 },
  { id: 2, title: "The Martian dust storm", place: "Mars", minutes: 10 },
  { id: 3, title: "Solar storm emergency", place: "Mars", minutes: 10 },
  { id: 4, title: "Pack your space lunch", place: "Moon", minutes: 6 },
  { id: 5, title: "Solve the mystery", place: "Mars", minutes: 7 },
];
export const INTRO_MINUTES = 4;

/** Score keys: Round 3 has two parts. */
export type ScoreKey = "1" | "2" | "3a" | "3b" | "4" | "5";
export const SCORE_MAX: Record<ScoreKey, number> = { "1": 3, "2": 3, "3a": 3, "3b": 6, "4": 3, "5": 3 };
export const SCORE_LABEL: Record<ScoreKey, string> = {
  "1": "Round 1 · Moon base",
  "2": "Round 2 · Dust storm",
  "3a": "Round 3 · Rescue",
  "3b": "Round 3 · Best shelter",
  "4": "Round 4 · Best lunch bag",
  "5": "Round 5 · Best answer",
};
export function scoreKeysFor(round: RoundId): ScoreKey[] {
  return round === 3 ? ["3a", "3b"] : [String(round) as ScoreKey];
}

/** Round 1 site → water bags for the Round 3 shelter (C5). */
export const WATER_BY_SITE: Record<SiteId, { thick: number; wide: number }> = {
  A: { thick: 1, wide: 2 },
  C: { thick: 1, wide: 1 },
  B: { thick: 0, wide: 1 },
};

/* ------------------------------------------------------------------ */
/* Round 2 · dust storm                                                */
/* ------------------------------------------------------------------ */

export type SystemId = "life" | "food" | "heat" | "comms";
/** Which team runs which system in Round 2. */
export const SYSTEM_OF_TEAM: Record<TeamId, SystemId> = {
  energy: "life",
  water: "food",
  terrain: "heat",
  comms: "comms",
};
export const SYSTEMS: SystemId[] = ["life", "food", "heat", "comms"];
export const SYSTEM_INFO: Record<
  SystemId,
  { label: string; control: string; levels: [string, string, string]; effects: [string, string, string] }
> = {
  life: {
    label: "Life support",
    control: "Air recycling",
    levels: ["OFF", "BASIC", "HIGH"],
    effects: [
      "Air becomes unsafe.",
      "Safe air is maintained.",
      "Extra air processing, but no extra safety in an emergency. It only uses energy you may need later.",
    ],
  },
  food: {
    label: "Food",
    control: "Plant lights",
    levels: ["OFF", "LOW", "HIGH"],
    effects: [
      "Growth pauses. The crew eats the packed food bag, so it is gone for Round 3.",
      "Plants get a little light. The food bag is kept.",
      "Normal growth, but no extra help during the storm.",
    ],
  },
  heat: {
    label: "Temperature",
    control: "Heating",
    levels: ["OFF", "BASIC", "HIGH"],
    effects: [
      "The habitat becomes too cold.",
      "A safe minimum temperature is maintained.",
      "Extra heating, but no extra safety.",
    ],
  },
  comms: {
    label: "Communications",
    control: "Message to Earth",
    levels: ["OFF", "SHORT", "LONG"],
    effects: [
      "No message. Earth cannot send you the storm forecast.",
      "Basic status report. Earth replies: \"The storm will continue.\"",
      "Detailed report. Earth replies with how many more days the storm will last.",
    ],
  },
};
export const START_POWER = 8;
export const DELAY_MINUTES = 12; // C4: average Mars–Earth one-way delay

export type Level = 0 | 1 | 2;
export type R2State = {
  day: number; // 1-based day being planned or shown
  stormDays: number; // 2 (70%) or 3 (30%), C8
  plan: Partial<Record<SystemId, Level>>; // the class screen's choice for this day
  lastPlan: Partial<Record<SystemId, Level>>; // what ran on the last day
  forecast: "none" | "short" | "long";
  survived: number;
  failedOn: number; // 0 = not failed
};

/* ------------------------------------------------------------------ */
/* Round 3 · solar storm                                               */
/* ------------------------------------------------------------------ */

export const RESCUE_DEADLINE = 8;
export const RESCUE_PAIRS: [number, number][] = [
  [4, 3],
  [7, 5],
  [11, 6],
];
export const MISSION_CONTROL: TeamId = "energy";
export const EXPLORERS: TeamId[] = ["water", "terrain", "comms"];

export type R3State = {
  times: Partial<Record<TeamId, [number, number]>>; // explorer → [walk, rover]
  rover: TeamId | null;
  roverOk: boolean; // had battery when the rescue ran
  safe: Partial<Record<TeamId, boolean>>;
};

export type ShelterObject = "thick" | "wide" | "food" | "clothing" | "empty";
export const SHELTER_INFO: Record<ShelterObject, { label: string; wide: boolean; layers: number }> = {
  thick: { label: "Thick water bag", wide: false, layers: 2 },
  wide: { label: "Wide water bag", wide: true, layers: 1 },
  food: { label: "Packed food bag", wide: false, layers: 2 },
  clothing: { label: "Wide clothing bag", wide: true, layers: 1 },
  empty: { label: "Empty storage bag", wide: false, layers: 0 },
};
export type Area = "A" | "B" | "C";
/** For wide objects the spot is "AB" or "BC". */
export type Placement = { obj: ShelterObject; spot: "A" | "B" | "C" | "AB" | "BC" };

/* ------------------------------------------------------------------ */
/* Round 4 · lunch (Apollo 12 menu)                                    */
/* ------------------------------------------------------------------ */

export type FoodId = "chicken" | "spaghetti" | "beef" | "turkey" | "apricot" | "chocolate";
export const FOODS: { id: FoodId; label: string; prep: string; space: number; water: number; energy: number }[] = [
  { id: "chicken", label: "Chicken and rice", prep: "Add water", space: 1, water: 1, energy: 3 },
  { id: "spaghetti", label: "Spaghetti with meat", prep: "Add water", space: 1, water: 1, energy: 3 },
  { id: "beef", label: "Beef and gravy", prep: "No added water", space: 3, water: 0, energy: 3 },
  { id: "turkey", label: "Turkey and gravy", prep: "No added water", space: 3, water: 0, energy: 3 },
  { id: "apricot", label: "Dried apricot bites", prep: "No added water", space: 1, water: 0, energy: 1 },
  { id: "chocolate", label: "Chocolate bar", prep: "No added water", space: 1, water: 0, energy: 2 },
];
export const LUNCH_LIMITS = { energyMin: 12, energyMax: 14, space: 9, water: 2 };

export function lunchTotals(foods: FoodId[]): { energy: number; space: number; water: number } {
  let energy = 0;
  let space = 0;
  let water = 0;
  for (const id of foods) {
    const f = FOODS.find((x) => x.id === id);
    if (!f) continue;
    energy += f.energy;
    space += f.space;
    water += f.water;
  }
  return { energy, space, water };
}

/** C18: 3 if every limit is met, 1 if exactly one is missed, else 0. */
export function lunchPoints(foods: FoodId[]): { points: number; ok: { energy: boolean; space: boolean; water: boolean } } {
  const t = lunchTotals(foods);
  const ok = {
    energy: t.energy >= LUNCH_LIMITS.energyMin && t.energy <= LUNCH_LIMITS.energyMax,
    space: t.space <= LUNCH_LIMITS.space,
    water: t.water <= LUNCH_LIMITS.water,
  };
  const missed = [ok.energy, ok.space, ok.water].filter((v) => !v).length;
  return { points: missed === 0 ? 3 : missed === 1 ? 1 : 0, ok };
}

/* ------------------------------------------------------------------ */
/* Round 5 · mystery                                                   */
/* ------------------------------------------------------------------ */

export type ClueId = "shape" | "size" | "rock" | "earth" | "red" | "cold";
export const MYSTERY_CLUES: Record<TeamId, { id: ClueId; team: string; text: string; because: string }> = {
  energy: {
    id: "shape",
    team: "Shape detectives",
    text: "These stones have rounded edges. When stones roll and knock against each other over time, their sharp corners can wear away.",
    because: "the stones have rounded edges",
  },
  water: {
    id: "size",
    team: "Size detectives",
    text: "These are not just tiny grains of dust. According to scientists, the pebbles were too large for wind to explain how they were transported.",
    because: "the pebbles are too big for wind to move",
  },
  terrain: {
    id: "rock",
    team: "Rock detectives",
    text: "Small stones and grains of sand are held together inside hardened rock. Before they became solid rock, these materials collected together.",
    because: "they are held together in hardened rock",
  },
  comms: {
    id: "earth",
    team: "Earth detectives",
    text: "On Earth, flowing water can move sand and pebbles. Stones become rounder as they roll and knock together. When the current slows down, it leaves material behind.",
    because: "flowing water on Earth does the same thing",
  },
};
export const DISTRACTORS: { id: ClueId; because: string }[] = [
  { id: "red", because: "the stones are red" },
  { id: "cold", because: "Mars is cold" },
];
export const CAUSES = ["wind", "flowing water", "ice", "a volcano"] as const;
export type Cause = (typeof CAUSES)[number];
const REAL_CLUES: ClueId[] = ["shape", "size", "rock", "earth"];

export function mysteryPoints(cause: Cause | null, because: ClueId[]): number {
  let p = cause === "flowing water" ? 1 : 0;
  const uniq = [...new Set(because)];
  for (const c of uniq) if (REAL_CLUES.includes(c)) p += 1;
  return Math.min(3, p);
}
export function becauseText(id: ClueId): string {
  for (const t of TEAM_IDS) if (MYSTERY_CLUES[t].id === id) return MYSTERY_CLUES[t].because;
  return DISTRACTORS.find((d) => d.id === id)?.because ?? id;
}

/* ------------------------------------------------------------------ */
/* Game state                                                          */
/* ------------------------------------------------------------------ */

export type Snapshot = { power: number; water: { thick: number; wide: number }; foodBag: boolean };

export type GameState = {
  at: number;
  started: boolean;
  done: boolean;
  rounds: RoundId[];
  index: number; // position in `rounds`
  stage: string; // step inside the current round
  power: number;
  water: { thick: number; wide: number };
  foodBag: boolean;
  site: SiteId | null;
  scores: Partial<Record<ScoreKey, number>>;
  snap: Snapshot; // meters at the start of the current round (for Try again)
  r2: R2State;
  r3: R3State;
  emergency: { cause: string; tip: string } | null;
};

export function newGame(rounds: RoundId[]): GameState {
  const water = rounds.includes(1) ? { thick: 0, wide: 0 } : { ...WATER_BY_SITE.C };
  const power = rounds.includes(2) ? START_POWER : 2;
  const g: GameState = {
    at: Date.now(),
    started: true,
    done: false,
    rounds,
    index: 0,
    stage: "",
    power,
    water,
    foodBag: true,
    site: rounds.includes(1) ? null : "C",
    scores: {},
    snap: { power, water, foodBag: true },
    r2: emptyR2(),
    r3: emptyR3(),
    emergency: null,
  };
  return enterRound(g, 0);
}

export function emptyR2(): R2State {
  return { day: 1, stormDays: 2, plan: {}, lastPlan: {}, forecast: "none", survived: 0, failedOn: 0 };
}
export function emptyR3(): R3State {
  return { times: {}, rover: null, roverOk: false, safe: {} };
}

export function currentRound(g: GameState | null): RoundId | null {
  if (!g || !g.started || g.done) return null;
  return g.rounds[g.index] ?? null;
}

const FIRST_STAGE: Record<RoundId, string> = { 1: "vote", 2: "plan", 3: "alert", 4: "pack", 5: "think" };

/** Set up round at `index` (random parts are chosen here, so Try again re-rolls them). */
export function enterRound(g: GameState, index: number): GameState {
  const round = g.rounds[index];
  if (!round) return { ...g, index, done: true, stage: "end", emergency: null, at: Date.now() };
  const next: GameState = {
    ...g,
    index,
    stage: FIRST_STAGE[round],
    emergency: null,
    snap: { power: g.power, water: { ...g.water }, foodBag: g.foodBag },
    at: Date.now(),
  };
  if (round === 2) {
    next.r2 = { ...emptyR2(), stormDays: Math.random() < 0.7 ? 2 : 3 };
  }
  if (round === 3) {
    const pairs = shuffle(RESCUE_PAIRS);
    const times: R3State["times"] = {};
    EXPLORERS.forEach((t, i) => (times[t] = pairs[i]));
    next.r3 = { ...emptyR3(), times };
  }
  next.scores = { ...g.scores };
  for (const k of scoreKeysFor(round)) delete next.scores[k];
  return next;
}

/** Try this round again: meters back to the start of the round, random parts re-rolled. */
export function retryRound(g: GameState): GameState {
  const back: GameState = { ...g, power: g.snap.power, water: { ...g.snap.water }, foodBag: g.snap.foodBag };
  return enterRound(back, g.index);
}

export function nextRound(g: GameState): GameState {
  return enterRound(g, g.index + 1);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Round 2 rules --------------------------------------------------------- */

export function planTotal(plan: Partial<Record<SystemId, Level>>): number {
  return SYSTEMS.reduce((s, id) => s + (plan[id] ?? 0), 0);
}

/** Run one storm day with the plan. Returns the new game state (stage "result"). */
export function runDay(g: GameState, plan: Record<SystemId, Level>): GameState {
  const r2 = { ...g.r2 };
  const used = planTotal(plan);
  const power = Math.max(0, g.power - used);
  const safe = plan.life >= 1 && plan.heat >= 1;
  let foodBag = g.foodBag;
  if (plan.food === 0) foodBag = false;
  if (plan.comms > 0 && r2.forecast === "none") r2.forecast = plan.comms === 1 ? "short" : "long";
  if (safe) r2.survived += 1;
  else r2.failedOn = r2.day;
  r2.lastPlan = plan;
  r2.plan = {};
  const next: GameState = { ...g, power, foodBag, r2, stage: "result", at: Date.now() };
  if (!safe) {
    next.scores = { ...g.scores, "2": r2.day === 1 ? 0 : 1 };
  } else if (r2.day >= r2.stormDays) {
    next.scores = { ...g.scores, "2": 3 };
  }
  return next;
}

export function forecastText(r2: R2State): string {
  if (r2.forecast === "none") return "No message from Earth. Nobody knows how long the storm will last.";
  if (r2.forecast === "short") return "Earth says: \"The storm will continue.\"";
  const left = r2.stormDays - r2.survived;
  if (left <= 0) return "Earth says: \"The storm is ending. Good work!\"";
  return `Earth says: "Our forecast: the storm will last ${left} more ${left === 1 ? "day" : "days"}."`;
}

/* Round 3 rules --------------------------------------------------------- */

export function runRescue(g: GameState): GameState {
  const r3 = { ...g.r3 };
  const roverOk = !!r3.rover && g.power >= 1;
  const safe: R3State["safe"] = {};
  for (const t of EXPLORERS) {
    const pair = r3.times[t];
    if (!pair) continue;
    const time = roverOk && r3.rover === t ? pair[1] : pair[0];
    safe[t] = time <= RESCUE_DEADLINE;
  }
  r3.roverOk = roverOk;
  r3.safe = safe;
  const points = Object.values(safe).filter(Boolean).length;
  return {
    ...g,
    r3,
    power: roverOk ? g.power - 1 : g.power,
    scores: { ...g.scores, "3a": points },
    stage: "rescueResult",
    at: Date.now(),
  };
}

export function inventory(g: GameState): Record<ShelterObject, number> {
  return { thick: g.water.thick, wide: g.water.wide, food: g.foodBag ? 1 : 0, clothing: 1, empty: 1 };
}

export function shelterLayers(places: Placement[]): Record<Area, number> {
  const layers: Record<Area, number> = { A: 0, B: 0, C: 0 };
  for (const p of places) {
    const n = SHELTER_INFO[p.obj].layers;
    const areas: Area[] = p.spot === "AB" ? ["A", "B"] : p.spot === "BC" ? ["B", "C"] : [p.spot];
    for (const a of areas) layers[a] += n;
  }
  return layers;
}

export function shelterPoints(places: Placement[]): number {
  const l = shelterLayers(places);
  return (["A", "B", "C"] as Area[]).reduce((s, a) => s + Math.min(2, l[a]), 0);
}

/** Best score possible with this inventory (3 objects). */
export function bestShelter(inv: Record<ShelterObject, number>): number {
  const objs: ShelterObject[] = [];
  for (const o of Object.keys(inv) as ShelterObject[]) for (let i = 0; i < inv[o]; i++) objs.push(o);
  let best = 0;
  const spotsFor = (o: ShelterObject): Placement["spot"][] => (SHELTER_INFO[o].wide ? ["AB", "BC"] : ["A", "B", "C"]);
  const n = objs.length;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      for (let k = j + 1; k < n; k++)
        for (const a of spotsFor(objs[i]))
          for (const b of spotsFor(objs[j]))
            for (const c of spotsFor(objs[k])) {
              const p = shelterPoints([
                { obj: objs[i], spot: a },
                { obj: objs[j], spot: b },
                { obj: objs[k], spot: c },
              ]);
              if (p > best) best = p;
            }
  return best;
}

/* End of mission (C10) -------------------------------------------------- */

export function missionTotals(g: GameState): { points: number; max: number; stars: 1 | 2 | 3 } {
  let points = 0;
  let max = 0;
  for (const r of g.rounds)
    for (const k of scoreKeysFor(r)) {
      max += SCORE_MAX[k];
      points += g.scores[k] ?? 0;
    }
  const share = max ? points / max : 0;
  return { points, max, stars: share >= 0.8 ? 3 : share >= 0.5 ? 2 : 1 };
}

/* ------------------------------------------------------------------ */
/* Team acts (what a team device sends during Rounds 2–5)              */
/* ------------------------------------------------------------------ */

export type TeamAct = {
  key: string; // round + step it belongs to, e.g. "2:day1", "3:rover", "3:shelter", "4", "5"
  value: string; // small JSON payload
  at: number;
};

export function actKey(g: GameState | null): string {
  const round = currentRound(g);
  if (!g || !round) return "";
  if (round === 2) return `2:day${g.r2.day}`;
  if (round === 3) return g.stage === "shelter" || g.stage === "shelterResult" ? "3:shelter" : "3:rover";
  return String(round);
}

export function readAct<T>(act: TeamAct | undefined, key: string): T | null {
  if (!act || act.key !== key) return null;
  try {
    return JSON.parse(act.value) as T;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Sync helpers (called from model.ts sanitize / mergeState)           */
/* ------------------------------------------------------------------ */

function isRec(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
const num = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) ? v : d);

export function sanitizeGame(v: unknown): GameState | null {
  if (!isRec(v) || typeof v.at !== "number" || !Array.isArray(v.rounds)) return null;
  try {
    const rounds = (v.rounds as unknown[]).filter((r): r is RoundId => [1, 2, 3, 4, 5].includes(r as number));
    const g = JSON.parse(JSON.stringify(v)) as GameState;
    g.rounds = rounds;
    g.at = num(v.at, 0);
    g.index = Math.max(0, Math.min(rounds.length, num(v.index, 0)));
    g.power = Math.max(0, Math.min(START_POWER, num(v.power, 0)));
    g.scores = isRec(v.scores) ? (g.scores ?? {}) : {};
    g.r2 = { ...emptyR2(), ...(isRec(v.r2) ? g.r2 : {}) };
    g.r3 = { ...emptyR3(), ...(isRec(v.r3) ? g.r3 : {}) };
    g.water = isRec(v.water) ? { thick: num(g.water.thick, 0), wide: num(g.water.wide, 0) } : { thick: 0, wide: 0 };
    g.snap = isRec(v.snap) ? g.snap : { power: g.power, water: { ...g.water }, foodBag: !!g.foodBag };
    g.emergency = isRec(v.emergency) ? g.emergency : null;
    g.stage = typeof v.stage === "string" ? v.stage.slice(0, 40) : "";
    return g;
  } catch {
    return null;
  }
}

export function sanitizeActs(v: unknown): Partial<Record<TeamId, TeamAct>> {
  const out: Partial<Record<TeamId, TeamAct>> = {};
  if (!isRec(v)) return out;
  for (const t of TEAM_IDS) {
    const a = v[t];
    if (!isRec(a) || typeof a.key !== "string" || typeof a.value !== "string") continue;
    const at = num(a.at, 0);
    if (at <= 0 || a.value.length > 600) continue;
    out[t] = { key: a.key.slice(0, 20), value: a.value, at };
  }
  return out;
}

export function mergeGame(a: GameState | null, b: GameState | null, clearedAt: number): GameState | null {
  const ok = (g: GameState | null) => (g && g.at > clearedAt ? g : null);
  const x = ok(a);
  const y = ok(b);
  if (!x) return y;
  if (!y) return x;
  return y.at > x.at ? y : x;
}

export function mergeActs(
  a: Partial<Record<TeamId, TeamAct>>,
  b: Partial<Record<TeamId, TeamAct>>,
  clearedAt: number,
): Partial<Record<TeamId, TeamAct>> {
  const out: Partial<Record<TeamId, TeamAct>> = {};
  for (const t of TEAM_IDS) {
    const pick = [a[t], b[t]].filter((x): x is TeamAct => !!x && x.at > clearedAt).sort((p, q) => q.at - p.at)[0];
    if (pick) out[t] = pick;
  }
  return out;
}
