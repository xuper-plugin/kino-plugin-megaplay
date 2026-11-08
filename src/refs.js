// Refs (what Kino hands back to resolve, episodes and browse):
//   m:<tmdb>                      a movie
//   s:<tmdb>                      a series
//   e:<tmdb>:<season>:<episode>   an episode
//   x:<sub|dub>:<m:… or e:…>      a lazy copy in the other audio (a Stream's alternative)
//   d:<row id>                    a catalog row ("Ver más"), see catalog.js

export const movieRef = (id) => `m:${id}`;
export const seriesRef = (id) => `s:${id}`;
export const episodeRef = (id, season, episode) => `e:${id}:${season}:${episode}`;
export const copyRef = (audio, ref) => `x:${audio}:${ref}`;

/** `{ kind: "movie"|"series"|"episode", id, season?, episode? }` of a title ref, or null. */
export function parseTitleRef(ref) {
  const r = String(ref || "");
  let m = /^([ms]):(\d{1,10})$/.exec(r);
  if (m) return { kind: m[1] === "m" ? "movie" : "series", id: Number(m[2]) };
  m = /^e:(\d{1,10}):(\d{1,3}):(\d{1,5})$/.exec(r);
  if (m) return { kind: "episode", id: Number(m[1]), season: Number(m[2]), episode: Number(m[3]) };
  return null;
}

/** `{ audio, ref }` of a lazy copy ref, or null. */
export function parseCopyRef(ref) {
  const m = /^x:(sub|dub):(.+)$/.exec(String(ref || ""));
  return m && parseTitleRef(m[2]) ? { audio: m[1], ref: m[2] } : null;
}
