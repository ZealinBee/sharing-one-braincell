const RoomState = require("../modules/roomState");

const registerGameHandler = (io, socket, initialInGameWords) => {
  const startGame = (roomId, players) => {
    RoomState.updateRoomGameStateById(Number(roomId), "playing");
    const wordsHistory = [];
    const game = {
      roomId,
      wordsHistory,
      isGameStarted: true,
      gameState: "playing",
    };
    const wordsToPushToHistory = [];
    players.forEach((player) => {
      const randomIndex = Math.floor(Math.random() * initialInGameWords.length);
      player.previousWord = initialInGameWords[randomIndex];

      // Since it is a 2D array [[word1, word2], [word1, word2]], push word to history
      wordsToPushToHistory.push(player.previousWord);
    });

    game.wordsHistory.push(wordsToPushToHistory);
    io.to(Number(roomId)).emit("startGame", game, players);
  };

  const resetGame = () => {
    players.forEach((player) => {
      player.word = "";
      player.ready = false;
      player.previousWord = "";
    });
    wordsHistory.length = 0;
    io.emit("resetGame");
  };

  const ready = (word, game, players) => {
    const player = players.find((player) => player.id === socket.id);
    player.ready = true;
    player.word = word;
    io.to(Number(game.roomId)).emit("ready", players);

    if (!players.every((player) => player.ready)) {
      return;
    }
    // if all players are ready
    const wordsToPushToHistory = [];
    players.forEach((player) => {
      player.ready = false;
      player.previousWord = player.word;
      wordsToPushToHistory.push(player.word);
    });
    game.wordsHistory.push(wordsToPushToHistory);
    const doesWordsMatch =
      new Set(players.map((player) => player.word.toLowerCase())).size === 1;
    if (doesWordsMatch) {
      game.gameState = "won";
      game.isGameStarted = false;
      io.to(Number(game.roomId)).emit("gameWon", game, players);
    } else {
      game.gameState = "nextround";
      io.to(Number(game.roomId)).emit("nextRound", game, players);
    }
  };

  const gameWon = (game) => {
    console.log(game);
    game.gameState = "won";
    game.isGameStarted = false;
    io.to(Number(game.roomId)).emit("gameWon", game);
  };

  socket.on("startGame", startGame);
  socket.on("gameWon", gameWon);
  socket.on("resetGame", resetGame);
  socket.on("ready", ready);
};

module.exports = registerGameHandler;
