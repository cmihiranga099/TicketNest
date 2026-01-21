import type { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server | null = null;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: true,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("join_showtime", (showtimeId: string) => {
      socket.join(`showtime:${showtimeId}`);
    });

    socket.on("leave_showtime", (showtimeId: string) => {
      socket.leave(`showtime:${showtimeId}`);
    });
  });

  return io;
}

function getIo() {
  if (!io) {
    return null;
  }
  return io;
}

export function emitSeatLocks(showtimeId: string, seatIds: string[]) {
  const socket = getIo();
  if (!socket) {
    return;
  }
  socket.to(`showtime:${showtimeId}`).emit("seat_locks", { seatIds });
}

export function emitSeatUnlocks(showtimeId: string, seatIds: string[]) {
  const socket = getIo();
  if (!socket) {
    return;
  }
  socket.to(`showtime:${showtimeId}`).emit("seat_unlocks", { seatIds });
}

export function emitSeatBooked(showtimeId: string, seatIds: string[]) {
  const socket = getIo();
  if (!socket) {
    return;
  }
  socket.to(`showtime:${showtimeId}`).emit("seat_booked", { seatIds });
}
