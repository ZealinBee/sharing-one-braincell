import React from "react";

import Room from "./Room";
import "../styles/components/room-list.scss";

function RoomList({ rooms }) {
  return (
    <ul className="room-list">
      {rooms.map((room) => (
        <Room room={room}/>
      ))}
    </ul>
  );
}

export default RoomList;
