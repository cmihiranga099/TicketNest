import { io, Socket } from "socket.io-client";
import { getApiBaseUrl, getToken } from "./client";

let socket: Socket | null = null;

export function getSocket() {
  if (socket) {
    return socket;
  }
  socket = io(getApiBaseUrl(), {
    transports: ["websocket"],
    auth: {
      token: getToken()
    }
  });
  return socket;
}

export function resetSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
