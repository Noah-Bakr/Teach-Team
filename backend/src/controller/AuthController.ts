import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {
    private userRepository = AppDataSource.getRepository(User);

    /**
     * Handles user login
     * @param req - Express request object containing email and hashed password in body
     * @param res - Express response object
     * @returns JSON response with success message and user data or error message
     */
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = await this.userRepository.findOne({
            where: { email },
            relations: ['role'],
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user.user_id, role: user.role.role_name },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000,
        });

        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({ message: 'Login successful', user: userWithoutPassword });

        // return res.status(200).json({ message: 'Login successful', user });
    }

    /**
     * Handles user sign-up
     * @param req - Express request object containing email and hashed password in body
     * @param res - Express response object
     * @returns JSON response with success message and user data or error message
     */
    async signUp(req: Request, res: Response) {
        const { firstName, lastName, username, email, password } = req.body;

        const existingEmail = await this.userRepository.findOne({ where: { email } });
        const existingUsername = await this.userRepository.findOne({ where: { username } });

        if (existingEmail || existingUsername) {
        return res.status(400).json({ message: 'Email or username already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.userRepository.create({
            first_name: firstName,
            last_name: lastName,
            username,
            email,
            password: hashedPassword,
        });

        await this.userRepository.save(newUser);

        const { password: _, ...userWithoutPassword } = newUser;
        return res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });

        // return res.status(201).json({ message: 'User registered successfully', user: newUser });
    }

    /**
     * Retrieves all users
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response containing an array of all users
     */
    async getAllUsers(req: Request, res: Response) {
        const users = await this.userRepository.find();
        return res.status(200).json(users);
    }

    /**
     * Handles deleting a user by ID
     * @param req - Express request object containing user ID in params
     * @param res - Express response object
     * @returns JSON response with success message or error message
     */
    async deleteUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id);

        const user = await this.userRepository.findOne({ where: { user_id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await this.userRepository.remove(user);
        return res.status(200).json({ message: 'User deleted successfully' });
    }

    /**
     * Updates a user's details by ID
     * @param req - Express request object containing user ID in params and updated fields in body
     * @param res - Express response object
     * @returns JSON response with success message and updated user data or error message
     */
    async updateUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        const updates = req.body;

        try {
            const user = await this.userRepository.findOne({ where: { user_id: userId } });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (updates.password) {
                updates.password = await bcrypt.hash(updates.password, 10);
            }

            Object.assign(user, updates); // Merge updates into the user object
            const updatedUser = await this.userRepository.save(user);

            return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to update user', error });
        }
    }

    /**
     * Retrieves a user by ID
     * @param req - Express request object containing user ID in params
     * @param res - Express response object
     * @returns JSON response containing the user data or error message
     */
    async getUserById(req: Request, res: Response) {
        const userId = parseInt(req.params.id);

        try {
            const user = await this.userRepository.findOne({
            where: { user_id: userId },
            relations: ["role"],
            });

            if (!user) {
            return res.status(404).json({ message: "User not found" });
            }

            const { password, ...userWithoutPassword } = user;

            return res.status(200).json(userWithoutPassword);
        } catch (error) {
            return res.status(500).json({ message: "Failed to fetch user", error });
        }
    }

    /**
     * Retrieves the current authenticated user
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response containing the current user data or error message
     */
    async getCurrentUser(req: Request, res: Response) {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not authenticated" });

        try {
            const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
            const user = await this.userRepository.findOne({
                where: { user_id: payload.userId },
                relations: ['role'],
            });

            if (!user) return res.status(404).json({ message: "User not found" });

            const { password, ...userWithoutPassword } = user;
            return res.status(200).json({ user: userWithoutPassword });
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
    }

    /**
     * Handles user logout
     * @param req - Express request object
     * @param res - Express response object
     * @returns JSON response with success message
     */
    async logout(req: Request, res: Response) {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out" });
    }

}