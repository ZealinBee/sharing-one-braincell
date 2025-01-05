module.exports = (io, socket, rooms) => {
  const createRoomHandler = () => {
    // make unique later
    const roomId = Math.floor(1000 + Math.random() * 9000);
    rooms.push({
      roomId,
      players: [
        {
          id: socket.id,
          ready: false,
          word: "",
          previousWord: "",
        },
      ],
    });
    socket.join(roomId);
    socket.emit("roomCreated", roomId);
    // inform all clients about the new room
    io.emit("newRoom", rooms);
  };

  const joinRoomHandler = (roomId) => {
    const room = rooms.find((room) => room.roomId === Number(roomId));
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
      });
    }

    socket.join(Number(roomId));
    io.to(Number(roomId)).emit("roomUpdate", room.players);
  };

  socket.on("createRoom", createRoomHandler);
  socket.on("joinRoom", joinRoomHandler);
};
