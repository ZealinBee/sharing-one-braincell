import { useEffect, useState } from "react";

import "../styles/pages/gamepage.scss";
import socket from "../socket";

function GamePage() {
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [wordInput, setWordInput] = useState("");
  const [gameState, setGameState] = useState("");
  const [wordsHistory, setWordsHistory] = useState([]);
  useEffect(() => {
    const onConnect = () => {
      socket.emit("join");
    };

    const onJoin = (players) => {
      setPlayers(players);
    };

    const onStartGame = (players) => {
      setGameStarted(true);
      setPlayers(players);
    };

    const onReady = (players) => {
      setPlayers(players);
    };

    const onGameWon = (wordsHistory) => {
      setGameState("won");
      setWordsHistory(wordsHistory);
    };

    const onCompareWords = (players, doesWordsMatch) => {
      setPlayers(players);
      if (doesWordsMatch) {
        socket.emit("gameWon");
        return;
      }
      setGameState("nextround");
      setWordInput("");
    };

    const onResetGame = () => {
      setGameState("");
      setWordInput("");
    }

    const onLeave = (players) => {
      setPlayers(players);
    }

    socket.on("connect", onConnect);
    socket.on("join", onJoin);
    socket.on("startGame", onStartGame);
    socket.on("ready", onReady);
    socket.on("gameWon", onGameWon);
    socket.on("compareWords", onCompareWords);
    socket.on("resetGame", onResetGame);
    socket.on("leave", onLeave);

    return () => {
      socket.off("connect", onConnect);
      socket.off("join", onJoin);
      socket.off("startGame", onStartGame);
      socket.off("ready", onReady);
      socket.off("gameWon", onGameWon);
      socket.off("compareWords", onCompareWords);
      socket.off("resetGame", onResetGame);
      socket.off("leave", onLeave);
    };
  }, []);

  const startGameHandler = () => {
    if (players.length < 2) {
      alert("You need at least 2 players to start the game");
      return;
    }
    if (players.length > 4) {
      alert("You can't have more than 4 players");
      return;
    }
    socket.emit("startGame");
  };

  const readyHandler = (e) => {
    e.preventDefault();
    socket.emit("ready", wordInput);
  };

  const resetGameHandler = () => {
    socket.emit("resetGame");
    socket.emit("startGame");
  }

  return (
    <>
      <h2 className="title">Try to Guess the Same Word</h2>
      <ul className="players">
        {players.map((player) => (
          <li key={player.id}>
            <b>Name:</b> {player.name}{" "}
            {player.lastWord && <b>Previous Word:</b>} {player.lastWord}{" "}
            {player.ready && <b>READY</b>}
          </li>
        ))}
      </ul>
      {gameStarted ? (
        <form className="word-form">
          <input
            type="text"
            className="word-input"
            placeholder="your word"
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
          />
          <button className="ready-button" type="submit" onClick={readyHandler}>
            Ready
          </button>
        </form>
      ) : (
        <button className="start-game-button" onClick={startGameHandler}>
          Start Game
        </button>
      )}
      {gameState === "won" && (
        <div className="winning-panel">
          <h2 className="winning-title">
            Congrats! Yall Got One Braincell FRFR
          </h2>
          <h3>Your attempts:</h3>
          <ul className="words-history">
            {wordsHistory.map((words, index) => (
              <li key={index}>
                Round {index}:{" "}
                {words.map((word, wordIndex) => (
                  <b key={wordIndex}>
                    {word}
                    {wordIndex < words.length - 1 ? " - " : ""}
                  </b>
                ))}
              </li>
            ))}
          </ul>
          <button className="reset-game-button" onClick={resetGameHandler}>Reset Game</button>
        </div>
      )}
      {gameState === "nextround" && (
        <div className="losing-panel">
          <h3>Press yes if it was actually just the same word</h3>
          <button
            className="same-word-button"
            onClick={() => socket.emit("gameWon")}
          >
            Yes
          </button>
        </div>
      )}
    </>
  );
}

export default GamePage;
