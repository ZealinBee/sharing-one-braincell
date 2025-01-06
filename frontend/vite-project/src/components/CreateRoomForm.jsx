import { useState } from "react";

import socket from "../socket";
import "../styles/components/create-room-form.scss";

function CreateRoomForm() {
  const [playerName, setPlayerName] = useState("");

  const createRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("createRoom");
  };

  return (
    <form className="create-room-form">
      <div className="create-room-form--wrapper">
        <label htmlFor="create-room-form--name">Player Name</label>
        <input
          type="text"
          value={playerName}
          id="create-room-form--name"
          onChange={(e) => setPlayerName(e.target.value)}
        />
      </div>
      <button type="submit" onClick={(e) => createRoomHandler(e)}>
        Create Room
      </button>
    </form>
  );
}

export default CreateRoomForm;
