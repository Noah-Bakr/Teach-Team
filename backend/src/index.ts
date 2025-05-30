import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import commentRoutes from './routes/comment.routes';
import authRoutes from './routes/auth.routes';
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Test connection
app.get("/ping", (_req: Request, res: Response) => {
    res.send("pong");
});

// Routes
app.use("/api/comments", commentRoutes);
app.use("/api/auth", authRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) =>
        console.log("Error during Data Source initialization:", error)
    );