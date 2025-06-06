import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { PreviousRole } from '../entity/PreviousRole';
import { User } from '../entity/User';
import { CreatePreviousRoleDto, UpdatePreviousRoleDto } from '../dto/previousRole.dto';

export class PreviousRoleController {
    private previousRoleRepository = AppDataSource.getRepository(PreviousRole);
    private userRepository = AppDataSource.getRepository(User);

    /**
     * GET /previous-roles
     * Fetch all previous roles, including the related User.
     * @param req  - Express request object
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON array of PreviousRole, or HTTP 500 + error
     */
    async getAllPreviousRoles(req: Request, res: Response) {
        try {
            const roles = await this.previousRoleRepository.find({
                relations: ['user'],
                order: { start_date: 'DESC' },
            });
            return res.status(200).json(roles);
        } catch (error) {
            console.error('Error fetching all previous roles:', error);
            return res
                .status(500)
                .json({ message: 'Error fetching previous roles', error });
        }
    }

    /**
     * GET /previous-roles/:id
     * Fetch one previous role by its ID.
     * @param req  - Express request object (expects `:id` in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON object, HTTP 404 if not found, or HTTP 400/500 + error
     */
    async getPreviousRoleById(req: Request, res: Response) {
        const previousRoleId = parseInt(req.params.id, 10);
        if (isNaN(previousRoleId)) {
            return res.status(400).json({ message: 'Invalid previous_role_id' });
        }

        try {
            const role = await this.previousRoleRepository.findOne({
                where: { previous_role_id: previousRoleId },
                relations: ['user'],
            });

            if (!role) {
                return res.status(404).json({ message: 'Previous role not found' });
            }
            return res.status(200).json(role);
        } catch (error) {
            console.error(`Error fetching previous role id=${previousRoleId}:`, error);
            return res
                .status(500)
                .json({ message: 'Error fetching previous role', error });
        }
    }

    /**
     * POST /previous-roles
     * Create a new previous role for a user.
     * @param req  - Express request object (expects JSON body)
     * @param res  - Express response object
     * @returns    HTTP 201 + JSON of created PreviousRole, HTTP 400 if missing/invalid fields,
     *             HTTP 404 if referenced User not found, or HTTP 500 + error
     *
     * Body should include:
     *   - previous_role (string, required)
     *   - company       (string, required)
     *   - start_date    (string in YYYY-MM-DD, required)
     *   - end_date      (string in YYYY-MM-DD or null, optional)
     *   - description   (string or null, optional)
     *   - user_id       (number, required)
     */
    async createPreviousRole(req: Request, res: Response) {
        const {
            previous_role,
            company,
            start_date,
            end_date,
            description,
            user_id,
        } = req.body as CreatePreviousRoleDto;

        // // Basic validation of required fields
        // if (
        //     typeof previous_role !== 'string' ||
        //     typeof company !== 'string' ||
        //     !start_date ||
        //     typeof user_id !== 'number'
        // ) {
        //     return res.status(400).json({
        //         message:
        //             'previous_role (string), company (string), start_date (YYYY-MM-DD), and user_id (number) are required',
        //     });
        // }

        try {
            // Verify that the referenced User exists
            const user = await this.userRepository.findOneBy({ user_id });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Create new PreviousRole
            const newRole = this.previousRoleRepository.create({
                previous_role,
                company,
                start_date: new Date(start_date),
                end_date: end_date ? new Date(end_date) : undefined,
                description: description ?? undefined,
                user,
            });

            const saved = await this.previousRoleRepository.save(newRole);
            return res.status(201).json(saved);
        } catch (error) {
            console.error('Error creating previous role:', error);
            return res
                .status(500)
                .json({ message: 'Error creating previous role', error });
        }
    }

    /**
     * PUT /previous-roles/:id
     * Update an existing previous role by its ID.
     * @param req  - Express request object (expects `:id` in params and JSON body)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON of updated PreviousRole, HTTP 404 if not found,
     *             HTTP 400 if invalid input, or HTTP 500 + error
     *
     * Body may include any of:
     *   - previous_role (string)
     *   - company       (string)
     *   - start_date    (string in YYYY-MM-DD)
     *   - end_date      (string in YYYY-MM-DD or null)
     *   - description   (string or null)
     *
     * Note: We do not allow changing `user_id` via this endpoint. To reassign, delete and re-create.
     */
    async updatePreviousRole(req: Request, res: Response) {
        const previousRoleId = parseInt(req.params.id, 10);
        if (isNaN(previousRoleId)) {
            return res.status(400).json({ message: 'Invalid previous_role_id' });
        }

        try {
            const existing = await this.previousRoleRepository.findOne({
                where: { previous_role_id: previousRoleId },
            });
            if (!existing) {
                return res.status(404).json({ message: 'Previous role not found' });
            }

            const {
                previous_role: newRoleName,
                company: newCompany,
                start_date: newStartDate,
                end_date: newEndDate,
                description: newDescription,
            } = req.body as UpdatePreviousRoleDto;

            // Update only provided fields
            if (newRoleName !== undefined) {
                if (typeof newRoleName !== 'string') {
                    return res.status(400).json({ message: 'previous_role must be a string' });
                }
                existing.previous_role = newRoleName;
            }
            if (newCompany !== undefined) {
                if (typeof newCompany !== 'string') {
                    return res.status(400).json({ message: 'company must be a string' });
                }
                existing.company = newCompany;
            }
            if (newStartDate !== undefined) {
                existing.start_date = new Date(newStartDate);
            }
            if (newEndDate !== undefined) {
                existing.end_date = newEndDate ? new Date(newEndDate) : null;
            }
            if (newDescription !== undefined) {
                existing.description = newDescription;
            }

            await this.previousRoleRepository.save(existing);

            // Fetch again with user relation
            const updatedWithUser = await this.previousRoleRepository.findOne({
                where: { previous_role_id: previousRoleId },
                relations: ['user'],
            });

            return res.status(200).json(updatedWithUser);
        } catch (error) {
            console.error(`Error updating previous role id=${previousRoleId}:`, error);
            return res
                .status(500)
                .json({ message: 'Error updating previous role', error });
        }
    }

    /**
     * DELETE /previous-roles/:id
     * Delete a previous role by its ID.
     * @param req  - Express request object (expects `:id` in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + success message, HTTP 404 if not found, or HTTP 500 + error
     */
    async deletePreviousRole(req: Request, res: Response) {
        const previousRoleId = parseInt(req.params.id, 10);
        if (isNaN(previousRoleId)) {
            return res.status(400).json({ message: 'Invalid previous_role_id' });
        }

        try {
            const existing = await this.previousRoleRepository.findOne({
                where: { previous_role_id: previousRoleId },
            });
            if (!existing) {
                return res.status(404).json({ message: 'Previous role not found' });
            }

            await this.previousRoleRepository.remove(existing);
            return res
                .status(200)
                .json({ message: 'Previous role deleted successfully' });
        } catch (error) {
            console.error(`Error deleting previous role id=${previousRoleId}:`, error);
            return res
                .status(500)
                .json({ message: 'Error deleting previous role', error });
        }
    }
}
