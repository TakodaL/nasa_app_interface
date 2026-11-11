import { useState } from "react";
import { Monitor, Mountain, Radio, Sun, Droplets } from "lucide-react";
import { makeCode, TEAM_META, type Role, type TeamId } from "@/lib/moon/model";
import { unlockAudio } from "@/lib/moon/audio";
import { Button, Card, cn, Eyebrow } from "@/components/moon/ui";

const TEAMS: { id: TeamId; icon: typeof Sun }[] = [
  { id: "energy", icon: Sun },
  { id: "water", icon: Droplets },
  { id: "terrain", icon: Mountain },
  { id: "comms", icon: Radio },
];

export function Lobby({
  initialRoom,
  onJoin,
}: {
  initialRoom?: string;
  onJoin: (room: string, role: Role) => void;
}) {
  const [code, setCode] = useState(initialRoom ?? "");
  const [error, setError] = useState("");

  function enter(role: Role) {
    unlockAudio();
    const next = code.trim().toUpperCase();
    if (role !== "main" && !/^[A-Z0-9]{4}$/.test(next)) {
      setError("Ask the class screen for the 4-character code.");
      return;
    }
    const room = /^[A-Z0-9]{4}$/.test(next) ? next : makeCode();
    setError("");
    onJoin(room, role);
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="rise">
        <Eyebrow>NASA Junior · Round 1</Eyebrow>
        <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold tracking-tight text-fg md:text-6xl">
          Pick our Moon base
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
          Four science teams study the lunar south pole. The class screen listens, then the crew locks one
          site: Mons Mouton, Malapert, or Nobile Rim.
        </p>
        <ol className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["1", "Open clues", "Each team reads the evidence for sun, ice, ground, and radios."],
            ["2", "Send a pick", "Choose A, B, or C and say why in one line."],
            ["3", "Build", "The class debates, then hits Build our base."],
          ].map(([step, title, body], index) => (
            <li key={step} className={cn("glass rounded-3xl p-4", index === 1 && "rise-2", index === 2 && "rise-3")}>
              <span className="font-display text-xs font-semibold tracking-widest text-accent">{step}</span>
              <p className="mt-2 font-display text-lg font-semibold">{title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
            </li>
          ))}
        </ol>
      </div>

      <Card className="rise-2">
        <Eyebrow>Join the class</Eyebrow>
        <label className="mt-4 block" htmlFor="class-code">
          <span className="text-sm text-muted">Class code</span>
          <input
            id="class-code"
            value={code}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            maxLength={4}
            onChange={(event) => {
              setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4));
              setError("");
            }}
            placeholder="••••"
            className="code-track mt-2 w-full rounded-lg border border-line bg-bg px-3 py-3 text-center font-display text-3xl font-semibold text-accent uppercase placeholder:text-line"
          />
        </label>
        <p className="mt-2 text-sm text-faint">
          Class screen can leave this blank. A code is made for you. Tablets type the code they see.
        </p>
        {error && (
          <p className="mt-3 text-sm text-warn" role="alert">
            {error}
          </p>
        )}
        <Button variant="signal" className="mt-4 w-full" onClick={() => enter("main")}>
          <Monitor className="size-4" />
          This is the class screen
        </Button>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {TEAMS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => enter(id)}
              className="flex min-h-20 flex-col items-start justify-center gap-1 rounded-lg bg-bg/60 px-3 py-3 text-left transition-[transform,background-color] duration-150 active:scale-[0.96] hover:bg-surface-2"
            >
              <Icon className="size-4 text-accent" aria-hidden />
              <span className="font-display text-sm font-semibold">{TEAM_META[id].label}</span>
              <span className="text-xs leading-snug text-muted">{TEAM_META[id].mission}</span>
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-faint">
          One tablet nearby? Join as the class screen, then use the station buttons to play each team. Real
          classrooms use one device per station. Numbers are a classroom model of Artemis candidate regions,
          not a flight prediction.
        </p>
      </Card>
    </div>
  );
}
