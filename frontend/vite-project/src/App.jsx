import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import "./styles/global.scss";
import socket from "./socket";
import RoomList from "./components/RoomList";

function App() {
  let navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    const onRoomCreated = (roomId) => {
      navigate(`/game/${roomId}`);
    };

    const onNewConnection = (rooms) => {
      setRooms(rooms);
    };

    const onNewRoom = (rooms) => {
      setRooms(rooms);
    };

    socket.on("roomCreated", onRoomCreated);
    socket.on("newConnection", onNewConnection);
    socket.on("newRoom", onNewRoom);

    return () => {
      socket.off("roomCreated", onRoomCreated);
      socket.off("newConnection", onNewConnection);
      socket.off("newRoom", onNewRoom);
    };
  }, []);

  const createRoomHandler = () => {
    socket.emit("createRoom");
  };

  return (
    <>
      <h2>Join a Room</h2>
      <RoomList rooms={rooms} />
      <div className="home-button-wrappers">
        <button className="create-room-button" onClick={createRoomHandler}>
          Create Room
        </button>
        {/* <button className="join-button">Join a Private Room by Code</button> */}
      </div>
    </>
  );
}

export default App;
