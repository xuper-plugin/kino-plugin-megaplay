// Every text the person sees, in Spanish (neutral, tuteo) and English, picked by kino.lang. Screen trees carry both at once
// (`both`), so a language change needs no new call.

const WORDS = {
  es: {
    // catalog rows
    rowPopular: "Populares ahora",
    rowAiring: "En emisión",
    rowTopSeries: "Series mejor valoradas",
    rowMovies: "Películas de anime",
    rowTopMovies: "Películas mejor valoradas",
    rowNewMovies: "Películas recientes",
    rowSeriesPopular: "Series populares",
    rowMoviesPopular: "Películas populares",
    rowAction: "Acción y aventura",
    rowComedy: "Comedia",
    rowDrama: "Drama",
    rowFantasy: "Fantasía y ciencia ficción",
    rowMystery: "Misterio",
    rowFamily: "Para toda la familia",
    rowRomance: "Romance",
    rowAdventure: "Aventura",
    rowScifi: "Ciencia ficción",
    rowHorror: "Terror",
    // tabs
    tabHome: "Inicio",
    tabSeries: "Series",
    tabMovies: "Películas",
    // categories
    catSeries: "Series: {g}",
    catMovies: "Películas: {g}",
    // resolve
    notFound: "Megaplay no tiene este episodio.",
    notAnime: "Megaplay solo tiene anime.",
    tmdbDown: "El catálogo no responde ahora. Intenta de nuevo en un rato.",
    sub: "Subtitulado",
    dub: "Doblado",
    // settings actions
    cacheCleared: "Listo: se borraron {n} datos guardados.",
    // browse screen
    brWatch: "Ver",
    brInfo: "Más información",
    brMore: "Ver más",
    brRecent: "Continuar viendo",
    brSearch: "Buscar",
    brSearchHint: "Buscar anime",
    brSearchTitle: "Buscar",
    brSearchedBefore: "Buscado recientemente",
    brNoResults: "No encontramos anime con esas palabras.",
    brSearchFailed: "No se pudo buscar. Revisa tu conexión e inténtalo de nuevo.",
    brFailed: "No se pudo cargar esta sección. Revisa tu conexión e inténtalo de nuevo.",
    brRetry: "Reintentar",
    brEmpty: "Aún no hay nada aquí.",
    brBack: "Atrás",
    brClose: "Cerrar",
    brSettings: "Configuración",
    // title page
    dEpisodeN: "Episodio {n}",
    dSeasonN: "Temporada {n}",
    dSeasonsN: "{n} temporadas",
    dSeasonOne: "1 temporada",
    dSeriesGo: "Ver episodios",
    dMore: "Más opciones",
    dCreators: "Creación: {v}",
    dDirector: "Dirección: {v}",
    dCast: "Reparto",
    dEpisodes: "Episodios",
    dSimilar: "Más como esto",
    dSeeInKino: "Ver en Kino",
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
    dSeeInKino: "Open in Kino",
  },
};

const fill = (text, vars) => String(text).replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] != null ? String(vars[k]) : m));

/** "en" when Kino runs in English, else "es". */
export function langOf(kino = globalThis.kino) {
  return String((kino && kino.lang) || "").toLowerCase().startsWith("en") ? "en" : "es";
}

/** The sentence for [key] in the person's language, its `{name}` placeholders filled from [vars]. */
export function t(key, vars, kino = globalThis.kino) {
  const words = WORDS[langOf(kino)];
  return fill(words[key] ?? WORDS.es[key] ?? key, vars);
}

/** [key] in both languages: `{ es, en }`. */
export function both(key, vars) {
  return { es: fill(WORDS.es[key] ?? key, vars), en: fill(WORDS.en[key] ?? WORDS.es[key] ?? key, vars) };
}

export const KEYS = { es: Object.keys(WORDS.es), en: Object.keys(WORDS.en) };
