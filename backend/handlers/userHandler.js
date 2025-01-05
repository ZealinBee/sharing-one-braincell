module.exports = (io, socket, players) => {
  const joinHandler = () => {
    let playerName = `Player ${players.length + 1}`;
    let newPlayer = {
      id: socket.id,
      name: playerName,
      word: "",
      ready: false,
      lastWord: "",
    };
    players.push(newPlayer);
    io.emit("join", players);
  };

  socket.on("join", joinHandler);
};
