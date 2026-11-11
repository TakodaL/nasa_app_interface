import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lobby } from "@/components/moon/Lobby";
import { Mission } from "@/components/moon/Mission";
import { Starfield } from "@/components/moon/Starfield";
import { play } from "@/lib/moon/audio";
import { ROLES, type Role } from "@/lib/moon/model";

type MissionSearch = {
  room?: string;
  role?: Role;
};

function readSearch(search: Record<string, unknown>): MissionSearch {
  const roomRaw = typeof search.room === "string" ? search.room.toUpperCase() : "";
  const room = /^[A-Z0-9]{4}$/.test(roomRaw) ? roomRaw : undefined;
  const roleRaw = typeof search.role === "string" ? search.role : "";
  const role = (ROLES as readonly string[]).includes(roleRaw) ? (roleRaw as Role) : undefined;
  return { room, role: room ? role : undefined };
}

export const Route = createFileRoute("/")({
  validateSearch: readSearch,
  component: Home,
});

function Home() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const room = search.room;
  const role = search.role;

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <Starfield />
      <div className="hud-grid pointer-events-none fixed inset-0" aria-hidden />
      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-5 md:px-6 md:py-8">
        {room && role ? (
          <Mission
            room={room}
            role={role}
            onRole={(next) => {
              void navigate({ search: { room, role: next } });
            }}
            onLeave={() => {
              play("tap");
              void navigate({ search: {} });
            }}
          />
        ) : (
          <Lobby
            initialRoom={room}
            onJoin={(nextRoom, nextRole) => {
              void navigate({ search: { room: nextRoom, role: nextRole } });
            }}
          />
        )}
      </main>
    </div>
  );
}
