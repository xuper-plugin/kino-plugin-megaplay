// The catalog: rows of Japanese animation from TMDB's discover lists. Each row is one kino.tmdb call; its `ref` (`d:<row id>`)
// pages it in "Ver más". The tabs of the section and of the screen are built from the same rows.
import { t, both } from "./i18n.js";
import { tmdb, toItem, ANIMATION } from "./tmdb.js";

const ANIME = { with_original_language: "ja", sort_by: "popularity.desc" };
const MAX_PAGE = 500; // TMDB serves at most 500 pages

const isoDay = (offsetDays) => new Date(Date.now() + offsetDays * 86400000).toISOString().slice(0, 10);

/**
 * Every row: `kind` ("tv" or "movie"), the TMDB genres it needs besides Animation, its extra discover filters and its title key.
 * Filters that depend on today are functions.
 */
export const ROWS = {
  "tv-popular": { kind: "tv", title: "rowPopular" },
  "tv-popular2": { kind: "tv", title: "rowSeriesPopular" },
  "tv-airing": { kind: "tv", title: "rowAiring", extra: () => ({ "air_date.gte": isoDay(-7), "air_date.lte": isoDay(7) }) },
  "tv-top": { kind: "tv", title: "rowTopSeries", extra: () => ({ sort_by: "vote_average.desc", "vote_count.gte": "400" }) },
  "tv-action": { kind: "tv", genres: [10759], title: "rowAction" },
  "tv-comedy": { kind: "tv", genres: [35], title: "rowComedy" },
  "tv-drama": { kind: "tv", genres: [18], title: "rowDrama" },
  "tv-fantasy": { kind: "tv", genres: [10765], title: "rowFantasy" },
  "tv-mystery": { kind: "tv", genres: [9648], title: "rowMystery" },
  "tv-family": { kind: "tv", genres: [10751], title: "rowFamily" },
  "movie-popular": { kind: "movie", title: "rowMovies" },
  "movie-popular2": { kind: "movie", title: "rowMoviesPopular" },
  "movie-top": { kind: "movie", title: "rowTopMovies", extra: () => ({ sort_by: "vote_average.desc", "vote_count.gte": "300" }) },
  "movie-new": { kind: "movie", title: "rowNewMovies", extra: () => ({ "primary_release_date.gte": isoDay(-730), "primary_release_date.lte": isoDay(0) }) },
  "movie-action": { kind: "movie", genres: [28], title: "rowAction" },
  "movie-adventure": { kind: "movie", genres: [12], title: "rowAdventure" },
  "movie-fantasy": { kind: "movie", genres: [14], title: "rowFantasy" },
  "movie-romance": { kind: "movie", genres: [10749], title: "rowRomance" },
  "movie-scifi": { kind: "movie", genres: [878], title: "rowScifi" },
  "movie-drama": { kind: "movie", genres: [18], title: "rowDrama" },
  "movie-family": { kind: "movie", genres: [10751], title: "rowFamily" },
  "movie-horror": { kind: "movie", genres: [27], title: "rowHorror" },
};

/** The tabs, each a list of row ids. Kino's limit of 20 kino.tmdb calls every 10 s bounds how many rows a tab can ask at once. */
export const TABS = {
  inicio: ["tv-popular", "tv-airing", "movie-popular", "tv-top", "movie-top"],
  series: ["tv-popular2", "tv-airing", "tv-action", "tv-fantasy", "tv-comedy", "tv-drama", "tv-mystery"],
  peliculas: ["movie-popular2", "movie-new", "movie-top", "movie-action", "movie-adventure", "movie-romance", "movie-family"],
};
export const TAB_IDS = Object.keys(TABS);
const TAB_KEYS = { inicio: "tabHome", series: "tabSeries", peliculas: "tabMovies" };
export const HOME_ROWS = ["tv-popular", "tv-airing", "movie-popular"];

/** One page of row [id] as `{ items, next }`. */
export async function rowPage(id, page = 1) {
  const row = ROWS[id];
  if (!row) return { items: [] };
  const params = { ...ANIME, with_genres: [ANIMATION, ...(row.genres || [])].join(","), ...(row.extra ? row.extra() : {}), page: String(page) };
  const data = await tmdb(`/discover/${row.kind}`, params);
  const kind = row.kind === "movie" ? "movie" : "series";
  return {
    items: (data.results || []).filter((m) => !m.adult).map((m) => toItem(m, kind)),
    next: data.page < Math.min(data.total_pages || 0, MAX_PAGE) ? String(data.page + 1) : undefined,
  };
}

/** Rows [ids] as Kino rows, each with its "Ver más" ref; a row that fails or is empty is left out. */
export async function buildRows(ids) {
  const pages = await Promise.all(ids.map((id) => rowPage(id).catch((e) => {
    kino.log("[megaplay] row", id, (e && e.code) || "error");
    return null;
  })));
  return ids.map((id, i) => (pages[i] && pages[i].items.length
    ? { id, title: t(ROWS[id].title), ref: `d:${id}`, genre: "anime", items: pages[i].items }
    : null)).filter(Boolean);
}

/** `browse(ref, cursor)`: a row's next page. */
export async function browsePage(ref, cursor) {
  const m = /^d:([a-z0-9-]+)$/.exec(String(ref || ""));
  if (!m || !ROWS[m[1]]) return { items: [] };
  return rowPage(m[1], cursor ? Math.max(1, Number(cursor) || 1) : 1);
}

/** The tabs as Kino's section draws them. */
export const tabList = () => TAB_IDS.map((id) => ({ id, label: t(TAB_KEYS[id]) }));
/** A tab's label in both languages (the screen's TabBar). */
export const tabLabel = (id) => both(TAB_KEYS[id]);

/** `section({ tab })`: a tab's rows, with the first title that has a backdrop and a synopsis as the hero. */
export async function sectionPage(tab) {
  const chosen = TABS[tab] ? tab : "inicio";
  const rows = await buildRows(TABS[chosen]);
  const out = { tabs: tabList(), tab: chosen, rows };
  const star = rows.flatMap((r) => r.items).find((i) => i.backdrop && i.overview);
  if (star) out.hero = { title: star.title, text: star.overview.length > 300 ? star.overview.slice(0, 299) + "…" : star.overview, image: star.backdrop };
  return out;
}

// Category tiles: a well-known title of each genre as the art (TMDB backdrops at w780, picked by hand). Static on purpose, so
// Kino's Categorías paints at once; a path that stops answering costs one tile its picture.
const ART = "https://image.tmdb.org/t/p/w780";
const TILES = [
  ["tv-action", "/z0YhJvomqedHF85bplUJEotkN5l.jpg"], // Naruto Shippūden
  ["tv-fantasy", "/rBOnrVlck7BIlGeWVlzYiZeg4l2.jpg"], // Frieren
  ["tv-comedy", "/2rmK7mnchw9Xr3XdiTFSxTTLXqv.jpg"], // One Piece
  ["tv-drama", "/2UG177tWHy7xRmMKWJHB7nAUmKd.jpg"], // Fullmetal Alchemist: Brotherhood
  ["tv-mystery", "/koBa94NxTaGe2FoDzlXMuJptsv0.jpg"], // Death Note
  ["tv-family", "/6oVBODwFvbDJczBFlf4J930jKZg.jpg"], // Doraemon
  ["tv-top", "/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg"], // Attack on Titan
  ["tv-airing", "/3US5UXJSStOVozc6EwhGSMDguol.jpg"], // Jujutsu Kaisen
  ["movie-action", "/fK40VGYIm7hmKrLJ26fgPQU0qRG.jpg"], // Akira
  ["movie-adventure", "/nv5wwZou159v5OC61i4ElR7OqyY.jpg"], // Howl's Moving Castle
  ["movie-fantasy", "/m4TUa2ciEWSlk37rOsjiSIvZDXE.jpg"], // Spirited Away
  ["movie-romance", "/mMtUybQ6hL24FXo0F3Z4j2KG7kZ.jpg"], // Your Name.
  ["movie-scifi", "/jIpagj2Dud9g3ZVJFvaWikEWsYz.jpg"], // Ghost in the Shell
  ["movie-drama", "/5lAMQMWpXMsirvtLLvW7cJgEPkU.jpg"], // A Silent Voice
  ["movie-family", "/zkThiZAaAie8Lw7RAc5yPTOewBV.jpg"], // My Neighbor Totoro
  ["movie-horror", "/mHG7dpLb0ZScSY3LpP443IHRmjy.jpg"], // Perfect Blue
];

/** `categories()`: one tile per genre row, series first. */
export function categoryTiles() {
  return TILES.map(([id, art]) => ({
    id,
    title: t(ROWS[id].kind === "movie" ? "catMovies" : "catSeries", { g: t(ROWS[id].title) }).slice(0, 40),
    ref: `d:${id}`,
    art: ART + art,
  }));
}
