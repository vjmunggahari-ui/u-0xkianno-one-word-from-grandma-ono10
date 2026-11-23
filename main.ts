// One Word From Grandma: writes one word to entry.txt.
// The word is the whole entry: exactly one word, 1-30 characters.
// "Allie" — grandma hears "AI" as a person's name. Warm, baffled,
// funny in one word, tied to AI by the homophone, and fresh.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "Allie";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || join(process.cwd(), "output");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, WORD, "utf8");

// Gate: exactly one word, UTF-8 byte length 1..30, not only whitespace.
const words = WORD.trim().split(/\s+/);
if (words.length !== 1) {
  throw new Error(`entry has ${words.length} words, need exactly 1`);
}
if (Buffer.byteLength(WORD, "utf8") === 0 || Buffer.byteLength(WORD, "utf8") > 30) {
  throw new Error(`entry byte length ${Buffer.byteLength(WORD, "utf8")} outside 1..30`);
}
if (WORD.trim().length === 0) {
  throw new Error("entry is only whitespace");
}
if (WORD !== WORD.trim() || /\s/.test(WORD)) {
  throw new Error("entry has leading/trailing whitespace or inner whitespace");
}

// Read-back verification: the file on disk must be byte-identical to the word.
const back = readFileSync(outPath, "utf8");
if (back !== WORD) {
  throw new Error("read-back mismatch: entry.txt differs from the chosen word");
}

// Second read-back, byte level: the raw bytes on disk must equal the word's
// UTF-8 encoding exactly (guards against any encoding or newline drift).
const backBytes = readFileSync(outPath);
const wordBytes = Buffer.from(WORD, "utf8");
if (!backBytes.equals(wordBytes)) {
  throw new Error("byte read-back mismatch: entry.txt bytes differ from the chosen word");
}
if (backBytes.length !== 5) {
  throw new Error(`entry.txt is ${backBytes.length} bytes, expected 5 for "Allie"`);
}
console.log(`wrote entry.txt (1 word, ${WORD.length} chars, ${Buffer.byteLength(WORD, "utf8")} bytes)`);
