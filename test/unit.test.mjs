import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseTitleRef, parseCopyRef, copyRef, episodeRef } from "../src/refs.js";
import { isAnime, toItem } from "../src/tmdb.js";
import { langFrom, bySubtitlePreference, skipOf } from "../src/megaplay.js";
import { slidesOf, tabOf, playedKey, recentOf } from "../src/browse/model.js";
import { pushOf, openArgs } from "../src/browse/detail.js";
import { KEYS, both } from "../src/i18n.js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

test("title refs round-trip and reject anything else", () => {
  assert.deepEqual(parseTitleRef("m:129"), { kind: "movie", id: 129 });
  assert.deepEqual(parseTitleRef("s:209867"), { kind: "series", id: 209867 });
  assert.deepEqual(parseTitleRef(episodeRef(37854, 23, 1180)), { kind: "episode", id: 37854, season: 23, episode: 1180 });
  assert.equal(parseTitleRef("m|603|tt|x|1999"), null);
  assert.equal(parseTitleRef("d:tv-popular"), null);
  assert.deepEqual(parseCopyRef(copyRef("dub", "e:1:1:2")), { audio: "dub", ref: "e:1:1:2" });
  assert.equal(parseCopyRef("x:fr:m:1"), null);
  assert.equal(parseCopyRef("x:dub:nothing"), null);
});

test("only Japanese animation counts as anime", () => {
  assert.equal(isAnime({ genre_ids: [16, 10759], original_language: "ja" }), true);
  assert.equal(isAnime({ genres: [{ id: 16 }], origin_country: ["JP"], original_language: "en" }), true);
  assert.equal(isAnime({ genre_ids: [16], original_language: "en" }), false); // Western animation
  assert.equal(isAnime({ genre_ids: [18], original_language: "ja" }), false); // live action
  assert.equal(isAnime(null), false);
});

test("items carry Kino-safe ids and https art", () => {
  const item = toItem({ id: 129, title: "El viaje de Chihiro", release_date: "2001-07-20", poster_path: "/a.jpg", backdrop_path: "/b.jpg", vote_average: 8.5, vote_count: 900 }, "movie");
  assert.match(item.id, /^[A-Za-z0-9._~-]{1,128}$/);
  assert.equal(item.ref, "m:129");
  assert.equal(item.year, 2001);
  assert.match(item.poster, /^https:\/\/image\.tmdb\.org\/t\/p\/w342\/a\.jpg$/);
  assert.match(item.backdrop, /^https:/);
});

test("subtitle languages come from Megaplay's file names, the person's first", () => {
  assert.equal(langFrom("https://x.mysubsplay.com/a/subtitles/spa-5.vtt"), "es");
  assert.equal(langFrom("https://x/subtitles/chi-26.vtt"), "zh");
  assert.equal(langFrom("https://x/subtitles/thumbnails.vtt"), "und");
  const subs = ["ar", "zh", "en", "es", "pt"].map((lang) => ({ lang, url: lang }));
  assert.deepEqual(bySubtitlePreference(subs, "es").map((s) => s.lang), ["es", "en", "ar", "zh", "pt"]);
  assert.deepEqual(bySubtitlePreference(subs, "en").map((s) => s.lang), ["en", "es", "ar", "zh", "pt"]);
});

test("Megaplay's intro and outro become the Stream's skip marks", () => {
  assert.deepEqual(skipOf({ intro: { start: 0, end: 89 }, outro: { start: 1460, end: 1549 } }), { openingStartMs: 0, openingEndMs: 89000, endingStartMs: 1460000 });
  assert.equal(skipOf({ intro: { start: 0, end: 0 }, outro: { start: 0, end: 0 } }), null);
});

test("slides need a backdrop and a synopsis; tabs without rows are null", () => {
  const rows = [{ id: "r", title: "R", items: [
    { id: "s-1", ref: "s:1", kind: "series", title: "A", backdrop: "https://i/b.jpg", overview: "x".repeat(400), ids: { tmdb: 1 } },
    { id: "s-2", ref: "s:2", kind: "series", title: "B", overview: "no picture" },
  ] }];
  const slides = slidesOf(rows);
  assert.equal(slides.length, 1);
  assert.ok(slides[0].text.length <= 160);
  assert.equal(slides[0].tmdb, 1);
  assert.equal(tabOf({ rows: [] }), null);
});

test("continue watching finds episodes by their series", () => {
  assert.equal(playedKey("e:209867:1:3"), "t:209867");
  const tabs = [{ rails: [{ items: [{ id: "s-209867", ref: "s:209867", ids: { tmdb: 209867 } }] }] }];
  assert.deepEqual(recentOf(["t:209867"], tabs).map((c) => c.id), ["s-209867"]);
});

test("a card's open args push its title page", () => {
  const args = openArgs({ id: "s-1", ref: "s:1", kind: "series", title: "Frieren", year: 2023 });
  const route = pushOf(JSON.stringify(args));
  assert.equal(route.push, "detail");
  assert.equal(route.params.d, 1);
  assert.equal(pushOf("{bad"), null);
});

test("every text exists in Spanish and English", () => {
  assert.deepEqual([...KEYS.es].sort(), [...KEYS.en].sort());
  assert.equal(both("dSeasonsN", { n: 3 }).en, "3 seasons");
});

test("the manifest's settings have English texts", () => {
  const m = JSON.parse(readFileSync(join(ROOT, "kino-plugin.json"), "utf8"));
  for (const s of m.settings) {
    assert.ok(s.labelEn, s.key);
    if (s.hint) assert.ok(s.hintEn, s.key);
  }
});

test("the committed plugin.js is a fresh build of src/", () => {
  const dir = mkdtempSync(join(tmpdir(), "megaplay-build-"));
  try {
    const out = join(dir, "plugin.js");
    execFileSync(process.execPath, [join(ROOT, "node_modules", "esbuild", "bin", "esbuild"), join(ROOT, "src", "plugin.js"), "--bundle", "--format=esm", "--target=es2020", "--loader:.png=dataurl", `--outfile=${out}`, "--log-level=error"], { cwd: ROOT });
    const norm = (s) => s.replace(/\r\n/g, "\n");
    assert.equal(norm(readFileSync(out, "utf8")), norm(readFileSync(join(ROOT, "plugin.js"), "utf8")), "run npm run build");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("the Home rows are all typed anime and the airing row leads", async () => {
  const keep = globalThis.kino;
  globalThis.kino = { lang: "es", log() {}, error: (c, m) => new Error(m), tmdb: async () => ({ page: 1, total_pages: 1, results: [{ id: 1, name: "A", original_language: "ja", genre_ids: [16], poster_path: "/a.jpg" }] }) };
  try {
    const { HOME_ROWS, buildRows } = await import("../src/catalog.js");
    const rows = await buildRows(HOME_ROWS);
    assert.equal(rows[0].id, "tv-airing");
    assert.ok(rows.length >= 2);
    for (const r of rows) assert.equal(r.genre, "anime", r.id);
  } finally { globalThis.kino = keep; }
});
