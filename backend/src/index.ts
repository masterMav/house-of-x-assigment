import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import appRouter from "./routes/routes";
import cors from "cors";
import { _init } from "./database";
dotenv.config();

_init();
const app: Express = express();
const port = process.env.PORT || 5000;
app.use(cors<Request>());
app.use(express.json());

app.use("/", appRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
