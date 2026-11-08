// src/i18n.js
var WORDS = {
  es: {
    // catalog rows
    rowPopular: "Populares ahora",
    rowAiring: "En emisi\xF3n",
    rowTopSeries: "Series mejor valoradas",
    rowMovies: "Pel\xEDculas de anime",
    rowTopMovies: "Pel\xEDculas mejor valoradas",
    rowNewMovies: "Pel\xEDculas recientes",
    rowSeriesPopular: "Series populares",
    rowMoviesPopular: "Pel\xEDculas populares",
    rowAction: "Acci\xF3n y aventura",
    rowComedy: "Comedia",
    rowDrama: "Drama",
    rowFantasy: "Fantas\xEDa y ciencia ficci\xF3n",
    rowMystery: "Misterio",
    rowFamily: "Para toda la familia",
    rowRomance: "Romance",
    rowAdventure: "Aventura",
    rowScifi: "Ciencia ficci\xF3n",
    rowHorror: "Terror",
    // tabs
    tabHome: "Inicio",
    tabSeries: "Series",
    tabMovies: "Pel\xEDculas",
    // categories
    catSeries: "Series: {g}",
    catMovies: "Pel\xEDculas: {g}",
    // resolve
    notFound: "Megaplay no tiene este episodio.",
    notAnime: "Megaplay solo tiene anime.",
    tmdbDown: "El cat\xE1logo no responde ahora. Intenta de nuevo en un rato.",
    sub: "Subtitulado",
    dub: "Doblado",
    // settings actions
    cacheCleared: "Listo: se borraron {n} datos guardados.",
    // browse screen
    brWatch: "Ver",
    brInfo: "M\xE1s informaci\xF3n",
    brMore: "Ver m\xE1s",
    brRecent: "Continuar viendo",
    brSearch: "Buscar",
    brSearchHint: "Buscar anime",
    brSearchTitle: "Buscar",
    brSearchedBefore: "Buscado recientemente",
    brNoResults: "No encontramos anime con esas palabras.",
    brSearchFailed: "No se pudo buscar. Revisa tu conexi\xF3n e int\xE9ntalo de nuevo.",
    brFailed: "No se pudo cargar esta secci\xF3n. Revisa tu conexi\xF3n e int\xE9ntalo de nuevo.",
    brRetry: "Reintentar",
    brEmpty: "A\xFAn no hay nada aqu\xED.",
    brBack: "Atr\xE1s",
    brClose: "Cerrar",
    brSettings: "Configuraci\xF3n",
    // title page
    dEpisodeN: "Episodio {n}",
    dSeasonN: "Temporada {n}",
    dSeasonsN: "{n} temporadas",
    dSeasonOne: "1 temporada",
    dSeriesGo: "Ver episodios",
    dMore: "M\xE1s opciones",
    dCreators: "Creaci\xF3n: {v}",
    dDirector: "Direcci\xF3n: {v}",
    dCast: "Reparto",
    dEpisodes: "Episodios",
    dSimilar: "M\xE1s como esto",
    dSeeInKino: "Ver en Kino"
  },
  en: {
    rowPopular: "Popular now",
    rowAiring: "Airing now",
    rowTopSeries: "Top rated series",
    rowMovies: "Anime movies",
    rowTopMovies: "Top rated movies",
    rowNewMovies: "Recent movies",
    rowSeriesPopular: "Popular series",
    rowMoviesPopular: "Popular movies",
    rowAction: "Action and adventure",
    rowComedy: "Comedy",
    rowDrama: "Drama",
    rowFantasy: "Fantasy and sci-fi",
    rowMystery: "Mystery",
    rowFamily: "For the whole family",
    rowRomance: "Romance",
    rowAdventure: "Adventure",
    rowScifi: "Science fiction",
    rowHorror: "Horror",
    tabHome: "Home",
    tabSeries: "Series",
    tabMovies: "Movies",
    catSeries: "Series: {g}",
    catMovies: "Movies: {g}",
    notFound: "Megaplay does not have this episode.",
    notAnime: "Megaplay only has anime.",
    tmdbDown: "The catalog is not answering right now. Try again in a while.",
    sub: "Subtitled",
    dub: "Dubbed",
    cacheCleared: "Done: {n} saved items were cleared.",
    brWatch: "Watch",
    brInfo: "More info",
    brMore: "See more",
    brRecent: "Continue watching",
    brSearch: "Search",
    brSearchHint: "Search anime",
    brSearchTitle: "Search",
    brSearchedBefore: "Recently searched",
    brNoResults: "No anime matched those words.",
    brSearchFailed: "The search failed. Check your connection and try again.",
    brFailed: "This section could not be loaded. Check your connection and try again.",
    brRetry: "Retry",
    brEmpty: "Nothing here yet.",
    brBack: "Back",
    brClose: "Close",
    brSettings: "Settings",
    dEpisodeN: "Episode {n}",
    dSeasonN: "Season {n}",
    dSeasonsN: "{n} seasons",
    dSeasonOne: "1 season",
    dSeriesGo: "Watch episodes",
    dMore: "More options",
    dCreators: "Created by: {v}",
    dDirector: "Directed by: {v}",
    dCast: "Cast",
    dEpisodes: "Episodes",
    dSimilar: "More like this",
    dSeeInKino: "Open in Kino"
  }
};
var fill = (text, vars) => String(text).replace(/\{(\w+)\}/g, (m, k) => vars && vars[k] != null ? String(vars[k]) : m);
function langOf(kino2 = globalThis.kino) {
  return String(kino2 && kino2.lang || "").toLowerCase().startsWith("en") ? "en" : "es";
}
function t(key, vars, kino2 = globalThis.kino) {
  const words = WORDS[langOf(kino2)];
  return fill(words[key] ?? WORDS.es[key] ?? key, vars);
}
function both(key, vars) {
  return { es: fill(WORDS.es[key] ?? key, vars), en: fill(WORDS.en[key] ?? WORDS.es[key] ?? key, vars) };
}
var KEYS = { es: Object.keys(WORDS.es), en: Object.keys(WORDS.en) };

// src/refs.js
var movieRef = (id) => `m:${id}`;
var seriesRef = (id) => `s:${id}`;
var episodeRef = (id, season, episode) => `e:${id}:${season}:${episode}`;
var copyRef = (audio, ref) => `x:${audio}:${ref}`;
function parseTitleRef(ref) {
  const r = String(ref || "");
  let m = /^([ms]):(\d{1,10})$/.exec(r);
  if (m) return { kind: m[1] === "m" ? "movie" : "series", id: Number(m[2]) };
  m = /^e:(\d{1,10}):(\d{1,3}):(\d{1,5})$/.exec(r);
  if (m) return { kind: "episode", id: Number(m[1]), season: Number(m[2]), episode: Number(m[3]) };
  return null;
}
function parseCopyRef(ref) {
  const m = /^x:(sub|dub):(.+)$/.exec(String(ref || ""));
  return m && parseTitleRef(m[2]) ? { audio: m[1], ref: m[2] } : null;
}

// src/tmdb.js
var IMG = "https://image.tmdb.org/t/p/";
var ANIMATION = 16;
async function tmdb(path, params = {}) {
  await null;
  if (typeof kino.tmdb !== "function") {
    throw kino.error("unavailable", "kino.tmdb missing (Kino older than 0.9.53)", { userMessage: t("tmdbDown") });
  }
  return kino.tmdb(path, { language: langOf() === "en" ? "en-US" : "es-MX", ...params });
}
function isAnime(m) {
  if (!m) return false;
  const genres = m.genre_ids || (m.genres || []).map((g) => g.id);
  return genres.includes(ANIMATION) && (m.original_language === "ja" || (m.origin_country || []).includes("JP"));
}
var img = (size, path) => typeof path === "string" && path.startsWith("/") ? IMG + size + path : void 0;
var yearOf = (d) => typeof d === "string" && /^\d{4}/.test(d) ? Number(d.slice(0, 4)) : void 0;
function toItem(m, kind) {
  const isMovie = kind ? kind === "movie" : m.media_type === "movie";
  const item = {
    // Kino takes only A-Z a-z 0-9 . _ ~ - in an id.
    id: `${isMovie ? "m" : "s"}-${m.id}`,
    ref: isMovie ? movieRef(m.id) : seriesRef(m.id),
    title: m.title || m.name || "",
    kind: isMovie ? "movie" : "series",
    ids: { tmdb: m.id }
  };
  const year = yearOf(m.release_date || m.first_air_date);
  if (year) item.year = year;
  const poster = img("w342", m.poster_path);
  if (poster) item.poster = poster;
  const backdrop = img("w780", m.backdrop_path);
  if (backdrop) item.backdrop = backdrop;
  if (m.overview) item.overview = m.overview;
  if (typeof m.vote_average === "number" && m.vote_count > 20) item.rating = Math.round(m.vote_average * 10) / 10;
  const original = m.original_title || m.original_name;
  if (original && original !== item.title) item.originalTitle = original;
  return item;
}
async function searchAnime(query) {
  const data = await tmdb("/search/multi", { query });
  return (data.results || []).filter((m) => (m.media_type === "movie" || m.media_type === "tv") && isAnime(m) && !m.adult).map((m) => toItem(m));
}
async function seriesEpisodes(id) {
  const show = await tmdb(`/tv/${id}`);
  const seasons = (show.seasons || []).filter((s) => s.season_number > 0);
  const batches = [];
  for (let i = 0; i < seasons.length; i += 20) batches.push(seasons.slice(i, i + 20));
  const answers = await Promise.all(batches.map((b) => tmdb(`/tv/${id}`, { append_to_response: b.map((s) => `season/${s.season_number}`).join(",") })));
  const fetched = batches.flatMap((b, i) => b.map((s) => answers[i][`season/${s.season_number}`] || {}));
  const episodes2 = fetched.flatMap((sd, i) => (sd.episodes || []).map((ep) => {
    const out = { season: seasons[i].season_number, number: ep.episode_number, ref: episodeRef(id, seasons[i].season_number, ep.episode_number) };
    if (ep.name) out.title = ep.name;
    const still = img("w300", ep.still_path);
    if (still) out.still = still;
    if (ep.overview) out.overview = ep.overview;
    if (/^\d{4}-\d{2}-\d{2}$/.test(ep.air_date || "")) out.airDate = ep.air_date;
    if (ep.runtime > 0) out.runtimeMinutes = ep.runtime;
    return out;
  }));
  return {
    series: {
      title: show.name,
      ...img("w342", show.poster_path) ? { poster: img("w342", show.poster_path) } : {},
      ...img("w780", show.backdrop_path) ? { backdrop: img("w780", show.backdrop_path) } : {},
      ...show.overview ? { overview: show.overview } : {},
      ids: { tmdb: Number(id) }
    },
    episodes: episodes2
  };
}

// src/catalog.js
var ANIME = { with_original_language: "ja", sort_by: "popularity.desc" };
var MAX_PAGE = 500;
var isoDay = (offsetDays) => new Date(Date.now() + offsetDays * 864e5).toISOString().slice(0, 10);
var ROWS = {
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
  "movie-horror": { kind: "movie", genres: [27], title: "rowHorror" }
};
var TABS = {
  inicio: ["tv-popular", "tv-airing", "movie-popular", "tv-top", "movie-top"],
  series: ["tv-popular2", "tv-airing", "tv-action", "tv-fantasy", "tv-comedy", "tv-drama", "tv-mystery"],
  peliculas: ["movie-popular2", "movie-new", "movie-top", "movie-action", "movie-adventure", "movie-romance", "movie-family"]
};
var TAB_IDS = Object.keys(TABS);
var TAB_KEYS = { inicio: "tabHome", series: "tabSeries", peliculas: "tabMovies" };
var HOME_ROWS = ["tv-popular", "tv-airing", "movie-popular"];
async function rowPage(id, page = 1) {
  const row = ROWS[id];
  if (!row) return { items: [] };
  const params = { ...ANIME, with_genres: [ANIMATION, ...row.genres || []].join(","), ...row.extra ? row.extra() : {}, page: String(page) };
  const data = await tmdb(`/discover/${row.kind}`, params);
  const kind = row.kind === "movie" ? "movie" : "series";
  return {
    items: (data.results || []).filter((m) => !m.adult).map((m) => toItem(m, kind)),
    next: data.page < Math.min(data.total_pages || 0, MAX_PAGE) ? String(data.page + 1) : void 0
  };
}
async function buildRows(ids) {
  const pages = await Promise.all(ids.map((id) => rowPage(id).catch((e) => {
    kino.log("[megaplay] row", id, e && e.code || "error");
    return null;
  })));
  return ids.map((id, i) => pages[i] && pages[i].items.length ? { id, title: t(ROWS[id].title), ref: `d:${id}`, genre: "anime", items: pages[i].items } : null).filter(Boolean);
}
async function browsePage(ref, cursor) {
  const m = /^d:([a-z0-9-]+)$/.exec(String(ref || ""));
  if (!m || !ROWS[m[1]]) return { items: [] };
  return rowPage(m[1], cursor ? Math.max(1, Number(cursor) || 1) : 1);
}
var tabList = () => TAB_IDS.map((id) => ({ id, label: t(TAB_KEYS[id]) }));
var tabLabel = (id) => both(TAB_KEYS[id]);
async function sectionPage(tab) {
  const chosen = TABS[tab] ? tab : "inicio";
  const rows = await buildRows(TABS[chosen]);
  const out = { tabs: tabList(), tab: chosen, rows };
  const star = rows.flatMap((r) => r.items).find((i) => i.backdrop && i.overview);
  if (star) out.hero = { title: star.title, text: star.overview.length > 300 ? star.overview.slice(0, 299) + "\u2026" : star.overview, image: star.backdrop };
  return out;
}
var ART = "https://image.tmdb.org/t/p/w780";
var TILES = [
  ["tv-action", "/z0YhJvomqedHF85bplUJEotkN5l.jpg"],
  // Naruto Shippūden
  ["tv-fantasy", "/rBOnrVlck7BIlGeWVlzYiZeg4l2.jpg"],
  // Frieren
  ["tv-comedy", "/2rmK7mnchw9Xr3XdiTFSxTTLXqv.jpg"],
  // One Piece
  ["tv-drama", "/2UG177tWHy7xRmMKWJHB7nAUmKd.jpg"],
  // Fullmetal Alchemist: Brotherhood
  ["tv-mystery", "/koBa94NxTaGe2FoDzlXMuJptsv0.jpg"],
  // Death Note
  ["tv-family", "/6oVBODwFvbDJczBFlf4J930jKZg.jpg"],
  // Doraemon
  ["tv-top", "/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg"],
  // Attack on Titan
  ["tv-airing", "/3US5UXJSStOVozc6EwhGSMDguol.jpg"],
  // Jujutsu Kaisen
  ["movie-action", "/fK40VGYIm7hmKrLJ26fgPQU0qRG.jpg"],
  // Akira
  ["movie-adventure", "/nv5wwZou159v5OC61i4ElR7OqyY.jpg"],
  // Howl's Moving Castle
  ["movie-fantasy", "/m4TUa2ciEWSlk37rOsjiSIvZDXE.jpg"],
  // Spirited Away
  ["movie-romance", "/mMtUybQ6hL24FXo0F3Z4j2KG7kZ.jpg"],
  // Your Name.
  ["movie-scifi", "/jIpagj2Dud9g3ZVJFvaWikEWsYz.jpg"],
  // Ghost in the Shell
  ["movie-drama", "/5lAMQMWpXMsirvtLLvW7cJgEPkU.jpg"],
  // A Silent Voice
  ["movie-family", "/zkThiZAaAie8Lw7RAc5yPTOewBV.jpg"],
  // My Neighbor Totoro
  ["movie-horror", "/mHG7dpLb0ZScSY3LpP443IHRmjy.jpg"]
  // Perfect Blue
];
function categoryTiles() {
  return TILES.map(([id, art]) => ({
    id,
    title: t(ROWS[id].kind === "movie" ? "catMovies" : "catSeries", { g: t(ROWS[id].title) }).slice(0, 40),
    ref: `d:${id}`,
    art: ART + art
  }));
}

// src/megaplay.js
var MPY = "https://megaplay.buzz";
var ENC = "https://enc-dec.app/api";
var ANILIST = "https://graphql.anilist.co";
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36";
var AJAX = { "User-Agent": UA, Origin: MPY, Referer: `${MPY}/`, "X-Requested-With": "XMLHttpRequest" };
var MAX_SUBTITLES = 30;
async function anilistId(show, isMovie, seasonYear) {
  const query = "query($q:String){Page(perPage:10){media(search:$q,type:ANIME){id format startDate{year}}}}";
  for (const q of [show.original_name || show.original_title, show.name || show.title].filter(Boolean)) {
    const res = await kino.fetch(ANILIST, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query, variables: { q } })
    });
    if (!res.ok) continue;
    const list = (await res.json())?.data?.Page?.media || [];
    const kinds = isMovie ? ["MOVIE"] : ["TV", "TV_SHORT", "ONA"];
    const fit = list.filter((m) => kinds.includes(m.format));
    const pick = seasonYear && fit.find((m) => m.startDate?.year === seasonYear) || fit[0];
    if (pick) return pick.id;
  }
  return null;
}
var ISO3 = {
  ara: "ar",
  bul: "bg",
  chi: "zh",
  zho: "zh",
  cze: "cs",
  ces: "cs",
  dan: "da",
  dut: "nl",
  nld: "nl",
  eng: "en",
  fin: "fi",
  fre: "fr",
  fra: "fr",
  ger: "de",
  deu: "de",
  gre: "el",
  ell: "el",
  heb: "he",
  hin: "hi",
  hun: "hu",
  ind: "id",
  ita: "it",
  jpn: "ja",
  kor: "ko",
  may: "ms",
  msa: "ms",
  nob: "nb",
  nor: "no",
  pol: "pl",
  por: "pt",
  rum: "ro",
  ron: "ro",
  rus: "ru",
  slo: "sk",
  slk: "sk",
  spa: "es",
  swe: "sv",
  tha: "th",
  tur: "tr",
  ukr: "uk",
  vie: "vi",
  fil: "fil",
  tgl: "tl"
};
function langFrom(url) {
  const code = /\/([a-z]{3})-\d+\.vtt(?:\?|$)/i.exec(String(url))?.[1]?.toLowerCase();
  return code && ISO3[code] || "und";
}
function bySubtitlePreference(subs, lang = langOf()) {
  const order = [lang, "es", "en"];
  const rank = (s) => {
    const i = order.indexOf(s.lang);
    return i < 0 ? order.length : i;
  };
  return subs.map((s, i) => [s, i]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map(([s]) => s);
}
var subFormat = (url) => /\.vtt(\?|$)/i.test(String(url)) ? "vtt" : "srt";
function skipOf(data) {
  const s = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;
  const intro = data && data.intro, outro = data && data.outro;
  const out = {};
  if (intro && s(intro.end) > s(intro.start)) {
    out.openingStartMs = s(intro.start) * 1e3;
    out.openingEndMs = s(intro.end) * 1e3;
  }
  if (outro && s(outro.end) > s(outro.start) && s(outro.start) > 0) out.endingStartMs = s(outro.start) * 1e3;
  return Object.keys(out).length ? out : null;
}
async function megaplayStream(aniId, episode, audio) {
  const embed = await kino.fetch(`${MPY}/stream/ani/${aniId}/${episode}/${audio}`, { headers: { "User-Agent": UA, Referer: `${MPY}/` } });
  if (!embed.ok) return null;
  const fileId = /data-id="(\d+)"/.exec(await embed.text())?.[1];
  if (!fileId) return null;
  const res = await kino.fetch(`${MPY}/stream/getSources?id=${fileId}`, { headers: AJAX });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.enc) return null;
  const dec = await kino.fetch(`${ENC}/dec-megaplay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: data.enc })
  });
  if (!dec.ok) return null;
  const file = (await dec.json())?.result?.file;
  if (!file) return null;
  const skip = skipOf(data);
  return {
    url: file,
    mime: "application/x-mpegURL",
    headers: { "User-Agent": UA, Referer: `${MPY}/`, Origin: MPY },
    subtitles: bySubtitlePreference((data.tracks || []).filter((tr) => tr.kind === "captions" && tr.file).map((tr) => ({ lang: langFrom(tr.file), url: tr.file, format: subFormat(tr.file), ...tr.label ? { label: String(tr.label).slice(0, 60) } : {} }))).slice(0, MAX_SUBTITLES),
    ...skip ? { skip } : {}
  };
}

// src/settings.js
var bool = (v, fallback) => v === true || v === "true" ? true : v === false || v === "false" ? false : fallback;
function readSettings(kino2 = globalThis.kino) {
  const get = (key) => {
    try {
      return kino2 && kino2.config ? kino2.config.get(key) : void 0;
    } catch (_) {
      return void 0;
    }
  };
  const audio = get("audio") === "dub" ? "dub" : "sub";
  return { audio, homeRows: bool(get("homeRows"), true) };
}

// src/resolve.js
var MATCH_PREFIX = "ani1:";
var MATCH_TTL_MS = 30 * 24 * 3600 * 1e3;
var notFound = () => kino.error("not_found", "megaplay has no copy", { userMessage: t("notFound") });
async function titleOf(parsed) {
  const isMovie = parsed.kind === "movie";
  let show;
  try {
    show = await tmdb(`/${isMovie ? "movie" : "tv"}/${parsed.id}`);
  } catch (e) {
    kino.log("[megaplay] tmdb", e && e.code || "error");
    throw kino.error("unavailable", "tmdb: " + (e && e.code || "error"), { userMessage: t("tmdbDown") });
  }
  if (!isAnime(show)) throw kino.error("not_found", "not an anime", { userMessage: t("notAnime") });
  return { show, isMovie, season: parsed.season || 1, episode: isMovie ? 1 : parsed.episode };
}
async function matchOf({ show, isMovie, season }) {
  const key = `${MATCH_PREFIX}${isMovie ? "m" : "s"}:${show.id}:${isMovie ? 0 : season}`;
  try {
    const kept = Number(kino.storage.get(key));
    if (kept > 0) return kept;
  } catch (_) {
  }
  const seasonInfo = !isMovie && season > 1 ? (show.seasons || []).find((s) => s.season_number === season) : null;
  const seasonYear = seasonInfo && seasonInfo.air_date ? Number(seasonInfo.air_date.slice(0, 4)) : null;
  const id = await anilistId(show, isMovie, seasonYear);
  if (id) {
    try {
      kino.storage.set(key, String(id), { ttlMs: MATCH_TTL_MS });
    } catch (_) {
    }
  }
  return id;
}
var labelled = (stream, audio) => ({ ...stream, label: t(audio) });
async function resolveRef(ref) {
  const copy = parseCopyRef(ref);
  const parsed = parseTitleRef(copy ? copy.ref : ref);
  if (!parsed || parsed.kind === "series") throw notFound();
  const title = await titleOf(parsed);
  let aniId;
  try {
    aniId = await matchOf(title);
  } catch (e) {
    kino.log("[megaplay] anilist", e && e.code || "error");
  }
  if (!aniId) throw notFound();
  if (copy) {
    const s = await megaplayStream(aniId, title.episode, copy.audio).catch(() => null);
    if (!s) throw notFound();
    return labelled(s, copy.audio);
  }
  const first = readSettings().audio;
  const other = first === "sub" ? "dub" : "sub";
  const main = await megaplayStream(aniId, title.episode, first).catch((e) => {
    kino.log("[megaplay] copy", first, e && e.code || "error");
    return null;
  });
  if (main) return { ...labelled(main, first), alternatives: [{ ref: copyRef(other, ref), label: t(other) }] };
  const fallback = await megaplayStream(aniId, title.episode, other).catch(() => null);
  if (fallback) return labelled(fallback, other);
  throw notFound();
}

// src/browse/model.js
var MAX_SLIDES = 6;
var MAX_RAILS = 8;
var MAX_RAIL_ITEMS = 20;
var MAX_SLIDE_TEXT = 160;
var HTTPS = /^https:\/\//;
function cardOf(item) {
  const out = { id: item.id, ref: item.ref, title: item.title, kind: item.kind };
  if (item.poster && HTTPS.test(item.poster)) out.poster = item.poster;
  if (item.backdrop && HTTPS.test(item.backdrop)) out.backdrop = item.backdrop;
  if (item.rating !== void 0) out.rating = item.rating;
  if (item.year !== void 0) out.year = item.year;
  if (item.ids && item.ids.tmdb) out.ids = { tmdb: item.ids.tmdb };
  return out;
}
function slidesOf(rows) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const row of rows) {
    for (const item of row.items) {
      if (out.length >= MAX_SLIDES) return out;
      if (seen.has(item.id) || !item.backdrop || !HTTPS.test(item.backdrop)) continue;
      const text = typeof item.overview === "string" ? item.overview.trim() : "";
      if (text === "") continue;
      seen.add(item.id);
      out.push({
        id: item.id,
        ref: item.ref,
        kind: item.kind,
        title: item.title,
        image: item.backdrop,
        ...item.ids && item.ids.tmdb ? { tmdb: item.ids.tmdb } : {},
        text: text.length <= MAX_SLIDE_TEXT ? text : `${text.slice(0, MAX_SLIDE_TEXT - 1).trimEnd()}\u2026`
      });
    }
  }
  return out;
}
function railsOf(rows) {
  return rows.filter((r) => r.items && r.items.length > 0).slice(0, MAX_RAILS).map((r) => ({
    id: r.id,
    title: r.title,
    ...r.ref ? { ref: r.ref } : {},
    items: r.items.slice(0, MAX_RAIL_ITEMS).map(cardOf)
  }));
}
function tabOf(page) {
  const rows = page && Array.isArray(page.rows) ? page.rows : [];
  const rails = railsOf(rows);
  if (rails.length === 0) return null;
  return { slides: slidesOf(rows), rails };
}
function playedKey(ref) {
  const m = /^(?:m|s|e):(\d{1,10})(?::|$)/.exec(String(ref || ""));
  return m ? `t:${m[1]}` : String(ref || "");
}
function recentOf(keys, tabs) {
  if (keys.length === 0) return [];
  const byKey = /* @__PURE__ */ new Map();
  for (const data of tabs) {
    for (const rail2 of data.rails) {
      for (const card of rail2.items) {
        const ks = [card.ref];
        if (card.ids && card.ids.tmdb) ks.push(`t:${card.ids.tmdb}`);
        for (const k of ks) if (!byKey.has(k)) byKey.set(k, card);
      }
    }
  }
  const out = [];
  const used = /* @__PURE__ */ new Set();
  for (const key of keys) {
    const card = byKey.get(key);
    if (card && !used.has(card.id)) {
      used.add(card.id);
      out.push(card);
    }
  }
  return out;
}

// logo-bar.png
var logo_bar_default = "data:image/png;base64,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";

// src/browse/logo.js
var logoNode = () => ({
  type: "Row",
  key: "logo",
  gap: 12,
  crossAxisAlignment: "center",
  children: [
    {
      type: "Image",
      key: "logoIcon",
      url: logo_bar_default,
      aspect: "1:1",
      fit: "contain",
      h: 32,
      width: 32,
      alt: "Megaplay",
      altEn: "Megaplay",
      fallback: { type: "Icon", name: "movie" }
    },
    { type: "Text", key: "logoText", text: "Megaplay", textEn: "Megaplay", style: "h4", bold: true }
  ]
});

// src/browse/detail.js
var HTTPS2 = /^https:\/\//;
var MAX_EPISODES = 80;
var MAX_CAST = 12;
var LEAD_MAX = 140;
var TMDB_IMG = "https://image.tmdb.org/t/p/";
var twin = (key, field = "text", vars) => {
  const w = both(key, vars);
  return { [field]: w.es, [field + "En"]: w.en };
};
var same = (text) => ({ text, textEn: text });
var num = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
};
var https = (v) => typeof v === "string" && HTTPS2.test(v) && v.length <= 2048 ? v : void 0;
var tmdbLang = () => langOf() === "en" ? "en-US" : "es-MX";
var opensPage = (card) => !!card && (card.kind === "movie" || card.kind === "series") && typeof card.id === "string" && !!parseTitleRef(card.ref) && parseTitleRef(card.ref).kind !== "episode";
var cardNode = (card, size, scope) => ({
  type: "titleCard",
  key: `${scope}-${card.id}`,
  size,
  item: card,
  ...opensPage(card) ? { onTap: { event: "openTitle", arg: JSON.stringify(openArgs(card)) } } : {}
});
var cardRow = (items, key, size) => ({ type: "SingleChildScrollView", key: key + "-s", direction: "horizontal", children: [{ type: "Row", key: key + "-r", gap: 12, children: items.map((c) => cardNode(c, size, key)) }] });
var cardGrid = (items, key) => ({ type: "GridView", key, columns: { compact: 3, expanded: 6 }, children: items.map((c) => cardNode(c, "medium", key)) });
function openArgs(card) {
  const r = parseTitleRef(card.ref);
  const tmdb2 = r ? r.id : card.ids && Number.isInteger(card.ids.tmdb) ? card.ids.tmdb : 0;
  const year = card.year ? num(card.year) : 0;
  return { open: card.ref, i: card.id, t: String(card.title || "").slice(0, 100), k: card.kind, ...tmdb2 ? { d: tmdb2 } : {}, ...year ? { y: year } : {} };
}
function pushOf(arg) {
  let a = null;
  try {
    a = JSON.parse(String(arg));
  } catch (_) {
    a = null;
  }
  if (!a || typeof a.open !== "string" || typeof a.i !== "string" || a.k !== "movie" && a.k !== "series") return null;
  return { push: "detail", params: { open: a.open, i: a.i, t: typeof a.t === "string" ? a.t.slice(0, 100) : "", k: a.k, d: Number(a.d) || 0, y: Number(a.y) || 0 } };
}
function backdropsOf(images, first) {
  const list = (images && images.backdrops || []).filter((b) => b && typeof b.file_path === "string" && b.file_path.startsWith("/") && b.width >= 1e3).sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)).map((b) => TMDB_IMG + "w780" + b.file_path);
  const out = [];
  for (const u of [first, ...list]) if (u && !out.some((x) => x.slice(x.lastIndexOf("/")) === u.slice(u.lastIndexOf("/")))) out.push(u);
  return out.slice(0, 6);
}
var hoursOf = (min) => {
  const m = num(min);
  return m > 0 ? m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}` : `${m} min` : "";
};
var MONTHS = {
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};
var dateText = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  return m >= 1 && m <= 12 ? { es: `${d} ${MONTHS.es[m - 1]} ${y}`, en: `${MONTHS.en[m - 1]} ${d}, ${y}` } : { es: iso, en: iso };
};
async function loadDetail(args) {
  const kind = args.k === "movie" ? "movie" : "series";
  const tmdbId = Number(args.d) || 0;
  if (!tmdbId) throw Object.assign(new Error("no tmdb id"), { code: "not_found" });
  const tv = kind === "movie" ? "movie" : "tv";
  const x = await kino.tmdb(`/${tv}/${tmdbId}`, {
    language: tmdbLang(),
    append_to_response: "credits,images,recommendations," + (kind === "movie" ? "release_dates" : "content_ratings"),
    include_image_language: "null,es,en,ja"
  });
  const cert = kind === "movie" ? ((x.release_dates && x.release_dates.results || []).find((r) => r.iso_3166_1 === "MX" || r.iso_3166_1 === "US")?.release_dates || []).map((r) => r.certification).find(Boolean) : ((x.content_ratings && x.content_ratings.results || []).find((r) => r.iso_3166_1 === "MX") || (x.content_ratings && x.content_ratings.results || []).find((r) => r.iso_3166_1 === "US") || {}).rating;
  const backdrop = typeof x.backdrop_path === "string" ? TMDB_IMG + "w780" + x.backdrop_path : void 0;
  const d = {
    kind,
    title: String(x.title || x.name || args.t || "").slice(0, 200),
    overview: String(x.overview || ""),
    year: num(String(x.release_date || x.first_air_date || "").slice(0, 4)),
    backdrop,
    genres: (x.genres || []).map((g) => g && g.name).filter((g) => typeof g === "string").slice(0, 4),
    runtime: kind === "movie" ? num(x.runtime) : 0,
    tagline: String(x.tagline || ""),
    certification: String(cert || "").slice(0, 8),
    directors: (kind === "movie" ? (x.credits && x.credits.crew || []).filter((c) => c.job === "Director").map((c) => c.name) : (x.created_by || []).map((c) => c.name)).filter(Boolean).slice(0, 3),
    ratings: typeof x.vote_average === "number" && x.vote_count > 20 ? [{ source: "tmdb", value: (Math.round(x.vote_average * 10) / 10).toFixed(1) }] : [],
    cast: (x.credits && x.credits.cast || []).filter((c) => c && c.name).slice(0, MAX_CAST).map((c) => ({
      name: String(c.name),
      character: String(c.character || ""),
      photo: typeof c.profile_path === "string" && c.profile_path.startsWith("/") ? TMDB_IMG + "w185" + c.profile_path : void 0
    })),
    images: backdropsOf(x.images, backdrop),
    similar: (x.recommendations && x.recommendations.results || []).filter((m) => m && m.id && (m.title || m.name) && m.poster_path && isAnime(m) && !m.adult).slice(0, 12).map((m) => ({
      id: (kind === "movie" ? "m-" : "s-") + m.id,
      ref: (kind === "movie" ? "m:" : "s:") + m.id,
      kind,
      title: String(m.title || m.name).slice(0, 200),
      poster: TMDB_IMG + "w342" + m.poster_path,
      ids: { tmdb: m.id }
    })),
    episodes: []
  };
  if (kind === "series") {
    const eps = await seriesEpisodes(tmdbId).then((r) => r.episodes).catch(() => []);
    d.episodes = eps.slice(0, 1200).map((e) => ({
      s: num(e.season),
      n: num(e.number),
      title: String(e.title || "").slice(0, 120),
      overview: String(e.overview || "").slice(0, 110),
      still: https(e.still),
      air: e.airDate || ""
    }));
  }
  if (typeof kino.meta === "function") {
    try {
      const meta = await kino.meta({ type: kind, ids: { tmdb: tmdbId } });
      if (meta && https(meta.logo)) d.logo = https(meta.logo);
    } catch (_) {
    }
  }
  return d;
}
var heroSkeleton = () => ({ type: "Skeleton", key: "heroSkeleton", shape: "block", height: { compact: 200, expanded: 320 } });
var railSkeleton = () => ({
  type: "Column",
  key: "dskel1",
  gap: 8,
  children: [
    { type: "Skeleton", shape: "line", width: 120 },
    { type: "Row", gap: 12, children: [1, 2, 3].map((i) => ({ type: "Skeleton", shape: "card", key: `dsk${i}`, flex: 1 })) }
  ]
});
var sectionTitle = (key) => ({ type: "Text", ...twin(key), style: "h4" });
var episodeGo = (d, r) => ({ go: { title: { ref: r.ref, kind: "series", id: r.id, title: d.title } } });
function episodeRow(d, r, ep) {
  const facts = ep.air ? dateText(ep.air) : null;
  const heading = ep.title ? { text: `${ep.n}. ${ep.title}`, textEn: `${ep.n}. ${ep.title}` } : twin("dEpisodeN", "text", { n: ep.n });
  return {
    type: "Row",
    key: `ep-${ep.s}-${ep.n}`,
    gap: 12,
    crossAxisAlignment: "center",
    onTap: episodeGo(d, r),
    canRequestFocus: true,
    children: [
      { type: "Image", key: `epi-${ep.s}-${ep.n}`, width: 120, aspect: "16:9", fit: "cover", radius: "medium", ...ep.still ? { url: ep.still } : {}, fallback: { type: "Skeleton", shape: "block", height: 64 } },
      { type: "Column", flex: 1, gap: 4, children: [
        { type: "Text", bold: true, maxLines: 2, ...heading },
        ...facts ? [{ type: "Text", style: "caption", color: "muted", text: facts.es, textEn: facts.en }] : [],
        ...ep.overview ? [{ type: "Text", style: "caption", color: "muted", maxLines: 2, ...same(ep.overview) }] : []
      ] }
    ]
  };
}
function castItem(c) {
  const name = String(c.name || "").slice(0, 60);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return {
    type: "Column",
    key: "cast-" + name.replace(/[^A-Za-z0-9]/g, "").slice(0, 24) + "-" + String(c.character || "").length,
    width: 96,
    gap: 4,
    crossAxisAlignment: "center",
    canRequestFocus: true,
    children: [
      { type: "CircleAvatar", radius: 32, ...https(c.photo) ? { image: https(c.photo) } : {}, text: initials, textEn: initials },
      { type: "Text", ...same(name), style: "caption", maxLines: 2 },
      ...c.character ? [{ type: "Text", ...same(String(c.character).slice(0, 40)), style: "caption", color: "muted", maxLines: 1 }] : []
    ]
  };
}
function detailView({ r, entry, season, logo, back }) {
  const d = entry && entry.d;
  const appBar = { type: "AppBar", mergeWithKinoBar: true, dense: true, divider: false, leading: back, title: logo };
  const body = [];
  let hero2 = null;
  if (!entry) {
    hero2 = heroSkeleton();
    body.push(railSkeleton());
  } else if (!d) {
    body.push({ type: "MaterialBanner", key: "detailFailed", role: "error", ...twin("brFailed"), action: { ...twin("brRetry", "label"), onTap: "dretry" } });
    body.push({ type: "ElevatedButton", key: "dkino", icon: "play", ...twin("dSeeInKino", "labelText"), onPressed: { go: { title: { ref: r.ref, kind: r.kind, id: r.id, title: r.title } } } });
  } else {
    const series = d.kind === "series";
    const seasons = [...new Set(d.episodes.map((e) => e.s))].sort((a, b) => a - b);
    const shown = seasons.includes(season) ? season : seasons[0];
    const toKino = { go: { title: { ref: r.ref, kind: d.kind, id: r.id, title: r.title || d.title } } };
    const buttons = series ? [{ type: "ElevatedButton", key: "dplay", ...twin("dSeriesGo", "labelText"), icon: "play", autofocus: true, onPressed: toKino }] : [
      { type: "ElevatedButton", key: "dplay", ...twin("brWatch", "labelText"), icon: "play", autofocus: true, onPressed: { go: { play: { ref: r.ref, kind: "movie", id: r.id, title: d.title } } } },
      { type: "TextButton", key: "dmore", ...twin("dMore", "labelText"), onPressed: toKino }
    ];
    const lead = d.tagline || (d.overview.length <= LEAD_MAX ? d.overview : d.overview.slice(0, LEAD_MAX - 1).trimEnd() + "\u2026");
    const images = (d.images && d.images.length ? d.images : [d.backdrop || ""]).slice(0, 6);
    const slide = (image, i) => ({
      type: "heroCard",
      key: i ? "dhero-" + i : "dhero",
      h: { compact: 240, expanded: 320 },
      title: d.title,
      titleEn: d.title,
      ...lead ? same(lead) : {},
      ...image ? { image } : {},
      ...d.logo ? { logo: d.logo } : {},
      buttons: i ? buttons.map((b) => ({ ...b, key: b.key + "-" + i, autofocus: false })) : buttons
    });
    hero2 = images.length > 1 ? { type: "PageView", key: "hero" + images.length, autoPlayMs: 6e3, children: images.map(slide) } : slide(images[0], 0);
    const rating = d.ratings.find((x) => x.source === "imdb") || d.ratings.find((x) => x.source === "tmdb");
    const facts = [];
    if (rating) facts.push("\u2605 " + rating.value);
    if (d.year) facts.push(String(d.year));
    if (d.certification) facts.push(d.certification);
    if (d.runtime) facts.push(hoursOf(d.runtime));
    const seasonsText = seasons.length === 1 ? both("dSeasonOne") : both("dSeasonsN", { n: seasons.length });
    const es = facts.concat(series && seasons.length ? [seasonsText.es] : []);
    const en = facts.concat(series && seasons.length ? [seasonsText.en] : []);
    if (es.length) body.push({ type: "Text", key: "dfacts", style: "h4", text: es.join("  \xB7  "), textEn: en.join("  \xB7  ") });
    if (d.genres.length) body.push({ type: "Row", key: "dgenres", gap: 8, children: d.genres.map((g, i) => ({ type: "Badge", key: "dg-" + i, ...same(g) })) });
    if (d.overview) body.push({ type: "Text", key: "dsynopsis", canRequestFocus: true, ...same(d.overview) });
    if (d.directors.length) body.push({ type: "Text", ...twin(series ? "dCreators" : "dDirector", "text", { v: d.directors.join(", ") }), color: "muted" });
    if (d.cast.length) {
      body.push(sectionTitle("dCast"));
      body.push({ type: "SingleChildScrollView", key: "dcast", direction: "horizontal", children: [{ type: "Row", gap: 12, children: d.cast.map(castItem) }] });
    }
    if (series && seasons.length) {
      body.push(seasons.length > 1 ? { type: "DropdownButton", key: "dseason", value: String(shown), onChanged: "season", options: seasons.map((s) => {
        const w = both("dSeasonN", { n: s });
        return { value: String(s), label: w.es, labelEn: w.en };
      }) } : sectionTitle("dEpisodes"));
      for (const ep of d.episodes.filter((e) => e.s === shown).slice(0, MAX_EPISODES)) body.push(episodeRow(d, r, ep));
    }
    if (d.similar.length) {
      body.push(sectionTitle("dSimilar"));
      body.push(cardRow(d.similar, "dsimilar", "small"));
    }
  }
  return {
    type: "Scaffold",
    appBar,
    body: { type: "SingleChildScrollView", key: "detail-page", children: [...hero2 ? [hero2] : [], { type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] },
    ...!entry ? { every: { ms: 1e3, event: "dtick" } } : {}
  };
}

// src/browse/view.js
var POLL_MS = 1500;
var SEARCH_CAP = 60;
var tabBar = (active) => ({
  type: "TabBar",
  key: "tabs",
  divider: false,
  value: active,
  onChanged: "tab",
  tabs: TAB_IDS.map((id) => {
    const w = tabLabel(id);
    return { value: id, label: w.es, labelEn: w.en };
  })
});
var railSkeleton2 = (n) => ({
  type: "Column",
  key: "skel" + n,
  gap: 8,
  children: [
    { type: "Skeleton", shape: "line", width: 120 },
    { type: "Row", gap: 12, sizes: ["compact"], children: [1, 2, 3].map((i) => ({ type: "Skeleton", shape: "card", key: `sk${n}c${i}`, flex: 1 })) },
    { type: "Row", gap: 12, sizes: ["medium", "expanded"], children: [1, 2, 3, 4, 5, 6].map((i) => ({ type: "Skeleton", shape: "card", key: `sk${n}w${i}`, flex: 1 })) }
  ]
});
var gridSkeleton = () => ({
  type: "Column",
  key: "gridSkeleton",
  gap: 12,
  children: [
    ...[1, 2].map((r) => ({ type: "Row", gap: 12, sizes: ["compact"], key: `gc${r}`, children: [1, 2, 3].map((i) => ({ type: "Skeleton", shape: "card", key: `gc${r}-${i}`, flex: 1 })) })),
    ...[1, 2].map((r) => ({ type: "Row", gap: 12, sizes: ["medium", "expanded"], key: `gw${r}`, children: [1, 2, 3, 4, 5, 6].map((i) => ({ type: "Skeleton", shape: "card", key: `gw${r}-${i}`, flex: 1 })) }))
  ]
});
var heroSkeleton2 = () => ({ type: "Skeleton", key: "heroSkeleton", shape: "block", height: { compact: 200, expanded: 320 } });
var slideNode = (s) => ({
  type: "heroCard",
  key: "slide-" + s.id,
  h: { compact: 200, expanded: 240 },
  ...s.logo ? { logo: s.logo } : {},
  title: s.title,
  text: s.text,
  image: s.image,
  buttons: [
    s.kind === "movie" ? { type: "ElevatedButton", key: "watch-" + s.id, ...twin("brWatch", "labelText"), icon: "play", onPressed: { go: { play: { ref: s.ref, kind: s.kind, id: s.id, title: s.title } } } } : { type: "ElevatedButton", key: "watch-" + s.id, ...twin("dSeriesGo", "labelText"), icon: "play", onPressed: { go: { title: { ref: s.ref, kind: s.kind, id: s.id, title: s.title } } } },
    { type: "TextButton", key: "info-" + s.id, ...twin("brInfo", "labelText"), onPressed: { event: "openTitle", arg: JSON.stringify(openArgs({ ...s, ids: s.tmdb ? { tmdb: s.tmdb } : void 0 })) } }
  ]
});
var hero = (slides) => slides.length === 1 ? slideNode(slides[0]) : {
  type: "PageView",
  key: "hero" + slides.length,
  autoPlayMs: 6e3,
  children: slides.map(slideNode)
};
var rail = (r, key, titleOverride) => ({
  type: "Column",
  key,
  gap: 8,
  children: [
    { type: "Row", key: key + "-h", crossAxisAlignment: "center", children: [
      { type: "Text", style: "h4", flex: 1, text: titleOverride ? titleOverride.title : r.title, textEn: titleOverride ? titleOverride.titleEn : r.title },
      ...r.ref ? [{ type: "TextButton", key: key + "-more", ...twin("brMore", "labelText"), onPressed: { go: { browse: { ref: r.ref, title: r.title } } } }] : []
    ] },
    cardRow(r.items, key, "medium")
  ]
});
var backButton = () => ({ type: "IconButton", key: "back", icon: "arrow_back", ...twin("brBack", "labelText"), ...twin("brBack", "tooltip"), onPressed: "back" });
function browseView({ tab, data, recent, pending, failed, device = "phone" }) {
  const tv = device === "tv";
  const gear = { type: "IconButton", key: "settingsButton", icon: "settings", ...twin("brSettings", "labelText"), ...twin("brSettings", "tooltip"), onPressed: { event: "go", arg: "settings" } };
  const active = TAB_IDS.includes(tab) ? tab : TAB_IDS[0];
  const body = [];
  if (data) {
    if (data.slides.length > 0) body.push(hero(data.slides));
    if (recent.length > 0) body.push(rail({ items: recent }, "recent", twin("brRecent", "title")));
    for (const r of data.rails) body.push(rail(r, "rail-" + String(r.id).replace(/[^A-Za-z0-9_-]/g, "_")));
    if (data.rails.length === 0) body.push({ type: "Text", ...twin("brEmpty", "text"), color: "muted" });
  } else if (failed) {
    body.push({ type: "MaterialBanner", key: "loadFailed", role: "error", ...twin("brFailed"), action: { ...twin("brRetry", "label"), onTap: "retry" } });
  } else {
    body.push(heroSkeleton2(), railSkeleton2(1), railSkeleton2(2), railSkeleton2(3));
  }
  const isBanner = (n) => !!n && (n.type === "heroCard" || n.key === "heroSkeleton" || n.type === "PageView" && String(n.key).startsWith("hero"));
  const banner = body.length > 0 && isBanner(body[0]) ? body.shift() : null;
  return {
    type: "Scaffold",
    appBar: {
      type: "AppBar",
      // One bar instead of two (Kino 0.9.81+): the close button where Kino's was and the plugin's logo where its name was.
      mergeWithKinoBar: true,
      dense: true,
      divider: false,
      leading: { type: "IconButton", key: "close", icon: "close", ...twin("brClose", "labelText"), ...twin("brClose", "tooltip"), onPressed: { go: { close: true } } },
      // On a TV the search is a button of the bar (a floating one is hard to reach with a remote); elsewhere it floats.
      actions: tv ? [{ type: "IconButton", key: "searchButton", icon: "search", ...twin("brSearch", "labelText"), ...twin("brSearch", "tooltip"), onPressed: "openSearch" }, gear] : [gear],
      // On a TV the tabs sit in the bar beside the logo (one D-pad strip); elsewhere they are pinned under it.
      title: tv ? { type: "Row", key: "titleRow", gap: 24, crossAxisAlignment: "center", children: [logoNode(), tabBar(active)] } : logoNode()
    },
    ...tv ? {} : { floatingActionButton: { type: "FloatingActionButton", key: "searchFab", icon: "search", ...twin("brSearch", "tooltip"), onPressed: "openSearch" } },
    // The tabs stay pinned under the bar; only the rows scroll.
    body: { type: "Column", key: "page", children: [
      ...tv ? [] : [{ type: "Column", key: "tabsRow", padding: { compact: 0, expanded: 24 }, children: [tabBar(active)] }],
      { type: "SingleChildScrollView", key: "browse-" + active, flex: 1, children: [...banner ? [banner] : [], { type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] }
    ] },
    ...pending ? { every: { ms: POLL_MS, event: "tick" } } : {}
  };
}
function settingsView() {
  return {
    type: "Scaffold",
    appBar: { type: "AppBar", mergeWithKinoBar: true, dense: true, divider: false, leading: backButton(), title: logoNode() },
    body: { type: "SingleChildScrollView", key: "settings-page", children: [{ type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: [{ type: "settings", key: "form" }] }] }
  };
}
function searchView({ query, status, items, history = [], device = "phone" }) {
  const tv = device === "tv";
  const searchForm = () => ({
    type: "Form",
    key: "searchForm",
    onSubmitted: "search",
    gap: 8,
    children: tv ? [{ type: "Row", key: "searchRow", gap: 16, crossAxisAlignment: "center", children: [
      { type: "TextField", key: "q", kind: "text", value: query, ...twin("brSearchHint", "labelText"), maxLength: 100, autofocus: true, weight: 1 },
      { type: "ElevatedButton", key: "searchGo", ...twin("brSearch", "labelText"), icon: "search", submit: true }
    ] }] : [
      { type: "TextField", key: "q", kind: "text", value: query, ...twin("brSearchHint", "labelText"), maxLength: 100, autofocus: true },
      { type: "ElevatedButton", key: "searchGo", ...twin("brSearch", "labelText"), icon: "search", submit: true }
    ]
  });
  const body = tv ? [] : [searchForm()];
  if (status === "fail") {
    body.push({ type: "MaterialBanner", key: "searchFailed", role: "error", ...twin("brSearchFailed"), action: { ...twin("brRetry", "label"), onTap: "sretry" } });
  } else if (status === "done" && items) {
    if (items.length === 0) body.push({ type: "Text", ...twin("brNoResults", "text"), color: "muted" });
    else body.push(cardGrid(items.slice(0, SEARCH_CAP), "results"));
  } else if (status !== "idle") {
    body.push(gridSkeleton());
  } else if (history.length > 0) {
    body.push({ type: "Text", ...twin("brSearchedBefore", "text"), style: "h4" });
    body.push(cardGrid(history.slice(0, SEARCH_CAP), "history"));
  }
  return {
    type: "Scaffold",
    appBar: {
      type: "AppBar",
      mergeWithKinoBar: true,
      dense: true,
      divider: false,
      leading: backButton(),
      ...tv ? { title: searchForm() } : twin("brSearchTitle", "title")
    },
    body: { type: "SingleChildScrollView", key: "search-page", children: [{ type: "Column", padding: { compact: 12, expanded: 24 }, gap: 16, children: body }] },
    ...status === "loading" ? { every: { ms: 1e3, event: "stick" } } : {}
  };
}
function detailPage({ r, entry, season }) {
  return detailView({ r, entry, season, logo: logoNode(), back: backButton() });
}

// src/browse/logos.js
var KEY = "logo1";
var MAX = 120;
var CALL_MS = 8e3;
var HTTPS3 = /^https:\/\//;
function makeLogoCache({ kino: kino2, clock = { now: () => Date.now() } }) {
  const usable = () => {
    try {
      return typeof kino2.meta === "function";
    } catch (_) {
      return false;
    }
  };
  let book = null;
  function read() {
    if (book) return book;
    try {
      const o = JSON.parse(kino2.storage.get(KEY) || "null");
      book = o && typeof o === "object" && !Array.isArray(o) ? o : {};
    } catch (_) {
      book = {};
    }
    return book;
  }
  function write() {
    try {
      const ids = Object.keys(book);
      if (ids.length > MAX) for (const id of ids.slice(0, ids.length - MAX)) delete book[id];
      kino2.storage.set(KEY, JSON.stringify(book));
    } catch (_) {
    }
  }
  function logoOf(id) {
    const l = read()[id];
    return typeof l === "string" && HTTPS3.test(l) ? l : void 0;
  }
  async function fill2(slides, budgetMs) {
    if (!usable()) return 0;
    const b = read();
    const end = clock.now() + budgetMs;
    let asked = 0;
    for (const s of slides) {
      if (clock.now() + CALL_MS > end) break;
      if (!s || typeof s.id !== "string" || !s.tmdb || Object.hasOwn(b, s.id)) continue;
      try {
        const a = await kino2.meta({ type: s.kind === "series" ? "series" : "movie", ids: { tmdb: s.tmdb } });
        b[s.id] = a && typeof a.logo === "string" ? a.logo : "";
      } catch (e) {
        if (e && e.code === "rate_limited") break;
        continue;
      }
      asked++;
    }
    if (asked > 0) write();
    return asked;
  }
  return { logoOf, fill: fill2, usable };
}

// src/browse/index.js
var TAB_KEY = "browseTab";
var SNAP_PREFIX = "browse1:";
var SNAP_TTL_MS = 12 * 3600 * 1e3;
var SNAP_MAX = 24 * 1024;
var RECENT_KEY = "recent1";
var RECENT_MAX = 12;
var HIST_KEY = "searchHist1";
var HIST_MAX = 24;
function makeBrowse({ kino: kino2, loadTab, searchTitles }) {
  const logos = makeLogoCache({ kino: kino2 });
  const enrich = (data) => data ? { ...data, slides: data.slides.map((s) => {
    const l = logos.logoOf(s.id);
    return l ? { ...s, logo: l } : s;
  }) } : data;
  const memo = /* @__PURE__ */ new Map();
  const log = (...a) => {
    try {
      kino2.log("[megaplay]", ...a);
    } catch (_) {
    }
  };
  const get = (k) => {
    try {
      return kino2.storage.get(k);
    } catch (_) {
      return null;
    }
  };
  const set = (k, v, opts) => {
    try {
      kino2.storage.set(k, v, opts);
    } catch (_) {
    }
  };
  function readSnap(tab) {
    try {
      const o = JSON.parse(get(SNAP_PREFIX + tab) || "null");
      return o && Date.now() - o.at < SNAP_TTL_MS && o.data && Array.isArray(o.data.rails) ? o.data : null;
    } catch (_) {
      return null;
    }
  }
  function writeSnap(tab, data) {
    for (let per = 12; per >= 3; per -= 3) {
      const slim2 = { slides: data.slides, rails: data.rails.map((r) => ({ ...r, items: r.items.slice(0, per) })) };
      const text = JSON.stringify({ at: Date.now(), data: slim2 });
      if (text.length <= SNAP_MAX) {
        set(SNAP_PREFIX + tab, text, { ttlMs: SNAP_TTL_MS });
        return;
      }
    }
  }
  const stored = () => {
    const t2 = get(TAB_KEY);
    return TAB_IDS.includes(t2) ? t2 : null;
  };
  const remember = (tab) => set(TAB_KEY, tab);
  function dataOf(tab) {
    if (memo.has(tab)) return memo.get(tab).data;
    const snap = readSnap(tab);
    if (snap) {
      memo.set(tab, { data: snap, whole: false });
      return snap;
    }
    return null;
  }
  const readKeys = () => {
    try {
      const a = JSON.parse(get(RECENT_KEY) || "[]");
      return Array.isArray(a) ? a.filter((k) => typeof k === "string") : [];
    } catch (_) {
      return [];
    }
  };
  function notePlayed(ref) {
    try {
      const key = playedKey(ref);
      if (key === "" || key.startsWith("x:")) return;
      const keys = readKeys();
      if (keys[0] === key) return;
      set(RECENT_KEY, JSON.stringify([key, ...keys.filter((k) => k !== key)].slice(0, RECENT_MAX)));
    } catch (_) {
    }
  }
  const slim = (c) => ({ id: c.id, ref: c.ref, title: c.title, kind: c.kind, ...c.poster ? { poster: c.poster } : {}, ...c.ids ? { ids: c.ids } : {}, ...c.year ? { year: c.year } : {} });
  function readHistory() {
    try {
      const a = JSON.parse(get(HIST_KEY) || "[]");
      return Array.isArray(a) ? a.filter((c) => c && typeof c.id === "string" && typeof c.ref === "string" && typeof c.title === "string").slice(0, HIST_MAX) : [];
    } catch (_) {
      return [];
    }
  }
  function rememberFound(cards) {
    try {
      const fresh = cards.slice(0, 12).map(slim);
      const ids = new Set(fresh.map((c) => c.id));
      set(HIST_KEY, JSON.stringify([...fresh, ...readHistory().filter((c) => !ids.has(c.id))].slice(0, HIST_MAX)));
    } catch (_) {
    }
  }
  let found = null;
  const details = /* @__PURE__ */ new Map();
  const paramsOf = (route) => route && route.params && typeof route.params === "object" ? route.params : {};
  const tabFromArgs = (route) => {
    const a = route && route.args && typeof route.args === "object" ? route.args : {};
    return TAB_IDS.includes(a.tab) ? a.tab : null;
  };
  function needed(tab, device) {
    const order = [tab, ...TAB_IDS.filter((t2) => t2 !== tab)];
    return order.filter((t2, i) => (i === 0 || device !== "tv") && !(memo.get(t2) && memo.get(t2).whole));
  }
  function view(ctx) {
    const st = ctx.state && typeof ctx.state === "object" ? ctx.state : {};
    if (ctx.route && ctx.route.name === "settings") return settingsView();
    if (ctx.route && ctx.route.name === "detail") {
      const p = paramsOf(ctx.route);
      if (typeof p.open === "string" && typeof p.i === "string") {
        return detailPage({ r: { ref: p.open, id: p.i, kind: p.k === "movie" ? "movie" : "series", title: typeof p.t === "string" ? p.t : "" }, entry: details.get(p.open) || null, season: Number(st.season) || 0 });
      }
    }
    if (ctx.route && ctx.route.name === "search") {
      const query = typeof st.sq === "string" ? st.sq : "";
      const items = found && found.q === query ? found.items : null;
      const status = query === "" ? "idle" : st.sstate === "fail" ? "fail" : items ? "done" : "loading";
      return searchView({ query, status, items, history: query === "" ? readHistory() : [], device: ctx.device });
    }
    const tab = TAB_IDS.includes(st.tab) ? st.tab : tabFromArgs(ctx.route) ?? stored() ?? TAB_IDS[0];
    const data = enrich(dataOf(tab));
    const loaded = TAB_IDS.map((t2) => memo.get(t2)).filter(Boolean).map((m) => m.data);
    const pending = Array.isArray(st.pending) && st.pending.length > 0;
    return browseView({ tab, data, recent: recentOf(readKeys(), loaded), pending, failed: !!(st.failed && st.failed[tab]), device: ctx.device });
  }
  async function load(tab) {
    const page = await loadTab(tab);
    const data = tabOf(page);
    if (data) {
      memo.set(tab, { data, whole: true });
      writeSnap(tab, data);
    }
    return data !== null;
  }
  const events = {
    open({ route, state, device }) {
      const tab = tabFromArgs(route) ?? (TAB_IDS.includes(state.tab) ? state.tab : stored() ?? TAB_IDS[0]);
      for (const t2 of TAB_IDS) dataOf(t2);
      const out = { state: { tab, pending: needed(tab, device), failed: null } };
      const a = route && route.args && typeof route.args === "object" ? route.args : {};
      if (typeof a.open === "string" && typeof a.i === "string" && (a.k === "movie" || a.k === "series")) {
        out.route = { push: "detail", params: { open: a.open, i: a.i, t: typeof a.t === "string" ? a.t.slice(0, 100) : "", k: a.k, d: Number(a.d) || 0, y: Number(a.y) || 0 } };
        out.state.season = null;
      }
      return out;
    },
    // A card of the list was tapped: its page goes over the list.
    openTitle({ arg }) {
      const route = pushOf(arg);
      return route ? { route, state: { season: null } } : null;
    },
    // The page's timer: loads the title once, then no timer.
    async dtick({ route }) {
      const p = paramsOf(route);
      if (typeof p.open !== "string" || details.has(p.open)) return { state: { dv: Date.now() } };
      try {
        details.set(p.open, { d: await loadDetail({ t: p.t, k: p.k, d: p.d, y: p.y }) });
      } catch (e) {
        log("browse detail", e && e.code || "error");
        details.set(p.open, { d: null });
      }
      return { state: { dv: Date.now() } };
    },
    dretry({ route }) {
      details.delete(paramsOf(route).open);
      return { state: { dv: Date.now() } };
    },
    season({ value, arg }) {
      const n = parseInt(value != null ? value : arg, 10);
      return n > 0 ? { state: { season: n } } : null;
    },
    tab({ value, arg, state }) {
      const tab = TAB_IDS.includes(value) ? value : TAB_IDS.includes(arg) ? arg : null;
      if (!tab) return null;
      remember(tab);
      dataOf(tab);
      const failed = { ...state.failed || {} };
      delete failed[tab];
      const pending = [tab, ...Array.isArray(state.pending) ? state.pending.filter((t2) => t2 !== tab) : []];
      return { state: { tab, pending: memo.get(tab) && memo.get(tab).whole ? pending.slice(1) : pending, failed } };
    },
    retry({ state, device }) {
      const tab = TAB_IDS.includes(state.tab) ? state.tab : TAB_IDS[0];
      return { state: { failed: null, pending: [tab, ...needed(tab, device).filter((t2) => t2 !== tab)] } };
    },
    async tick({ state }) {
      const pending = Array.isArray(state.pending) ? state.pending : [];
      if (pending.length === 0) return null;
      const [next, ...rest] = pending;
      const failed = { ...state.failed || {} };
      if (next.startsWith("logo:")) {
        const m = memo.get(next.slice(5));
        if (m) await logos.fill(m.data.slides, 12e3);
        return { state: { pending: rest } };
      }
      try {
        const ok = await load(next);
        if (!ok) failed[next] = true;
        else delete failed[next];
        if (ok && logos.usable()) rest.unshift("logo:" + next);
      } catch (e) {
        log("browse tab", e && e.code || "error");
        failed[next] = true;
      }
      return { state: { pending: rest, failed } };
    },
    // The search button: straight to the search page, empty and ready for the words.
    openSearch() {
      return { route: { push: "search" }, state: { sq: "", sstate: null } };
    },
    search({ value, route }) {
      const q = value && typeof value.q === "string" ? value.q.trim().slice(0, 100) : "";
      if (q === "") return null;
      const state = { sq: q, sstate: "loading" };
      return route && route.name === "search" ? { state } : { route: { push: "search" }, state };
    },
    // The search page's timer: one search per press, then no timer.
    async stick({ state }) {
      const q = typeof state.sq === "string" ? state.sq : "";
      if (q === "" || state.sstate !== "loading") return null;
      try {
        const out = await searchTitles(q);
        found = { q, items: (Array.isArray(out) ? out : []).slice(0, 60).map(cardOf) };
        rememberFound(found.items);
        return { state: { sstate: "done" } };
      } catch (e) {
        log("browse search", e && e.code || "error");
        return { state: { sstate: "fail" } };
      }
    },
    sretry({ state }) {
      return typeof state.sq === "string" && state.sq !== "" ? { state: { sstate: "loading" } } : null;
    },
    // The gear: the plugin's settings are a page of their own, one Back away.
    go({ arg }) {
      return arg === "settings" ? { route: { push: "settings" }, state: { fromBrowse: true } } : null;
    },
    back({ state, route }) {
      if (route && route.name === "settings" && !state.fromBrowse) return { close: true };
      return { route: { pop: true }, state: { sq: null, sstate: null } };
    }
  };
  async function event(ev) {
    const handler = Object.hasOwn(events, ev.name) ? events[ev.name] : null;
    return handler ? await handler({ ...ev, state: ev.state || {} }) ?? null : null;
  }
  return { view, event, notePlayed };
}

// src/plugin.js
var tmdbFailure = (e) => e && ["timeout", "network", "unavailable", "rate_limited"].includes(e.code) ? kino.error("unavailable", "tmdb: " + e.code, { userMessage: t("tmdbDown") }) : e;
async function search(query) {
  const q = typeof query === "string" ? query : query && query.q || "";
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
async function home() {
  if (!readSettings().homeRows) return [];
  return buildRows(HOME_ROWS);
}
async function browse(ref, cursor) {
  try {
    return await browsePage(ref, cursor);
  } catch (e) {
    throw tmdbFailure(e);
  }
}
async function section(arg) {
  return sectionPage(arg && arg.tab);
}
async function categories() {
  return categoryTiles();
}
async function episodes(ref) {
  const r = parseTitleRef(ref);
  if (!r || r.kind !== "series") throw kino.error("not_found", "not a series ref");
  try {
    return await seriesEpisodes(r.id);
  } catch (e) {
    throw tmdbFailure(e);
  }
}
async function resolve(ref) {
  const out = await resolveRef(ref);
  try {
    browseScreen().notePlayed(String(ref));
  } catch (_) {
  }
  return out;
}
var browseInstance = null;
var browseScreen = () => browseInstance ?? (browseInstance = makeBrowse({
  kino,
  loadTab: (tab) => sectionPage(tab),
  searchTitles: (q) => search({ q })
}));
async function screen(ctx) {
  await null;
  return browseScreen().view(ctx && typeof ctx === "object" ? ctx : {});
}
async function screenEvent(ev) {
  await null;
  return browseScreen().event(ev && typeof ev === "object" ? ev : {});
}
function clearCache() {
  let n = 0;
  for (const key of kino.storage.keys()) {
    if (["browse1:", "ani1:", "logo1"].some((p) => key.startsWith(p))) {
      kino.storage.remove(key);
      n++;
    }
  }
  return { message: t("cacheCleared", { n }) };
}
async function action(key) {
  if (key === "clearCache") return clearCache();
  return null;
}
export {
  action,
  browse,
  categories,
  episodes,
  home,
  resolve,
  screen,
  screenEvent,
  search,
  section
};
