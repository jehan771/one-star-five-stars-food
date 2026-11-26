// One Star, Five Stars for the Food — entry program.
//
// Writes exactly one sentence (an alien tourist's one-star review of Earth
// that still compliments the food) to /output/entry.txt, after asserting the
// competition gate itself: UTF-8 text, 1 to 200 characters, a single sentence,
// no surrounding whitespace. The text is fixed: a deterministic program must
// produce byte-identical output on every run.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const SENTENCE =
  "One star: Earth is 70% water and still charges me for a bottle of it, " +
  "but the bakso broth was so good I drank it with all four hands.";

function fail(message: string): never {
  throw new Error(`gate failed: ${message}`);
}

// --- gate checks, before anything is written ---
const trimmed = SENTENCE.trim();
if (trimmed.length < 1 || trimmed.length > 200) {
  fail(`length ${trimmed.length} outside 1..200 characters`);
}
if (trimmed !== SENTENCE) fail("sentence has surrounding whitespace");
if (/\s/.test(SENTENCE[0]) || /\s/.test(SENTENCE[SENTENCE.length - 1])) {
  fail("sentence starts or ends with whitespace");
}
// Exactly one sentence: one terminal period, at the very end, none earlier.
const periods = [...SENTENCE].filter((c) => c === ".").length;
if (periods !== 1 || !SENTENCE.endsWith(".")) {
  fail(`expected exactly one sentence, found ${periods} periods`);
}
if (/[\n\r]/.test(SENTENCE)) fail("sentence contains a line break");
if (Buffer.byteLength(SENTENCE, "utf8") !== SENTENCE.length) {
  fail("sentence is not pure ASCII/UTF-8 single-byte text");
}

// --- write, then read back and verify ---
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", SENTENCE, "utf8");
const back = readFileSync("/output/entry.txt", "utf8");
if (back !== SENTENCE) fail("read-back mismatch after write");
console.log(
  `wrote ${back.length} characters (${Buffer.byteLength(back, "utf8")} bytes) to /output/entry.txt`,
);
