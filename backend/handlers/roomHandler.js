const RoomState = require("../modules/roomState");

const registerRoomHandlers = (io, socket) => {
  const createRoomHandler = (creatorName, maxPlayers) => {
    // make unique later
    const roomId = Math.floor(1000 + Math.random() * 9000);
    RoomState.addRoom({
      roomId,
      gameState: "waiting",
      maxPlayers,
      players: [
        {
          id: socket.id,
          ready: false,
          word: "",
          previousWord: "",
          name: creatorName,
        },
      ],
    });
    socket.join(roomId);
    socket.emit("roomCreated", roomId);
    // inform all clients about the new room
    io.emit("roomsUpdate", RoomState.getAllRooms());
  };

  const joinRoomHandler = (roomId, playerName) => {
    const room = RoomState.getRoom(Number(roomId));
    if (!room) {
      socket.emit("roomNotFound");
      return;
    }
    const isAlreadyInRoom = room.players.find(
      (player) => player.id === socket.id
    );
    if (!isAlreadyInRoom) {
      room.players.push({
        id: socket.id,
        ready: false,
        word: "",
        previousWord: "",
        name: playerName,
      });
    }
    RoomState.updateRoom(room);
    socket.join(Number(roomId));
    io.to(Number(roomId)).emit("roomUpdate", room.players);
    io.emit("roomsUpdate", RoomState.getAllRooms());
  };

  const leaveRoomHandler = (roomId, players) => {
    const updatedPlayers = players.filter((player) => player.id !== socket.id);
    const room = RoomState.getRoom(Number(roomId));
    room.players = updatedPlayers;
    RoomState.updateRoom(room);
    socket.leave(Number(roomId));

    if (updatedPlayers.length === 0) {
      RoomState.removeRoom(Number(roomId));
    } else {
      io.to(Number(roomId)).emit("roomUpdate", updatedPlayers);
    }
    console.log("rooms");
    console.log(RoomState.getAllRooms());
    io.emit("roomsUpdate", RoomState.getAllRooms());
  };

  socket.on("createRoom", createRoomHandler);
  socket.on("joinRoom", joinRoomHandler);
  socket.on("leaveRoom", leaveRoomHandler);
};

module.exports = registerRoomHandlers;
