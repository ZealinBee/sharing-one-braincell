import React from "react";
import { useNavigate } from "react-router";

import socket from "../socket";

function Room({ room }) {
  let navigate = useNavigate();
  const joinRoomHandler = () => {
    socket.emit("joinRoom", room.roomId);
    navigate(`/game/${room.roomId}`);
  };
  return (
    <li key={room.roomId}>
      <p>{room.roomId}</p>
      <button onClick={joinRoomHandler}>Join Room</button>
    </li>
  );
}

export default Room;
