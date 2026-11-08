// TMDB through Kino's own key (kino.tmdb): no key of ours. Kino lets one plugin make 20 calls every 10 s on it, so every
// list is one call and a series' seasons come 20 at a time.
import { langOf, t } from "./i18n.js";
import { movieRef, seriesRef, episodeRef } from "./refs.js";

const IMG = "https://image.tmdb.org/t/p/";
export const ANIMATION = 16; // TMDB's "Animation" genre

/** One kino.tmdb call in the person's language. */
export async function tmdb(path, params = {}) {
  await null;
  if (typeof kino.tmdb !== "function") {
    throw kino.error("unavailable", "kino.tmdb missing (Kino older than 0.9.53)", { userMessage: t("tmdbDown") });
  }
  return kino.tmdb(path, { language: langOf() === "en" ? "en-US" : "es-MX", ...params });
}

/** Whether a TMDB title (a list entry or a full record) is Japanese animation. */
export function isAnime(m) {
  if (!m) return false;
  const genres = m.genre_ids || (m.genres || []).map((g) => g.id);
  return genres.includes(ANIMATION) && (m.original_language === "ja" || (m.origin_country || []).includes("JP"));
}

const img = (size, path) => (typeof path === "string" && path.startsWith("/") ? IMG + size + path : undefined);
const yearOf = (d) => (typeof d === "string" && /^\d{4}/.test(d) ? Number(d.slice(0, 4)) : undefined);

/** A Kino item from a TMDB list entry. [kind] when the list does not say (discover lists). */
export function toItem(m, kind) {
  const isMovie = kind ? kind === "movie" : m.media_type === "movie";
  const item = {
    // Kino takes only A-Z a-z 0-9 . _ ~ - in an id.
    id: `${isMovie ? "m" : "s"}-${m.id}`,
    ref: isMovie ? movieRef(m.id) : seriesRef(m.id),
    title: m.title || m.name || "",
    kind: isMovie ? "movie" : "series",
    ids: { tmdb: m.id },
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

/** Japanese animation matching [query] (movies and series), safe ones only. */
export async function searchAnime(query) {
  const data = await tmdb("/search/multi", { query });
  return (data.results || [])
    .filter((m) => (m.media_type === "movie" || m.media_type === "tv") && isAnime(m) && !m.adult)
    .map((m) => toItem(m));
}

/** A series' episodes, flat. TMDB appends at most 20 seasons to one answer: one call per 20 seasons. */
export async function seriesEpisodes(id) {
  const show = await tmdb(`/tv/${id}`);
  const seasons = (show.seasons || []).filter((s) => s.season_number > 0);
  const batches = [];
  for (let i = 0; i < seasons.length; i += 20) batches.push(seasons.slice(i, i + 20));
  const answers = await Promise.all(batches.map((b) =>
    tmdb(`/tv/${id}`, { append_to_response: b.map((s) => `season/${s.season_number}`).join(",") })));
  const fetched = batches.flatMap((b, i) => b.map((s) => answers[i][`season/${s.season_number}`] || {}));
  const episodes = fetched.flatMap((sd, i) => (sd.episodes || []).map((ep) => {
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
      ...(img("w342", show.poster_path) ? { poster: img("w342", show.poster_path) } : {}),
      ...(img("w780", show.backdrop_path) ? { backdrop: img("w780", show.backdrop_path) } : {}),
      ...(show.overview ? { overview: show.overview } : {}),
      ids: { tmdb: Number(id) },
    },
    episodes,
  };
}
