import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import "./styles/global.scss";
import socket from "./socket";
import RoomList from "./components/RoomList";
import CreateRoomForm from "./components/CreateRoomForm";

function App() {
  let navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [createRoomForm, setCreateRoomForm] = useState(false);
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

    const onRoomsUpdate = (rooms) => {
      setRooms([...rooms]);
    }

    socket.on("roomCreated", onRoomCreated);
    socket.on("newConnection", onNewConnection);
    socket.on("newRoom", onNewRoom);
    socket.on("roomsUpdate", onRoomsUpdate);

    return () => {
      socket.off("roomCreated", onRoomCreated);
      socket.off("newConnection", onNewConnection);
      socket.off("newRoom", onNewRoom);
      socket.off("roomsUpdate", onRoomsUpdate);
    };
  }, []);

  const createRoomHandler = () => {
    socket.emit("createRoom");
  };
  return (
    <>
      <h2>Join a Room</h2>
      {
        rooms.length === 0 && <p>No rooms available. Create one!</p>
      }
      <RoomList rooms={rooms} />
      <div className="home-button-wrappers">
        <button className="create-room-button" onClick={createRoomHandler}>
          Create Room
        </button>
        {/* <button className="join-button">Join a Private Room by Code</button> */}
      </div>
      {
        createRoomForm && <CreateRoomForm />
      }
    </>
  );
}

export default App;
