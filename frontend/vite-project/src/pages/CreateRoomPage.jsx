import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import socket from "../socket";
import "../styles/pages/create-room-page.scss";

function CreateRoomPage() {
  let navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  useEffect(() => {
    const onRoomCreated = (roomId) => {
      socket.emit("joinRoom", roomId, playerName);
      navigate(`/game/${roomId}`);
    };

    socket.on("roomCreated", onRoomCreated);

    return () => {
      socket.off("roomCreated", onRoomCreated);
    };
  }, []);

  const createRoomHandler = (e) => {
    e.preventDefault();
    let creatorName = playerName;
    if(playerName.trim() === "") {
      creatorName = "Guest";
    }
    socket.emit("createRoom", creatorName, maxPlayers);
  };
  return (
    <div className="create-room-page">
      <Link to="/">
        <button>Back to Lobby</button>
      </Link>
      <h1>Create a Room</h1>
      <form className="create-room-form">
        <label htmlFor="create-room-form--name">Player Name</label>
        <input
          type="text"
          value={playerName}
          id="create-room-form--name"
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Guest"
        />
        <label htmlFor="max-players">Max Players</label>
        <select
          name="max-players"
          id="max-players"
          onChange={(e) => setMaxPlayers(e.target.value)}
          value={maxPlayers}
        >
          <option value="2">2 Players</option>
          <option value="3">3 Players</option>
          <option value="4">4 Players</option>
        </select>
        <button type="submit" onClick={(e) => createRoomHandler(e)}>
          Create Room
        </button>
      </form>
    </div>
  );
}

export default CreateRoomPage;
