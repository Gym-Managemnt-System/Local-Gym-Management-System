const crypto = require("crypto");

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

/**
 * Generates a username. If a name/seed is provided, it's used as the base
 * (e.g. "Nadeesha Perera" -> "nadeesha.perera47"); otherwise a generic
 * "member####" handle is produced.
 */
function generateUsername(seed) {
  const suffix = crypto.randomInt(10, 9999);
  if (seed && seed.trim().length > 0) {
    const parts = seed.trim().split(/\s+/).map(slugify).filter(Boolean);
    const base = parts.length > 1 ? `${parts[0]}.${parts[parts.length - 1]}` : parts[0];
    if (base) return `${base}${suffix}`;
  }
  return `member${suffix}`;
}

/**
 * Generates a random password that always includes at least one lowercase,
 * one uppercase, one digit, and one symbol.
 */
function generatePassword(length = 12) {
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const upper = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const digits = "23456789";
  const symbols = "!@#$%^&*-_+=";
  const all = lower + upper + digits + symbols;

  const pick = (chars) => chars[crypto.randomInt(0, chars.length)];

  const required = [pick(lower), pick(upper), pick(digits), pick(symbols)];
  const rest = Array.from({ length: Math.max(length - required.length, 0) }, () => pick(all));

  const combined = [...required, ...rest];
  // Fisher-Yates shuffle
  for (let i = combined.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined.join("");
}

module.exports = { generateUsername, generatePassword };
