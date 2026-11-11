import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { _ as mergeState, p as emptyState, v as sanitize } from "./model-CNNHFNAS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/room.functions-Bgl2ogOS.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
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
var pullRoom_createServerFn_handler = createServerRpc({
	id: "49482b1beba812af0020afce34a29ae6488ebb4908906cdfa6e8bf398304556b",
	name: "pullRoom",
	filename: "src/lib/moon/room.functions.ts"
}, (opts) => pullRoom.__executeServer(opts));
var pullRoom = createServerFn({ method: "GET" }).validator((input) => ({ code: readCode(input) })).handler(pullRoom_createServerFn_handler, async ({ data }) => {
	const { getSql } = await import("./db-BJlmR-Se.mjs");
	const rows = await (await getSql())`select payload from moon_rooms where code = ${data.code}`;
	if (!rows[0]) return emptyState();
	try {
		return sanitize(JSON.parse(rows[0].payload));
	} catch {
		return emptyState();
	}
});
var pushRoom_createServerFn_handler = createServerRpc({
	id: "9a23e808307e3bc4756ec9e57b63bfc4ad19bf34fdb3181987cfe1cb3786f78e",
	name: "pushRoom",
	filename: "src/lib/moon/room.functions.ts"
}, (opts) => pushRoom.__executeServer(opts));
var pushRoom = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input !== "object" || input === null || !("state" in input)) throw new Error("Missing room state");
	return {
		code: readCode(input),
		state: sanitize(input.state)
	};
}).handler(pushRoom_createServerFn_handler, async ({ data }) => {
	const { getSql } = await import("./db-BJlmR-Se.mjs");
	const sql = await getSql();
	const rows = await sql`select payload from moon_rooms where code = ${data.code}`;
	let prev = emptyState();
	if (rows[0]) try {
		prev = sanitize(JSON.parse(rows[0].payload));
	} catch {
		prev = emptyState();
	}
	const next = mergeState(prev, data.state);
	const payload = JSON.stringify(next);
	if (rows[0]) await sql`update moon_rooms set payload = ${payload}, updated_at = now() where code = ${data.code}`;
	else await sql`insert into moon_rooms (code, payload) values (${data.code}, ${payload})`;
	return next;
});
//#endregion
export { pullRoom_createServerFn_handler, pushRoom_createServerFn_handler };
