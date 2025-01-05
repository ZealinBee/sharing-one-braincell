import { useState, useEffect } from "react";

import socket from "./socket";
import "./styles/global.scss";
import GamePage from "./pages/GamePage";

function App() {
  // const [isConnected, setIsConnected] = useState(false);

  // useEffect(() => {
  //   const onConnect = () => {
  //     setIsConnected(true);
  //   };

  //   const onDisconnect = () => {
  //     setIsConnected(false);
  //   };
  //   socket.on("connect", onConnect);
  //   socket.on("disconnect", onDisconnect);

  //   return () => {
  //     socket.off("connect", onConnect);
  //     socket.off("disconnect", onDisconnect);
  //   };
  // }, []);

  return <>
    <GamePage />
  </>;
}

export default App;
