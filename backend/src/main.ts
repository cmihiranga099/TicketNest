import dotenv from "dotenv";
import http from "http";
import { createApp } from "./app.js";
import { initSocket } from "./socket.js";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const app = createApp();
const server = http.createServer(app);

initSocket(server);

server.listen(port, () => {
  console.log(`TicketNest API listening on :${port}`);
});
