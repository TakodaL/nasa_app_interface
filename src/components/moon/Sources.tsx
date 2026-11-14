// C7: every NASA dataset the game uses, credited inside the app.
// "Saved" = copied into the game. Nothing in this version is fetched live, so nothing is labelled Live.
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { play } from "@/lib/moon/audio";
import { cn } from "@/components/moon/ui";

export const SOURCES: { round: string; title: string; what: string; url: string }[] = [
  {
    round: "Round 1",
    title: "Artemis III candidate landing regions",
    what: "Sun visibility, Earth visibility, average slope and landing area for Mons Mouton, Malapert and Nobile Rim 1.",
    url: "https://www.nasa.gov/news-release/nasa-provides-update-on-artemis-iii-moon-landing-regions/",
  },
  {
    round: "Round 1",
    title: "LRO Diviner lunar temperatures",
    what: "25 K (−248 °C) measured in a permanently shadowed crater on the Moon.",
    url: "https://science.nasa.gov/wp-content/uploads/2024/01/lrolitho7temperaturevariation27may2014.pdf",
  },
  {
    round: "Round 2",
    title: "Opportunity and the 2018 Mars dust storm",
    what: "On June 10, 2018 the rover's solar panels made only 21 watt-hours; NASA lost contact that day.",
    url: "https://www.jpl.nasa.gov/news/opportunity-hunkers-down-during-dust-storm/",
  },
  {
    round: "Round 2",
    title: "Mars–Earth message delay",
    what: "12 minutes on average (about 3 to 22 minutes, depending on where the planets are).",
    url: "https://science.nasa.gov/resource/on-mars-light-is-energy/",
  },
  {
    round: "Round 3",
    title: "DONKI space weather database",
    what: "The solar storm of September 10, 2017: CME 2017-09-10T16:09:00-CME-001 and particle event 2017-09-10T16:25:00-SEP-001.",
    url: "https://kauai.ccmc.gsfc.nasa.gov/DONKI/",
  },
  {
    round: "Round 3",
    title: "Curiosity radiation sensor (RAD)",
    what: "Radiation jumped on the Mars surface during that storm.",
    url: "https://science.nasa.gov/photojournal/solar-storms-radiation-at-martian-orbit-and-surface/",
  },
  {
    round: "Round 3",
    title: "OSDR Environmental Data App",
    what: "Radiation dose on the International Space Station: about 0.2 mGy a day, 7.96 mGy over 39 days (Rodent Research-1, 2014).",
    url: "https://visualization.osdr.nasa.gov/eda/",
  },
  {
    round: "Round 3",
    title: "How NASA protects astronauts from space radiation",
    what: "Astronauts build a shelter from bags of water, food and supplies.",
    url: "https://science.nasa.gov/science-research/heliophysics/how-nasa-will-protect-astronauts-from-space-radiation-at-the-moon/",
  },
  {
    round: "Round 4",
    title: "Apollo 12 crew menu",
    what: "The six foods and how they were packed.",
    url: "https://science.nasa.gov/wp-content/uploads/2023/09/Apollo_12.pdf",
  },
  {
    round: "Round 5",
    title: "Curiosity finds an ancient streambed (2012)",
    what: "Rounded pebbles show that water once flowed on Mars.",
    url: "https://science.nasa.gov/resource/remnants-of-ancient-streambed-on-mars/",
  },
];

export function SourcesList() {
  return (
    <div>
      <p className="text-sm leading-relaxed text-muted">
        Every number in this game comes from real NASA science. <b className="text-fg">Saved</b> means we copied it into the
        game. This is a student project, not an official NASA product.
      </p>
      <ul className="mt-3 grid gap-2">
        {SOURCES.map((s) => (
          <li key={s.title} className="rounded-lg bg-bg/50 px-3 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-surface-2 px-2 py-0.5 font-display text-xs font-semibold text-accent">{s.round}</span>
              <a href={s.url} target="_blank" rel="noreferrer" className="font-display text-sm font-semibold text-fg underline-offset-2 hover:underline">
                {s.title}
              </a>
              <span className="ml-auto rounded-md border border-line px-2 text-xs text-muted">Saved</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">{s.what}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SourcesToggle({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn(className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          play("tap");
          setOpen((v) => !v);
        }}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface-2 px-4 font-display text-sm font-semibold text-fg"
      >
        <BookOpen className="size-4 text-accent" aria-hidden />
        {open ? "Hide sources" : "Where our data comes from"}
      </button>
      {open && (
        <div className="mt-3">
          <SourcesList />
        </div>
      )}
    </div>
  );
}
