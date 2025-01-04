const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const path = require("path");
const io = new Server(server);
const fs = require("fs");

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const players = [];
let wordsArray = [];
const wordsHistory = [];

fs.readFile("words.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  wordsArray = data.split("\n").map((word) => word.trim());
});

const compareWords = () => {
  const uniqueWords = new Set(players.map((player) => player.word));
  return uniqueWords.size === 1;
};

io.on("connection", (socket) => {
  console.log(`a user connected with id ${socket.id}`);

  socket.emit("updatePlayersList", players);

  socket.on("join", (playerName) => {
    let newPlayer = {
      id: socket.id,
      name: playerName,
      word: "",
      ready: false,
      lastWord: "",
    };
    players.push(newPlayer);
    io.emit("join", newPlayer, players);
  });

  socket.on("updatePlayersList", (players) => {
    io.emit("updatePlayersList", players);
  });

  socket.on("startGame", () => {
    wordsHistory.length = 0;
    const wordsToAddToHistory = [];
    players.forEach((player) => {
      const randomIndex = Math.floor(Math.random() * wordsArray.length);
      player.lastWord = wordsArray[randomIndex];
      wordsToAddToHistory.push(player.lastWord);
    });
    wordsHistory.push(wordsToAddToHistory);
    io.emit("startGame", players);
  });

  socket.on("win", () => {
    io.emit("win", wordsHistory);
  });

  socket.on("resetGame", () => {
    players.forEach((player) => {
      player.word = "";
      player.ready = false;
      player.lastWord = "";
    });
    wordsHistory.length = 0;
    io.emit("resetGame");
  });

  socket.on("ready", (word) => {
    const player = players.find((player) => player.id === socket.id);
    player.ready = true;
    player.word = word;
    io.emit("ready", players);

    if (players.every((player) => player.ready)) {
      const wordsToAddToHistory = [];
      players.forEach((player) => {
        player.ready = false;
        player.lastWord = player.word;
        wordsToAddToHistory.push(player.word);
      });
      wordsHistory.push(wordsToAddToHistory);
      const doesWordsMatch = compareWords();
      io.emit("compareWords", players, doesWordsMatch);
    }
  });

  socket.on("disconnect", () => {
    console.log(`user disconnected with id ${socket.id}`);
    const leavingPlayer = players.find((player) => player.id === socket.id);
    players.splice(players.indexOf(leavingPlayer), 1);
    io.emit("leave", players);
  });
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
