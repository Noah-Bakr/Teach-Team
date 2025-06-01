import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Skills } from '../entity/Skills';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skills.dto';

export class SkillsController {
    private skillsRepository = AppDataSource.getRepository(Skills);

    /**
     * GET /skills
     * Fetch all skills, including related Users and Courses.
     * @param req  - Express request object
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON array of Skills, or HTTP 500 + error
     */
    async getAllSkills(req: Request, res: Response) {
        try {
            const skills = await this.skillsRepository.find({
                relations: ['users', 'courses'],
                order: { skill_name: 'ASC' },
            });
            return res.status(200).json(skills);
        } catch (error) {
            console.error('Error fetching all skills:', error);
            return res.status(500).json({ message: 'Error fetching skills', error });
        }
    }

    /**
     * GET /skills/:id
     * Fetch one skill by its ID.
     * @param req  - Express request object (expects `:id` in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON object, HTTP 404 if not found, or HTTP 400/500 + error
     */
    async getSkillById(req: Request, res: Response) {
        const skillId = parseInt(req.params.id, 10);
        if (isNaN(skillId)) {
            return res.status(400).json({ message: 'Invalid skill ID' });
        }

        try {
            const skill = await this.skillsRepository.findOne({
                where: { skill_id: skillId },
                relations: ['users', 'courses'],
            });

            if (!skill) {
                return res.status(404).json({ message: 'Skill not found' });
            }
            return res.status(200).json(skill);
        } catch (error) {
            console.error(`Error fetching skill id=${skillId}:`, error);
            return res.status(500).json({ message: 'Error fetching skill', error });
        }
    }

    /**
     * POST /skills
     * Create a new skill.
     * @param req  - Express request object (expects JSON body)
     * @param res  - Express response object
     * @returns    HTTP 201 + JSON of created Skills, HTTP 400 if missing/invalid fields,
     *             or HTTP 500 + error
     *
     * Body should include:
     *   - skill_name  (string, required, max length 100)
     */
    async createSkill(req: Request, res: Response) {
        const { skill_name } = req.body as CreateSkillDto;

        // // Validate skill_name
        // if (typeof skill_name !== 'string' || skill_name.trim().length === 0) {
        //     return res
        //         .status(400)
        //         .json({ message: 'skill_name (string) is required' });
        // }
        // if (skill_name.length > 100) {
        //     return res
        //         .status(400)
        //         .json({ message: 'skill_name must not exceed 100 characters' });
        // }

        try {
            // Check for existing skill_name (optional: enforce unique constraint)
            const existing = await this.skillsRepository.findOneBy({ skill_name });
            if (existing) {
                return res
                    .status(409)
                    .json({ message: `Skill '${skill_name}' already exists` });
            }

            const newSkill = this.skillsRepository.create({ skill_name });
            const saved = await this.skillsRepository.save(newSkill);
            return res.status(201).json(saved);
        } catch (error) {
            console.error('Error creating skill:', error);
            return res.status(500).json({ message: 'Error creating skill', error });
        }
    }

    /**
     * PUT /skills/:id
     * Update an existing skill by its ID.
     * @param req  - Express request object (expects `:id` in params and JSON body)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON of updated Skills, HTTP 404 if not found,
     *             HTTP 400 if invalid input, or HTTP 500 + error
     *
     * Body may include:
     *   - skill_name  (string, max length 100)
     *
     * Note: We do not handle reassigning Users or Courses via this endpoint. Use separate endpoints if needed.
     */
    async updateSkill(req: Request, res: Response) {
        const skillId = parseInt(req.params.id, 10);
        if (isNaN(skillId)) {
            return res.status(400).json({ message: 'Invalid skill ID' });
        }

        try {
            const existing = await this.skillsRepository.findOne({
                where: { skill_id: skillId },
            });
            if (!existing) {
                return res.status(404).json({ message: 'Skill not found' });
            }

            const { skill_name: newName } = req.body as UpdateSkillDto;
            if (newName !== undefined) {
                // if (typeof newName !== 'string' || newName.trim().length === 0) {
                //     return res
                //         .status(400)
                //         .json({ message: 'skill_name must be a non-empty string' });
                // }
                // if (newName.length > 100) {
                //     return res
                //         .status(400)
                //         .json({ message: 'skill_name must not exceed 100 characters' });
                // }
                existing.skill_name = newName;
            }

            const updated = await this.skillsRepository.save(existing);
            return res.status(200).json(updated);
        } catch (error) {
            console.error(`Error updating skill id=${skillId}:`, error);
            return res.status(500).json({ message: 'Error updating skill', error });
        }
    }

    /**
     * DELETE /skills/:id
     * Delete a skill by its ID.
     * @param req  - Express request object (expects `:id` in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + success message, HTTP 404 if not found, or HTTP 500 + error
     *
     * Note: If there are Users or Courses still linked to this skill, deletion will fail
     *       due to foreign key constraints. Handle unlinking separately before deleting.
     */
    async deleteSkill(req: Request, res: Response) {
        const skillId = parseInt(req.params.id, 10);
        if (isNaN(skillId)) {
            return res.status(400).json({ message: 'Invalid skill ID' });
        }

        try {
            const existing = await this.skillsRepository.findOne({
                where: { skill_id: skillId },
                relations: ['users', 'courses'],
            });
            if (!existing) {
                return res.status(404).json({ message: 'Skill not found' });
            }

            if (
                (existing.users && existing.users.length > 0) ||
                (existing.courses && existing.courses.length > 0)
            ) {
                return res.status(400).json({
                    message:
                        'Cannot delete skill: it is still assigned to users or courses. Unlink before deleting.',
                });
            }

            await this.skillsRepository.remove(existing);
            return res.status(200).json({ message: 'Skill deleted successfully' });
        } catch (error) {
            console.error(`Error deleting skill id=${skillId}:`, error);
            return res.status(500).json({ message: 'Error deleting skill', error });
        }
    }
}
