import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import commentRoutes from './routes/comment.routes';
import authRoutes from './routes/auth.routes';
import cors from "cors";
import { seed } from "./seeds/seed";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Test connection
app.get("/ping", (_req: Request, res: Response) => {
    res.send("pong");
});

// Routes
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

AppDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!");
        await seed();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });