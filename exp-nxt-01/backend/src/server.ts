import { toNodeHandler } from "better-auth/node";
import express, { type Request, type Response } from "express";
import { auth } from "./utils/auth/auth.ts";
import cors from "cors";
import authRouter from "./routes/auth.routes.ts";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.use("/api", authRouter);

app.get("/", (request: Request, response: Response) => {
  console.log("server is running good");
  response.send("Server is up");
});

export default app;
