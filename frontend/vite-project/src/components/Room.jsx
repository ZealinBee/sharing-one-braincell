import React from "react";
import { Link } from "react-router";
import "../styles/components/room.scss";

function Room({ room }) {
  console.log(room);
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
        <Link to={`/game/${room.roomId}`} className="join-room">
          <button>Join Room</button>
        </Link>
      ) : (
        <button className="disabled-button" disabled>
          Join Room
        </button>
      )}
    </li>
  );
}

export default Room;
