import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

interface LecturerRequest extends Request {
    lecturer?: User;
}
// Middleware to check if the user is a lecturer
export const isLecturer = async (req: LecturerRequest, res: Response, next: NextFunction): Promise<void> => {
    const lecturerIdStr =
        req.body?.lecturerId || req.query?.lecturerId || req.params?.id;

    const lecturerId = parseInt(lecturerIdStr ?? "", 10);

    if (isNaN(lecturerId)) {
        res.status(400).json({ message: "Invalid or missing lecturer ID" });
        return;
    }

    try {
        const userRepo = AppDataSource.getRepository(User);
        const lecturer = await userRepo
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.role", "role")
            .leftJoinAndSelect("user.courses", "course")
            .where("user.user_id = :lecturerId", { lecturerId })
            .andWhere("role.role_name = :roleName", { roleName: "lecturer" })
            .getOne();

        if (!lecturer) {
            res.status(403).json({ message: "Access denied. Not a lecturer." });
            return;
        }

        req.lecturer = lecturer;
        next();
    } catch (error) {
        console.error("Lecturer middleware error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
