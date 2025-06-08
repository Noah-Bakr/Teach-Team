import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Application } from '../entity/Application';
import { User } from '../entity/User';
import { Course } from '../entity/Course';
import { Review } from '../entity/Review';
import { CreateApplicationDto, UpdateApplicationDto } from '../dto/application.dto';

export class ApplicationController {
    private applicationRepository = AppDataSource.getRepository(Application);
    private userRepository = AppDataSource.getRepository(User);
    private courseRepository = AppDataSource.getRepository(Course);

    /**
     * GET /applications
     * Fetch all applications, including related User, Course, and comments.
     * @param req  - Express request object
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON array of Application, or HTTP 500 + error
     */
    async getAllApplications(req: Request, res: Response) {
        try {
            const applications = await this.applicationRepository.find({
                relations: ['user', 'course', 'reviews'],
                order: { applied_at: 'DESC' },
            });
            return res.status(200).json(applications);
        } catch (error) {
            console.error('Error fetching all applications:', error);
            return res
                .status(500)
                .json({ message: 'Error fetching applications', error });
        }
    }

    /**
     * GET /applications/:id
     * Fetch one application by its ID.
     * @param req  - Express request object (expects `:id` in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON object, HTTP 404 if not found, or HTTP 400/500 + error
     */
    async getApplicationById(req: Request, res: Response) {
        const applicationId = parseInt(req.params.id, 10);
        if (isNaN(applicationId)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }

        try {
            const application = await this.applicationRepository.findOne({
                where: { application_id: applicationId },
                relations: ['user', 'course', 'reviews'],
            });

            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }
            return res.status(200).json(application);
        } catch (error) {
            console.error(`Error fetching application id=${applicationId}:`, error);
            return res
                .status(500)
                .json({ message: 'Error fetching application', error });
        }
    }

    // GET /applications/user/:userId
    async getApplicationsByUserId(req: Request, res: Response) {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        try {
            const applications = await AppDataSource.getRepository(Application).find({
                where: { user: { user_id: userId } },
                relations: ["course", "user"],
            });

            return res.status(200).json(applications);
        } catch (error) {
            console.error("Error fetching applications:", error);
            return res.status(500).json({ message: "Failed to fetch applications", error });
        }
    }


        /**
     * POST /applications
     * Create a new application.
     * @param req  - Express request object (expects JSON body)
     * @param res  - Express response object
     * @returns    HTTP 201 + JSON of created Application, HTTP 400 if missing/invalid fields,
     *             HTTP 404 if referenced User or Course not found, or HTTP 500 + error
     *
     * Body should include:
     *   - position_type  ('tutor' | 'lab_assistant', required)
     *   - status         ('pending' | 'accepted' | 'rejected', required)
     *   - selected       (boolean, required)
     *   - availability   ('Full-Time' | 'Part-Time' | 'Not Available', required)
     *   - user_id        (number, required)
     *   - course_id      (number, required)
     *   - rank           (number, optional)
     */
    async createApplication(req: Request, res: Response) {
        const {
            position_type,
            status,
            selected,
            availability,
            user_id,
            course_id,
        } = req.body as CreateApplicationDto;

        // // Basic validation of required fields
        // if (
        //     !position_type ||
        //     !status ||
        //     typeof selected !== 'boolean' ||
        //     !availability ||
        //     typeof user_id !== 'number' ||
        //     typeof course_id !== 'number'
        // ) {
        //     return res.status(400).json({
        //         message:
        //             'position_type, status, selected (boolean), availability, user_id (number), and course_id (number) are required',
        //     });
        // }

        try {
            // Verify that the referenced user exists
            const user = await this.userRepository.findOneBy({ user_id });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verify that the referenced course exists
            const course = await this.courseRepository.findOneBy({ course_id });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Check for existing application for same course + role
            const existingApplication = await this.applicationRepository.findOne({
                where: {
                    user: { user_id },
                    course: { course_id },
                    position_type: position_type,
                },
                relations: ["user", "course"],
            });

            if (existingApplication) {
                return res.status(409).json({
                    message: `User has already applied for ${position_type} role in this course.`,
                });
            }

            // Create new Application
            const newApplication = this.applicationRepository.create({
                position_type,
                status,
                selected,
                availability,
                user,
                course,
            });

            const saved = await this.applicationRepository.save(newApplication);
            return res.status(201).json(saved);
        } catch (error) {
            console.error('Error creating application:', error);
            return res.status(500).json({ message: 'Error creating application', error });
        }
    }

    /**
     * PUT /applications/:id
     * Update an existing application by its ID.
     * @param req  - Express request object (expects `:id` in params and JSON body)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON of updated Application, HTTP 404 if not found,
     *             HTTP 400 if invalid input, or HTTP 500 + error
     *
     * Body may include any of:
     *   - position_type  ('tutor' | 'lab_assistant')
     *   - status         ('pending' | 'accepted' | 'rejected')
     *   - selected       (boolean)
     *   - availability   ('Full-Time' | 'Part-Time' | 'Not Available')
     *   - rank           (number or null)
     *
     * Note: We do not allow changing `user` or `course` via this endpoint. To reassign,
     *       client must delete and re-create the record.
     */
    async updateApplication(req: Request, res: Response) {
        const applicationId = parseInt(req.params.id, 10);
        if (isNaN(applicationId)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }

        try {
            const existing = await this.applicationRepository.findOne({
                where: { application_id: applicationId },
            });
            if (!existing) {
                return res.status(404).json({ message: 'Application not found' });
            }

            const {
                position_type,
                status,
                selected,
                availability,
            } = req.body as UpdateApplicationDto;

            // Only update fields if they are provided in the request
            if (position_type !== undefined) existing.position_type = position_type;
            if (status !== undefined) existing.status = status;
            if (selected !== undefined) existing.selected = selected;
            if (availability !== undefined) existing.availability = availability;

            const updated = await this.applicationRepository.save(existing);
            return res.status(200).json(updated);
        } catch (error) {
            console.error(`Error updating application id=${applicationId}:`, error);
            return res.status(500).json({ message: 'Error updating application', error });
        }
    }

    /**
     * DELETE /applications/:id
     * Delete an application by its ID.
     * @param req  - Express request object (expects `:id` in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + success message, HTTP 404 if not found, or HTTP 500 + error
     */
    async deleteApplication(req: Request, res: Response) {
        const applicationId = parseInt(req.params.id, 10);
        if (isNaN(applicationId)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }

        try {
            const existing = await this.applicationRepository.findOne({
                where: { application_id: applicationId },
            });
            if (!existing) {
                return res.status(404).json({ message: 'Application not found' });
            }

            await this.applicationRepository.remove(existing);
            return res
                .status(200)
                .json({ message: 'Application deleted successfully' });
        } catch (error) {
            console.error(`Error deleting application id=${applicationId}:`, error);
            return res.status(500).json({ message: 'Error deleting application', error });
        }
    }

    // GET /applications/visual-insights
    async getVisualInsights(req: Request, res: Response) {
        try {
            const appRepo = AppDataSource.getRepository(Application);
            const reviewRepo = AppDataSource.getRepository(Review);

            // Status breakdown
            const statusBreakdown = await appRepo
                .createQueryBuilder("app")
                .select("app.status", "status")
                .addSelect("COUNT(*)", "count")
                .groupBy("app.status")
                .getRawMany();

            // Average rank per status
            const avgRankByStatus = await reviewRepo
                .createQueryBuilder("rev")
                .innerJoin("rev.application", "app")
                .select("app.status", "status")
                .addSelect("AVG(rev.rank)", "avgRank")
                .groupBy("app.status")
                .getRawMany();

            // Top 5 skills by frequency (across all users in accepted apps)
            const topSkills = await AppDataSource.query(`
                SELECT s.skill_name, COUNT(*) AS count
                FROM Application a
                         JOIN User u ON a.user_id = u.user_id
                         JOIN user_skills_skills uss ON u.user_id = uss.userUserId
                         JOIN Skills s ON uss.skillsSkillId = s.skill_id
                WHERE a.status = 'accepted'
                GROUP BY s.skill_name
                ORDER BY count DESC
                LIMIT 2
            `);

            const usersWithMostPopularSkills = await AppDataSource.query(`
                SELECT s.skill_name, u.first_name, u.last_name, u.user_id, u.avatar
                FROM User u
                         JOIN user_skills_skills uss ON u.user_id = uss.userUserId
                         JOIN Skills s ON uss.skillsSkillId = s.skill_id
                WHERE s.skill_name IN (${topSkills.map((s: { skill_name: string }) => `'${s.skill_name}'`).join(',')})
                ORDER BY s.skill_name
            `);

            // Least 2 common skills by frequency (across all users in accepted apps)
            const leastCommonSkills = await AppDataSource.query(`
                  SELECT s.skill_name, COUNT(*) AS count
                  FROM Application a
                  JOIN User u ON a.user_id = u.user_id
                  JOIN user_skills_skills uss ON u.user_id = uss.userUserId
                  JOIN Skills s ON uss.skillsSkillId = s.skill_id
                  WHERE a.status = 'accepted'
                  GROUP BY s.skill_name
                  ORDER BY count ASC
                  LIMIT 2
                `);

            const usersWithLeastCommonSkills = await AppDataSource.query(`
                SELECT s.skill_name, u.first_name, u.last_name, u.user_id, u.avatar
                FROM User u
                         JOIN user_skills_skills uss ON u.user_id = uss.userUserId
                         JOIN Skills s ON uss.skillsSkillId = s.skill_id
                WHERE s.skill_name IN (${leastCommonSkills.map((s: { skill_name: string }) => `'${s.skill_name}'`).join(',')})
                ORDER BY s.skill_name
            `);

            // Top 3 accepted applicants by best avg rank
            const topAcceptedApplicants = await AppDataSource.query(`
                SELECT u.user_id, u.first_name, u.last_name, u.avatar, AVG(r.rank) as avgRank
                FROM Review r
                         JOIN Application a ON r.application_id = a.application_id
                         JOIN User u ON a.user_id = u.user_id
                WHERE a.status = 'accepted'
                GROUP BY u.user_id
                ORDER BY avgRank ASC
                LIMIT 3
            `);

            // Bottom 3 accepted applicants by worst avg rank
            const bottomAcceptedApplicants = await AppDataSource.query(`
                  SELECT u.user_id, u.first_name, u.last_name, u.avatar, AVG(r.rank) as avgRank
                  FROM Review r
                  JOIN Application a ON r.application_id = a.application_id
                  JOIN User u ON a.user_id = u.user_id
                  WHERE a.status = 'accepted'
                  GROUP BY u.user_id
                  ORDER BY avgRank DESC
                  LIMIT 3
                `);

            // Most accepted applicant
            const mostAcceptedApplicant = await AppDataSource.query(`
                  SELECT u.user_id, u.first_name, u.last_name, u.avatar, COUNT(*) AS acceptedCount
                  FROM Application a
                  JOIN User u ON a.user_id = u.user_id
                  WHERE a.status = 'accepted'
                  GROUP BY u.user_id
                  ORDER BY acceptedCount DESC
                  LIMIT 1
                `);

            // Breakdown by count
            const positionBreakdown = await appRepo
                .createQueryBuilder("app")
                .select("app.position_type", "position")
                .addSelect("COUNT(*)", "count")
                .groupBy("app.position_type")
                .getRawMany();

            // 6. Unranked applicants
            const unrankedApplicants = await appRepo
                .createQueryBuilder("app")
                .leftJoinAndSelect("app.user", "user")
                .leftJoin("app.reviews", "rev")
                .where("rev.review_id IS NULL")
                .getMany();

            if (!statusBreakdown.length) {
                return res.status(200).json({
                    statusBreakdown: [],
                    averageRankByStatus: [],
                    mostCommonSkills: [],
                    usersWithMostPopularSkills: [],
                    leastCommonSkills: [],
                    usersWithLeastCommonSkills: [],
                    mostAcceptedApplicant: [],
                    topApplicants: [],
                    bottomApplicants: [],
                    positionBreakdown: [],
                    unrankedApplicants: [],
                });
            }

            return res.json({
                statusBreakdown,
                averageRankByStatus: avgRankByStatus,
                mostCommonSkills: topSkills,
                usersWithMostPopularSkills,
                leastCommonSkills: leastCommonSkills,
                usersWithLeastCommonSkills,
                mostAcceptedApplicant: mostAcceptedApplicant[0],
                topApplicants: topAcceptedApplicants,
                bottomApplicants: bottomAcceptedApplicants,
                positionBreakdown,
                unrankedApplicants,
            });
        } catch (err) {
            console.error("Error fetching insights:", err);
            return res.status(500).json({ message: "Internal error" });
        }
    }

}
