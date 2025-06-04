import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import authRoutes from './routes/auth.routes';
import cors from "cors";
import { seed } from "./seeds/seed";
import cookieParser from "cookie-parser";
import academicCredentialRoutes from "./routes/academicCredential.routes";
import applicationRoutes from "./routes/application.routes";
import previousRoleRoutes from "./routes/previousRole.routes";
import roleRoutes from "./routes/role.routes";
import skillsRoutes from "./routes/skills.routes";
import reviewRoutes from "./routes/review.routes";
import courseRoutes from "./routes/course.routes";
import userRoutes from "./routes/user.routes";

const app = express();
const PORT = Number(process.env.PORT) || 3001;
//const PORT = process.env.PORT || 3001;

// Log every request, to see exactly what path Express sees
app.use((req, res, next) => {
    console.log(`Incoming request → ${req.method} ${req.path}`);
    next();
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes

app.use("/api/academic-credentials", academicCredentialRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/previous-roles", previousRoleRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/users", userRoutes);

AppDataSource.initialize()
    .then(async () => {
        console.log("Data Source has been initialised!");
        await seed();
        app.listen(PORT, "::", () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialisation:", err);
    });