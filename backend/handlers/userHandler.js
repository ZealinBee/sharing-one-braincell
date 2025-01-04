module.exports = (io, socket, players) => {
  const joinHandler = (playerName) => {
    let newPlayer = {
      id: socket.id,
      name: playerName,
      word: "",
      ready: false,
      lastWord: "",
    };
    players.push(newPlayer);
    io.emit("join", newPlayer, players);
  };

  socket.on("join", joinHandler);
};
