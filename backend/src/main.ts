import dotenv from "dotenv";
import { createApp } from "./app.js";

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const app = createApp();

app.listen(port, () => {
  console.log(`TicketNest API listening on :${port}`);
});
