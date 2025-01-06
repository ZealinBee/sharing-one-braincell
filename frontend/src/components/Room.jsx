import React from "react";
import { useNavigate } from "react-router";
import { faCircle as solidCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle as emptyCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import socket from "../socket";
import "../styles/components/room.scss";

function Room({ room }) {
  let navigate = useNavigate();
  console.log(room);
  let roomMaxPlayers = Number(room.maxPlayers);
  const playersWithEmptySlots = new Array(roomMaxPlayers).fill(null);

  const joinRoomHandler = () => {
    let playerName = prompt("Enter your name for this room");
    if (playerName === null) return;
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
        {console.log(room.maxPlayers)}
        {playersWithEmptySlots.map((_, index) => {
          const player = room.players[index];
          return (
            <div key={index} className="player">
              {player ? (
                <FontAwesomeIcon icon={solidCircle} />
              ) : (
                <FontAwesomeIcon icon={emptyCircle} />
              )}
            </div>
          );
        })}
      </div>
      {room.players.length < room.maxPlayers && room.gameState === "waiting" ? (
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
