import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Course } from "../entity/Course";
import { Application } from "../entity/Application";
import { Review } from "../entity/Review";

export class LecturerController {
    // GET /lecturer/:id/courses
    async getCourses(req: Request, res: Response) {
        try {
            const lecturer = req.lecturer;

            if (!lecturer) {
                return res.status(403).json({ message: "Lecturer not attached" });
            }

            return res.status(200).json(lecturer.courses);
        } catch (err) {
            console.error('Error fetching courses for lecturer:', err);
            return res.status(500).json({ message: 'Error fetching lecturers', err });
        }
    }

    // GET /lecturer/:id/applications/all
    async getAllApplicationsByLecturer(req: Request, res: Response) {
        const lecturer = req.lecturer;

        if (!lecturer) {
            return res.status(403).json({ message: "Lecturer not attached to request" });
        }

        const courseIds = lecturer.courses.map((c: Course) => c.course_id);

        if (!courseIds.length) {
            return res.status(200).json([]); // Lecturer has no assigned courses
        }

        try {
            const applications = await AppDataSource.getRepository(Application)
                .createQueryBuilder("application")
                .leftJoinAndSelect("application.user", "user")
                .leftJoinAndSelect("user.skills", "skills")
                .leftJoinAndSelect("user.academicCredentials", "credentials")
                .leftJoinAndSelect("user.previousRoles", "previousRoles")
                .leftJoinAndSelect("application.course", "course")
                .leftJoinAndSelect("course.skills", "courseSkills")
                .leftJoinAndSelect("application.reviews", "review", "review.lecturer = :lecturerId", { lecturerId: lecturer.user_id })
                .where("application.course IN (:...courseIds)", { courseIds })
                .getMany();

            return res.status(200).json(applications);
        } catch (error) {
            console.error("Error fetching applications:", error);
            return res.status(500).json({ message: "Error fetching applications", error });
        }
    }


    // GET /lecturer/:id/applications?courseId=X
    async getApplications(req: Request, res: Response) {
        const lecturer = req.lecturer;
        if (!lecturer) {
            return res.status(403).json({ message: "Lecturer not attached to request" });
        }

        const courseId = Number(req.query.courseId);

        if (isNaN(courseId)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        const isAssigned = lecturer.courses.some((c: Course) => c.course_id === courseId);
        if (!isAssigned) {
            return res.status(403).json({ message: "You are not assigned to this course" });
        }

        const applications = await AppDataSource.getRepository(Application)
            .createQueryBuilder("application")
            .leftJoinAndSelect("application.user", "user")
            .leftJoinAndSelect("user.skills", "skills")
            .leftJoinAndSelect("user.academicCredentials", "credentials")
            .leftJoinAndSelect("user.previousRoles", "previousRoles")
            .leftJoinAndSelect("application.course", "course")
            .leftJoinAndSelect("course.skills", "courseSkills")
            .leftJoinAndSelect("application.reviews", "review", "review.lecturer = :lecturerId", { lecturerId: lecturer.user_id })
            .where("application.course_id = :courseId", { courseId })
            .getMany();

        return res.status(200).json(applications);
    }

    // POST /applications/:id/review
    async saveReview(req: Request, res: Response) {
        const applicationId = parseInt(req.params.id, 10);
        const { rank, comment } = req.body;
        const lecturer = req.lecturer;
        if (!lecturer) {
            return res.status(403).json({ message: "Lecturer not attached to request" });
        }

        if (isNaN(applicationId)) {
            return res.status(400).json({ message: "Invalid application ID" });
        }

        const appRepo = AppDataSource.getRepository(Application);
        const reviewRepo = AppDataSource.getRepository(Review);

        const application = await appRepo.findOne({
            where: { application_id: applicationId },
            relations: ["course"],
        });

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        const courseId = application.course.course_id;
        const positionType = application.position_type;

        const existingRankConflict = await reviewRepo
            .createQueryBuilder("review")
            .leftJoin("review.application", "application")
            .where("review.lecturer = :lecturerId", { lecturerId: lecturer.user_id })
            .andWhere("application.course = :courseId", { courseId })
            .andWhere("application.position_type = :positionType", { positionType })
            .andWhere("review.rank = :rank", { rank })
            .andWhere("application.application_id != :currentAppId", { currentAppId: applicationId })
            .getOne();

        if (existingRankConflict) {
            return res.status(409).json({
                message: `You’ve already used rank ${rank} for this course and position type.`,
            });
        }

        let review = await reviewRepo.findOne({
            where: {
                lecturer: { user_id: lecturer.user_id },
                application: { application_id: application.application_id },
            },
            relations: ["lecturer", "application"],
        });

        if (review) {
            review.rank = rank;
            review.comment = comment;
        } else {
            review = reviewRepo.create({
                rank,
                comment,
                lecturer,
                application,
            });
        }

        const savedReview = await reviewRepo.save(review);
        return res.status(200).json({ message: "Review saved", review: savedReview });
    }


    // GET /applications/:id/review?lecturerId=3
    async getReviewByApplication(req: Request, res: Response) {
        const applicationId = parseInt(req.params.id, 10);
        const lecturer = req.lecturer;
        if (!lecturer) {
            return res.status(403).json({ message: "Lecturer not attached to request" });
        }

        if (isNaN(applicationId)) {
            return res.status(400).json({ message: "Invalid application ID" });
        }

        const review = await AppDataSource.getRepository(Review).findOne({
            where: {
                lecturer: { user_id: lecturer.user_id },
                application: { application_id: applicationId },
            },
            relations: ["lecturer", "application"],
        });

        if (!review) {
            return res.status(404).json({ message: "No review found" });
        }

        return res.status(200).json(review);
    }
}
