const RoomState = require("../modules/roomState");
const registerRoomHandlers = require("./roomHandler");

const registerSocketHandler = (io, socket) => {
  const onDisconnecting = () => {
    const roomId = Array.from(socket.rooms)[1];
    // if the player is inside a room, initiate the leave room handler
    if (roomId) {
      const players = RoomState.getRoom(Number(roomId)).players;
      const updatedPlayers = players.filter(
        (player) => player.id !== socket.id
      );
      const room = RoomState.getRoom(Number(roomId));
      room.players = updatedPlayers;
      RoomState.updateRoom(room);
      socket.leave(Number(roomId));

      if (updatedPlayers.length === 0) {
        RoomState.removeRoom(Number(roomId));
      } else {
        io.to(Number(roomId)).emit("roomUpdate", updatedPlayers);
      }
      io.emit("roomsUpdate", RoomState.getAllRooms());
    }
  };

  socket.on("disconnecting", onDisconnecting);
  socket.on("disconnect", () => {
    console.log(`user disconnected with id ${socket.id}`);
  });
};
module.exports = registerSocketHandler;
