const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const fs = require("fs");
const path = require("path");

const TOKEN_FILE = path.resolve(__dirname, "../data/tokens.json");

async function fetchCurrentTokens() {
  const res = await fetch("https://api.hyperliquid.xyz/info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "spotMeta" }),
  });

  const data = await res.json();
  return data.tokens;
}

function loadKnownTokens() {
  if (!fs.existsSync(TOKEN_FILE)) return [];
  return JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8"));
}

function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}

(async () => {
  const current = await fetchCurrentTokens();
  const known = loadKnownTokens();
  const knownIds = new Set(known.map((t) => t.address));

  const newTokens = current.filter((t) => !knownIds.has(t.token));

  const timestamped = newTokens.map((t) => ({
    name: t.name,
    symbol: t.symbol,
    address: t.token,
    discoveredAt: Date.now(),
  }));

  const all = [...known, ...timestamped];
  saveTokens(all);

  console.log(`✅ Added ${timestamped.length} new token(s).`);
})();
