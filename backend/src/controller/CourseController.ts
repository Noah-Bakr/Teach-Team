import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Course } from '../entity/Course';

export class CourseController {
    private courseRepository = AppDataSource.getRepository(Course);

    /**
     * Handles fetching all courses
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response with list of courses or error message
     */
    async getAllCourses(req: Request, res: Response) {
        try {
            const courses = await this.courseRepository.find({
                relations: ['skills'],
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
        try {
            const course = await this.courseRepository.findOne({
                where: { course_id: courseId },
                relations: ['skills'],
            });

            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            return res.status(200).json(course);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error fetching course', error });
        }
    }

    /**
     * Handles creating a new course
     * @param req - Express request object containing course details in body
     * @param res - Express response object
     * @returns JSON response with created course data or error message
     */
    async createCourse(req: Request, res: Response) {
        const { course_code, course_name, semester, skills } = req.body;

        try {
            const newCourse = this.courseRepository.create({
                course_code,
                course_name,
                semester,
                skills: skills ? skills.map((skill: any) => ({ skill_name: skill })) : [], //TODO possibly requires a datatype change in the entity
            });

            const savedCourse = await this.courseRepository.save(newCourse);
            return res.status(201).json(savedCourse);
        } catch (error) {
            return res.status(500).json({ message: 'Error creating course', error });
        }
    }

    /**
     * Handles updating an existing course
     * @param req - Express request object containing course ID in params and updated fields in body
     * @param res - Express response object
     * @returns JSON response with updated course data or error message
     */
    async updateCourse(req: Request, res: Response) {
        const courseId = parseInt(req.params.id, 10);
        const updates = req.body;

        try {
            const course = await this.courseRepository.findOne({
                where: { course_id: courseId },
                relations: ['skills'],
            });

            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            Object.assign(course, updates);

            if (updates.skills) {
                course.skills = updates.skills.map((skill: any) => ({ skill_name: skill }));
            }

            const updatedCourse = await this.courseRepository.save(course);
            return res.status(200).json(updatedCourse);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating course', error });
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