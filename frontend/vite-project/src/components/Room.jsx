import React from "react";
import { useNavigate } from "react-router";
import "../styles/components/room.scss";

import socket from "../socket";

function Room({ room }) {
  let navigate = useNavigate();
  const joinRoomHandler = () => {
    socket.emit("joinRoom", room.roomId);
    navigate(`/game/${room.roomId}`);
  };
  return (
    <li key={room.roomId} className="room-list-item">
      <p>Room ID: {room.roomId}</p>
      <p>{room.players.length}/4 Players</p>
      <button onClick={joinRoomHandler}>Join Room</button>
    </li>
  );
}

export default Room;
