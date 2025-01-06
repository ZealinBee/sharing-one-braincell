import React from "react";
import { useNavigate } from "react-router";
import socket from "../socket";
import "../styles/components/room.scss";

function Room({ room }) {
  let navigate = useNavigate();
  const joinRoomHandler = () => {
    let playerName = prompt("Enter your name for this room");
    if (playerName === null) return;
    console.log(playerName);
    socket.emit("joinRoom", room.roomId, playerName);
    navigate(`/game/${room.roomId}`);
  };
  return (
    <li key={room.roomId} className="room-list-item">
      <h3>Room ID: {room.roomId}</h3>
      {room.gameState === "playing" ? (
        <p>Game is in progress</p>
      ) : (
        <p>Game is waiting for players</p>
      )}
      <div className="room-list-item-players">
        {room.players.map((player) => {
          return (
            <div key={player.id} className="player">
              <img src={"./user-circle.png"} alt="user-circle" />
            </div>
          );
        })}
      </div>
      {room.players.length < 4 && room.gameState === "waiting" ? (
        <button onClick={joinRoomHandler}>Join Room</button>
      ) : (
        <button className="disabled-button" disabled>
          Join Room
        </button>
      )}
    </li>
  );
}

export default Room;
