import { io } from "socket.io-client";

let socket;

function getSocket() {
  if (!socket) {
    socket = io("http://localhost:3000");
    // socket = io(window.location.origin, {
    //   secure: true,
    //   rejectUnauthorized: false,
    // });
  }
  return socket;
}
socket = getSocket();

export default socket;
