const express = require("express");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const httpServer = require("http").createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const registerUserHandlers = require("./handlers/userHandler");
const registerGameHandlers = require("./handlers/gameHandler");
const registerSocketHandlers = require("./handlers/socketHandler");
const registerRoomHandlers = require("./handlers/roomHandler");
const RoomState = require("./modules/roomState");

let initialInGameWords = [];

app.use(express.static(path.join(__dirname, "../frontend/vite-project/dist/")));

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/vite-project/dist/index.html")
  );
});

fs.readFile("words.txt", "utf8", (err, data) => {
  initialInGameWords = data.split("\n").map((word) => word.trim());
});

io.on("connection", (socket) => {
  console.log(`a user connected with id ${socket.id}`);
  // give the client the list of players upon connection
  socket.emit("newConnection", RoomState.rooms);

  // registerUserHandlers(io, socket, players);
  registerGameHandlers(io, socket, initialInGameWords);
  // registerSocketHandlers(io, socket, rooms);
  registerRoomHandlers(io, socket);
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
