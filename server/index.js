import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 8080;
const TOKEN_FILE = path.resolve("my-token-app/data/tokens.json");

app.use(cors());

app.get("/new-tokens", (req, res) => {
  if (!fs.existsSync(TOKEN_FILE)) return res.json([]);

  const tokens = JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8"));
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  const recent = tokens.filter((t) => t.discoveredAt > cutoff);
  res.json(recent);
});

app.listen(PORT, () => {
  console.log(`API listening at http://localhost:${PORT}`);
});
