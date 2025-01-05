import React from "react";

import Room from "./Room";

function RoomList({ rooms }) {

  return (
    <ul>
      {rooms.map((room) => (
        <Room room={room}/>
      ))}
    </ul>
  );
}

export default RoomList;
