import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import commentRoutes from './routes/comment.routes';
import authRoutes from './routes/auth.routes';
import cors from "cors";
import { seed } from "./seeds/seed";
import cookieParser from "cookie-parser";
import academicCredentialRoutes from "./routes/academicCredential.routes";
import applicationRoutes from "./routes/application.routes";
import previousRoleRoutes from "./routes/previousRole.routes";
import roleRoutes from "./routes/role.routes";
import skillsRoutes from "./routes/skills.routes";
import applicationRankingRoutes from "./routes/applicationRanking.routes";
import courseRoutes from "./routes/course.routes";
import userRoutes from "./routes/user.routes";

const app = express();
const PORT = Number(process.env.PORT) || 3001;
//const PORT = process.env.PORT || 3001;

// (1) Log every request, to see exactly what path Express sees
app.use((req, res, next) => {
    console.log(`Incoming request → ${req.method} ${req.path}`);
    next();
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Test connection
app.get("/ping", (_req: Request, res: Response) => {
    res.send("pong");
});

// Routes

app.use("/api/academic-credentials", academicCredentialRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/application-rankings", applicationRankingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/previous-roles", previousRoleRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/users", userRoutes);

AppDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialized!");
        // By passing `"::"` as the second argument, Express will accept both IPv4 and IPv6.
        await seed();
        app.listen(PORT, "::", () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });