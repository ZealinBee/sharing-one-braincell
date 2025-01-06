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

const registerGameHandlers = require("./handlers/gameHandler");
const registerRoomHandlers = require("./handlers/roomHandler");
const RoomState = require("./modules/roomState");

let initialInGameWords = [];

app.use(express.static(path.join(__dirname, "../frontend/dist/")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

fs.readFile("words.txt", "utf8", (err, data) => {
  initialInGameWords = data.split("\n").map((word) => word.trim());
});

io.on("connection", (socket) => {
  console.log(`a user connected with id ${socket.id}`);
  // give the client the list of players upon connection
  socket.emit("newConnection", RoomState.rooms);

  registerGameHandlers(io, socket, initialInGameWords);
  registerRoomHandlers(io, socket);
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
