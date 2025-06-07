import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { AcademicCredential } from '../entity/AcademicCredential';
import { CreateAcademicCredentialDto, UpdateAcademicCredentialDto } from '../dto/academicCredential.dto';

export class AcademicCredentialController {
    private credentialRepository = AppDataSource.getRepository(AcademicCredential);

    /**
     * GET /academic-credentials
     * Fetch all academic credentials, including related AcademicCredentialUser entries.
     * @param req  - Express request object
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON array of AcademicCredential, or HTTP 500 + error
     */
    async getAllAcademicCredentials(req: Request, res: Response) {
        try {
            const credentials = await this.credentialRepository.find({
                relations: ['users'],
                order: { start_date: 'DESC' },
            });
            const result = credentials.map(cred => ({
                academic_id: cred.academic_id,
                degree_name: cred.degree_name,
                institution: cred.institution,
                start_date: cred.start_date,
                end_date: cred.end_date,
                description: cred.description,
                users: cred.users.map(u => ({
                    user_id: u.user_id,
                    username: u.username
                }))
            }));
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching all academic credentials:', error);
            return res.status(500).json({ message: 'Error fetching academic credentials', error });
        }
    }

    /**
     * GET /academic-credentials/:id
     * Fetch one academic credential by its ID.
     * @param req  - Express request object (expects `:id` in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON object, HTTP 404 if not found, or HTTP 500 + error
     */
    async getAcademicCredentialById(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid academic credential ID' });
        }

        try {
            const credential = await this.credentialRepository.findOne({
                where: { academic_id: id },
                relations: ['users'],
            });

            if (!credential) {
                return res.status(404).json({ message: 'Academic credential not found' });
            }
            return res.status(200).json(credential);
        } catch (error) {
            console.error(`Error fetching academic credential id=${id}:`, error);
            return res.status(500).json({ message: 'Error fetching academic credential', error });
        }
    }

    /**
     * POST /academic-credentials
     * Create a new academic credential.
     * @param req  - Express request object (expects JSON body)
     * @param res  - Express response object
     * @returns    HTTP 201 + JSON of created AcademicCredential, or HTTP 400/500 + error
     *
     * include:
     *   - degree_name  (string, required)
     *   - institution  (string, required)
     *   - start_date   (string in YYYY-MM-DD, required)
     *   - end_date     (string in YYYY-MM-DD or null, optional)
     *   - description  (string or null, optional)
     */
    async createAcademicCredential(req: Request, res: Response) {
        const { degree_name, institution, start_date, end_date, description } = req.body as CreateAcademicCredentialDto;

        try {
            const newCredential = this.credentialRepository.create({
                degree_name,
                institution,
                start_date: new Date(start_date),
                end_date: end_date ? new Date(end_date) : undefined,
                description: description ?? undefined,
            });

            const saved = await this.credentialRepository.save(newCredential);
            return res.status(201).json(saved);
        } catch (error) {
            console.error('Error creating academic credential:', error);
            return res.status(500).json({ message: 'Error creating academic credential', error });
        }
    }

    /**
     * PUT /academic-credentials/:id
     * Update an existing academic credential by ID.
     * @param req  - Express request object (expects `:id` in params and JSON body)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON of updated AcademicCredential, HTTP 404 if not found,
     *             or HTTP 400/500 + error
     *
     * Body may include any of:
     *   - degree_name  (string)
     *   - institution  (string)
     *   - start_date   (string in YYYY-MM-DD)
     *   - end_date     (string in YYYY-MM-DD or null)
     *   - description  (string or null)
     */
    async updateAcademicCredential(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid academic credential ID' });
        }

        try {
            const existing = await this.credentialRepository.findOne({
                where: { academic_id: id },
            });
            if (!existing) {
                return res.status(404).json({ message: 'Academic credential not found' });
            }

            const { degree_name, institution, start_date, end_date, description } = req.body as UpdateAcademicCredentialDto;

            if (degree_name !== undefined) existing.degree_name = degree_name;
            if (institution !== undefined) existing.institution = institution;
            if (start_date !== undefined) existing.start_date = new Date(start_date);
            if (end_date !== undefined) existing.end_date = end_date ? new Date(end_date) : null;
            if (description !== undefined) existing.description = description;

            const updated = await this.credentialRepository.save(existing);
            return res.status(200).json(updated);
        } catch (error) {
            console.error(`Error updating academic credential id=${id}:`, error);
            return res
                .status(500)
                .json({ message: 'Error updating academic credential', error });
        }
    }

    /**
     * DELETE /academic-credentials/:id
     * Delete an academic credential by ID.
     * @param req  - Express request object (expects `:id` in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + success message, HTTP 404 if not found, or HTTP 500 + error
     */
    async deleteAcademicCredential(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid academic credential ID' });
        }

        try {
            const existing = await this.credentialRepository.findOne({
                where: { academic_id: id },
            });
            if (!existing) {
                return res.status(404).json({ message: 'Academic credential not found' });
            }

            await this.credentialRepository.remove(existing);
            return res.status(200).json({ message: 'Academic credential deleted successfully' });
        } catch (error) {
            console.error(`Error deleting academic credential id=${id}:`, error);
            return res
                .status(500)
                .json({ message: 'Error deleting academic credential', error });
        }
    }
}

