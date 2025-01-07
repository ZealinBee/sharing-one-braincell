import React from "react";

import "../styles/components/player.scss";

function Player({ player, gameState}) {
  return (
    <li key={player.id} className={`player ${player.ready ? "ready" : ""}`}>
      <p>Name: {player.name}</p>
      {player.previousWord && (
        <>
          <h1>Previous Word: {player.previousWord}</h1>
        </>
      )}
      {player.ready && <b className="word-ready">WORD READY</b>}
    </li>
  );
}

export default Player;
