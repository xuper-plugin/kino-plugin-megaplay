// resolve(ref): a Megaplay copy of a movie or an episode, in the audio the person prefers, with the other audio as a lazy
// alternative (`x:<audio>:<ref>`, resolved only when chosen). The TMDB-to-AniList match is kept, so a series is looked up once.
import { t } from "./i18n.js";
import { tmdb, isAnime } from "./tmdb.js";
import { parseTitleRef, parseCopyRef, copyRef } from "./refs.js";
import { anilistId, megaplayStream } from "./megaplay.js";
import { readSettings } from "./settings.js";

const MATCH_PREFIX = "ani1:";
const MATCH_TTL_MS = 30 * 24 * 3600 * 1000;

const notFound = () => kino.error("not_found", "megaplay has no copy", { userMessage: t("notFound") });

/** What a title ref plays: the TMDB record, whether it is a movie, and the season/episode. Throws when it is not anime. */
async function titleOf(parsed) {
  const isMovie = parsed.kind === "movie";
  let show;
  try {
    show = await tmdb(`/${isMovie ? "movie" : "tv"}/${parsed.id}`);
  } catch (e) {
    kino.log("[megaplay] tmdb", (e && e.code) || "error");
    throw kino.error("unavailable", "tmdb: " + ((e && e.code) || "error"), { userMessage: t("tmdbDown") });
  }
  if (!isAnime(show)) throw kino.error("not_found", "not an anime", { userMessage: t("notAnime") });
  return { show, isMovie, season: parsed.season || 1, episode: isMovie ? 1 : parsed.episode };
}

/** The AniList id for [title], from the kept match or a new lookup (null when AniList has none). */
async function matchOf({ show, isMovie, season }) {
  const key = `${MATCH_PREFIX}${isMovie ? "m" : "s"}:${show.id}:${isMovie ? 0 : season}`;
  try {
    const kept = Number(kino.storage.get(key));
    if (kept > 0) return kept;
  } catch (_) { /* no storage: look it up */ }
  const seasonInfo = !isMovie && season > 1 ? (show.seasons || []).find((s) => s.season_number === season) : null;
  const seasonYear = seasonInfo && seasonInfo.air_date ? Number(seasonInfo.air_date.slice(0, 4)) : null;
  const id = await anilistId(show, isMovie, seasonYear);
  if (id) { try { kino.storage.set(key, String(id), { ttlMs: MATCH_TTL_MS }); } catch (_) { /* asked again next time */ } }
  return id;
}

const labelled = (stream, audio) => ({ ...stream, label: t(audio) });

/** `resolve(ref)`. */
export async function resolveRef(ref) {
  const copy = parseCopyRef(ref);
  const parsed = parseTitleRef(copy ? copy.ref : ref);
  if (!parsed || parsed.kind === "series") throw notFound();
  const title = await titleOf(parsed);
  let aniId;
  try {
    aniId = await matchOf(title);
  } catch (e) {
    kino.log("[megaplay] anilist", (e && e.code) || "error");
  }
  if (!aniId) throw notFound();

  // A lazy copy: only that audio.
  if (copy) {
    const s = await megaplayStream(aniId, title.episode, copy.audio).catch(() => null);
    if (!s) throw notFound();
    return labelled(s, copy.audio);
  }

  const first = readSettings().audio;
  const other = first === "sub" ? "dub" : "sub";
  const main = await megaplayStream(aniId, title.episode, first).catch((e) => { kino.log("[megaplay] copy", first, (e && e.code) || "error"); return null; });
  if (main) return { ...labelled(main, first), alternatives: [{ ref: copyRef(other, ref), label: t(other) }] };
  const fallback = await megaplayStream(aniId, title.episode, other).catch(() => null);
  if (fallback) return labelled(fallback, other);
  throw notFound();
}
