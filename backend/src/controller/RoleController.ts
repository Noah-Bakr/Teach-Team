import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Role } from '../entity/Role';

export class RoleController {
    private roleRepository = AppDataSource.getRepository(Role);

    /**
     * GET /roles
     * Fetch all roles.
     * @param req  - Express request object
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON array of Role, or HTTP 500 + error
     */
    async getAllRoles(req: Request, res: Response) {
        try {
            const roles = await this.roleRepository.find({
                order: { role_id: 'ASC' },
            });
            return res.status(200).json(roles);
        } catch (error) {
            console.error('Error fetching all roles:', error);
            return res.status(500).json({ message: 'Error fetching roles', error });
        }
    }

    /**
     * GET /roles/:id
     * Fetch one role by its ID.
     * @param req  - Express request object (expects `:id` in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON object, HTTP 404 if not found, or HTTP 400/500 + error
     */
    async getRoleById(req: Request, res: Response) {
        const roleId = parseInt(req.params.id, 10);
        if (isNaN(roleId)) {
            return res.status(400).json({ message: 'Invalid role ID' });
        }

        try {
            const role = await this.roleRepository.findOne({
                where: { role_id: roleId },
            });

            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }
            return res.status(200).json(role);
        } catch (error) {
            console.error(`Error fetching role id=${roleId}:`, error);
            return res.status(500).json({ message: 'Error fetching role', error });
        }
    }

    /**
     * POST /roles
     * Create a new role.
     * @param req  - Express request object (expects JSON body)
     * @param res  - Express response object
     * @returns    HTTP 201 + JSON of created Role, HTTP 400 if missing/invalid fields,
     *             or HTTP 500 + error
     *
     * Body should include:
     *   - role_name  ('admin' | 'lecturer' | 'candidate', required)
     */
    async createRole(req: Request, res: Response) {
        const { role_name } = req.body;

        // Basic validation
        const validRoles = ['admin', 'lecturer', 'candidate'] as const;
        if (!role_name || !validRoles.includes(role_name)) {
            return res.status(400).json({
                message: `role_name is required and must be one of: ${validRoles.join(
                    ', '
                )}`,
            });
        }

        try {
            // Check for existing role_name (optional: enforce unique constraint)
            const existing = await this.roleRepository.findOneBy({ role_name });
            if (existing) {
                return res
                    .status(409)
                    .json({ message: `Role '${role_name}' already exists` });
            }

            const newRole = this.roleRepository.create({ role_name });
            const saved = await this.roleRepository.save(newRole);
            return res.status(201).json(saved);
        } catch (error) {
            console.error('Error creating role:', error);
            return res.status(500).json({ message: 'Error creating role', error });
        }
    }

    /**
     * PUT /roles/:id
     * Update an existing role by its ID.
     * @param req  - Express request object (expects `:id` in params and JSON body)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON of updated Role, HTTP 404 if not found,
     *             HTTP 400 if invalid input, or HTTP 500 + error
     *
     * Body may include:
     *   - role_name  ('admin' | 'lecturer' | 'candidate')
     */
    async updateRole(req: Request, res: Response) {
        const roleId = parseInt(req.params.id, 10);
        if (isNaN(roleId)) {
            return res.status(400).json({ message: 'Invalid role ID' });
        }

        try {
            const existing = await this.roleRepository.findOne({
                where: { role_id: roleId },
            });
            if (!existing) {
                return res.status(404).json({ message: 'Role not found' });
            }

            const { role_name } = req.body;
            const validRoles = ['admin', 'lecturer', 'candidate'] as const;
            if (role_name !== undefined) {
                if (!validRoles.includes(role_name)) {
                    return res.status(400).json({
                        message: `role_name must be one of: ${validRoles.join(', ')}`,
                    });
                }
                existing.role_name = role_name;
            }

            const updated = await this.roleRepository.save(existing);
            return res.status(200).json(updated);
        } catch (error) {
            console.error(`Error updating role id=${roleId}:`, error);
            return res.status(500).json({ message: 'Error updating role', error });
        }
    }

    /**
     * DELETE /roles/:id
     * Delete a role by its ID.
     * @param req  - Express request object (expects `:id` in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + success message, HTTP 404 if not found, or HTTP 500 + error
     */
    async deleteRole(req: Request, res: Response) {
        const roleId = parseInt(req.params.id, 10);
        if (isNaN(roleId)) {
            return res.status(400).json({ message: 'Invalid role ID' });
        }

        try {
            const existing = await this.roleRepository.findOne({
                where: { role_id: roleId },
                relations: ['users'],
            });
            if (!existing) {
                return res.status(404).json({ message: 'Role not found' });
            }

            // Optional: Prevent deletion if users are assigned to this role
            if (existing.users && existing.users.length > 0) {
                return res.status(400).json({
                    message:
                        'Cannot delete role: users are still assigned. Reassign or remove users first.',
                });
            }

            await this.roleRepository.remove(existing);
            return res.status(200).json({ message: 'Role deleted successfully' });
        } catch (error) {
            console.error(`Error deleting role id=${roleId}:`, error);
            return res.status(500).json({ message: 'Error deleting role', error });
        }
    }
}
