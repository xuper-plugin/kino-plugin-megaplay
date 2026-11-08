// Megaplay: anime episodes by AniList id and episode number. The player page names Megaplay's own id for the episode; its
// sources come encrypted and enc-dec.app opens them. Megaplay answers only its own player's AJAX calls, and serves the video
// only to a request that names it as the Referer.
import { langOf } from "./i18n.js";

export const MPY = "https://megaplay.buzz";
const ENC = "https://enc-dec.app/api";
const ANILIST = "https://graphql.anilist.co";
export const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36";
const AJAX = { "User-Agent": UA, Origin: MPY, Referer: `${MPY}/`, "X-Requested-With": "XMLHttpRequest" };
const MAX_SUBTITLES = 30; // what Kino keeps

/** The AniList id of the anime behind a TMDB title, or null. A later TMDB season is its own AniList entry (found by its year). */
export async function anilistId(show, isMovie, seasonYear) {
  const query = "query($q:String){Page(perPage:10){media(search:$q,type:ANIME){id format startDate{year}}}}";
  for (const q of [show.original_name || show.original_title, show.name || show.title].filter(Boolean)) {
    const res = await kino.fetch(ANILIST, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query, variables: { q } }),
    });
    if (!res.ok) continue;
    const list = (await res.json())?.data?.Page?.media || [];
    const kinds = isMovie ? ["MOVIE"] : ["TV", "TV_SHORT", "ONA"];
    const fit = list.filter((m) => kinds.includes(m.format));
    const pick = (seasonYear && fit.find((m) => m.startDate?.year === seasonYear)) || fit[0];
    if (pick) return pick.id;
  }
  return null;
}

// Megaplay names each subtitle file by its ISO 639-2 code (`spa-5.vtt`, `chi-26.vtt`): the 639-1 code Kino wants.
const ISO3 = {
  ara: "ar", bul: "bg", chi: "zh", zho: "zh", cze: "cs", ces: "cs", dan: "da", dut: "nl", nld: "nl", eng: "en", fin: "fi",
  fre: "fr", fra: "fr", ger: "de", deu: "de", gre: "el", ell: "el", heb: "he", hin: "hi", hun: "hu", ind: "id", ita: "it",
  jpn: "ja", kor: "ko", may: "ms", msa: "ms", nob: "nb", nor: "no", pol: "pl", por: "pt", rum: "ro", ron: "ro", rus: "ru",
  slo: "sk", slk: "sk", spa: "es", swe: "sv", tha: "th", tur: "tr", ukr: "uk", vie: "vi", fil: "fil", tgl: "tl",
};

/** The ISO 639-1 code of a Megaplay subtitle, from its file name, else "und". */
export function langFrom(url) {
  const code = /\/([a-z]{3})-\d+\.vtt(?:\?|$)/i.exec(String(url))?.[1]?.toLowerCase();
  return (code && ISO3[code]) || "und";
}

/** The person's language first, then Spanish and English, then the rest in Megaplay's order. */
export function bySubtitlePreference(subs, lang = langOf()) {
  const order = [lang, "es", "en"];
  const rank = (s) => { const i = order.indexOf(s.lang); return i < 0 ? order.length : i; };
  return subs.map((s, i) => [s, i]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map(([s]) => s);
}

const subFormat = (url) => (/\.vtt(\?|$)/i.test(String(url)) ? "vtt" : "srt");

/** Megaplay's intro/outro marks as the Stream's `skip`, or null when it has none. */
export function skipOf(data) {
  const s = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
  const intro = data && data.intro, outro = data && data.outro;
  const out = {};
  if (intro && s(intro.end) > s(intro.start)) { out.openingStartMs = s(intro.start) * 1000; out.openingEndMs = s(intro.end) * 1000; }
  if (outro && s(outro.end) > s(outro.start) && s(outro.start) > 0) out.endingStartMs = s(outro.start) * 1000;
  return Object.keys(out).length ? out : null;
}

/** One copy of AniList [aniId]'s episode [episode] in [audio] ("sub" or "dub"), as a Kino Stream, or null. */
export async function megaplayStream(aniId, episode, audio) {
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
    body: JSON.stringify({ text: data.enc }),
  });
  if (!dec.ok) return null;
  const file = (await dec.json())?.result?.file;
  if (!file) return null;

  const skip = skipOf(data);
  return {
    url: file,
    mime: "application/x-mpegURL",
    headers: { "User-Agent": UA, Referer: `${MPY}/`, Origin: MPY },
    subtitles: bySubtitlePreference((data.tracks || [])
      .filter((tr) => tr.kind === "captions" && tr.file)
      .map((tr) => ({ lang: langFrom(tr.file), url: tr.file, format: subFormat(tr.file), ...(tr.label ? { label: String(tr.label).slice(0, 60) } : {}) })))
      .slice(0, MAX_SUBTITLES),
    ...(skip ? { skip } : {}),
  };
}
