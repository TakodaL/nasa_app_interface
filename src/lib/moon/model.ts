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
};

export type Site = {
  id: SiteId;
  name: string;
  short: string;
  tag: string;
  x: number;
  y: number;
  sun: number;
  nightDays: number;
  ice: number;
  kelvin: number;
  psr: number;
  slope: number;
  pads: number;
  earth: number;
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
    tag: "Wide and steady",
    x: 36,
    y: 48,
    sun: 74,
    nightDays: 5,
    ice: 58,
    kelvin: 50,
    psr: 4,
    slope: 6,
    pads: 5,
    earth: 70,
  },
  {
    id: "B",
    name: "Malapert Massif",
    short: "Malapert",
    tag: "Tall and chatty",
    x: 56,
    y: 32,
    sun: 88,
    nightDays: 3,
    ice: 34,
    kelvin: 70,
    psr: 1,
    slope: 12,
    pads: 2,
    earth: 97,
  },
  {
    id: "C",
    name: "Nobile Rim 1",
    short: "Nobile",
    tag: "Icy and cold",
    x: 64,
    y: 63,
    sun: 61,
    nightDays: 9,
    ice: 91,
    kelvin: 30,
    psr: 7,
    slope: 9,
    pads: 3,
    earth: 55,
  },
];

export const TEAM_META: Record<
  TeamId,
  { label: string; mission: string; question: string }
> = {
  energy: {
    label: "Energy",
    mission: "Sunlight and solar power",
    question: "Where can solar panels stay awake the longest?",
  },
  water: {
    label: "Water",
    mission: "Ice in cold shadows",
    question: "Where can the crew find water ice?",
  },
  terrain: {
    label: "Terrain",
    mission: "Slopes and landing pads",
    question: "Where is the ground gentle enough to land?",
  },
  comms: {
    label: "Communications",
    mission: "Calling Earth",
    question: "Where can the radio see Earth?",
  },
};

export type ReasonChip = { id: string; text: string; leans: SiteId };

export const REASONS: Record<TeamId, ReasonChip[]> = {
  energy: [
    { id: "sun", text: "The most sunlight for solar panels", leans: "B" },
    { id: "mix", text: "Good sun, and not too far from ice", leans: "A" },
    { id: "night", text: "We can pack batteries for a longer night", leans: "C" },
  ],
  water: [
    { id: "ice", text: "The strongest ice clues", leans: "C" },
    { id: "reach", text: "Some ice, easier to reach from a flat pad", leans: "A" },
    { id: "drive", text: "Less ice here, but a rover could drive to it", leans: "B" },
  ],
  terrain: [
    { id: "flat", text: "Flattest ground and the biggest landing pad", leans: "A" },
    { id: "care", text: "Steeper, but still landable if we aim carefully", leans: "C" },
    { id: "steep", text: "Too steep and small for a first base", leans: "B" },
  ],
  comms: [
    { id: "always", text: "Earth stays in view almost all the time", leans: "B" },
    { id: "most", text: "Enough Earth time to call home most days", leans: "A" },
    { id: "relay", text: "More blackouts, so we would need a relay plan", leans: "C" },
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
      body: "High rims near the south pole can stay in sunlight for most of the year. Crater floors can stay dark.",
    },
    {
      title: "Night needs a plan",
      body: "No Sun means no solar power. Batteries, fuel cells, or a small nuclear source have to cover the dark.",
    },
  ],
  water: [
    {
      title: "Shadows that never end",
      body: "Some crater floors never see the Sun. Scientists call them permanently shadowed regions, or PSRs.",
    },
    {
      title: "Cold keeps ice",
      body: "In the coldest traps, ice can sit for millions of years. Warmer ground lets it escape into space.",
    },
    {
      title: "Ice is useful",
      body: "Water ice can become drinking water, breathable air, and rocket fuel. NASA hunts it on purpose.",
    },
  ],
  terrain: [
    {
      title: "Landers like it gentle",
      body: "A wheelchair ramp is about 5°. Steeper than 10° gets tricky for a lander, a rover, and a habitat.",
    },
    {
      title: "Room to build",
      body: "A base needs flat pads for the lander, solar panels, a habitat, and a safe backup spot.",
    },
    {
      title: "Peaks trade safety",
      body: "A tall massif sees Earth and the Sun well, but the flat spots on it can be small and steep.",
    },
  ],
  comms: [
    {
      title: "Earth sits low",
      body: "From the lunar south pole, Earth hangs near the horizon. A hill can hide it.",
    },
    {
      title: "Height helps the radio",
      body: "A tall peak like Malapert can keep Earth in view almost the whole time.",
    },
    {
      title: "Quiet radios",
      body: "When Earth dips away, the direct call drops. A relay satellite or a second antenna can help.",
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
  };
}

export function siteById(id: SiteId): Site {
  const site = SITES_DATA.find((s) => s.id === id);
  if (!site) throw new Error(`Unknown site ${id}`);
  return site;
}

export function kelvinToC(k: number): number {
  return Math.round(k - 273.15);
}

export function blackoutDays(earth: number): number {
  return Math.round(((100 - earth) / 100) * 29);
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export type ScoreCard = {
  sun: number;
  ice: number;
  landing: number;
  earth: number;
  total: number;
};

export function scoreSite(site: Site): ScoreCard {
  const slopeScore = clamp(Math.round(100 - (site.slope - 5) * 8), 0, 100);
  const padScore = Math.round((site.pads / 5) * 100);
  const landing = Math.round(slopeScore * 0.6 + padScore * 0.4);
  const total = Math.round(site.sun * 0.25 + site.ice * 0.3 + landing * 0.25 + site.earth * 0.2);
  return { sun: site.sun, ice: site.ice, landing, earth: site.earth, total };
}

export function bestSiteId(): SiteId {
  return [...SITES].sort((a, b) => scoreSite(siteById(b)).total - scoreSite(siteById(a)).total)[0];
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
  total: number;
  base: number;
  bonus: number;
  submitted: number;
  agree: number;
  best: boolean;
  fullCrew: boolean;
};

export function classScore(choice: SiteId, state: RoomState): ClassResult {
  const base = scoreSite(siteById(choice)).total;
  const votes = activeVotes(state);
  const submitted = votes.length;
  const agree = votes.filter(({ vote }) => vote.choice === choice).length;
  let bonus = 0;
  if (submitted === 4) bonus += 8;
  else if (submitted >= 2) bonus += 3;
  if (agree >= 3) bonus += 6;
  else if (agree === 2) bonus += 3;
  const best = choice === bestSiteId();
  if (best) bonus += 4;
  return {
    total: Math.min(100, base + bonus),
    base,
    bonus,
    submitted,
    agree,
    best,
    fullCrew: submitted === 4,
  };
}

export function debrief(id: SiteId): { cheer: string; watch: string } {
  if (id === "A") {
    return {
      cheer:
        "Mons Mouton gives the crew a wide, gentler place to land, with a fair mix of sun, ice nearby, and time to talk to Earth.",
      watch:
        "Ice clues are stronger at Nobile Rim. A rover trip into a cold shadow may still be on the chore list.",
    };
  }
  if (id === "B") {
    return {
      cheer:
        "Malapert is the champion for sunlight and calling Earth. The radio would almost never go quiet.",
      watch:
        "The ground is steeper, the flat pad is small, and the ice clues are the weakest. Landing and water are the hard parts.",
    };
  }
  return {
    cheer:
      "Nobile Rim hides the coldest traps and the best ice clues. Water for drinking, air, and fuel could be close.",
    watch:
      "Nights last longer and Earth slips away more often. The crew needs batteries and a plan for quiet radios.",
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
  };
}

export function stateAhead(local: RoomState, remote: RoomState): boolean {
  if (local.clearedAt > remote.clearedAt) return true;
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
