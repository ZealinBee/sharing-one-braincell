module.exports = (io, socket, players, wordsHistory, initialInGameWords) => {
  const startGame = () => {
    wordsHistory.length = 0;
    const wordsToAddToHistory = [];
    players.forEach((player) => {
      const randomIndex = Math.floor(Math.random() * initialInGameWords.length);
      player.lastWord = initialInGameWords[randomIndex];
      wordsToAddToHistory.push(player.lastWord);
    });
    wordsHistory.push(wordsToAddToHistory);
    io.emit("startGame", players);
  };

  const gameWon = () => {
    io.emit("gameWon", wordsHistory);
  };

  const resetGame = () => {
    players.forEach((player) => {
      player.word = "";
      player.ready = false;
      player.lastWord = "";
    });
    wordsHistory.length = 0;
    io.emit("resetGame");
  };

  const ready = (word) => {
    const player = players.find((player) => player.id === socket.id);
    player.ready = true;
    player.word = word;
    io.emit("ready", players);

    if (players.every((player) => player.ready)) {
      const wordsToAddToHistory = [];
      players.forEach((player) => {
        player.ready = false;
        player.lastWord = player.word;
        wordsToAddToHistory.push(player.word);
      });
      wordsHistory.push(wordsToAddToHistory);
      const doesWordsMatch =
        new Set(players.map((player) => player.word.toLowerCase())).size === 1;
      io.emit("compareWords", players, doesWordsMatch);
    }
  };

  socket.on("startGame", startGame);
  socket.on("gameWon", gameWon);
  socket.on("resetGame", resetGame);
  socket.on("ready", ready);
};
