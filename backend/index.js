const express = require("express");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const httpServer = require("http").createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const registerUserHandlers = require("./handlers/userHandler");
const registerGameHandlers = require("./handlers/gameHandler");
const registerSocketHandlers = require("./handlers/socketHandler");

const players = [];
let initialInGameWords = [];
const wordsHistory = [];

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

fs.readFile("words.txt", "utf8", (err, data) => {
  initialInGameWords = data.split("\n").map((word) => word.trim());
});

io.on("connection", (socket) => {
  console.log(`a user connected with id ${socket.id}`);
  // give the client the list of players upon connection
  socket.emit("updatePlayersList", players);

  registerUserHandlers(io, socket, players);
  registerGameHandlers(io, socket, players, wordsHistory, initialInGameWords);
  registerSocketHandlers(io, socket, players);
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
