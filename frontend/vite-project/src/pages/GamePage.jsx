import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import "../styles/pages/gamepage.scss";
import socket from "../socket";

function GamePage() {
  let navigate = useNavigate();
  const location = useLocation();
  const roomId = location.pathname.split("/")[2];
  const [wordInput, setWordInput] = useState("");
  const [players, setPlayers] = useState([]);

  const [game, setGame] = useState({
    roomId: "",
    isGameStarted: false,
    wordsHistory: [],
    gameState: "waiting", // playing, won, nextround, waiting
  });

  useEffect(() => {
    socket.emit("joinRoom", roomId);
  }, [location]);

  useEffect(() => {
    const onRoomUpdate = (players) => {
      setPlayers(players);
    };

    const onStartGame = (game, updatedPlayers) => {
      setGame(game);
      setPlayers([...updatedPlayers]);
    };

    const onReady = (players) => {
      setPlayers([...players]);
    };

    const onGameWon = (game) => {
      setGame(game);
      console.log(game);
    };

    const onNextRound = (game, players) => {
      setGame(game);
      setPlayers([...players]);
      setWordInput("");
    };

    socket.on("roomUpdate", onRoomUpdate);
    socket.on("startGame", onStartGame);
    socket.on("ready", onReady);
    socket.on("gameWon", onGameWon);
    socket.on("nextRound", onNextRound);
    return () => {
      socket.off("onRoomUpdate", onRoomUpdate);
      socket.off("startGame", onStartGame);
      socket.off("ready", onReady);
      socket.off("gameWon", onGameWon);
      socket.off("nextRound", onNextRound);
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
    socket.emit("startGame", roomId, players);
  };

  const readyHandler = (e) => {
    e.preventDefault();
    socket.emit("ready", wordInput, game, players);
  };

  const resetGameHandler = () => {
    socket.emit("resetGame");
    socket.emit("startGame");
  };

  const leaveRoomHandler = () => {
    socket.emit("leaveRoom", roomId, players);
    navigate("/");
  }

  return (
    <>
      <button onClick={leaveRoomHandler}>Back To Lobby</button>
      <h2 className="title">Try to Guess the Same Word</h2>
      <ul className="players">
        {players.map((player) => (
          <li key={player.id}>
            <b>Name:</b> {player.id} {player.previousWord && <b>Previous Word:</b>}{" "}
            {player.previousWord} {player.ready && <b>READY</b>}
          </li>
        ))}
      </ul>
      {game.isGameStarted && (
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
      )}
      {
        game.gameState === "waiting" && (
          <button className="start-button" onClick={startGameHandler}>
            Start Game
          </button>
        )
      }
      {game.gameState === "won" && (
        <div className="winning-panel">
          <h2 className="winning-title">
            Congrats! Yall Got One Braincell FRFR
          </h2>
          <h3>Your attempts:</h3>
          <ul className="words-history">
            {game.wordsHistory.map((words, index) => (
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
          <button className="reset-game-button" onClick={resetGameHandler}>
            Reset Game
          </button>
        </div>
      )}
      {game.gameState === "nextround" && (
        <div className="losing-panel">
          <h3>Press yes if it was actually just the same word</h3>
          <button
            className="same-word-button"
            onClick={() => socket.emit("gameWon", game)}
          >
            Yes
          </button>
        </div>
      )}
    </>
  );
}

export default GamePage;
