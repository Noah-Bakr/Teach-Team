import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { Role } from '../entity/Role';

export class UserController {
    private userRepository = AppDataSource.getRepository(User);
    private roleRepository = AppDataSource.getRepository(Role);

    /**
     * GET /users
     * Fetch all users, including related Role, Skills, Applications, AcademicCredentialUsers,
     * Courses, PreviousRoles, and Comments.
     * @param req  - Express Request object
     * @param res  - Express Response object
     * @returns    HTTP 200 + JSON array of User, or HTTP 500 + error
     */
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.userRepository.find({
                relations: [
                    'role',
                    'skills',
                    'applications',
                    'academicCredentialUsers',
                    'courses',
                    'previousRoles',
                    'comments',
                ],
                order: { created_at: 'DESC' },
            });
            return res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching all users:', error);
            return res.status(500).json({ message: 'Error fetching users', error });
        }
    }

    /**
     * GET /users/:id
     * Fetch one user by its ID.
     * @param req  - Express Request object (expects `:id` in params)
     * @param res  - Express Response object
     * @returns    HTTP 200 + JSON object, HTTP 404 if not found, or HTTP 400/500 + error
     */
    async getUserById(req: Request, res: Response) {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        try {
            const user = await this.userRepository.findOne({
                where: { user_id: userId },
                relations: [
                    'role',
                    'skills',
                    'applications',
                    'academicCredentialUsers',
                    'courses',
                    'previousRoles',
                    'comments',
                ],
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            console.error(`Error fetching user id=${userId}:`, error);
            return res.status(500).json({ message: 'Error fetching user', error });
        }
    }

    /**
     * POST /users
     * Create a new user.
     * @param req  - Express Request object (expects JSON body)
     * @param res  - Express Response object
     * @returns    HTTP 201 + JSON of created User, HTTP 400 if missing/invalid fields,
     *             HTTP 409 if username/email already exists, HTTP 404 if Role not found,
     *             or HTTP 500 + error
     *
     * Body must include:
     *   - username     (string, required, max length 100, unique)
     *   - email        (string, required, max length 150, unique, valid email format)
     *   - password     (string, required, max length 255)
     *   - first_name   (string, required, max length 100)
     *   - last_name    (string, required, max length 100)
     *   - role_id      (number, required)
     *
     * Body may include:
     *   - avatar       (string URL or null, optional, max length 150)
     */
    async createUser(req: Request, res: Response) {
        const {
            username,
            email,
            password,
            first_name,
            last_name,
            avatar,
            role_id,
        } = req.body;

        // Basic validation of required fields
        if (
            typeof username !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            typeof first_name !== 'string' ||
            typeof last_name !== 'string' ||
            typeof role_id !== 'number'
        ) {
            return res.status(400).json({
                message:
                    'username (string), email (string), password (string), first_name (string), last_name (string), and role_id (number) are required',
            });
        }

        // Length checks
        if (username.length > 100) {
            return res
                .status(400)
                .json({ message: 'username must not exceed 100 characters' });
        }
        if (email.length > 150) {
            return res
                .status(400)
                .json({ message: 'email must not exceed 150 characters' });
        }
        if (password.length > 255) {
            return res
                .status(400)
                .json({ message: 'password must not exceed 255 characters' });
        }
        if (first_name.length > 100 || last_name.length > 100) {
            return res
                .status(400)
                .json({ message: 'first_name and last_name must not exceed 100 characters' });
        }
        if (avatar !== undefined && avatar !== null && avatar.length > 150) {
            return res
                .status(400)
                .json({ message: 'avatar URL must not exceed 150 characters' });
        }

        try {
            // Check if username or email already exists
            const existingUsername = await this.userRepository.findOneBy({ username });
            if (existingUsername) {
                return res.status(409).json({ message: 'Username already in use' });
            }
            const existingEmail = await this.userRepository.findOneBy({ email });
            if (existingEmail) {
                return res.status(409).json({ message: 'Email already in use' });
            }

            // Verify that the referenced Role exists
            const role = await this.roleRepository.findOneBy({ role_id });
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }

            // Create new User
            const newUser = this.userRepository.create({
                username,
                email,
                password, // In production, hash before saving!
                first_name,
                last_name,
                avatar: avatar ?? null,
                role,
            });

            const savedUser = await this.userRepository.save(newUser);
            return res.status(201).json(savedUser);
        } catch (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ message: 'Error creating user', error });
        }
    }

    /**
     * PUT /users/:id
     * Update an existing user by its ID.
     * @param req  - Express Request object (expects `:id` in params and JSON body)
     * @param res  - Express Response object
     * @returns    HTTP 200 + JSON of updated User, HTTP 404 if not found,
     *             HTTP 400 if invalid input, HTTP 409 if username/email conflict,
     *             HTTP 404 if new Role not found, or HTTP 500 + error
     *
     * Body may include any of:
     *   - username     (string, max length 100, unique)
     *   - email        (string, max length 150, unique)
     *   - password     (string, max length 255)
     *   - first_name   (string, max length 100)
     *   - last_name    (string, max length 100)
     *   - avatar       (string URL or null, max length 150)
     *   - role_id      (number)
     *
     * Note: Updating relations like skills, applications, courses, etc. should
     *       be done via their own controllers/endpoints.
     */
    async updateUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        try {
            const existing = await this.userRepository.findOne({
                where: { user_id: userId },
                relations: ['role'],
            });
            if (!existing) {
                return res.status(404).json({ message: 'User not found' });
            }

            const {
                username: newUsername,
                email: newEmail,
                password: newPassword,
                first_name: newFirstName,
                last_name: newLastName,
                avatar: newAvatar,
                role_id: newRoleId,
            } = req.body;

            // If updating username, check length and uniqueness
            if (newUsername !== undefined) {
                if (typeof newUsername !== 'string' || newUsername.trim() === '') {
                    return res.status(400).json({ message: 'username must be a non-empty string' });
                }
                if (newUsername.length > 100) {
                    return res
                        .status(400)
                        .json({ message: 'username must not exceed 100 characters' });
                }
                const duplicate = await this.userRepository.findOne({
                    where: { username: newUsername },
                });
                if (duplicate && duplicate.user_id !== userId) {
                    return res.status(409).json({ message: 'Username already in use' });
                }
                existing.username = newUsername;
            }

            // If updating email, check length and uniqueness
            if (newEmail !== undefined) {
                if (typeof newEmail !== 'string' || newEmail.trim() === '') {
                    return res.status(400).json({ message: 'email must be a non-empty string' });
                }
                if (newEmail.length > 150) {
                    return res
                        .status(400)
                        .json({ message: 'email must not exceed 150 characters' });
                }
                const duplicate = await this.userRepository.findOne({
                    where: { email: newEmail },
                });
                if (duplicate && duplicate.user_id !== userId) {
                    return res.status(409).json({ message: 'Email already in use' });
                }
                existing.email = newEmail;
            }

            // If updating password, check length
            if (newPassword !== undefined) {
                if (typeof newPassword !== 'string' || newPassword.trim() === '') {
                    return res.status(400).json({ message: 'password must be a non-empty string' });
                }
                if (newPassword.length > 255) {
                    return res
                        .status(400)
                        .json({ message: 'password must not exceed 255 characters' });
                }
                existing.password = newPassword; // Hash in production!
            }

            // If updating first_name or last_name
            if (newFirstName !== undefined) {
                if (typeof newFirstName !== 'string' || newFirstName.trim() === '') {
                    return res.status(400).json({ message: 'first_name must be a non-empty string' });
                }
                if (newFirstName.length > 100) {
                    return res
                        .status(400)
                        .json({ message: 'first_name must not exceed 100 characters' });
                }
                existing.first_name = newFirstName;
            }
            if (newLastName !== undefined) {
                if (typeof newLastName !== 'string' || newLastName.trim() === '') {
                    return res.status(400).json({ message: 'last_name must be a non-empty string' });
                }
                if (newLastName.length > 100) {
                    return res
                        .status(400)
                        .json({ message: 'last_name must not exceed 100 characters' });
                }
                existing.last_name = newLastName;
            }

            // If updating avatar
            if (newAvatar !== undefined) {
                if (newAvatar !== null && typeof newAvatar !== 'string') {
                    return res.status(400).json({ message: 'avatar must be a string or null' });
                }
                if (newAvatar !== null && newAvatar.length > 150) {
                    return res
                        .status(400)
                        .json({ message: 'avatar URL must not exceed 150 characters' });
                }
                existing.avatar = newAvatar;
            }

            // If updating role_id, verify new Role exists
            if (newRoleId !== undefined) {
                if (typeof newRoleId !== 'number') {
                    return res.status(400).json({ message: 'role_id must be a number' });
                }
                const newRole = await this.roleRepository.findOneBy({ role_id: newRoleId });
                if (!newRole) {
                    return res.status(404).json({ message: 'Role not found' });
                }
                existing.role = newRole;
            }

            const updated = await this.userRepository.save(existing);
            return res.status(200).json(updated);
        } catch (error) {
            console.error(`Error updating user id=${userId}:`, error);
            return res.status(500).json({ message: 'Error updating user', error });
        }
    }

    /**
     * DELETE /users/:id
     * Delete a user by its ID.
     * @param req  - Express Request object (expects `:id` in params)
     * @param res  - Express Response object
     * @returns    HTTP 200 + success message, HTTP 404 if not found, or HTTP 500 + error
     *
     * Note: If the user has related Applications, AcademicCredentials, etc.,
     *       cascading delete behavior depends on your TypeORM config.
     *       If onDelete is not CASCADE, you may need to remove those first.
     */
    async deleteUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        try {
            const existing = await this.userRepository.findOne({
                where: { user_id: userId },
                relations: [
                    'applications',
                    'academicCredentialUsers',
                    'courses',
                    'previousRoles',
                    'comments',
                    'skills',
                ],
            });
            if (!existing) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Optionally, ensure no related data would violate constraints.
            // e.g., if cascade delete is not configured, you might need to unlink first.

            await this.userRepository.remove(existing);
            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error(`Error deleting user id=${userId}:`, error);
            return res.status(500).json({ message: 'Error deleting user', error });
        }
    }
}
