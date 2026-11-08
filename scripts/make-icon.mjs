// Draws icon.png: a rounded square with a purple-to-pink gradient, a white play triangle, the word "ANIME" under it and an
// anime-style sparkle.
// Deterministic, no dependencies: `node scripts/make-icon.mjs`.
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SIZE = 256;
const SS = 4; // supersampling per axis, for smooth edges

function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) {
    let c = (crc ^ b) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "latin1");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, crc]);
}

// Shapes, in a 0..256 space.
const R = 60; // corner radius of the tile
function inTile(x, y) {
  const cx = Math.min(Math.max(x, R), SIZE - R);
  const cy = Math.min(Math.max(y, R), SIZE - R);
  return (x - cx) ** 2 + (y - cy) ** 2 <= R * R;
}

// Play triangle, slightly right of centre so it looks centred, above the word.
const TRI = [[104, 46], [104, 140], [182, 93]];

// "ANIME" under the play, drawn as strokes: each letter is segments in a 0..1 box.
const LETTERS = {
  A: [[0, 1, 0.5, 0], [0.5, 0, 1, 1], [0.22, 0.62, 0.78, 0.62]],
  N: [[0, 1, 0, 0], [0, 0, 1, 1], [1, 1, 1, 0]],
  I: [[0.2, 0, 0.8, 0], [0.2, 1, 0.8, 1], [0.5, 0, 0.5, 1]],
  M: [[0, 1, 0, 0], [0, 0, 0.5, 0.62], [0.5, 0.62, 1, 0], [1, 0, 1, 1]],
  E: [[0, 0, 0, 1], [0, 0, 1, 0], [0, 0.5, 0.8, 0.5], [0, 1, 1, 1]],
};
const WORD = "ANIME", LW = 26, LH = 34, GAP = 10, STROKE = 3.4, TEXT_TOP = 166;
const WORD_LEFT = (SIZE - (WORD.length * LW + (WORD.length - 1) * GAP)) / 2;
const SEGMENTS = [...WORD].flatMap((ch, i) => LETTERS[ch].map(([x1, y1, x2, y2]) => {
  const ox = WORD_LEFT + i * (LW + GAP);
  return [ox + x1 * LW, TEXT_TOP + y1 * LH, ox + x2 * LW, TEXT_TOP + y2 * LH];
}));
function inWord(x, y) {
  for (const [x1, y1, x2, y2] of SEGMENTS) {
    const dx = x2 - x1, dy = y2 - y1;
    const k = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
    if ((x - x1 - k * dx) ** 2 + (y - y1 - k * dy) ** 2 <= STROKE * STROKE) return true;
  }
  return false;
}
function inTriangle(x, y) {
  const [[ax, ay], [bx, by], [cx, cy]] = TRI;
  const s = (px, py, qx, qy) => (x - qx) * (py - qy) - (px - qx) * (y - qy);
  const d1 = s(ax, ay, bx, by), d2 = s(bx, by, cx, cy), d3 = s(cx, cy, ax, ay);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
}

// Four-point sparkle: |dx|^p + |dy|^p <= r^p with p < 1 gives the concave star.
function inSparkle(x, y, sx, sy, r) {
  const p = 0.5;
  return Math.abs(x - sx) ** p + Math.abs(y - sy) ** p <= r ** p;
}

const TOP = [124, 58, 237]; // violet
const BOTTOM = [219, 39, 119]; // pink

/** The icon's pixels; [behind] (an RGB colour) fills what is outside the tile, else it stays transparent. */
function draw(behind) {
const raw = Buffer.alloc(SIZE * (SIZE * 4 + 1));
for (let y = 0; y < SIZE; y++) {
  raw[y * (SIZE * 4 + 1)] = 0; // filter: none
  for (let x = 0; x < SIZE; x++) {
    let a = 0, r = 0, g = 0, b = 0;
    for (let j = 0; j < SS; j++) {
      for (let i = 0; i < SS; i++) {
        const px = x + (i + 0.5) / SS, py = y + (j + 0.5) / SS;
        if (!inTile(px, py)) continue;
        const t = (px + py) / (2 * SIZE);
        let c = TOP.map((v, k) => v + (BOTTOM[k] - v) * t);
        if (inTriangle(px, py) || inWord(px, py) || inSparkle(px, py, 198, 50, 26) || inSparkle(px, py, 216, 84, 10)) c = [255, 255, 255];
        a += 1; r += c[0]; g += c[1]; b += c[2];
      }
    }
    const o = y * (SIZE * 4 + 1) + 1 + x * 4;
    const n = SS * SS;
    if (behind) {
      // Blend the tile over the solid colour: an opaque picture.
      for (let k = 0; k < 3; k++) raw[o + k] = Math.round(([r, g, b][k] + behind[k] * (n - a)) / n);
      raw[o + 3] = 255;
    } else {
      if (a) { raw[o] = Math.round(r / a); raw[o + 1] = Math.round(g / a); raw[o + 2] = Math.round(b / a); }
      raw[o + 3] = Math.round((a / n) * 255);
    }
  }
}
return raw;
}

function png(raw) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(SIZE, 0);
  ihdr.writeUInt32BE(SIZE, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// icon.png: transparent corners (Kino masks it on its cards). logo-bar.png: the screen's bar logo, its corners painted in the
// theme's surface colour (#1B1430, the bar's), because an Image's transparent pixels show white there.
for (const [name, behind] of [["icon.png", null], ["logo-bar.png", [0x1b, 0x14, 0x30]]]) {
  const bytes = png(draw(behind));
  writeFileSync(fileURLToPath(new URL("../" + name, import.meta.url)), bytes);
  console.log(`${name} ${SIZE}x${SIZE}, ${bytes.length} bytes`);
}
