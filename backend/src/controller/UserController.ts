import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { Role } from '../entity/Role';
import { Skills } from '../entity/Skills';
import { AcademicCredential } from '../entity/AcademicCredential';
import { Course } from '../entity/Course';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

export class UserController {
    private userRepository = AppDataSource.getRepository(User);
    private roleRepository = AppDataSource.getRepository(Role);
    private skillsRepository = AppDataSource.getRepository(Skills);
    private credentialRepository = AppDataSource.getRepository(AcademicCredential);
    private courseRepository = AppDataSource.getRepository(Course);

    /**
     * GET /user
     * Fetch all users, including their role, skills, applications, academicCredentials,
     * courses, previousRoles, comments, and rankings.
     */
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.userRepository.find({
                relations: [
                    'role',
                    'skills',
                    'applications',
                    'academicCredentials',
                    'courses',
                    'previousRoles',
                    'reviews',
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
     * GET /user/:id
     * Fetch a single user by ID, including all related arrays.
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
                    'academicCredentials',
                    'courses',
                    'previousRoles',
                    'reviews',
                ],
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // return res.status(200).json(user);
            const { password, ...userWithoutPassword } = user;

            return res.status(200).json(userWithoutPassword);
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
        } = req.body as CreateUserDto;

        // // Basic validation of required fields
        // if (
        //     typeof username !== 'string' ||
        //     typeof email !== 'string' ||
        //     typeof password !== 'string' ||
        //     typeof first_name !== 'string' ||
        //     typeof last_name !== 'string' ||
        //     typeof role_id !== 'number'
        // ) {
        //     return res.status(400).json({
        //         message:
        //             'username (string), email (string), password (string), first_name (string), last_name (string), and role_id (number) are required',
        //     });
        // }

        // // Length checks
        // if (username.length > 100) {
        //     return res
        //         .status(400)
        //         .json({ message: 'username must not exceed 100 characters' });
        // }
        // if (email.length > 150) {
        //     return res
        //         .status(400)
        //         .json({ message: 'email must not exceed 150 characters' });
        // }
        // if (password.length > 255) {
        //     return res
        //         .status(400)
        //         .json({ message: 'password must not exceed 255 characters' });
        // }
        // if (first_name.length > 100 || last_name.length > 100) {
        //     return res
        //         .status(400)
        //         .json({ message: 'first_name and last_name must not exceed 100 characters' });
        // }
        // if (avatar !== undefined && avatar !== null && avatar.length > 150) {
        //     return res
        //         .status(400)
        //         .json({ message: 'avatar URL must not exceed 150 characters' });
        // }

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
                password,
                first_name,
                last_name,
                avatar: avatar ?? undefined,
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

        // Validate and transform request body into UpdateUserDto
        const { username, email, password, first_name, last_name, avatar, role_id } = req.body as UpdateUserDto;

        try {
            const existing = await this.userRepository.findOne({
                where: { user_id: userId },
                relations: ['role'],
            });
            if (!existing) {
                return res.status(404).json({ message: 'User not found' });
            }

            // const {
            //     username: newUsername,
            //     email: newEmail,
            //     password: newPassword,
            //     first_name: newFirstName,
            //     last_name: newLastName,
            //     avatar: newAvatar,
            //     role_id: newRoleId,
            // } = req.body;

            // // If updating username, check length and uniqueness
            // if (newUsername !== undefined) {
            //     if (typeof newUsername !== 'string' || newUsername.trim() === '') {
            //         return res.status(400).json({ message: 'username must be a non-empty string' });
            //     }
            //     if (newUsername.length > 100) {
            //         return res
            //             .status(400)
            //             .json({ message: 'username must not exceed 100 characters' });
            //     }
            //     const duplicate = await this.userRepository.findOne({
            //         where: { username: newUsername },
            //     });
            //     if (duplicate && duplicate.user_id !== userId) {
            //         return res.status(409).json({ message: 'Username already in use' });
            //     }
            //     existing.username = newUsername;
            // }

            if (username) {
                const duplicate = await this.userRepository.findOneBy({ username: username });
                if (duplicate && duplicate.user_id !== userId) {
                    return res.status(409).json({ message: 'Username already in use' });
                }
                existing.username = username;
            }

            // // If updating email, check length and uniqueness
            // if (newEmail !== undefined) {
            //     if (typeof newEmail !== 'string' || newEmail.trim() === '') {
            //         return res.status(400).json({ message: 'email must be a non-empty string' });
            //     }
            //     if (newEmail.length > 150) {
            //         return res
            //             .status(400)
            //             .json({ message: 'email must not exceed 150 characters' });
            //     }
            //     const duplicate = await this.userRepository.findOne({
            //         where: { email: newEmail },
            //     });
            //     if (duplicate && duplicate.user_id !== userId) {
            //         return res.status(409).json({ message: 'Email already in use' });
            //     }
            //     existing.email = newEmail;
            // }

            if (email) {
                const duplicate = await this.userRepository.findOneBy({ email: email });
                if (duplicate && duplicate.user_id !== userId) {
                    return res.status(409).json({ message: 'Email already in use' });
                }
                existing.email = email;
            }

            // // If updating password, check length
            // if (newPassword !== undefined) {
            //     if (typeof newPassword !== 'string' || newPassword.trim() === '') {
            //         return res.status(400).json({ message: 'password must be a non-empty string' });
            //     }
            //     if (newPassword.length > 255) {
            //         return res
            //             .status(400)
            //             .json({ message: 'password must not exceed 255 characters' });
            //     }
            //     existing.password = newPassword; // Hash in production!
            // }

            if (password) {
                existing.password = password;
            }

            // // If updating first_name or last_name
            // if (newFirstName !== undefined) {
            //     if (typeof newFirstName !== 'string' || newFirstName.trim() === '') {
            //         return res.status(400).json({ message: 'first_name must be a non-empty string' });
            //     }
            //     if (newFirstName.length > 100) {
            //         return res
            //             .status(400)
            //             .json({ message: 'first_name must not exceed 100 characters' });
            //     }
            //     existing.first_name = newFirstName;
            // }
            // if (newLastName !== undefined) {
            //     if (typeof newLastName !== 'string' || newLastName.trim() === '') {
            //         return res.status(400).json({ message: 'last_name must be a non-empty string' });
            //     }
            //     if (newLastName.length > 100) {
            //         return res
            //             .status(400)
            //             .json({ message: 'last_name must not exceed 100 characters' });
            //     }
            //     existing.last_name = newLastName;
            // }

            if (first_name) {
                existing.first_name = first_name;
            }

            if (last_name) {
                existing.last_name = last_name;
            }

            // // If updating avatar
            // if (newAvatar !== undefined) {
            //     if (newAvatar !== null && typeof newAvatar !== 'string') {
            //         return res.status(400).json({ message: 'avatar must be a string or null' });
            //     }
            //     if (newAvatar !== null && newAvatar.length > 150) {
            //         return res
            //             .status(400)
            //             .json({ message: 'avatar URL must not exceed 150 characters' });
            //     }
            //     existing.avatar = newAvatar;
            // }

            if (avatar !== undefined && avatar !== null) {
                existing.avatar = avatar;
            }

            // // If updating role_id, verify new Role exists
            // if (newRoleId !== undefined) {
            //     if (typeof newRoleId !== 'number') {
            //         return res.status(400).json({ message: 'role_id must be a number' });
            //     }
            //     const newRole = await this.roleRepository.findOneBy({ role_id: newRoleId });
            //     if (!newRole) {
            //         return res.status(404).json({ message: 'Role not found' });
            //     }
            //     existing.role = newRole;
            // }

            if (role_id !== undefined) {
                const newRole = await this.roleRepository.findOneBy({ role_id: role_id });
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
                    'academicCredentials',
                    'courses',
                    'previousRoles',
                    'skills',
                    'reviews',
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

    /**
     * POST /user/:id/skills
     * Attach one or more skills to this user.
     * Body: { skillIds: number[] }
     */
    async addSkillsToUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id, 10);
        const { skillIds } = req.body;

        if (isNaN(userId) || !Array.isArray(skillIds)) {
            return res.status(400).json({ message: 'Invalid user ID or skillIds' });
        }

        try {
            const user = await this.userRepository.findOneBy({ user_id: userId });
            if (!user) return res.status(404).json({ message: 'User not found' });

            // Validate each skillId
            for (const sid of skillIds) {
                const skill = await this.skillsRepository.findOneBy({ skill_id: sid });
                if (!skill) {
                    return res.status(400).json({ message: `Skill ID ${sid} not found` });
                }
            }

            // Attach from owning side (User)
            await this.userRepository
                .createQueryBuilder()
                .relation(User, 'skills')
                .of(userId)
                .add(skillIds);

            const updated = await this.userRepository.findOne({
                where: { user_id: userId },
                relations: ['skills'],
            });
            return res.status(200).json(updated);
        } catch (error) {
            console.error(`Error adding skills to user ${userId}:`, error);
            return res.status(500).json({ message: 'Error adding skills to user', error });
        }
    }

    /**
     * DELETE /user/:id/skills/:skillId
     * Detach a single skill from this user.
     */
    async removeSkillFromUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id, 10);
        const skillId = parseInt(req.params.skillId, 10);

        if (isNaN(userId) || isNaN(skillId)) {
            return res.status(400).json({ message: 'Invalid user ID or skill ID' });
        }

        try {
            const user = await this.userRepository.findOneBy({ user_id: userId });
            if (!user) return res.status(404).json({ message: 'User not found' });

            await this.userRepository
                .createQueryBuilder()
                .relation(User, 'skills')
                .of(userId)
                .remove(skillId);

            const updated = await this.userRepository.findOne({
                where: { user_id: userId },
                relations: ['skills'],
            });
            return res.status(200).json(updated);
        } catch (error) {
            console.error(`Error removing skill ${skillId} from user ${userId}:`, error);
            return res.status(500).json({ message: 'Error removing skill from user', error });
        }
    }

    /**
     * POST /user/:id/academic-credentials
     * Attach one or more academic credentials to this user.
     * Body: { credentialIds: number[] }
     */
    async addCredentialsToUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id, 10);
        const { credentialIds } = req.body;

        if (isNaN(userId) || !Array.isArray(credentialIds)) {
            return res.status(400).json({ message: 'Invalid user ID or credentialIds' });
        }

        try {
            const user = await this.userRepository.findOneBy({ user_id: userId });
            if (!user) return res.status(404).json({ message: 'User not found' });

            for (const cid of credentialIds) {
                const cred = await this.credentialRepository.findOneBy({ academic_id: cid });
                if (!cred) {
                    return res.status(400).json({ message: `AcademicCredential ID ${cid} not found` });
                }
            }

            await this.userRepository
                .createQueryBuilder()
                .relation(User, 'academicCredentials')
                .of(userId)
                .add(credentialIds);

            const updated = await this.userRepository.findOne({
                where: { user_id: userId },
                relations: ['academicCredentials'],
            });
            return res.status(200).json(updated);
        } catch (error) {
            console.error(`Error adding credentials to user ${userId}:`, error);
            return res
                .status(500)
                .json({ message: 'Error adding academic credentials to user', error });
        }
    }

    /**
     * DELETE /user/:id/academic-credentials/:credentialId
     * Detach a single academic credential from this user.
     */
    async removeCredentialFromUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id, 10);
        const credentialId = parseInt(req.params.credentialId, 10);

        if (isNaN(userId) || isNaN(credentialId)) {
            return res.status(400).json({ message: 'Invalid user ID or credential ID' });
        }

        try {
            const user = await this.userRepository.findOneBy({ user_id: userId });
            if (!user) return res.status(404).json({ message: 'User not found' });

            await this.userRepository
                .createQueryBuilder()
                .relation(User, 'academicCredentials')
                .of(userId)
                .remove(credentialId);

            const updated = await this.userRepository.findOne({
                where: { user_id: userId },
                relations: ['academicCredentials'],
            });
            return res.status(200).json(updated);
        } catch (error) {
            console.error(
                `Error removing academic credential ${credentialId} from user ${userId}:`,
                error
            );
            return res
                .status(500)
                .json({ message: 'Error removing academic credential from user', error });
        }
    }

    /**
     * POST /user/:id/courses
     * Attach one or more courses to this user (lecturer).
     * Body: { courseIds: number[] }
     */
    async addCoursesToUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id, 10);
        const { courseIds } = req.body;

        if (isNaN(userId) || !Array.isArray(courseIds)) {
            return res.status(400).json({ message: 'Invalid user ID or courseIds' });
        }

        try {
            const user = await this.userRepository.findOneBy({ user_id: userId });
            if (!user) return res.status(404).json({ message: 'User not found' });

            for (const cid of courseIds) {
                const course = await this.courseRepository.findOneBy({ course_id: cid });
                if (!course) {
                    return res.status(400).json({ message: `Course ID ${cid} not found` });
                }
            }

            await this.userRepository
                .createQueryBuilder()
                .relation(User, 'courses')
                .of(userId)
                .add(courseIds);

            const updated = await this.userRepository.findOne({
                where: { user_id: userId },
                relations: ['courses'],
            });
            return res.status(200).json(updated);
        } catch (error) {
            console.error(`Error adding courses to user ${userId}:`, error);
            return res.status(500).json({ message: 'Error adding courses to user', error });
        }
    }

    /**
     * DELETE /user/:id/courses/:courseId
     * Detach a single course from this user (lecturer).
     */
    async removeCourseFromUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id, 10);
        const courseId = parseInt(req.params.courseId, 10);

        if (isNaN(userId) || isNaN(courseId)) {
            return res.status(400).json({ message: 'Invalid user ID or course ID' });
        }

        try {
            const user = await this.userRepository.findOneBy({ user_id: userId });
            if (!user) return res.status(404).json({ message: 'User not found' });

            await this.userRepository
                .createQueryBuilder()
                .relation(User, 'courses')
                .of(userId)
                .remove(courseId);

            const updated = await this.userRepository.findOne({
                where: { user_id: userId },
                relations: ['courses'],
            });
            return res.status(200).json(updated);
        } catch (error) {
            console.error(`Error removing course ${courseId} from user ${userId}:`, error);
            return res.status(500).json({ message: 'Error removing course from user', error });
        }
    }
}
