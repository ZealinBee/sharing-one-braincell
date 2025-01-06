import { useState, useEffect } from "react";
import { Link } from "react-router";

import "./styles/global.scss";
import socket from "./socket";
import RoomList from "./components/RoomList";
import { useRooms } from "./context/RoomContext";

function App() {
  const { rooms, setRooms } = useRooms();
  useEffect(() => {
    const onNewConnection = (rooms) => {
      setRooms(rooms);
    };

    const onRoomsUpdate = (rooms) => {
      setRooms([...rooms]);
    };

    socket.on("newConnection", onNewConnection);
    socket.on("roomsUpdate", onRoomsUpdate);

    return () => {
      socket.off("newConnection", onNewConnection);
      socket.off("roomsUpdate", onRoomsUpdate);
    };
  }, []);

  return (
    <>
      <h2>Join a Room</h2>
      {rooms.length === 0 && <p>No rooms available. Create one!</p>}
      <RoomList rooms={rooms} />
      <div className="home-button-wrappers">
        <Link to="create-room">
          {" "}
          <button>Create Room</button>
        </Link>

        {/* <button className="join-button">Join a Private Room by Code</button> */}
      </div>
    </>
  );
}

export default App;
