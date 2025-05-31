import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { SkillsCourse } from '../entity/SkillsCourse';
import { Course } from '../entity/Course';
import { Skills } from '../entity/Skills';

export class SkillsCourseController {
    private skillsCourseRepository = AppDataSource.getRepository(SkillsCourse);
    private courseRepository = AppDataSource.getRepository(Course);
    private skillsRepository = AppDataSource.getRepository(Skills);

    /**
     * GET /skills-courses
     * Fetch all SkillsCourse links, including related Course and Skill.
     * @param req  - Express request object
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON array of SkillsCourse, or HTTP 500 + error
     */
    async getAllSkillsCourses(req: Request, res: Response) {
        try {
            const links = await this.skillsCourseRepository.find({
                relations: ['course', 'skill'],
                order: { course_id: 'ASC', skill_id: 'ASC' },
            });
            return res.status(200).json(links);
        } catch (error) {
            console.error('Error fetching all skills-course links:', error);
            return res
                .status(500)
                .json({ message: 'Error fetching skills-course links', error });
        }
    }

    /**
     * GET /skills-courses/:course_id/:skill_id
     * Fetch one SkillsCourse link by its composite key (course_id + skill_id).
     * @param req  - Express request object (expects :course_id and :skill_id in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON object, HTTP 404 if not found, or HTTP 400/500 + error
     */
    async getSkillsCourseByIds(req: Request, res: Response) {
        const courseId = parseInt(req.params.course_id, 10);
        const skillId = parseInt(req.params.skill_id, 10);

        if (isNaN(courseId) || isNaN(skillId)) {
            return res
                .status(400)
                .json({ message: 'Invalid course_id or skill_id parameter' });
        }

        try {
            const link = await this.skillsCourseRepository.findOne({
                where: { course_id: courseId, skill_id: skillId },
                relations: ['course', 'skill'],
            });

            if (!link) {
                return res
                    .status(404)
                    .json({ message: 'SkillsCourse link not found' });
            }
            return res.status(200).json(link);
        } catch (error) {
            console.error(
                `Error fetching skills-course link course_id=${courseId}, skill_id=${skillId}:`,
                error
            );
            return res
                .status(500)
                .json({ message: 'Error fetching skills-course link', error });
        }
    }

    /**
     * POST /skills-courses
     * Create a new SkillsCourse link.
     * @param req  - Express request object (expects JSON body)
     * @param res  - Express response object
     * @returns    HTTP 201 + JSON of created link, HTTP 400 if missing/invalid fields,
     *             HTTP 404 if referenced Course or Skills not found, HTTP 409 if already exists,
     *             or HTTP 500 + error
     *
     * Body should include:
     *   - course_id (number, required)
     *   - skill_id  (number, required)
     */
    async createSkillsCourse(req: Request, res: Response) {
        const { course_id, skill_id } = req.body;

        if (typeof course_id !== 'number' || typeof skill_id !== 'number') {
            return res
                .status(400)
                .json({ message: 'course_id (number) and skill_id (number) are required' });
        }

        try {
            // Verify that the referenced Course exists
            const course = await this.courseRepository.findOneBy({ course_id });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Verify that the referenced Skill exists
            const skill = await this.skillsRepository.findOneBy({ skill_id });
            if (!skill) {
                return res.status(404).json({ message: 'Skill not found' });
            }

            // Check if link already exists
            const existingLink = await this.skillsCourseRepository.findOneBy({ course_id, skill_id });
            if (existingLink) {
                return res
                    .status(409)
                    .json({ message: 'This skills-course link already exists' });
            }

            // Create the new link
            const newLink = this.skillsCourseRepository.create({
                course_id,
                skill_id,
                course,
                skill,
            });
            const savedLink = await this.skillsCourseRepository.save(newLink);
            return res.status(201).json(savedLink);
        } catch (error) {
            console.error('Error creating skills-course link:', error);
            return res
                .status(500)
                .json({ message: 'Error creating skills-course link', error });
        }
    }

    /**
     * PUT /skills-courses/:course_id/:skill_id
     * Update an existing SkillsCourse link.
     * @param req  - Express request object (expects :course_id and :skill_id in params)
     * @param res  - Express response object
     * @returns    HTTP 400 always, since primary keys cannot be updated
     *
     * Note: This join table has no additional columns. To change either key,
     *       delete the existing link and create a new one.
     */
    async updateSkillsCourse(req: Request, res: Response) {
        return res.status(400).json({
            message:
                'Cannot update primary keys of a SkillsCourse link. Delete and re-create if you need different values.',
        });
    }

    /**
     * DELETE /skills-courses/:course_id/:skill_id
     * Delete a SkillsCourse link by composite key (course_id + skill_id).
     * @param req  - Express request object (expects :course_id and :skill_id in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + success message, HTTP 404 if not found, or HTTP 400/500 + error
     */
    async deleteSkillsCourse(req: Request, res: Response) {
        const courseId = parseInt(req.params.course_id, 10);
        const skillId = parseInt(req.params.skill_id, 10);

        if (isNaN(courseId) || isNaN(skillId)) {
            return res
                .status(400)
                .json({ message: 'Invalid course_id or skill_id parameter' });
        }

        try {
            const existingLink = await this.skillsCourseRepository.findOneBy({
                course_id: courseId,
                skill_id: skillId,
            });
            if (!existingLink) {
                return res
                    .status(404)
                    .json({ message: 'SkillsCourse link not found' });
            }

            await this.skillsCourseRepository.remove(existingLink);
            return res
                .status(200)
                .json({ message: 'SkillsCourse link deleted successfully' });
        } catch (error) {
            console.error(
                `Error deleting skills-course link course_id=${courseId}, skill_id=${skillId}:`,
                error
            );
            return res
                .status(500)
                .json({ message: 'Error deleting skills-course link', error });
        }
    }
}
