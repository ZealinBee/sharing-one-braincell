var socket = io();
const playersList = document.querySelector(".players");
const startGameButton = document.querySelector(".start-game-button");
const wordInput = document.querySelector(".word-input");
const readyButton = document.querySelector(".ready-button");
const winningPanel = document.querySelector(".winning-panel");
const resetGameButton = document.querySelector(".reset-game-button");
const sameWordButton = document.querySelector(".same-word-button");
const losingPanel = document.querySelector(".losing-panel");
const wordsHistoryList = document.querySelector(".words-history");
const wordForm = document.querySelector(".word-form");

startGameButton.addEventListener("click", () => {
  if (playersList.children.length < 2) {
    alert("You need at least 2 players to start the game");
    return;
  }
  if (playersList.children.length > 4) {
    alert("You can't have more than 4 players");
    return;
  }
  socket.emit("startGame");
});

readyButton.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("ready", wordInput.value);
});

resetGameButton.addEventListener("click", () => {
  socket.emit("resetGame");
  socket.emit("startGame");
});

sameWordButton.addEventListener("click", () => {
  socket.emit("win");
});

const updatePlayersListHandler = (players) => {
  playersList.innerHTML = players
    .map((player) => {
      return `<li><b>Name: </b> ${player.name}  ${
        player.lastWord ? "<b>Previous Word</b>: " + player.lastWord : ""
      } ${player.ready ? "<b>READY</b>" : ""}</li>`;
    })
    .join("");
};

socket.on("connect", () => {
  socket.on("updatePlayersList", (playersList) => {
    socket.emit("join", `player ${playersList.length + 1}`);
  });
});

socket.on("join", (newPlayer, players) => {
  updatePlayersListHandler(players);
});

socket.on("startGame", (players) => {
  startGameButton.style.display = "none";
  wordForm.style.display = "block";
  document.querySelector(".word-form").style.display = "block";
  updatePlayersListHandler(players);
});

socket.on("ready", (players) => {
  updatePlayersListHandler(players);
});

socket.on("compareWords", (players, doesWordsMatch) => {
  updatePlayersListHandler(players);
  if (doesWordsMatch) {
    socket.emit("win");
    return;
  }
  losingPanel.style.display = "block";
  wordInput.value = "";
});

socket.on("win", (wordsHistory) => {
  winningPanel.style.display = "block";
  losingPanel.style.display = "none";
  wordForm.style.display = "none";
  wordsHistoryList.innerHTML = wordsHistory
    .map((words, index) => {
      return `<li>Round ${index + 1}: ${words
        .map((word) => {
          return `<b>${word} </b>`;
        })
        .join(" ")}</li>`;
    })
    .join("");
});

socket.on("resetGame", () => {
  winningPanel.style.display = "none";
  losingPanel.style.display = "none";
  wordInput.value = "";
});

socket.on("leave", (players) => {
  updatePlayersListHandler(players);
});
