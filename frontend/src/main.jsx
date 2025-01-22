import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App.jsx";
import GamePage from "./pages/GamePage.jsx";
import CreateRoomPage from "./pages/CreateRoomPage.jsx";
import { RoomProvider } from "./context/RoomContext.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


createRoot(document.getElementById("root")).render(
  <RoomProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/game/:id" element={<GamePage />} />
        <Route path="create-room" element={<CreateRoomPage />} />
      </Routes>
    </BrowserRouter>
  </RoomProvider>
);
