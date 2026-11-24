// Home snapshot: writes home/index.json and home/<tab>.json from this plugin's own tabs (catalog.js sectionPage), in the shape
// Da-Video reads for its Contenido tab (the same files the std plugins' snapshot writes). Megaplay keeps its own screen; its
// catalog is TMDB already, so every card carries its TMDB id, backdrop and synopsis, and a hidden "slides" row holds the slider.
// Run by .github/workflows/home-snapshot.yml every 6 hours with the repository's KINO_TMDB_KEY (the kit's kino.tmdb reads it).
// A tab that fails or comes back empty keeps its previous file; unchanged rows younger than KEEP_MS are not rewritten.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createKino } from "../sdk/kino-shim.mjs";

const ROOT = new URL("../", import.meta.url);
const manifest = JSON.parse(readFileSync(new URL("kino-plugin.json", ROOT), "utf8"));
const { kino } = createKino(manifest, { lang: "es-CO", device: "phone" });
globalThis.kino = kino;
const { sectionPage, TAB_IDS, tabLabel } = await import(new URL("src/catalog.js", ROOT).href);

const MAX_SLIDES = 6;
const KEEP_MS = 12 * 60 * 60 * 1000;
const dir = new URL("home/", ROOT);
mkdirSync(dir, { recursive: true });

const card = (i) => {
  const c = { id: i.id, ref: i.ref, title: i.title, kind: i.kind };
  for (const k of ["poster", "backdrop", "year", "rating", "overview"]) if (i[k] !== undefined && i[k] !== "" && i[k] !== null) c[k] = k === "year" ? String(i[k]) : i[k];
  if (Number.isInteger(i.tmdb) && i.tmdb > 0) c.ids = { tmdb: i.tmdb };
  return c;
};

let usable = 0;
for (const tab of TAB_IDS) {
  const file = new URL(tab + ".json", dir);
  const old = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
  let page = null;
  try { page = await sectionPage(tab); } catch (e) { console.log(`${tab}: ${(e && e.code) || ""} ${String((e && e.message) || e).slice(0, 120)}`); }
  const rows = (page && Array.isArray(page.rows) ? page.rows : [])
    .filter((r) => r && Array.isArray(r.items) && r.items.length > 0)
    .map((r) => ({ id: r.id, title: r.title, ...(r.titleEn ? { titleEn: r.titleEn } : {}), ...(r.ref ? { ref: r.ref } : {}), items: r.items.map(card) }));
  if (rows.length === 0) { console.log(`${tab}: nothing, the previous file stays`); if (old) usable++; continue; }
  const seen = new Set();
  const slides = rows.flatMap((r) => r.items).filter((i) => i.backdrop && i.overview && !seen.has(i.id) && seen.add(i.id)).slice(0, MAX_SLIDES);
  const all = slides.length ? [{ id: "slides", title: "Destacados", hidden: true, items: slides }, ...rows] : rows;
  usable++;
  if (old && JSON.stringify(old.rows) === JSON.stringify(all) && Date.now() - Number(old.at) < KEEP_MS) { console.log(`${tab}: unchanged`); continue; }
  writeFileSync(file, JSON.stringify({ v: 1, tab, at: Date.now(), rows: all }) + "\n");
  console.log(`${tab}: ${rows.length} rows, ${slides.length} slides`);
}
const index = { v: 1, tabs: TAB_IDS.map((id) => { const l = tabLabel(id); return { id, label: l.es, labelEn: l.en }; }) };
writeFileSync(new URL("index.json", dir), JSON.stringify(index) + "\n");
if (usable === 0) { console.error("no tab usable"); process.exit(1); }
