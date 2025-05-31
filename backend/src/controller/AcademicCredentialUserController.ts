import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { AcademicCredentialUser } from '../entity/AcademicCredentialUser';
import { User } from '../entity/User';
import { AcademicCredential } from '../entity/AcademicCredential';

export class AcademicCredentialUserController {
    private linkRepository = AppDataSource.getRepository(AcademicCredentialUser);
    private userRepository = AppDataSource.getRepository(User);
    private credentialRepository = AppDataSource.getRepository(AcademicCredential);

    /**
     * GET /academic-credential-users
     * Fetch all AcademicCredentialUser links, including related User and AcademicCredential.
     * @param req  - Express request object
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON array of AcademicCredentialUser, or HTTP 500 + error
     */
    async getAllAcademicCredentialUserLinks(req: Request, res: Response) {
        try {
            const links = await this.linkRepository.find({
                relations: ['user', 'academicCredential'],
                order: { user_id: 'ASC', academic_id: 'ASC' },
            });
            return res.status(200).json(links);
        } catch (error) {
            console.error('Error fetching all AcademicCredentialUser links:', error);
            return res
                .status(500)
                .json({ message: 'Error fetching academic‐credential‐user links', error });
        }
    }

    /**
     * GET /academic-credential-users/:user_id/:academic_id
     * Fetch one AcademicCredentialUser link by its composite key (user_id + academic_id).
     * @param req  - Express request object (expects :user_id and :academic_id in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON object, HTTP 404 if not found, or HTTP 400/500 + error
     */
    async getAcademicCredentialUserByIds(req: Request, res: Response) {
        const userId = parseInt(req.params.user_id, 10);
        const academicId = parseInt(req.params.academic_id, 10);

        if (isNaN(userId) || isNaN(academicId)) {
            return res
                .status(400)
                .json({ message: 'Invalid user_id or academic_id parameter' });
        }

        try {
            const link = await this.linkRepository.findOne({
                where: { user_id: userId, academic_id: academicId },
                relations: ['user', 'academicCredential'],
            });

            if (!link) {
                return res
                    .status(404)
                    .json({ message: 'AcademicCredentialUser link not found' });
            }
            return res.status(200).json(link);
        } catch (error) {
            console.error(
                `Error fetching AcademicCredentialUser link user_id=${userId}, academic_id=${academicId}:`,
                error
            );
            return res
                .status(500)
                .json({ message: 'Error fetching academic‐credential‐user link', error });
        }
    }

    /**
     * POST /academic-credential-users
     * Create a new AcademicCredentialUser link.
     * @param req  - Express request object (expects JSON body)
     * @param res  - Express response object
     * @returns    HTTP 201 + JSON of created link, HTTP 400 if missing fields, or HTTP 500 + error
     *
     * Body should include:
     *   - user_id      (number, required)
     *   - academic_id  (number, required)
     *
     * Note: Both User and AcademicCredential must already exist.
     */
    async createAcademicCredentialUser(req: Request, res: Response) {
        const { user_id, academic_id } = req.body;

        if (typeof user_id !== 'number' || typeof academic_id !== 'number') {
            return res
                .status(400)
                .json({ message: 'Both user_id and academic_id are required as numbers' });
        }

        try {
            // Verify that the referenced User exists
            const user = await this.userRepository.findOneBy({ user_id });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verify that the referenced AcademicCredential exists
            const credential = await this.credentialRepository.findOneBy({ academic_id });
            if (!credential) {
                return res.status(404).json({ message: 'AcademicCredential not found' });
            }

            // Check if link already exists
            const existingLink = await this.linkRepository.findOneBy({ user_id, academic_id });
            if (existingLink) {
                return res
                    .status(409)
                    .json({ message: 'This AcademicCredentialUser link already exists' });
            }

            // Create the new link
            const newLink = this.linkRepository.create({ user_id, academic_id });
            const savedLink = await this.linkRepository.save(newLink);
            return res.status(201).json(savedLink);
        } catch (error) {
            console.error('Error creating AcademicCredentialUser link:', error);
            return res
                .status(500)
                .json({ message: 'Error creating academic‐credential‐user link', error });
        }
    }

    /**
     * PUT /academic-credential-users/:user_id/:academic_id
     * Update an existing AcademicCredentialUser link.
     * @param req  - Express request object (expects :user_id and :academic_id in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON of updated link, HTTP 404 if not found,
     *             HTTP 400 if attempting to change primary keys, or HTTP 500 + error
     *
     * Note: This entity has a composite primary key only. There are no additional updatable fields.
     *       If you need to change user_id or academic_id, delete the existing link and create a new one.
     */
    async updateAcademicCredentialUser(req: Request, res: Response) {
        const userId = parseInt(req.params.user_id, 10);
        const academicId = parseInt(req.params.academic_id, 10);

        if (isNaN(userId) || isNaN(academicId)) {
            return res
                .status(400)
                .json({ message: 'Invalid user_id or academic_id parameter' });
        }

        try {
            const existingLink = await this.linkRepository.findOneBy({ user_id: userId, academic_id: academicId });
            if (!existingLink) {
                return res
                    .status(404)
                    .json({ message: 'AcademicCredentialUser link not found' });
            }

            // only the composite PK exists,
            // we do not allow modifying user_id or academic_id here.
            return res.status(400).json({
                message:
                    'Cannot update primary keys of an AcademicCredentialUser link. Delete and re-create if you need different values.',
            });
        } catch (error) {
            console.error(
                `Error updating AcademicCredentialUser link user_id=${userId}, academic_id=${academicId}:`,
                error
            );
            return res
                .status(500)
                .json({ message: 'Error updating academic‐credential‐user link', error });
        }
    }

    /**
     * DELETE /academic-credential-users/:user_id/:academic_id
     * Delete an AcademicCredentialUser link by composite key (user_id + academic_id).
     * @param req  - Express request object (expects :user_id and :academic_id in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + success message, HTTP 404 if not found, or HTTP 500 + error
     */
    async deleteAcademicCredentialUser(req: Request, res: Response) {
        const userId = parseInt(req.params.user_id, 10);
        const academicId = parseInt(req.params.academic_id, 10);

        if (isNaN(userId) || isNaN(academicId)) {
            return res
                .status(400)
                .json({ message: 'Invalid user_id or academic_id parameter' });
        }

        try {
            const existingLink = await this.linkRepository.findOneBy({ user_id: userId, academic_id: academicId });
            if (!existingLink) {
                return res
                    .status(404)
                    .json({ message: 'AcademicCredentialUser link not found' });
            }

            await this.linkRepository.remove(existingLink);
            return res
                .status(200)
                .json({ message: 'AcademicCredentialUser link deleted successfully' });
        } catch (error) {
            console.error(
                `Error deleting AcademicCredentialUser link user_id=${userId}, academic_id=${academicId}:`,
                error
            );
            return res
                .status(500)
                .json({ message: 'Error deleting academic‐credential‐user link', error });
        }
    }
}
