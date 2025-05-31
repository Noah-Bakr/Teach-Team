import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { LecturerCourse } from '../entity/LecturerCourse';
import { User } from '../entity/User';
import { Course } from '../entity/Course';

export class LecturerCourseController {
    private lecturerCourseRepository = AppDataSource.getRepository(LecturerCourse);
    private userRepository = AppDataSource.getRepository(User);
    private courseRepository = AppDataSource.getRepository(Course);

    /**
     * GET /lecturer-courses
     * Fetch all LecturerCourse links, including related User (as lecturer) and Course.
     * @param req  - Express request object
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON array of LecturerCourse, or HTTP 500 + error
     */
    async getAllLecturerCourses(req: Request, res: Response) {
        try {
            const links = await this.lecturerCourseRepository.find({
                relations: ['lecturer', 'course'],
                order: { user_id: 'ASC', course_id: 'ASC' },
            });
            return res.status(200).json(links);
        } catch (error) {
            console.error('Error fetching all LecturerCourse links:', error);
            return res
                .status(500)
                .json({ message: 'Error fetching lecturer-course links', error });
        }
    }

    /**
     * GET /lecturer-courses/:user_id/:course_id
     * Fetch one LecturerCourse link by its composite key (user_id + course_id).
     * @param req  - Express request object (expects :user_id and :course_id in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON object, HTTP 404 if not found, or HTTP 400/500 + error
     */
    async getLecturerCourseByIds(req: Request, res: Response) {
        const userId = parseInt(req.params.user_id, 10);
        const courseId = parseInt(req.params.course_id, 10);

        if (isNaN(userId) || isNaN(courseId)) {
            return res
                .status(400)
                .json({ message: 'Invalid user_id or course_id parameter' });
        }

        try {
            const link = await this.lecturerCourseRepository.findOne({
                where: { user_id: userId, course_id: courseId },
                relations: ['lecturer', 'course'],
            });

            if (!link) {
                return res
                    .status(404)
                    .json({ message: 'LecturerCourse link not found' });
            }
            return res.status(200).json(link);
        } catch (error) {
            console.error(
                `Error fetching LecturerCourse link user_id=${userId}, course_id=${courseId}:`,
                error
            );
            return res
                .status(500)
                .json({ message: 'Error fetching lecturer-course link', error });
        }
    }

    /**
     * POST /lecturer-courses
     * Create a new LecturerCourse link.
     * @param req  - Express request object (expects JSON body)
     * @param res  - Express response object
     * @returns    HTTP 201 + JSON of created link, HTTP 400 if missing/invalid fields,
     *             HTTP 404 if referenced User or Course not found, HTTP 409 if already exists,
     *             or HTTP 500 + error
     *
     * Body should include:
     *   - user_id   (number, required)
     *   - course_id (number, required)
     */
    async createLecturerCourse(req: Request, res: Response) {
        const { user_id, course_id } = req.body;

        if (typeof user_id !== 'number' || typeof course_id !== 'number') {
            return res
                .status(400)
                .json({ message: 'user_id (number) and course_id (number) are required' });
        }

        try {
            // Verify that the referenced User (lecturer) exists
            const user = await this.userRepository.findOneBy({ user_id });
            if (!user) {
                return res.status(404).json({ message: 'User (lecturer) not found' });
            }

            // Verify that the referenced Course exists
            const course = await this.courseRepository.findOneBy({ course_id });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Check if link already exists
            const existingLink = await this.lecturerCourseRepository.findOneBy({ user_id, course_id });
            if (existingLink) {
                return res
                    .status(409)
                    .json({ message: 'This lecturer-course link already exists' });
            }

            // Create the new link
            const newLink = this.lecturerCourseRepository.create({
                user_id,
                course_id,
                lecturer: user,
                course: course,
            });
            const savedLink = await this.lecturerCourseRepository.save(newLink);
            return res.status(201).json(savedLink);
        } catch (error) {
            console.error('Error creating LecturerCourse link:', error);
            return res
                .status(500)
                .json({ message: 'Error creating lecturer-course link', error });
        }
    }

    /**
     * PUT /lecturer-courses/:user_id/:course_id
     * Update an existing LecturerCourse link.
     * @param req  - Express request object (expects :user_id and :course_id in params)
     * @param res  - Express response object
     * @returns    HTTP 400 always, since primary keys cannot be updated
     *
     * Note: There are no other updatable fields in this join table. To change either key,
     *       delete the existing link and create a new one.
     */
    async updateLecturerCourse(req: Request, res: Response) {
        // This endpoint is intentionally not supported because there are no additional columns,
        // and primary keys (user_id and course_id) cannot be modified.
        return res.status(400).json({
            message:
                'Cannot update primary keys of a LecturerCourse link. Delete and re-create if you need different values.',
        });
    }

    /**
     * DELETE /lecturer-courses/:user_id/:course_id
     * Delete a LecturerCourse link by composite key (user_id + course_id).
     * @param req  - Express request object (expects :user_id and :course_id in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + success message, HTTP 404 if not found, or HTTP 400/500 + error
     */
    async deleteLecturerCourse(req: Request, res: Response) {
        const userId = parseInt(req.params.user_id, 10);
        const courseId = parseInt(req.params.course_id, 10);

        if (isNaN(userId) || isNaN(courseId)) {
            return res
                .status(400)
                .json({ message: 'Invalid user_id or course_id parameter' });
        }

        try {
            const existingLink = await this.lecturerCourseRepository.findOneBy({
                user_id: userId,
                course_id: courseId,
            });
            if (!existingLink) {
                return res
                    .status(404)
                    .json({ message: 'LecturerCourse link not found' });
            }

            await this.lecturerCourseRepository.remove(existingLink);
            return res
                .status(200)
                .json({ message: 'LecturerCourse link deleted successfully' });
        } catch (error) {
            console.error(
                `Error deleting LecturerCourse link user_id=${userId}, course_id=${courseId}:`,
                error
            );
            return res
                .status(500)
                .json({ message: 'Error deleting lecturer-course link', error });
        }
    }
}
