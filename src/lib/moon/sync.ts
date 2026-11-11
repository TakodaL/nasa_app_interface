import { pullRoom, pushRoom } from "@/lib/moon/room.functions";
import {
  emptyState,
  mergeState,
  sanitize,
  stateAhead,
  type Role,
  type RoomState,
  type SiteId,
  type TeamId,
} from "@/lib/moon/model";

type Listener = (state: RoomState, link: Link) => void;
export type Link = "connecting" | "live" | "local";

const KEY = (code: string) => `artemis-junior:v1:${code}`;

let bound = "";
let channel: BroadcastChannel | null = null;
let pollTimer = 0;
let heartTimer = 0;
let stopFlag = false;
let link: Link = "connecting";
let state: RoomState = emptyState();
let role: Role = "main";
const listeners = new Set<Listener>();

function emit(): void {
  for (const listener of listeners) listener(state, link);
}

function save(code: string): void {
  try {
    localStorage.setItem(KEY(code), JSON.stringify(state));
  } catch {
    /* private mode */
  }
}

function load(code: string): RoomState {
  try {
    const raw = localStorage.getItem(KEY(code));
    if (!raw) return emptyState();
    return sanitize(JSON.parse(raw));
  } catch {
    return emptyState();
  }
}

function adopt(code: string, next: RoomState, nextLink?: Link): void {
  state = sanitize(next);
  if (nextLink) link = nextLink;
  save(code);
  emit();
}

async function push(code: string, snapshot: RoomState): Promise<void> {
  try {
    const remote = await pushRoom({ data: { code, state: snapshot } });
    if (stopFlag || bound !== code) return;
    const merged = mergeState(state, remote);
    adopt(code, merged, "live");
  } catch {
    if (bound === code) {
      link = "local";
      emit();
    }
  }
}

async function pull(code: string): Promise<void> {
  try {
    const remote = await pullRoom({ data: { code } });
    if (stopFlag || bound !== code) return;
    const merged = mergeState(state, remote);
    const ahead = stateAhead(merged, remote);
    adopt(code, merged, "live");
    if (ahead) void push(code, merged);
  } catch {
    if (bound === code) {
      link = "local";
      emit();
    }
  }
}

export function subscribeRoom(listener: Listener): () => void {
  listeners.add(listener);
  listener(state, link);
  return () => listeners.delete(listener);
}

export function currentRoom(): { code: string; state: RoomState; link: Link } {
  return { code: bound, state, link };
}

export function bindRoom(code: string, as: Role): () => void {
  stopFlag = false;
  if (bound !== code) {
    bound = code;
    state = load(code);
    link = "connecting";
    channel?.close();
    channel = new BroadcastChannel(`artemis-junior:${code}`);
    channel.onmessage = (event) => {
      if (bound !== code) return;
      const merged = mergeState(state, sanitize(event.data));
      adopt(code, merged);
    };
  }
  role = as;
  stamp();
  void pull(code);
  window.clearInterval(pollTimer);
  window.clearInterval(heartTimer);
  pollTimer = window.setInterval(() => void pull(code), 2000);
  heartTimer = window.setInterval(() => stamp(), 4000);
  emit();
  return () => {
    stopFlag = true;
    window.clearInterval(pollTimer);
    window.clearInterval(heartTimer);
  };
}

function stamp(): void {
  if (!bound) return;
  const at = Date.now();
  if ((state.seen[role] ?? 0) > at - 1500) return;
  const next = mergeState(state, { ...emptyState(), seen: { [role]: at } });
  state = next;
  save(bound);
  channel?.postMessage(state);
  emit();
  void push(bound, state);
}

function commit(next: RoomState): void {
  if (!bound) return;
  state = next;
  save(bound);
  channel?.postMessage(state);
  emit();
  void push(bound, state);
}

export function castVote(team: TeamId, choice: SiteId, reason: string): boolean {
  if (state.locked) return false;
  const clean = reason.replace(/\s+/g, " ").trim().slice(0, 90);
  if (!clean) return false;
  const next = mergeState(state, {
    ...emptyState(),
    votes: { [team]: { choice, reason: clean, at: Date.now() } },
    seen: { [team]: Date.now() },
  });
  commit(next);
  return true;
}

export function lockBase(choice: SiteId): boolean {
  if (state.locked) return false;
  const next = mergeState(state, {
    ...emptyState(),
    locked: true,
    lockedAt: Date.now(),
    finalChoice: choice,
    seen: { main: Date.now() },
  });
  commit(next);
  return true;
}

export function resetRoom(): void {
  const seen = state.seen;
  commit({ ...emptyState(), clearedAt: Date.now(), seen });
}
