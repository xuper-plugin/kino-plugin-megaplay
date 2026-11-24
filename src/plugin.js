// Megaplay: Japanese animation, series and movies. The catalog is TMDB through Kino's own key (kino.tmdb), limited to
// Japanese animation; the episodes come from Megaplay by AniList id and episode number.
//
// Exports Kino calls: search, home, browse, section, categories, episodes, resolve, the screen's screen and screenEvent, and
// the settings form's action. Refs: see refs.js. `npm run build` bundles this folder into the single plugin.js Kino loads.
import { catalogDoor } from "./door.js";
import { t } from "./i18n.js";
import { searchAnime, seriesEpisodes } from "./tmdb.js";
import { HOME_ROWS, buildRows, browsePage, sectionPage, categoryTiles } from "./catalog.js";
import { parseTitleRef } from "./refs.js";
import { resolveRef } from "./resolve.js";
import { readSettings } from "./settings.js";
import { makeBrowse } from "./browse/index.js";

const tmdbFailure = (e) => (e && ["timeout", "network", "unavailable", "rate_limited"].includes(e.code)
  ? kino.error("unavailable", "tmdb: " + e.code, { userMessage: t("tmdbDown") })
  : e);

/** `search(query)`: Japanese animation matching the words; the kind Kino leans to goes first. */
// The catalog door (Kino protocol, apiVersion 20 through enhancements): Da-Video and the author's other plugins find titles here.
export const proto_catalog_search = catalogDoor(search);

export async function search(query) {
  const q = typeof query === "string" ? query : (query && query.q) || "";
  let items;
  try {
    items = await searchAnime(kino.rank.shortQuery(q));
  } catch (e) {
    throw tmdbFailure(e);
  }
  const sorted = kino.rank.sortBySimilarity(items, q);
  const lean = query && (query.type === "movie" || query.type === "series") ? query.type : null;
  return lean ? [...sorted.filter((i) => i.kind === lean), ...sorted.filter((i) => i.kind !== lean)] : sorted;
}

/** `home()`: three rows on Kino's Inicio, unless the person turned them off. */
export async function home() {
  if (!readSettings().homeRows) return [];
  return buildRows(HOME_ROWS);
}

/** `browse(ref, cursor)`: a row's "Ver más" page or a category tile. */
export async function browse(ref, cursor) {
  try {
    return await browsePage(ref, cursor);
  } catch (e) {
    throw tmdbFailure(e);
  }
}

/** `section({ tab })`: the plugin's own section in Kino -- Inicio, Series, Películas. */
export async function section(arg) {
  return sectionPage(arg && arg.tab);
}

/** `categories()`: genre tiles for Kino's Categorías. */
export async function categories() {
  return categoryTiles();
}

/** `episodes(ref)`: a series' episodes from TMDB. */
export async function episodes(ref) {
  const r = parseTitleRef(ref);
  if (!r || r.kind !== "series") throw kino.error("not_found", "not a series ref");
  try {
    return await seriesEpisodes(r.id);
  } catch (e) {
    throw tmdbFailure(e);
  }
}

/** `resolve(ref)`: the episode or movie from Megaplay; a play that found a copy goes to "Continuar viendo". */
export async function resolve(ref) {
  const out = await resolveRef(ref);
  try { browseScreen().notePlayed(String(ref)); } catch (_) { /* never fails a play */ }
  return out;
}

// ---------- the browse screen (Kino 0.9.74+, through the manifest's enhancements) ----------

let browseInstance = null;
const browseScreen = () => (browseInstance ??= makeBrowse({
  kino,
  loadTab: (tab) => sectionPage(tab),
  searchTitles: (q) => search({ q }),
}));

/** `screen(ctx)`: the plugin's own screen (a pure view: it draws what it holds and never waits for TMDB). */
export async function screen(ctx) {
  await null;
  return browseScreen().view(ctx && typeof ctx === "object" ? ctx : {});
}

/** `screenEvent(ev)`: the screen's events (its timers load a tab, a title or a search, one per call). */
export async function screenEvent(ev) {
  await null;
  return browseScreen().event(ev && typeof ev === "object" ? ev : {});
}

// ---------- settings form ----------

/** Only what can be fetched again: the kept tabs, the AniList matches and the title logos. */
function clearCache() {
  let n = 0;
  for (const key of kino.storage.keys()) {
    if (["browse1:", "ani1:", "logo1"].some((p) => key.startsWith(p))) { kino.storage.remove(key); n++; }
  }
  return { message: t("cacheCleared", { n }) };
}

/** `action(key)`: the form's buttons. */
export async function action(key) {
  if (key === "clearCache") return clearCache();
  return null;
}
