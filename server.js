const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const PORT = 3000;

const gameResults = [];

app.get("/", (req, res) => {
  res.send("Memory Card Game Backend is working!");
});

app.get("/api/game", (req, res) => {
  res.json({
    game: "Memory Card Game",
    cards: 20,
    pairs: 10,
    shapes: [
      "circle",
      "diamond",
      "flower",
      "heart",
      "hexagon",
      "moon",
      "spade",
      "square",
      "star",
      "triangle"
    ]
  });
});

app.get("/api/cards", (req, res) => {
  res.json([
    "circle",
    "diamond",
    "flower",
    "heart",
    "hexagon",
    "moon",
    "spade",
    "square",
    "star",
    "triangle"
  ]);
});

app.use(express.json());
app.post("/api/results", (req, res) => {
  const result = req.body;

  gameResults.push(result);

  console.log("Game Result:", result);

  res.json({
    message: "Game result saved!",
    result: result
  });
});

app.get("/api/results", (req, res) => {
  res.json(gameResults);
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});