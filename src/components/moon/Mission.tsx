import { useEffect, useState } from "react";
import { Check, Copy, Rocket } from "lucide-react";
import { play, setMuted, unlockAudio, watchVisibility } from "@/lib/moon/audio";
import {
  activeVotes,
  CLUES,
  SITE_FILL,
  SITES_DATA,
  siteById,
  suggestion,
  TEAM_META,
  TEAMS,
  voteCounts,
  type Role,
  type SiteId,
  type TeamId,
} from "@/lib/moon/model";
import { bindRoom, clearVotes, lockBase, setGame } from "@/lib/moon/sync";
import { currentRound, nextRound, ROUND_INFO, WATER_BY_SITE, type GameState } from "@/lib/moon/game";
import { EmergencyScreen, EndScreen, MeterBar, SetupDeck, SpeakButton, WaitCard } from "@/components/moon/GameUI";
import { Round2Main, Round2Team } from "@/components/moon/Round2";
import { Round3Main, Round3Team } from "@/components/moon/Round3";
import { Round4Main, Round4Team } from "@/components/moon/Round4";
import { Round5Main, Round5Team } from "@/components/moon/Round5";
import { useRoom } from "@/lib/moon/use-room";
import { ClueStack, LinkPill, Presence, SoundButton, StationStrip, TeamIcon, teamTone } from "@/components/moon/Bits";
import { LunarMap } from "@/components/moon/LunarMap";
import { CommsPanel, EnergyPanel, TerrainPanel, WaterPanel } from "@/components/moon/panels";
import { Report } from "@/components/moon/Report";
import { VoteDock } from "@/components/moon/VoteDock";
import { Button, Card, cn, Eyebrow } from "@/components/moon/ui";

export function Mission({
  room,
  role,
  onRole,
  onLeave,
}: {
  room: string;
  role: Role;
  onRole: (role: Role) => void;
  onLeave: () => void;
}) {
  const { state, link, now } = useRoom();
  const game = state.game;
  const round = currentRound(game);
  const info = ROUND_INFO.find((r) => r.id === round);

  useEffect(() => {
    try {
      if (localStorage.getItem("artemis-junior:mute") === "1") setMuted(true);
    } catch {
      /* ignore */
    }
    const release = bindRoom(room, role);
    const unwatch = watchVisibility();
    return () => {
      release();
      unwatch();
    };
  }, [room, role]);

  return (
    <div className="grid gap-4 pb-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Eyebrow>
            {game?.done ? "Artemis Junior · Mission complete" : info ? `Artemis Junior · Round ${info.id} · ${info.place}` : "Artemis Junior · Mission setup"}
          </Eyebrow>
          <h1 className="mt-1 font-display text-2xl font-semibold md:text-3xl">
            {role === "main" ? "Class screen" : TEAM_META[role].label}
          </h1>
          <p className="mt-1 flex items-start gap-2 text-sm text-muted">
            {role !== "main" && round === 1 && <SpeakButton text={TEAM_META[role].question} />}
            {role === "main"
              ? info
                ? info.title
                : "Set up the mission, then teams join with the class code."
              : round === 1
                ? TEAM_META[role].question
                : info?.title ?? "Waiting for the mission to start."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-surface-2 px-3 py-2 text-right">
            <p className="text-xs text-faint">Class code</p>
            <p className="code-track font-display text-xl font-semibold text-accent">{room}</p>
          </div>
          <SoundButton />
        </div>
      </header>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StationStrip role={role} onPick={onRole} />
        <div className="flex items-center gap-2">
          <LinkPill link={link} />
          <button type="button" onClick={onLeave} className="min-h-11 px-2 text-sm text-muted underline-offset-2 hover:underline">
            Leave
          </button>
        </div>
      </div>
      {game && game.started && !game.done && <MeterBar game={game} />}
      {role === "main" ? (
        <MainStage room={room} game={game} round={round} now={now} />
      ) : (
        <TeamStage team={role} game={game} round={round} />
      )}
      <p className="text-xs leading-relaxed text-faint">
        Devices with the same class code share picks. On one computer, the station buttons above hop between
        the screen and the teams.
      </p>
    </div>
  );
}

function MainStage({ room, game, round, now }: { room: string; game: GameState | null; round: number | null; now: number }) {
  const { state } = useRoom();
  if (!game || !game.started) return <SetupDeck />;
  if (game.done) return <EndScreen game={game} />;
  if (game.emergency) return <EmergencyScreen game={game} />;
  if (round === 1) {
    if (state.locked && state.finalChoice) {
      const site = state.finalChoice;
      return (
        <div className="grid gap-4">
          <Report
            state={state}
            onAgain={() => {
              play("tap");
              clearVotes();
            }}
          />
          <div>
            <Button
              onClick={() => {
                play("send");
                setGame(
                  nextRound({
                    ...game,
                    site,
                    water: { ...WATER_BY_SITE[site] },
                    scores: { ...game.scores, "1": siteById(site).points },
                  }),
                );
              }}
            >
              {game.index >= game.rounds.length - 1 ? "End of mission" : `Next: Round ${game.rounds[game.index + 1]}`}
            </Button>
          </div>
        </div>
      );
    }
    return <MainDeck room={room} />;
  }
  if (round === 2) return <Round2Main state={state} game={game} />;
  if (round === 3) return <Round3Main state={state} game={game} now={now} />;
  if (round === 4) return <Round4Main state={state} game={game} />;
  if (round === 5) return <Round5Main state={state} game={game} />;
  return null;
}

function TeamStage({ team, game, round }: { team: TeamId; game: GameState | null; round: number | null }) {
  const { state } = useRoom();
  if (!game || !game.started) return <WaitCard text="Waiting for your teacher to start the mission." />;
  if (game.done) return <WaitCard text="Mission complete! See how the class did on the big screen." />;
  if (game.emergency) return <WaitCard text="Emergency! Waiting for your teacher." />;
  if (round === 1) return <TeamDeck team={team} />;
  if (round === 2) return <Round2Team state={state} game={game} team={team} />;
  if (round === 3) return <Round3Team state={state} game={game} team={team} />;
  if (round === 4) return <Round4Team state={state} game={game} team={team} />;
  if (round === 5) return <Round5Team state={state} game={game} team={team} />;
  return null;
}

function MainDeck({ room }: { room: string }) {
  const { state, now } = useRoom();
  const counts = voteCounts(state);
  const hint = suggestion(state);
  const [pick, setPick] = useState<SiteId | null>(null);
  const [copied, setCopied] = useState(false);
  const votes = activeVotes(state);
  const chosen = pick;
  const ready = votes.length > 0 && !!chosen;

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
      <Card className="rise">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-semibold">Candidate regions</h2>
            <p className="text-sm text-muted">Tap a pin. Numbers on the pins are team votes.</p>
          </div>
          <Presence state={state} now={now} />
        </div>
        <LunarMap selected={chosen} counts={counts} onSelect={(id) => { play("tap"); setPick(id); }} />
        <figure className="mt-4 overflow-hidden rounded-2xl bg-bg/50">
          <img
            src="/art/nasa-artemis3-regions.jpg"
            alt="NASA map of the Artemis III candidate landing regions near the lunar south pole, including Mons Mouton, Malapert Massif and Nobile Rim 1"
            className="w-full"
          />
          <figcaption className="px-3 py-2 text-xs text-muted">
            The real map: NASA's Artemis III candidate landing regions. Image: NASA.
          </figcaption>
        </figure>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {SITES_DATA.map((site) => (
            <button
              key={site.id}
              type="button"
              onClick={() => {
                play("tap");
                setPick(site.id);
              }}
              className={cn(
                "rounded-lg px-3 py-3 text-left",
                chosen === site.id ? "bg-surface-2" : "bg-bg/40",
              )}
            >
              <span className="font-display text-sm font-semibold" style={{ color: SITE_FILL[site.id] }}>
                {site.id} · {site.short}
              </span>
              <span className="mt-1 block text-xs text-muted">{site.tag}</span>
              <span className="mt-2 block text-xs text-faint tabular-nums">
                {counts[site.id]} team {counts[site.id] === 1 ? "vote" : "votes"}
              </span>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-4">
        <Card className="rise-2">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold">Team feed</h2>
            <span className="text-sm text-muted tabular-nums">{votes.length}/4 in</span>
          </div>
          <ul className="mt-3 grid gap-2">
            {TEAMS.map((team) => {
              const vote = votes.find((row) => row.team === team)?.vote;
              return (
                <li key={team} className="rounded-lg bg-bg/50 px-3 py-3">
                  <p className="flex items-center gap-2 font-display text-sm font-semibold">
                    <TeamIcon team={team} className={cn("size-4", teamTone(team))} />
                    {TEAM_META[team].label}
                    {vote ? (
                      <span className="ml-auto font-bold" style={{ color: SITE_FILL[vote.choice] }}>
                        {vote.choice}
                      </span>
                    ) : (
                      <span className="ml-auto text-xs font-medium text-faint">Waiting</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-muted">{vote ? vote.reason : "Still exploring clues."}</p>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="rise-3">
          <h2 className="font-display text-lg font-semibold">Negotiate</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">{hint.note}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                void copyLink(room).then((ok) => {
                  play(ok ? "tap" : "nope");
                  setCopied(ok);
                });
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-bg/60 px-3 text-sm text-fg"
            >
              {copied ? <Check className="size-4 text-good" /> : <Copy className="size-4" />}
              {copied ? "Link copied" : "Copy join link"}
            </button>
          </div>
          <Button
            variant="good"
            className="mt-4 w-full"
            disabled={!ready}
            onClick={() => {
              if (!chosen) {
                play("nope");
                return;
              }
              unlockAudio();
              if (lockBase(chosen)) play("lock");
              else play("nope");
            }}
          >
            <Rocket className="size-4" />
            {chosen ? `Build our base at ${SITES_DATA.find((s) => s.id === chosen)?.short}` : "Choose a site first"}
          </Button>
          {votes.length === 0 && (
            <p className="mt-2 text-xs text-faint">Build unlocks after at least one team sends a pick.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

async function copyLink(room: string): Promise<boolean> {
  const url = new URL(window.location.href);
  url.searchParams.set("room", room);
  url.searchParams.delete("role");
  try {
    await navigator.clipboard.writeText(url.toString());
    return true;
  } catch {
    return false;
  }
}

function TeamDeck({ team }: { team: TeamId }) {
  const { state } = useRoom();
  const saved = activeVotes(state).find((row) => row.team === team)?.vote.choice ?? null;
  const [choice, setChoice] = useState<SiteId | null>(saved);
  useEffect(() => {
    if (!choice && saved) setChoice(saved);
  }, [choice, saved]);
  const Panel =
    team === "energy" ? EnergyPanel : team === "water" ? WaterPanel : team === "terrain" ? TerrainPanel : CommsPanel;

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Card className="rise">
        <LunarMap compact selected={choice} onSelect={setChoice} />
        <div className="mt-4">
          <ClueStack clues={CLUES[team]} />
        </div>
      </Card>
      <Card className="rise-2">
        <Panel selected={choice} onSelect={setChoice} />
        <div className="mt-4">
          <VoteDock team={team} state={state} choice={choice} onChoice={setChoice} />
        </div>
      </Card>
    </div>
  );
}
