import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, x as ClientOnly, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { C as voteCounts, S as suggestion, _ as mergeState, a as SITES_DATA, b as siteById, c as TEAM_META, d as classScore, f as debrief, g as makeCode, h as kelvinToC, i as SITES, l as activeVotes, m as isOnline, n as REASONS, o as SITE_FILL, p as emptyState, s as TEAMS$1, t as CLUES, u as blackoutDays, v as sanitize, x as stateAhead, y as scoreSite } from "./model-CNNHFNAS.mjs";
import { a as Send, c as Mountain, d as Copy, f as Check, i as Sun, l as Monitor, n as Volume2, o as Rocket, s as Radio, t as VolumeX, u as Droplets } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-kSsan7hG.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as Bar, i as CartesianGrid, n as YAxis, o as Cell, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BMWliha2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ctx = null;
var master = null;
var muted = false;
function context() {
	if (typeof window === "undefined") return null;
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return null;
	if (!ctx) {
		ctx = new AC({ latencyHint: "interactive" });
		master = ctx.createGain();
		master.gain.value = muted ? 0 : .18;
		master.connect(ctx.destination);
	}
	return ctx;
}
function unlockAudio() {
	const audio = context();
	if (audio && audio.state === "suspended") audio.resume();
}
function setMuted(next) {
	muted = next;
	const audio = context();
	if (audio && master) master.gain.setTargetAtTime(next ? 0 : .18, audio.currentTime, .02);
}
function tone(freq, when, dur, gain = .25) {
	if (!ctx || !master || muted) return;
	const osc = ctx.createOscillator();
	const amp = ctx.createGain();
	osc.type = "triangle";
	osc.frequency.setValueAtTime(freq, when);
	amp.gain.setValueAtTime(1e-4, when);
	amp.gain.exponentialRampToValueAtTime(gain, when + .012);
	amp.gain.exponentialRampToValueAtTime(1e-4, when + dur);
	osc.connect(amp);
	amp.connect(master);
	osc.start(when);
	osc.stop(when + dur + .02);
	osc.onended = () => {
		osc.disconnect();
		amp.disconnect();
	};
}
function play(kind) {
	unlockAudio();
	if (!ctx || muted) return;
	const t = ctx.currentTime;
	if (kind === "tap") tone(680, t, .07, .16);
	if (kind === "nope") tone(196, t, .14, .1);
	if (kind === "send") {
		tone(523, t, .1, .18);
		tone(659, t + .07, .12, .18);
		tone(784, t + .14, .18, .16);
	}
	if (kind === "lock") {
		tone(392, t, .16, .14);
		tone(523, t + .08, .18, .16);
		tone(659, t + .16, .2, .16);
		tone(784, t + .24, .32, .14);
	}
}
function watchVisibility() {
	const onVis = () => {
		if (document.visibilityState === "visible" && ctx?.state === "suspended") ctx.resume();
	};
	document.addEventListener("visibilitychange", onVis);
	return () => document.removeEventListener("visibilitychange", onVis);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Button({ variant = "primary", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 font-display text-sm font-semibold tracking-wide transition-[transform,filter,background-color,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40", variant === "primary" && "bg-accent text-bg hover:brightness-110", variant === "good" && "bg-good text-bg hover:brightness-110", variant === "warn" && "bg-warn text-bg hover:brightness-110", variant === "signal" && "bg-signal text-bg hover:brightness-110", variant === "ghost" && "bg-surface-2 text-fg shadow-card hover:brightness-110", className),
		...props
	});
}
function Card({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("glass rounded-3xl p-4", className),
		children
	});
}
function Eyebrow({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-display text-xs font-semibold tracking-widest text-accent uppercase",
		children
	});
}
var TEAMS = [
	{
		id: "energy",
		icon: Sun
	},
	{
		id: "water",
		icon: Droplets
	},
	{
		id: "terrain",
		icon: Mountain
	},
	{
		id: "comms",
		icon: Radio
	}
];
function Lobby({ initialRoom, onJoin }) {
	const [code, setCode] = (0, import_react.useState)(initialRoom ?? "");
	const [error, setError] = (0, import_react.useState)("");
	function enter(role) {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-start gap-4 lg:grid-cols-[1.15fr_0.85fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rise",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "NASA Junior · Round 1" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 max-w-xl font-display text-4xl font-semibold tracking-tight text-fg md:text-6xl",
					children: "Pick our Moon base"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg",
					children: "Four science teams study the lunar south pole. The class screen listens, then the crew locks one site: Mons Mouton, Malapert, or Nobile Rim."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-6 grid gap-3 sm:grid-cols-3",
					children: [
						[
							"1",
							"Open clues",
							"Each team reads the evidence for sun, ice, ground, and radios."
						],
						[
							"2",
							"Send a pick",
							"Choose A, B, or C and say why in one line."
						],
						[
							"3",
							"Build",
							"The class debates, then hits Build our base."
						]
					].map(([step, title, body], index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cn("glass rounded-3xl p-4", index === 1 && "rise-2", index === 2 && "rise-3"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-xs font-semibold tracking-widest text-accent",
								children: step
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-display text-lg font-semibold",
								children: title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted",
								children: body
							})
						]
					}, step))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "rise-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Join the class" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 block",
					htmlFor: "class-code",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: "Class code"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "class-code",
						value: code,
						autoCapitalize: "characters",
						autoComplete: "off",
						spellCheck: false,
						maxLength: 4,
						onChange: (event) => {
							setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4));
							setError("");
						},
						placeholder: "••••",
						className: "code-track mt-2 w-full rounded-lg border border-line bg-bg px-3 py-3 text-center font-display text-3xl font-semibold text-accent uppercase placeholder:text-line"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-faint",
					children: "Class screen can leave this blank. A code is made for you. Tablets type the code they see."
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-warn",
					role: "alert",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "signal",
					className: "mt-4 w-full",
					onClick: () => enter("main"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "size-4" }), "This is the class screen"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid grid-cols-2 gap-2",
					children: TEAMS.map(({ id, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => enter(id),
						className: "flex min-h-20 flex-col items-start justify-center gap-1 rounded-lg bg-bg/60 px-3 py-3 text-left transition-[transform,background-color] duration-150 active:scale-[0.96] hover:bg-surface-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-4 text-accent",
								"aria-hidden": true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-sm font-semibold",
								children: TEAM_META[id].label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs leading-snug text-muted",
								children: TEAM_META[id].mission
							})
						]
					}, id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs leading-relaxed text-faint",
					children: "One tablet nearby? Join as the class screen, then use the station buttons to play each team. Real classrooms use one device per station. Numbers are a classroom model of Artemis candidate regions, not a flight prediction."
				})
			]
		})]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var CODE = /^[A-Z0-9]{4}$/;
function readCode(input) {
	if (typeof input !== "object" || input === null || !("code" in input)) throw new Error("Missing class code");
	const code = String(input.code).toUpperCase();
	if (!CODE.test(code)) throw new Error("Class code must be 4 letters or numbers");
	return code;
}
var pullRoom = createServerFn({ method: "GET" }).validator((input) => ({ code: readCode(input) })).handler(createSsrRpc("49482b1beba812af0020afce34a29ae6488ebb4908906cdfa6e8bf398304556b"));
var pushRoom = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input !== "object" || input === null || !("state" in input)) throw new Error("Missing room state");
	return {
		code: readCode(input),
		state: sanitize(input.state)
	};
}).handler(createSsrRpc("9a23e808307e3bc4756ec9e57b63bfc4ad19bf34fdb3181987cfe1cb3786f78e"));
var KEY = (code) => `artemis-junior:v1:${code}`;
var bound = "";
var channel = null;
var pollTimer = 0;
var heartTimer = 0;
var stopFlag = false;
var link = "connecting";
var state = emptyState();
var role = "main";
var listeners = /* @__PURE__ */ new Set();
function emit() {
	for (const listener of listeners) listener(state, link);
}
function save(code) {
	try {
		localStorage.setItem(KEY(code), JSON.stringify(state));
	} catch {}
}
function load(code) {
	try {
		const raw = localStorage.getItem(KEY(code));
		if (!raw) return emptyState();
		return sanitize(JSON.parse(raw));
	} catch {
		return emptyState();
	}
}
function adopt(code, next, nextLink) {
	state = sanitize(next);
	if (nextLink) link = nextLink;
	save(code);
	emit();
}
async function push(code, snapshot) {
	try {
		const remote = await pushRoom({ data: {
			code,
			state: snapshot
		} });
		if (stopFlag || bound !== code) return;
		adopt(code, mergeState(state, remote), "live");
	} catch {
		if (bound === code) {
			link = "local";
			emit();
		}
	}
}
async function pull(code) {
	try {
		const remote = await pullRoom({ data: { code } });
		if (stopFlag || bound !== code) return;
		const merged = mergeState(state, remote);
		const ahead = stateAhead(merged, remote);
		adopt(code, merged, "live");
		if (ahead) push(code, merged);
	} catch {
		if (bound === code) {
			link = "local";
			emit();
		}
	}
}
function subscribeRoom(listener) {
	listeners.add(listener);
	listener(state, link);
	return () => listeners.delete(listener);
}
function currentRoom() {
	return {
		code: bound,
		state,
		link
	};
}
function bindRoom(code, as) {
	stopFlag = false;
	if (bound !== code) {
		bound = code;
		state = load(code);
		link = "connecting";
		channel?.close();
		channel = new BroadcastChannel(`artemis-junior:${code}`);
		channel.onmessage = (event) => {
			if (bound !== code) return;
			adopt(code, mergeState(state, sanitize(event.data)));
		};
	}
	role = as;
	stamp();
	pull(code);
	window.clearInterval(pollTimer);
	window.clearInterval(heartTimer);
	pollTimer = window.setInterval(() => void pull(code), 2e3);
	heartTimer = window.setInterval(() => stamp(), 4e3);
	emit();
	return () => {
		stopFlag = true;
		window.clearInterval(pollTimer);
		window.clearInterval(heartTimer);
	};
}
function stamp() {
	if (!bound) return;
	const at = Date.now();
	if ((state.seen[role] ?? 0) > at - 1500) return;
	state = mergeState(state, {
		...emptyState(),
		seen: { [role]: at }
	});
	save(bound);
	channel?.postMessage(state);
	emit();
	push(bound, state);
}
function commit(next) {
	if (!bound) return;
	state = next;
	save(bound);
	channel?.postMessage(state);
	emit();
	push(bound, state);
}
function castVote(team, choice, reason) {
	if (state.locked) return false;
	const clean = reason.replace(/\s+/g, " ").trim().slice(0, 90);
	if (!clean) return false;
	commit(mergeState(state, {
		...emptyState(),
		votes: { [team]: {
			choice,
			reason: clean,
			at: Date.now()
		} },
		seen: { [team]: Date.now() }
	}));
	return true;
}
function lockBase(choice) {
	if (state.locked) return false;
	commit(mergeState(state, {
		...emptyState(),
		locked: true,
		lockedAt: Date.now(),
		finalChoice: choice,
		seen: { main: Date.now() }
	}));
	return true;
}
function resetRoom() {
	const seen = state.seen;
	commit({
		...emptyState(),
		clearedAt: Date.now(),
		seen
	});
}
function useRoom() {
	const [state, setState] = (0, import_react.useState)(() => currentRoom().state);
	const [link, setLink] = (0, import_react.useState)(() => currentRoom().link);
	const [now, setNow] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setNow(Date.now());
		const unsub = subscribeRoom((next, nextLink) => {
			setState(next);
			setLink(nextLink);
		});
		const tick = window.setInterval(() => setNow(Date.now()), 3e3);
		return () => {
			unsub();
			window.clearInterval(tick);
		};
	}, []);
	return {
		state,
		link,
		now
	};
}
var ICONS = {
	energy: Sun,
	water: Droplets,
	terrain: Mountain,
	comms: Radio
};
function TeamIcon({ team, className }) {
	const Icon = ICONS[team];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
		className,
		"aria-hidden": true
	});
}
function teamTone(team) {
	if (team === "energy") return "text-warn";
	if (team === "water") return "text-accent";
	if (team === "terrain") return "text-signal";
	return "text-good";
}
var STATIONS = [{
	id: "main",
	label: "Class screen"
}, ...TEAMS$1.map((id) => ({
	id,
	label: TEAM_META[id].label
}))];
function StationStrip({ role, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-2",
		role: "tablist",
		"aria-label": "This device",
		children: STATIONS.map((station) => {
			const active = station.id === role;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "tab",
				"aria-selected": active,
				onClick: () => {
					play("tap");
					onPick(station.id);
				},
				className: cn("min-h-11 rounded-full px-3 font-display text-xs font-semibold tracking-wide transition-[transform,background-color,color] duration-150 active:scale-[0.96]", active ? "bg-accent text-bg" : "bg-surface-2 text-muted"),
				children: station.label
			}, station.id);
		})
	});
}
function SoundButton() {
	const [muted, setLocal] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const stored = localStorage.getItem("artemis-junior:mute") === "1";
			setLocal(stored);
			setMuted(stored);
		} catch {}
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": muted,
		"aria-label": muted ? "Unmute mission sounds" : "Mute mission sounds",
		className: "flex size-11 items-center justify-center rounded-full bg-surface-2 text-fg",
		onClick: () => {
			const next = !muted;
			setLocal(next);
			setMuted(next);
			try {
				localStorage.setItem("artemis-junior:mute", next ? "1" : "0");
			} catch {}
			if (!next) play("tap");
		},
		children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
	});
}
function LinkPill({ link }) {
	const label = link === "live" ? "Class linked" : link === "local" ? "This screen only" : "Linking";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 font-display text-xs tracking-wide text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("size-2 rounded-full", link === "live" && "bg-good", link === "local" && "bg-warn", link === "connecting" && "bg-faint"),
			"aria-hidden": true
		}), label]
	});
}
function Presence({ state, now }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "flex flex-wrap gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PresenceChip, {
			label: "Screen",
			on: isOnline(state.seen.main, now)
		}), TEAMS$1.map((team) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PresenceChip, {
			label: TEAM_META[team].label,
			on: isOnline(state.seen[team], now)
		}, team))]
	});
}
function PresenceChip({ label, on }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "inline-flex min-h-8 items-center gap-1.5 rounded-full bg-bg/70 px-2 text-xs text-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("size-1.5 rounded-full", on ? "bg-good" : "bg-line"),
				"aria-hidden": true
			}),
			label,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: on ? "online" : "not seen yet"
			})
		]
	});
}
function ClueStack({ clues }) {
	const [open, setOpen] = (0, import_react.useState)(0);
	const [seen, setSeen] = (0, import_react.useState)(1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2 flex items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-sm font-semibold tracking-wide text-fg",
			children: "Clues"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-xs text-muted tabular-nums",
			children: [
				seen,
				" of ",
				clues.length,
				" opened"
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-2",
		children: clues.map((clue, index) => {
			const expanded = open === index;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				"aria-expanded": expanded,
				onClick: () => {
					play("tap");
					setOpen(expanded ? -1 : index);
					setSeen((n) => Math.max(n, index + 1));
				},
				className: cn("rounded-lg px-3 py-3 text-left transition-[background-color,transform] duration-150 active:scale-[0.96]", expanded ? "bg-surface-2" : "bg-bg/50"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display text-sm font-semibold text-fg",
						children: [
							index + 1,
							". ",
							clue.title
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-accent",
						children: expanded ? "Hide" : "Open"
					})]
				}), expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-2 block text-sm leading-relaxed text-muted",
					children: clue.body
				})]
			}, clue.title);
		})
	})] });
}
function LunarMap({ selected, onSelect, counts, compact = false }) {
	const [photo, setPhoto] = (0, import_react.useState)(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative mx-auto w-full", compact ? "max-w-sm" : "max-w-xl"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-square overflow-hidden rounded-full shadow-glow",
			children: [
				photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/art/lunar-south.jpg",
					alt: "Orbital photo of the Moon's south polar craters",
					className: "h-full w-full object-cover outline outline-1 -outline-offset-1 outline-white/10",
					onError: () => setPhoto(false)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-[radial-gradient(circle_at_50%_45%,var(--color-surface-2),var(--color-bg)_70%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_55%,rgba(11,15,25,0.45)_100%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-none absolute top-[7%] left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-bg/70 px-2 py-1 font-display text-xs font-semibold tracking-widest text-accent uppercase",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, {
						className: "size-3",
						"aria-hidden": true
					}), "Earth"]
				}),
				SITES_DATA.map((site) => {
					const active = selected === site.id;
					const count = counts?.[site.id] ?? 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => onSelect?.(site.id),
						"aria-pressed": active,
						"aria-label": `${site.id}. ${site.name}`,
						className: "absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center",
						style: {
							left: `${site.x}%`,
							top: `${site.y}%`
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("pin-ring absolute size-11 rounded-full", active ? "opacity-100" : "opacity-70"),
								style: { background: SITE_FILL[site.id] }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("relative z-10 flex size-11 items-center justify-center rounded-full border font-display text-sm font-bold", active ? "border-transparent text-bg" : "border-white/30 bg-bg/80 text-fg"),
								style: active ? { background: SITE_FILL[site.id] } : void 0,
								children: site.id
							}),
							count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -top-1 -right-1 z-20 flex size-5 items-center justify-center rounded-full bg-fg font-display text-xs font-bold text-bg",
								children: count
							})
						]
					}, site.id);
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-center text-xs text-faint",
			children: "South pole, classroom map. Earth sits above the limb. Not to scale."
		})]
	});
}
var tick = {
	fill: "var(--color-muted)",
	fontSize: 12,
	fontFamily: "Outfit, sans-serif"
};
function Frame({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-56 rounded-lg bg-bg/40" }) });
}
function Tip({ active, payload, unit }) {
	if (!active || !payload?.[0]?.payload) return null;
	const site = payload[0].payload;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-surface px-3 py-2 text-sm shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display font-semibold text-fg",
			children: site.name
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-muted tabular-nums",
			children: [
				payload[0].value,
				" ",
				unit
			]
		})]
	});
}
function Bars({ dataKey, unit, domain, selected, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Frame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
		data: SITES_DATA,
		barCategoryGap: "28%",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
				vertical: false,
				stroke: "var(--color-line)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
				dataKey: "short",
				tick,
				axisLine: false,
				tickLine: false
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
				domain,
				tick,
				axisLine: false,
				tickLine: false,
				width: 36
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
				cursor: { fill: "rgba(62,224,255,0.06)" },
				content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tip, { unit })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
				dataKey,
				radius: [
					8,
					8,
					0,
					0
				],
				onClick: (row) => {
					if (row.id) {
						play("tap");
						onSelect(row.id);
					}
				},
				children: SITES_DATA.map((site) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, {
					fill: SITE_FILL[site.id],
					fillOpacity: !selected || selected === site.id ? 1 : .35
				}, site.id))
			})
		]
	}) });
}
function EnergyPanel({ selected, onSelect }) {
	const focus = SITES_DATA.find((s) => s.id === selected) ?? null;
	const leader = [...SITES_DATA].sort((a, b) => b.sun - a.sun)[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-base font-semibold",
				children: "Sunlight each year"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm leading-relaxed text-muted",
				children: [
					"Taller bar, more time in the Sun. Tap a bar. ",
					leader.short,
					" leads with ",
					leader.sun,
					"%."
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, {
				dataKey: "sun",
				unit: "% sunlit",
				domain: [0, 100],
				selected,
				onSelect
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2",
				children: SITES_DATA.map((site) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						play("tap");
						onSelect(site.id);
					},
					className: cn("rounded-lg px-2 py-2 text-left", selected === site.id ? "bg-surface-2" : "bg-bg/40"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-xs text-muted",
							children: site.id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block font-display text-lg font-semibold tabular-nums",
							children: [site.nightDays, "d"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-faint",
							children: "longest night"
						})
					]
				}, site.id))
			}),
			focus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm leading-relaxed text-fg",
				children: [
					focus.name,
					" is sunlit ",
					focus.sun,
					"% of the year. The longest dark stretch is about ",
					focus.nightDays,
					" ",
					"Earth days. ",
					focus.nightDays <= 4 ? "Batteries have an easier job." : "Pack a serious night plan."
				]
			})
		]
	});
}
function WaterPanel({ selected, onSelect }) {
	const focus = SITES_DATA.find((s) => s.id === selected) ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-base font-semibold",
				children: "Ice clues"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-relaxed text-muted",
				children: "Higher means stronger evidence of water ice in nearby cold traps. Colder traps hold ice longer."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg bg-bg/50 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xs tracking-widest text-accent uppercase",
						children: "Crater shadow"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-faint",
						children: "Sun misses the floor"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-24 overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 bottom-0 h-14 rounded-t-[50%] border-t border-line bg-surface-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-3 left-1/2 h-8 w-20 -translate-x-1/2 rounded-t-full bg-accent/30" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-1 left-3 font-display text-xs text-warn",
							children: "Sunlight"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute right-3 bottom-5 font-display text-xs text-accent",
							children: "Cold trap"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, {
				dataKey: "ice",
				unit: "ice clues",
				domain: [0, 100],
				selected,
				onSelect
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: SITES_DATA.map((site) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						play("tap");
						onSelect(site.id);
					},
					className: cn("flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left", selected === site.id ? "bg-surface-2" : "bg-bg/40"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display text-sm font-semibold",
						children: [
							site.id,
							" · ",
							site.short
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-0.5 block text-xs text-muted",
						children: [
							site.psr,
							" shadowed crater",
							site.psr === 1 ? "" : "s",
							" nearby"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block font-display text-lg font-semibold tabular-nums",
							children: [site.kelvin, " K"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-xs text-faint tabular-nums",
							children: [kelvinToC(site.kelvin), " °C"]
						})]
					})]
				}, site.id))
			}),
			focus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm leading-relaxed text-fg",
				children: [
					focus.name,
					" scores ",
					focus.ice,
					" for ice clues. Its coldest trap is ",
					focus.kelvin,
					" K, about",
					" ",
					kelvinToC(focus.kelvin),
					" °C. ",
					focus.kelvin <= 40 ? "That is cold enough to lock ice in place." : "Warmer traps let ice slip away."
				]
			})
		]
	});
}
function TerrainPanel({ selected, onSelect }) {
	const focus = SITES_DATA.find((s) => s.id === selected) ?? null;
	const [help, setHelp] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base font-semibold",
					children: "Slope vs landing room"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm leading-relaxed text-muted",
					children: "Low slope is safer. More pads means more room for a lander, habitat, and solar field."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-expanded": help,
					onClick: () => setHelp((v) => !v),
					className: "min-h-11 shrink-0 rounded-full bg-surface-2 px-3 font-display text-xs font-semibold text-warn",
					children: "What is slope?"
				})]
			}),
			help && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-lg bg-warn/10 px-3 py-3 text-sm leading-relaxed text-fg",
				children: "Slope is how steep the ground is. A wheelchair ramp is about 5°. A steep trail can be 15°. Under 8° is friendlier for a first Moon base."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xs tracking-widest text-muted uppercase",
				children: "Average slope · lower is better"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, {
				dataKey: "slope",
				unit: "° slope",
				domain: [0, 15],
				selected,
				onSelect
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xs tracking-widest text-muted uppercase",
				children: "Flat landing pads · more is better"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, {
				dataKey: "pads",
				unit: "pads",
				domain: [0, 5],
				selected,
				onSelect
			}),
			focus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm leading-relaxed text-fg",
				children: [
					focus.name,
					" averages ",
					focus.slope,
					"° and has ",
					focus.pads,
					" good pads.",
					" ",
					focus.slope <= 8 && focus.pads >= 4 ? "This is the friendly landing." : focus.slope >= 11 ? "Steep and tight. A hard first landing." : "Landable, if the pilot aims with care."
				]
			})
		]
	});
}
function CommsPanel({ selected, onSelect }) {
	const focus = SITES_DATA.find((s) => s.id === selected) ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-base font-semibold",
				children: "Earth in view"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-relaxed text-muted",
				children: "Percent of time Earth sits above the horizon. When it drops, the direct radio goes quiet."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bars, {
				dataKey: "earth",
				unit: "% Earth visible",
				domain: [0, 100],
				selected,
				onSelect
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: SITES_DATA.map((site) => {
					const quiet = blackoutDays(site.earth);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							play("tap");
							onSelect(site.id);
						},
						className: cn("rounded-lg px-3 py-3 text-left", selected === site.id ? "bg-surface-2" : "bg-bg/40"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-display text-sm font-semibold",
									children: [
										site.id,
										" · ",
										site.short
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-display text-lg font-semibold tabular-nums",
									children: [site.earth, "%"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-2 block h-2 overflow-hidden rounded-full bg-bg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block h-full rounded-full bg-good",
									style: { width: `${site.earth}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-2 block text-xs text-muted",
								children: [
									"About ",
									quiet,
									" quiet ",
									quiet === 1 ? "day" : "days",
									" each lunar month"
								]
							})
						]
					}, site.id);
				})
			}),
			focus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm leading-relaxed text-fg",
				children: [
					"From ",
					focus.name,
					", Earth is visible ",
					focus.earth,
					"% of the time.",
					" ",
					focus.earth >= 90 ? "Calls home almost never drop." : focus.earth >= 65 ? "Most days have a window to talk." : "Plan for longer blackouts or a relay."
				]
			})
		]
	});
}
function Report({ state, onAgain }) {
	if (!state.finalChoice) return null;
	const choice = state.finalChoice;
	const site = siteById(choice);
	const result = classScore(choice, state);
	const card = scoreSite(site);
	const story = debrief(choice);
	const votes = activeVotes(state);
	const [drawn, setDrawn] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const id = window.requestAnimationFrame(() => setDrawn(result.total));
		return () => window.cancelAnimationFrame(id);
	}, [result.total]);
	const radius = 52;
	const circ = 2 * Math.PI * radius;
	const dash = drawn / 100 * circ;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden",
				"aria-hidden": true,
				children: Array.from({ length: 14 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "confetti-bit",
					style: {
						left: `${6 + i * 7 % 88}%`,
						background: i % 3 === 0 ? "var(--color-accent)" : i % 3 === 1 ? "var(--color-warn)" : "var(--color-good)",
						animationDelay: `${i * 40}ms`
					}
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rise relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Mission report" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col items-center gap-5 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative size-36 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							viewBox: "0 0 120 120",
							className: "size-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "60",
								cy: "60",
								r: radius,
								fill: "none",
								stroke: "var(--color-line)",
								strokeWidth: "8"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "60",
								cy: "60",
								r: radius,
								fill: "none",
								stroke: "var(--color-accent)",
								strokeWidth: "8",
								strokeLinecap: "round",
								strokeDasharray: `${dash} ${circ}`,
								transform: "rotate(-90 60 60)",
								className: "transition-[stroke-dasharray] duration-700 ease-out"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 flex flex-col items-center justify-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-4xl font-semibold tabular-nums",
								children: result.total
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: "class score"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-xs tracking-widest text-muted uppercase",
							children: ["Site ", choice]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-3xl font-semibold md:text-4xl",
							children: site.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: site.tag
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								result.fullCrew && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Full crew reported" }),
								result.agree >= 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Strong agreement" }),
								result.best && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Balanced science pick" }),
								!result.best && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Bold tradeoff" })
							]
						})
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-semibold",
						children: "How this site scores"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							"Sun 25%, water 30%, landing 25%, Earth link 20%. Your class bonus was +",
							result.bonus,
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
								label: "Sunlight",
								value: card.sun
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
								label: "Water ice",
								value: card.ice
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
								label: "Landing",
								value: card.landing
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
								label: "Earth link",
								value: card.earth
							})
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base font-semibold",
					children: "What the crews said"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 grid gap-2",
					children: [votes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted",
						children: "No team notes were filed."
					}), votes.map(({ team, vote }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg bg-bg/50 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 font-display text-sm font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamIcon, {
									team,
									className: `size-4 ${teamTone(team)}`
								}),
								TEAM_META[team].label,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: ["→ ", vote.choice]
								}),
								vote.choice === choice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-good",
									children: "matched"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: vote.reason
						})]
					}, team))]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base font-semibold text-good",
					children: "What went well"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: story.cheer
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base font-semibold text-warn",
					children: "Watch out"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: story.watch
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-base font-semibold",
					children: "The other sites"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 grid gap-2 sm:grid-cols-3",
					children: SITES.map((id) => {
						const other = siteById(id);
						const total = scoreSite(other).total;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg bg-bg/50 px-3 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-display text-sm font-semibold",
									children: [
										id,
										" · ",
										other.short
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-display text-2xl font-semibold tabular-nums",
									children: total
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-faint",
									children: id === choice ? "Your base" : "Science balance"
								})
							]
						}, id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs leading-relaxed text-faint",
					children: "Scores compare tradeoffs for this classroom round. They are inspired by published Artemis south-pole candidate regions, not a NASA flight decision."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "mt-4",
					onClick: onAgain,
					children: "Run the round again"
				})
			] })
		]
	});
}
function Badge({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full bg-accent/15 px-3 py-1 font-display text-xs font-semibold text-accent",
		children
	});
}
function Meter({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1 flex items-center justify-between text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums text-muted",
			children: value
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-2 overflow-hidden rounded-full bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full bg-accent transition-[width] duration-700 ease-out",
			style: { width: `${value}%` }
		})
	})] });
}
function VoteDock({ team, state, choice, onChoice }) {
	const [chip, setChip] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)("");
	const [sent, setSent] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const mine = activeVotes(state).find((row) => row.team === team)?.vote;
	if (state.locked && state.finalChoice) {
		const site = siteById(state.finalChoice);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky bottom-3 z-20 rounded-3xl bg-good/15 p-4 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs font-semibold tracking-widest text-good uppercase",
					children: "Base locked"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-xl font-semibold text-fg",
					children: site.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "The class screen filed the mission report. Nice work, crew."
				})
			]
		});
	}
	const reason = [REASONS[team].find((item) => item.id === chip)?.text ?? "", note.trim()].filter(Boolean).join(" — ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sticky bottom-3 z-20 glass rounded-3xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xs font-semibold tracking-widest text-accent uppercase",
				children: "Our recommendation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-3 gap-2",
				children: SITES_DATA.map((site) => {
					const on = choice === site.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-pressed": on,
						onClick: () => {
							play("tap");
							onChoice(site.id);
							setSent(false);
						},
						className: cn("min-h-16 rounded-lg px-2 py-2 text-left transition-[transform,background-color] duration-150 active:scale-[0.96]", on ? "text-bg" : "bg-bg/60 text-fg"),
						style: on ? { background: SITE_FILL[site.id] } : void 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-sm font-bold",
							children: site.id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("mt-1 block text-xs leading-tight", on ? "text-bg/80" : "text-muted"),
							children: site.short
						})]
					}, site.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid gap-2",
				children: REASONS[team].map((item) => {
					const on = chip === item.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-pressed": on,
						onClick: () => {
							play("tap");
							setChip(on ? null : item.id);
							setSent(false);
						},
						className: cn("min-h-11 rounded-lg px-3 py-2 text-left text-sm transition-[background-color,transform] duration-150 active:scale-[0.96]", on ? "bg-accent/15 text-fg" : "bg-bg/50 text-muted"),
						children: [item.text, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-0.5 block text-xs text-faint",
							children: ["Leans ", item.leans]
						})]
					}, item.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-3 block text-xs text-muted",
				htmlFor: "team-note",
				children: ["Add your team’s words", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "team-note",
					value: note,
					maxLength: 70,
					onChange: (event) => {
						setNote(event.target.value);
						setSent(false);
					},
					placeholder: "Optional, one short line",
					className: "mt-1 min-h-11 w-full rounded-lg border border-line bg-bg px-3 text-sm text-fg placeholder:text-faint"
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-warn",
				children: error
			}),
			sent && mine && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-good",
				children: [
					"Sent. The class screen has ",
					siteById(mine.choice).short,
					". You can update until the base is locked."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-3 w-full",
				disabled: !choice || !reason,
				onClick: () => {
					if (!choice || !reason) {
						play("nope");
						setError("Pick a site and a reason first.");
						return;
					}
					if (!castVote(team, choice, reason)) {
						play("nope");
						setError("The class already locked the base.");
						return;
					}
					play("send");
					setError("");
					setSent(true);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), mine ? "Update the class" : "Send to the class"]
			})
		]
	});
}
function Mission({ room, role, onRole, onLeave }) {
	const { state, link, now } = useRoom();
	(0, import_react.useEffect)(() => {
		try {
			if (localStorage.getItem("artemis-junior:mute") === "1") setMuted(true);
		} catch {}
		const release = bindRoom(room, role);
		const unwatch = watchVisibility();
		return () => {
			release();
			unwatch();
		};
	}, [room, role]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eyebrow, { children: "Artemis Junior · Round 1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-2xl font-semibold md:text-3xl",
						children: role === "main" ? "Class screen" : TEAM_META[role].label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: role === "main" ? "Live picks from the four science teams." : TEAM_META[role].question
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg bg-surface-2 px-3 py-2 text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-faint",
							children: "Class code"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "code-track font-display text-xl font-semibold text-accent",
							children: room
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoundButton, {})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StationStrip, {
					role,
					onPick: onRole
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkPill, { link }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onLeave,
						className: "min-h-11 px-2 text-sm text-muted underline-offset-2 hover:underline",
						children: "Leave"
					})]
				})]
			}),
			role === "main" ? state.locked && state.finalChoice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Report, {
				state,
				onAgain: () => {
					play("tap");
					resetRoom();
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MainDeck, { room }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamDeck, { team: role }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-relaxed text-faint",
				children: "Devices with the same class code share picks. On one computer, the station buttons above hop between the screen and the teams."
			})
		]
	});
}
function MainDeck({ room }) {
	const { state, now } = useRoom();
	const counts = voteCounts(state);
	const hint = suggestion(state);
	const [pick, setPick] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const votes = activeVotes(state);
	const chosen = pick;
	const ready = votes.length > 0 && !!chosen;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-start gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "rise",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex flex-wrap items-end justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Candidate regions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Tap a pin. Numbers on the pins are team votes."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
						state,
						now
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LunarMap, {
					selected: chosen,
					counts,
					onSelect: (id) => {
						play("tap");
						setPick(id);
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-2 sm:grid-cols-3",
					children: SITES_DATA.map((site) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							play("tap");
							setPick(site.id);
						},
						className: cn("rounded-lg px-3 py-3 text-left", chosen === site.id ? "bg-surface-2" : "bg-bg/40"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display text-sm font-semibold",
								style: { color: SITE_FILL[site.id] },
								children: [
									site.id,
									" · ",
									site.short
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs text-muted",
								children: site.tag
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-2 block text-xs text-faint tabular-nums",
								children: [
									counts[site.id],
									" team ",
									counts[site.id] === 1 ? "vote" : "votes"
								]
							})
						]
					}, site.id))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rise-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Team feed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted tabular-nums",
						children: [votes.length, "/4 in"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 grid gap-2",
					children: TEAMS$1.map((team) => {
						const vote = votes.find((row) => row.team === team)?.vote;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg bg-bg/50 px-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 font-display text-sm font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamIcon, {
										team,
										className: cn("size-4", teamTone(team))
									}),
									TEAM_META[team].label,
									vote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto font-bold",
										style: { color: SITE_FILL[vote.choice] },
										children: vote.choice
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-auto text-xs font-medium text-faint",
										children: "Waiting"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: vote ? vote.reason : "Still exploring clues."
							})]
						}, team);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rise-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Negotiate"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-relaxed text-muted",
						children: hint.note
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								copyLink(room).then((ok) => {
									play(ok ? "tap" : "nope");
									setCopied(ok);
								});
							},
							className: "inline-flex min-h-11 items-center gap-2 rounded-full bg-bg/60 px-3 text-sm text-fg",
							children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-good" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "Link copied" : "Copy join link"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "good",
						className: "mt-4 w-full",
						disabled: !ready,
						onClick: () => {
							if (!chosen) {
								play("nope");
								return;
							}
							unlockAudio();
							if (lockBase(chosen)) play("lock");
							else play("nope");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rocket, { className: "size-4" }), chosen ? `Build our base at ${SITES_DATA.find((s) => s.id === chosen)?.short}` : "Choose a site first"]
					}),
					votes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-faint",
						children: "Build unlocks after at least one team sends a pick."
					})
				]
			})]
		})]
	});
}
async function copyLink(room) {
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
function TeamDeck({ team }) {
	const { state } = useRoom();
	const saved = activeVotes(state).find((row) => row.team === team)?.vote.choice ?? null;
	const [choice, setChoice] = (0, import_react.useState)(saved);
	(0, import_react.useEffect)(() => {
		if (!choice && saved) setChoice(saved);
	}, [choice, saved]);
	const Panel = team === "energy" ? EnergyPanel : team === "water" ? WaterPanel : team === "terrain" ? TerrainPanel : CommsPanel;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-start gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "rise",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LunarMap, {
				compact: true,
				selected: choice,
				onSelect: setChoice
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClueStack, { clues: CLUES[team] })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "rise-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				selected: choice,
				onSelect: setChoice
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoteDock, {
					team,
					state,
					choice,
					onChoice: setChoice
				})
			})]
		})]
	});
}
function Starfield() {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const stars = Array.from({ length: 90 }, () => ({
			x: Math.random(),
			y: Math.random(),
			z: Math.random(),
			r: Math.random() * 1.15 + .25
		}));
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let raf = 0;
		let running = true;
		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
				canvas.width = Math.floor(w * dpr);
				canvas.height = Math.floor(h * dpr);
			}
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			return {
				w,
				h
			};
		};
		const draw = (time) => {
			if (!running) return;
			const { w, h } = resize();
			ctx.clearRect(0, 0, w, h);
			for (const star of stars) {
				const twinkle = reduced ? .75 : .4 + Math.sin(time / 800 + star.z * 14) * .35;
				ctx.globalAlpha = Math.max(.15, twinkle);
				ctx.fillStyle = star.z > .86 ? "#3ee0ff" : "#d5e4ff";
				ctx.beginPath();
				ctx.arc(star.x * w, star.y * h, star.r, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.globalAlpha = 1;
			if (!reduced) raf = requestAnimationFrame(draw);
		};
		raf = requestAnimationFrame(draw);
		const onResize = () => {
			resize();
			if (reduced) draw(0);
		};
		window.addEventListener("resize", onResize);
		return () => {
			running = false;
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", onResize);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		"aria-hidden": true,
		className: "pointer-events-none fixed inset-0 h-full w-full"
	});
}
function Home() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: "/" });
	const room = search.room;
	const role = search.role;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Starfield, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hud-grid pointer-events-none fixed inset-0",
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "relative z-10 mx-auto w-full max-w-6xl px-4 py-5 md:px-6 md:py-8",
				children: room && role ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mission, {
					room,
					role,
					onRole: (next) => {
						navigate({ search: {
							room,
							role: next
						} });
					},
					onLeave: () => {
						play("tap");
						navigate({ search: {} });
					}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lobby, {
					initialRoom: room,
					onJoin: (nextRoom, nextRole) => {
						navigate({ search: {
							room: nextRoom,
							role: nextRole
						} });
					}
				})
			})
		]
	});
}
//#endregion
export { Home as component };
