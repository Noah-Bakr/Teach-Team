import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Course } from '../entity/Course';
import { Skills } from '../entity/Skills';

export class CourseController {
    private courseRepository = AppDataSource.getRepository(Course);
    private skillsRepository = AppDataSource.getRepository(Skills);

    /**
     * Handles fetching all courses
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response with list of courses or error message
     */
    async getAllCourses(req: Request, res: Response) {
        try {
            const courses = await this.courseRepository.find({
                relations: ['skills', 'lecturers'],
                order: { course_name: 'ASC' },
            });
            return res.status(200).json(courses);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching courses', error });
        }
    }

    /**
     * Handles fetching a course by its ID
     * @param req - Express request object containing course ID in params
     * @param res - Express response object
     * @returns JSON response with course data or error message
     */
    async getCourseById(req: Request, res: Response) {
        const courseId = parseInt(req.params.id, 10);
        if (isNaN(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID' });
        }
        try {
            const course = await this.courseRepository.findOne({
                where: { course_id: courseId },
                relations: ['skills', 'lecturers'],
            });

            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            return res.status(200).json(course);
        }
        catch (error) {
            console.error(`Error fetching course ${courseId}:`, error);
            return res.status(500).json({ message: 'Error fetching course', error: error });
        }
    }

    /**
     * POST /courses
     * Create a new course. Body may include:
     *   - course_code (string, required)
     *   - course_name (string, required)
     *   - semester    (string '1' or '2', required)
     *   - skillIds    (number[], optional)
     */
    async createCourse(req: Request, res: Response) {
        const { course_code, course_name, semester, skillIds } = req.body;

        if (!course_code || !course_name || !semester) {
            return res.status(400).json({
                message: 'course_code, course_name, and semester are required',
            });
        }
        try {
            const newCourse = this.courseRepository.create({
                course_code,
                course_name,
                semester,
            });
            const savedCourse = await this.courseRepository.save(newCourse);

            // If skillIds provided, attach them
            if (Array.isArray(skillIds) && skillIds.length > 0) {
                // Validate each skillId exists
                for (const sid of skillIds) {
                    const skills = await this.skillsRepository.findOneBy({ skill_id: sid });
                    if (!skills) {
                        return res.status(400).json({ message: `Skill ID ${sid} not found` });
                    }
                }
                // Attach in one call
                await this.courseRepository
                    .createQueryBuilder()
                    .relation(Course, 'skills')
                    .of(savedCourse.course_id)
                    .add(skillIds);
            }

            //  Return the course
            const complete = await this.courseRepository.findOne({
                where: { course_id: savedCourse.course_id },
                relations: ['skills', 'lecturers'],
            });
            return res.status(201).json(complete);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating course', error });
        }
    }

    /**
    * PUT /courses/:id
    * Update an existing course. Body may include any of:
     * *   - course_code (string)
    *   - course_name (string)
    *   - semester    (string '1' or '2')
    *   - skillIds    (number[], to REPLACE all skills)
    */
    async updateCourse(req: Request, res: Response) {
        const courseId = parseInt(req.params.id, 10);
        if (isNaN(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID' });
        }
        const { course_code, course_name, semester, skillIds } = req.body;

        try {
            // 1) Find existing course
            const course = await this.courseRepository.findOne({
                where: { course_id: courseId },
                relations: ['skills', 'lecturers'],
            });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // 2) Update basic fields if provided
            if (course_code !== undefined) course.course_code = course_code;
            if (course_name !== undefined) course.course_name = course_name;
            if (semester !== undefined) course.semester = semester;

            // 3) Save base changes
            await this.courseRepository.save(course);

            // 4) If skillIds provided, overwrite the relation
            if (Array.isArray(skillIds)) {
                // Validate each skillId
                for (const sid of skillIds) {
                    const skills = await this.skillsRepository.findOneBy({ skill_id: sid });
                    if (!skills) {
                        return res.status(400).json({ message: `Skill ID ${sid} not found` });
                    }
                }
                // Remove all existing skills, then attach new list
                await this.courseRepository
                    .createQueryBuilder()
                    .relation(Course, 'skills')
                    .of(courseId)
                    .addAndRemove(skillIds, course.skills.map((skills) => skills.skill_id));
            }

            // Return updated course
            const updated = await this.courseRepository.findOne({
                where: { course_id: courseId },
                relations: ['skills', 'lecturers'],
            });
            return res.status(200).json(updated);
        } catch (err) {
            console.error(`Error updating course ${courseId}:`, err);
            return res.status(500).json({ message: 'Error updating course', error: err });
        }
    }

    /**
     * Handles deleting a course by its ID
     * @param req - Express request object containing course ID in params
     * @param res - Express response object
     * @returns JSON response with success message or error message
     */
    async deleteCourse(req: Request, res: Response) {
        const courseId = parseInt(req.params.id, 10);

        if (isNaN(courseId)) {
            return res.status(400).json({ message: 'Invalid course ID' });
        }
        try {
            const course = await this.courseRepository.findOne({
                where: { course_id: courseId },
            });

            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            await this.courseRepository.remove(course);
            return res.status(200).json({ message: 'Course deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting course', error });
        }
    }
}