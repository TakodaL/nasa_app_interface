import { mergeActs, mergeGame, sanitizeActs, sanitizeGame, type GameState, type TeamAct } from "@/lib/moon/game";

export const TEAMS = ["energy", "water", "terrain", "comms"] as const;
export type TeamId = (typeof TEAMS)[number];

export const SITES = ["A", "B", "C"] as const;
export type SiteId = (typeof SITES)[number];

export const ROLES = ["main", ...TEAMS] as const;
export type Role = (typeof ROLES)[number];

export type Vote = {
  choice: SiteId;
  reason: string;
  at: number;
};

export type RoomState = {
  votes: Partial<Record<TeamId, Vote>>;
  seen: Partial<Record<Role, number>>;
  finalChoice: SiteId | null;
  locked: boolean;
  lockedAt: number | null;
  clearedAt: number;
  /** Rounds 1–5 mission (written by the class screen only). */
  game: GameState | null;
  /** What each team device sent during Rounds 2–5. */
  acts: Partial<Record<TeamId, TeamAct>>;
};

export type Site = {
  id: SiteId;
  name: string;
  short: string;
  tag: string;
  x: number;
  y: number;
  /** Sun visibility, % of time (NASA Artemis III landing-region data). */
  sun: number;
  /** Ice evidence from NASA's map of permanently shadowed areas: 3 = most likely, 1 = least. A ranking, not a measurement. */
  iceRank: 1 | 2 | 3;
  /** Average slope of the region, degrees. */
  slope: number;
  /** Total suitable landing area, km². */
  area: number;
  /** Earth visibility, % of time. */
  earth: number;
  /** Round 1 points for choosing this site (Rounds 1–5 document). */
  points: number;
  /** Water bags this site gives for the Round 3 shelter (change C5). */
  waterBags: string;
};

export const SITE_FILL: Record<SiteId, string> = {
  A: "var(--color-accent)",
  B: "var(--color-warn)",
  C: "var(--color-good)",
};

export const SITES_DATA: Site[] = [
  {
    id: "A",
    name: "Mons Mouton Plateau",
    short: "Mouton",
    tag: "Most sun, best Earth view, most room to land",
    x: 36,
    y: 48,
    sun: 45,
    iceRank: 3,
    slope: 7.4,
    area: 564.8,
    earth: 74,
    points: 3,
    waterBags: "1 thick + 2 wide water bags",
  },
  {
    id: "B",
    name: "Malapert Massif",
    short: "Malapert",
    tag: "Gentlest slope, but little room to land",
    x: 56,
    y: 32,
    sun: 31,
    iceRank: 1,
    slope: 5.6,
    area: 7.1,
    earth: 41,
    points: 1,
    waterBags: "1 wide water bag",
  },
  {
    id: "C",
    name: "Nobile Rim 1",
    short: "Nobile",
    tag: "A solid second choice",
    x: 64,
    y: 63,
    sun: 38,
    iceRank: 2,
    slope: 6.3,
    area: 22.2,
    earth: 68,
    points: 2,
    waterBags: "1 thick + 1 wide water bag",
  },
];

export const ICE_LABEL: Record<1 | 2 | 3, string> = {
  3: "Most likely",
  2: "Likely",
  1: "Least likely",
};

export const TEAM_META: Record<
  TeamId,
  { label: string; mission: string; question: string }
> = {
  energy: {
    label: "Energy",
    mission: "Sunlight and solar power",
    question: "Solar panels need sunlight to produce electricity. Which location gets the most sunlight?",
  },
  water: {
    label: "Water",
    mission: "Ice in cold shadows",
    question: "Astronauts need water to drink, grow food and produce oxygen. But where could we find it on the Moon?",
  },
  terrain: {
    label: "Terrain",
    mission: "Slopes and landing room",
    question: "Astronauts need a safe place to land. All three locations have suitable landing areas, but which one gives more landing options?",
  },
  comms: {
    label: "Communications",
    mission: "Calling Earth",
    question: "Astronauts need to contact Earth. Mountains and craters can block the signal! Which location sees Earth the most?",
  },
};

export type ReasonChip = { id: string; text: string; leans: SiteId };

export const REASONS: Record<TeamId, ReasonChip[]> = {
  energy: [
    { id: "sun", text: "The most sunlight for solar panels (45%)", leans: "A" },
    { id: "mid", text: "Good sunlight (38%), a strong backup", leans: "C" },
    { id: "low", text: "Least sunlight (31%), so we would need extra batteries", leans: "B" },
  ],
  water: [
    { id: "ice", text: "The most shadowed craters nearby, so ice is most likely", leans: "A" },
    { id: "some", text: "Some shadowed craters, a good second choice", leans: "C" },
    { id: "few", text: "Fewer shadows, so ice is less likely", leans: "B" },
  ],
  terrain: [
    { id: "room", text: "By far the most room to land (564.8 km²)", leans: "A" },
    { id: "gentle", text: "The gentlest average slope (5.6°)", leans: "B" },
    { id: "both", text: "Gentle slope and some landing room (22.2 km²)", leans: "C" },
  ],
  comms: [
    { id: "most", text: "Earth is in view the most (74%)", leans: "A" },
    { id: "good", text: "Earth is in view most of the time (68%)", leans: "C" },
    { id: "least", text: "Earth is hidden more often (41%)", leans: "B" },
  ],
};

export const CLUES: Record<TeamId, { title: string; body: string }[]> = {
  energy: [
    {
      title: "A slow day",
      body: "One lunar day lasts about 29 Earth days. The Sun crawls across the sky, then a long night begins.",
    },
    {
      title: "Peaks catch the Sun",
      body: "Near the south pole, the Sun stays low. Some high places see it often, while crater floors can stay dark.",
    },
    {
      title: "Night needs a plan",
      body: "No Sun means no solar power. Batteries have to cover the dark, so more sunlight means smaller batteries.",
    },
  ],
  water: [
    {
      title: "Shadows that never end",
      body: "Some crater floors never see the Sun. Scientists call them permanently shadowed regions.",
    },
    {
      title: "Colder than anywhere",
      body: "NASA's LRO spacecraft measured −248 °C (25 K) inside a dark crater near the Moon's north pole: one of the coldest places ever measured in the solar system. Dark craters near the south pole are just as cold, and some have not seen sunlight for billions of years, so ice there can stay frozen.",
    },
    {
      title: "More shadow, more chance",
      body: "More shadow does not automatically mean more water, but it makes finding ice more likely. Water ice can become drinking water, air and rocket fuel.",
    },
  ],
  terrain: [
    {
      title: "Landers like it gentle",
      body: "Slope is how steep the ground is. A wheelchair ramp is about 5°. Gentler ground is easier to land on.",
    },
    {
      title: "Average or area?",
      body: "Average slope describes the region overall, not every landing spot. A larger suitable area gives more places to choose from.",
    },
    {
      title: "All three are landable",
      body: "All three regions have suitable landing areas. None is unsafe. The question is which one gives more options.",
    },
  ],
  comms: [
    {
      title: "Earth sits low",
      body: "From the lunar south pole, Earth hangs near the horizon. A mountain or crater rim can hide it.",
    },
    {
      title: "Blocked signals",
      body: "When Earth is out of view, the base cannot call home directly. More Earth visibility means more time to talk.",
    },
    {
      title: "Compare the numbers",
      body: "NASA measured how much of the time Earth is visible from each region. Higher is better for calling home.",
    },
  ],
};

export function emptyState(): RoomState {
  return {
    votes: {},
    seen: {},
    finalChoice: null,
    locked: false,
    lockedAt: null,
    clearedAt: 0,
    game: null,
    acts: {},
  };
}

export function siteById(id: SiteId): Site {
  const site = SITES_DATA.find((s) => s.id === id);
  if (!site) throw new Error(`Unknown site ${id}`);
  return site;
}

/** Round 1 points for a site: 3 / 2 / 1 (Rounds 1–5 document). */
export function sitePoints(id: SiteId): number {
  return siteById(id).points;
}

export const MAX_POINTS = 3;

export function bestSiteId(): SiteId {
  return [...SITES].sort((a, b) => sitePoints(b) - sitePoints(a))[0];
}

export function activeVotes(state: RoomState): { team: TeamId; vote: Vote }[] {
  const out: { team: TeamId; vote: Vote }[] = [];
  for (const team of TEAMS) {
    const vote = state.votes[team];
    if (vote && vote.at > state.clearedAt) out.push({ team, vote });
  }
  return out;
}

export function voteCounts(state: RoomState): Record<SiteId, number> {
  const counts: Record<SiteId, number> = { A: 0, B: 0, C: 0 };
  for (const { vote } of activeVotes(state)) counts[vote.choice] += 1;
  return counts;
}

export function suggestion(state: RoomState): { choice: SiteId | null; note: string } {
  const votes = activeVotes(state);
  if (votes.length === 0) {
    return { choice: null, note: "Waiting for teams to send a pick." };
  }
  const counts = voteCounts(state);
  const ranked = [...SITES].sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  const top = ranked[0];
  const next = ranked[1];
  if (counts[top] === counts[next]) {
    return {
      choice: null,
      note: "Teams are split. Talk it out, then the class screen chooses.",
    };
  }
  return {
    choice: top,
    note: `${counts[top]} of ${votes.length} teams lean toward ${siteById(top).name}.`,
  };
}

export type ClassResult = {
  points: number;
  max: number;
  submitted: number;
  agree: number;
  best: boolean;
  fullCrew: boolean;
};

export function classScore(choice: SiteId, state: RoomState): ClassResult {
  const votes = activeVotes(state);
  const submitted = votes.length;
  const agree = votes.filter(({ vote }) => vote.choice === choice).length;
  return {
    points: sitePoints(choice),
    max: MAX_POINTS,
    submitted,
    agree,
    best: choice === bestSiteId(),
    fullCrew: submitted === 4,
  };
}

export function debrief(id: SiteId): { cheer: string; watch: string } {
  if (id === "A") {
    return {
      cheer:
        "Mons Mouton Plateau has the most sunlight (45%), the best Earth visibility (74%) and the largest suitable landing area (564.8 km²). Its cold shadowed regions could also have water ice.",
      watch: "Water for later: 1 thick + 2 wide water bags for the Round 3 shelter.",
    };
  }
  if (id === "C") {
    return {
      cheer:
        "Nobile Rim 1 has some sunlight (38%), good Earth visibility (68%) and suitable landing areas (22.2 km²).",
      watch:
        "Site A offers better conditions in all three measured categories. Water for later: 1 thick + 1 wide water bag.",
    };
  }
  return {
    cheer: "Malapert Massif has the lowest average slope (5.6°).",
    watch:
      "It offers much less suitable landing area (7.1 km²), sunlight (31%) and Earth visibility (41%). Water for later: 1 wide water bag.",
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function asSite(v: unknown): SiteId | null {
  return v === "A" || v === "B" || v === "C" ? v : null;
}

function asTeam(v: unknown): TeamId | null {
  return v === "energy" || v === "water" || v === "terrain" || v === "comms" ? v : null;
}

function asRole(v: string): Role | null {
  return v === "main" || asTeam(v) ? (v as Role) : null;
}

export function sanitize(input: unknown): RoomState {
  const base = emptyState();
  if (!isRecord(input)) return base;
  const clearedAt = typeof input.clearedAt === "number" && Number.isFinite(input.clearedAt) ? input.clearedAt : 0;
  const votes: RoomState["votes"] = {};
  if (isRecord(input.votes)) {
    for (const team of TEAMS) {
      const raw = input.votes[team];
      if (!isRecord(raw)) continue;
      const choice = asSite(raw.choice);
      const at = typeof raw.at === "number" && Number.isFinite(raw.at) ? raw.at : 0;
      const reason = typeof raw.reason === "string" ? raw.reason.replace(/\s+/g, " ").trim().slice(0, 90) : "";
      if (!choice || at <= 0 || !reason) continue;
      votes[team] = { choice, reason, at };
    }
  }
  const seen: RoomState["seen"] = {};
  if (isRecord(input.seen)) {
    for (const [key, value] of Object.entries(input.seen)) {
      const role = asRole(key);
      if (!role || typeof value !== "number" || !Number.isFinite(value)) continue;
      seen[role] = value;
    }
  }
  const locked = input.locked === true;
  const finalChoice = asSite(input.finalChoice);
  const lockedAt = typeof input.lockedAt === "number" && Number.isFinite(input.lockedAt) ? input.lockedAt : null;
  return {
    votes,
    seen,
    finalChoice: locked ? finalChoice : null,
    locked: locked && !!finalChoice && !!lockedAt,
    lockedAt: locked && finalChoice ? lockedAt : null,
    clearedAt,
    game: sanitizeGame(input.game),
    acts: sanitizeActs(input.acts),
  };
}

export function mergeState(a: RoomState, b: RoomState): RoomState {
  const clearedAt = Math.max(a.clearedAt, b.clearedAt);
  const seen: RoomState["seen"] = {};
  for (const role of ROLES) {
    const stamp = Math.max(a.seen[role] ?? 0, b.seen[role] ?? 0);
    if (stamp > 0) seen[role] = stamp;
  }
  const locks = [
    a.locked && a.lockedAt && a.lockedAt > clearedAt && a.finalChoice
      ? { choice: a.finalChoice, at: a.lockedAt }
      : null,
    b.locked && b.lockedAt && b.lockedAt > clearedAt && b.finalChoice
      ? { choice: b.finalChoice, at: b.lockedAt }
      : null,
  ].filter((v): v is { choice: SiteId; at: number } => !!v);
  locks.sort((x, y) => x.at - y.at);
  const lock = locks[0] ?? null;
  const votes: RoomState["votes"] = {};
  for (const team of TEAMS) {
    const left = a.votes[team];
    const right = b.votes[team];
    const pick = [left, right]
      .filter((v): v is Vote => !!v && v.at > clearedAt && (!lock || v.at <= lock.at))
      .sort((x, y) => y.at - x.at)[0];
    if (pick) votes[team] = pick;
  }
  return {
    votes,
    seen,
    clearedAt,
    locked: !!lock,
    lockedAt: lock?.at ?? null,
    finalChoice: lock?.choice ?? null,
    game: mergeGame(a.game, b.game, clearedAt),
    acts: mergeActs(a.acts, b.acts, clearedAt),
  };
}

export function stateAhead(local: RoomState, remote: RoomState): boolean {
  if (local.clearedAt > remote.clearedAt) return true;
  if (local.game && (!remote.game || local.game.at > remote.game.at)) return true;
  for (const team of TEAMS) {
    const l = local.acts[team];
    const r = remote.acts[team];
    if (l && (!r || l.at > r.at)) return true;
  }
  for (const team of TEAMS) {
    const l = local.votes[team];
    const r = remote.votes[team];
    if (l && l.at > local.clearedAt && (!r || l.at > r.at)) return true;
  }
  if (local.locked && local.lockedAt && (!remote.locked || (remote.lockedAt ?? Infinity) > local.lockedAt)) {
    return true;
  }
  for (const role of ROLES) {
    if ((local.seen[role] ?? 0) > (remote.seen[role] ?? 0) + 1000) return true;
  }
  return false;
}

export function makeCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  let code = "";
  for (const byte of bytes) code += alphabet[byte % alphabet.length];
  return code;
}

export function isOnline(seen: number | undefined, now: number): boolean {
  return typeof seen === "number" && now - seen < 9000;
}
