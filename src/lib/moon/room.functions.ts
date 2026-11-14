import { createServerFn } from "@tanstack/react-start";
import { emptyState, mergeState, sanitize, type RoomState } from "@/lib/moon/model";

const CODE = /^[A-Z0-9]{4}$/;

function readCode(input: unknown): string {
  if (typeof input !== "object" || input === null || !("code" in input)) {
    throw new Error("Missing class code");
  }
  const code = String((input as { code: unknown }).code).toUpperCase();
  if (!CODE.test(code)) throw new Error("Class code must be 4 letters or numbers");
  return code;
}

export const pullRoom = createServerFn({ method: "GET" })
  .validator((input: unknown) => ({ code: readCode(input) }))
  .handler(async ({ data }): Promise<RoomState> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{ payload: string }>`select payload from moon_rooms where code = ${data.code}`;
    if (!rows[0]) return emptyState();
    try {
      return sanitize(JSON.parse(rows[0].payload));
    } catch {
      return emptyState();
    }
  });

export const pushRoom = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (typeof input !== "object" || input === null || !("state" in input)) {
      throw new Error("Missing room state");
    }
    return {
      code: readCode(input),
      state: sanitize((input as { state: unknown }).state),
    };
  })
  .handler(async ({ data }): Promise<RoomState> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    // Privacy rule C15: a game is deleted after 3 hours without activity.
    await sql`delete from moon_rooms where updated_at < now() - interval '3 hours'`;
    const rows = await sql<{ payload: string }>`select payload from moon_rooms where code = ${data.code}`;
    let prev = emptyState();
    if (rows[0]) {
      try {
        prev = sanitize(JSON.parse(rows[0].payload));
      } catch {
        prev = emptyState();
      }
    }
    const next = mergeState(prev, data.state);
    const payload = JSON.stringify(next);
    if (rows[0]) {
      await sql`update moon_rooms set payload = ${payload}, updated_at = now() where code = ${data.code}`;
    } else {
      await sql`insert into moon_rooms (code, payload) values (${data.code}, ${payload})`;
    }
    return next;
  });
