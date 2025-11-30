import { toNodeHandler } from "better-auth/node";
import express, { type Request, type Response } from "express";
import { auth } from "./utils/auth/auth";
import cors from "cors";
import authRouter from "./routes/auth/auth.routes";
import blogRouter from "./routes/blogs/blog.routes";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL!],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.use("/api", authRouter);
app.use("/api", blogRouter);

app.get("/", (request: Request, response: Response) => {
  console.log("server is running good");
  console.log("Server is up and running..");
  response.send("Server is up");
});

export default app;
