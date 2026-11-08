# Megaplay (plugin de Kino)

Anime japonés, series y películas, subtitulado al español (y a otros idiomas) o doblado. El catálogo sale del TMDB de Kino
(`kino.tmdb`, sin llave propia); los episodios, de Megaplay, buscados por el id de AniList y el número de episodio.

## Qué tiene

- **Pantalla propia** (Kino 0.9.74+): barra con el logo, pestañas Inicio / Series / Películas, carrusel con el logo de cada
  título, filas con "Ver más", "Continuar viendo", buscador con historial y página de título (fondo, datos, géneros, reparto
  con fotos, temporadas con sus episodios y "Más como esto"). En TV las pestañas y la búsqueda van en la barra.
- **Sección en Kino** con las mismas pestañas, **categorías** por género y **filas en el Inicio** de Kino.
- **Reproducción:** la versión preferida (subtitulada o doblada, en Ajustes) y la otra como segunda opción; subtítulos en
  hasta 30 idiomas con el de la persona primero; marcas para **saltar la intro y los créditos**.
- Todo texto en español e inglés.

## Estructura

```
src/
  plugin.js        lo que Kino llama (search, home, browse, section, categories, episodes, resolve, screen…)
  i18n.js          textos en español e inglés
  refs.js          formato de las referencias (m:, s:, e:, x:, d:)
  tmdb.js          kino.tmdb, filtro de anime, episodios
  catalog.js       filas, pestañas, "Ver más" y categorías
  megaplay.js      AniList → Megaplay → enc-dec.app, subtítulos, intro/créditos
  resolve.js       versión preferida y copia alternativa
  settings.js      ajustes
  browse/          la pantalla propia (index, view, detail, model, logos, logo)
scripts/
  make-icon.mjs    dibuja icon.png y logo-bar.png
  package.mjs      arma dist/<id>-<versión>.kinoplugin
test/              pruebas (incluye que plugin.js esté al día)
plugin.js          el archivo único que Kino carga (generado)
```

## Comandos

```bash
npm install
npm run build      # src/ → plugin.js
npm test
npm run package    # build + dist/megaplay-<versión>.kinoplugin
npm run icon       # vuelve a dibujar los iconos
```

## Instalar

En Kino ▸ Plugins ▸ **+**, tipo **Kino**, escribe `xuper-plugin/kino-plugin-megaplay` y pulsa **Agregar**. También aparece
en «De la comunidad». Sin internet: `npm run package` y en Kino ▸ Plugins ▸ + ▸ "Importar plugin desde un archivo".

Cada quien es responsable del plugin que instala: Kino solo lista los plugins de la comunidad.

## Probar
Para probar con el kit de Kino: `node <kino>/plugins/sdk/validate.mjs .` y `node <kino>/plugins/sdk/run.mjs . screen`.

---

# Megaplay (Kino plugin) — English

Japanese animation, series and movies, subtitled (Spanish and other languages) or dubbed. The catalog is Kino's TMDB
(`kino.tmdb`, no key of its own); the episodes come from Megaplay, found by AniList id and episode number. It has its own
screen (tabs, banner slider, rows, search with history, title page with cast and seasons), a section, genre categories,
Home rows, the preferred audio with the other as an alternative copy, up to 30 subtitle languages and intro/credits skip
marks. Install it in Kino ▸ Plugins ▸ + with the address `xuper-plugin/kino-plugin-megaplay`. Build with `npm run build`,
test with `npm test`, package with `npm run package` (a `.kinoplugin` file for Kino ▸ Plugins ▸ + ▸ "Import plugin from a
file").
