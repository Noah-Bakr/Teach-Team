import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Course } from "../entity/Course";
import { Application } from "../entity/Application";
import { Review } from "../entity/Review";
import {User} from "../entity/User";


interface LecturerRequest extends Request {
    lecturer?: User;
}

export class LecturerController {
    // GET /lecturer/:id/courses Lecturer can see all courses they are assigned to
    async getCourses(req: LecturerRequest, res: Response) {
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

    // GET /lecturer/:id/applications/all Lecturer can see all applications for all courses they are assigned to
    async getAllApplicationsByLecturer(req: LecturerRequest, res: Response) {
        const lecturer = req.lecturer;

        if (!lecturer) {
            return res.status(403).json({ message: "Lecturer not attached to request" });
        }

        const courseIds = lecturer.courses.map((c: Course) => c.course_id);

        if (!courseIds.length) {
            return res.status(200).json([]); // Lecturer has no assigned courses
        }

        try {
            const search = (req.query.search as string)?.toLowerCase() || "";
            const sort = req.query.sort as string;

            // Base query setup and join tables...
            const query = AppDataSource.getRepository(Application)
                .createQueryBuilder("application")
                .leftJoinAndSelect("application.user", "user")
                .leftJoinAndSelect("user.skills", "skills")
                .leftJoinAndSelect("user.academicCredentials", "credentials")
                .leftJoinAndSelect("user.previousRoles", "previousRoles")
                .leftJoinAndSelect("application.course", "course")
                .leftJoinAndSelect("course.skills", "courseSkills")
                .leftJoinAndSelect("application.reviews", "review", "review.lecturer = :lecturerId", { lecturerId: lecturer.user_id })
                .where("application.course IN (:...courseIds)", { courseIds })

            //  Search Functionality
            if (search) {
                query.andWhere(
                    `(LOWER(user.first_name) LIKE :search OR LOWER(user.last_name) LIKE :search OR LOWER(course.course_name) LIKE :search OR LOWER(course.course_code) LIKE :search OR LOWER(application.availability) LIKE :search OR LOWER(skills.skill_name) LIKE :search)`,
                    { search: `%${search}%` }
                );
            }

            //  Sort Functionality
            if (sort === "course") {
                query.orderBy("course.course_name", "ASC");
            } else if (sort === "availability") {
                query.orderBy("application.availability", "ASC");
            }

            const applications = await query.getMany();

            return res.status(200).json(applications);
        } catch (error) {
            console.error("Error fetching applications:", error);
            return res.status(500).json({ message: "Error fetching applications", error });
        }
    }


    // GET /lecturer/:id/applications?courseId=X Lecturer can see applications for a specific course they are assigned to
    async getApplications(req: LecturerRequest, res: Response) {
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

        const search = (req.query.search as string)?.toLowerCase() || "";
        const sort = req.query.sort as string;

        // Base query setup and join tables...
        const query = AppDataSource.getRepository(Application)
            .createQueryBuilder("application")
            .leftJoinAndSelect("application.user", "user")
            .leftJoinAndSelect("user.skills", "skills")
            .leftJoinAndSelect("user.academicCredentials", "credentials")
            .leftJoinAndSelect("user.previousRoles", "previousRoles")
            .leftJoinAndSelect("application.course", "course")
            .leftJoinAndSelect("course.skills", "courseSkills")
            .leftJoinAndSelect("application.reviews", "review", "review.lecturer = :lecturerId", { lecturerId: lecturer.user_id })
            .where("application.course_id = :courseId", { courseId });

        // Search functionality
        if (search) {
            query.andWhere(
                `(LOWER(user.first_name) LIKE :search OR LOWER(user.last_name) LIKE :search OR LOWER(course.course_name) LIKE :search OR LOWER(course.course_code) LIKE :search OR LOWER(application.availability) LIKE :search OR LOWER(skills.skill_name) LIKE :search)`,
                { search: `%${search}%` }
            );
        }

        // Sort functionality
        if (sort === "course") {
            query.orderBy("course.course_name", "ASC");
        } else if (sort === "availability") {
            query.orderBy("application.availability", "ASC");
        }

        const applications = await query.getMany();


        return res.status(200).json(applications);
    }

    // POST /applications/:id/review Lecturer can save a review for an application
    async saveReview(req: Request, res: Response) {
            const { lecturerId, applicationId } = req.params;
            const { rank, comment } = req.body;

            const parsedLecturerId = parseInt(lecturerId, 10);
            const parsedApplicationId = parseInt(applicationId, 10);

            if (isNaN(parsedLecturerId) || isNaN(parsedApplicationId)) {
                return res.status(400).json({ message: "Invalid lecturer or application ID" });
            }

            const appRepo = AppDataSource.getRepository(Application);
            const reviewRepo = AppDataSource.getRepository(Review);
            const userRepo = AppDataSource.getRepository(User);

            const lecturer = await userRepo.findOne({
                where: { user_id: parsedLecturerId },
                relations: ["courses", "role"],
            });

            if (!lecturer || lecturer.role.role_name !== "lecturer") {
                return res.status(403).json({ message: "Invalid lecturer" });
            }

            const application = await appRepo.findOne({
                where: { application_id: parsedApplicationId },
                relations: ["course"],
            });

            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }


        // const applicationId = parseInt(req.params.id, 10);
        // const { rank, comment } = req.body;
        // const lecturer = req.lecturer;
        // if (!lecturer) {
        //     return res.status(403).json({ message: "Lecturer not attached to request" });
        // }
        //
        // if (isNaN(applicationId)) {
        //     return res.status(400).json({ message: "Invalid application ID" });
        // }

        // const appRepo = AppDataSource.getRepository(Application);
        // const reviewRepo = AppDataSource.getRepository(Review);
        //
        // const application = await appRepo.findOne({
        //     where: { application_id: applicationId },
        //     relations: ["course"],
        // });
        //
        // if (!application) {
        //     return res.status(404).json({ message: "Application not found" });
        // }

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

    async updateApplicationStatus(req: Request, res: Response) {
        const { lecturerId, applicationId } = req.params;
        const { status } = req.body;

        const parsedLecturerId = parseInt(lecturerId, 10);
        const parsedApplicationId = parseInt(applicationId, 10);

        if (isNaN(parsedLecturerId)) {
            return res.status(400).json({ message: "Invalid or missing lecturer ID" });
        }

        try {
            const lecturer = await AppDataSource.getRepository(User).findOne({
                where: { user_id: parsedLecturerId },
                relations: ["courses", "role"],
            });

            if (!lecturer || lecturer.role.role_name !== "lecturer") {
                return res.status(403).json({ message: "Lecturer not found or not a lecturer" });
            }

            const appRepo = AppDataSource.getRepository(Application);
            const application = await appRepo.findOneBy({ application_id: parsedApplicationId });

            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }

            // Optional: Verify lecturer is allowed to update this application
            // (e.g., only if course is in lecturer.courses)

            application.status = status;
            await appRepo.save(application);

            return res.status(200).json({ message: "Application status updated", application });
        } catch (error) {
            console.error("Update error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }


    // // PATCH /lecturer/:lecturerId/applications/:applicationId
    // async updateApplicationStatus(req: Request, res: Response) {
    //     const lecturer = req.lecturer;
    //     if (!lecturer) {
    //         return res.status(403).json({ message: "Lecturer not attached to request" });
    //     }
    //     const { applicationId } = req.params;
    //     const { status } = req.body;
    //
    //     try {
    //         const appRepo = AppDataSource.getRepository(Application);
    //         const application = await appRepo.findOneBy({
    //             application_id: parseInt(applicationId, 10),
    //         });
    //
    //         if (!application) {
    //             return res.status(404).json({ message: "Application not found" });
    //         }
    //
    //         application.status = status;
    //         await appRepo.save(application);
    //
    //         return res.status(200).json({ message: "Application status updated", application });
    //     } catch (error) {
    //         console.error("Update error:", error);
    //         return res.status(500).json({ message: "Internal server error" });
    //     }
    // }


    // GET /applications/:id/review?lecturerId=3 Lecturer can see their review for a specific application
    async getReviewByApplication(req: LecturerRequest, res: Response) {
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


