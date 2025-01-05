// module.exports = (io, socket, rooms) => {
//   const disconnect = () => {
//     console.log(`user disconnected with id ${socket.id}`);
//     console.log(rooms);
//     const room = rooms.find((room) => room.players.includes(socket.id));
//     console.log(room);

//     if (!room) return;
//   };

//   socket.on("disconnect", disconnect);
// };
