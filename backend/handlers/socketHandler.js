module.exports = (io, socket, players) => {
  const disconnect = () => {
    console.log(`user disconnected with id ${socket.id}`);
    const leavingPlayer = players.find((player) => player.id === socket.id);
    players.splice(players.indexOf(leavingPlayer), 1);
    io.emit("leave", players);
  };

  socket.on("disconnect", disconnect);
};
