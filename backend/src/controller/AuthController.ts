// import { Request, Response } from 'express';
// import { AppDataSource } from '../data-source';
// import { User } from '../entity/User';
// import jwt from 'jsonwebtoken';
// import * as argon2 from "argon2";
// import { LoginDto } from '../dto/auth.dto';
// import { CreateUserDto } from '../dto/user.dto';
//
// // Login, Sign-Up, getCurrentUser, and Logout controller for user authentication
//
// export class AuthController {
//     private userRepository = AppDataSource.getRepository(User);
//
//     /**
//      * Handles user login
//      * @param req - Express request object containing email and hashed password in body
//      * @param res - Express response object
//      * @returns JSON response with success message and user data or error message
//      */
//     async login(req: Request, res: Response) {
//         const { email, password } = req.body as LoginDto;
//
//         const user = await this.userRepository.findOne({
//             where: { email },
//             relations: [
//                     'role',
//                     'skills',
//                     'applications',
//                     'academicCredentials',
//                     'courses',
//                     'previousRoles',
//                     'reviews',
//                 ],
//         });
//
//         if (!user) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }
//
//         const isPasswordValid = await argon2.verify(user.password, password);
//
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }
//
//         const token = jwt.sign(
//             { userId: user.user_id, role: user.role.role_name },
//             process.env.JWT_SECRET!,
//             { expiresIn: "1h" }
//         );
//
//         res.cookie("token", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
//             maxAge: 3600000,
//             path: "/",
//         });
//
//         const { password: _, ...userWithoutPassword } = user;
//         //return res.status(200).json({ message: 'Login successful', user: userWithoutPassword });
//         return res.status(200).json(userWithoutPassword);
//
//         // return res.status(200).json({ message: 'Login successful', user });
//     }
//
//     /**
//      * Handles user sign-up
//      * @param req - Express request object containing email and hashed password in body
//      * @param res - Express response object
//      * @returns JSON response with success message and user data or error message
//      */
//     async signUp(req: Request, res: Response) {
//         const { first_name, last_name, username, email, password } = req.body as CreateUserDto;
//
//         const existingEmail = await this.userRepository.findOne({ where: { email } });
//         const existingUsername = await this.userRepository.findOne({ where: { username } });
//
//         if (existingEmail || existingUsername) {
//         return res.status(400).json({ message: 'Email or username already in use' });
//         }
//
//         const hashedPassword = await argon2.hash(password);
//
//         const newUser = this.userRepository.create({
//             first_name: first_name,
//             last_name: last_name,
//             username,
//             email,
//             role: { role_name: 'candidate' }, // Default role for new users
//             password: hashedPassword,
//         });
//
//         await this.userRepository.save(newUser);
//
//         const token = jwt.sign(
//             { userId: newUser.user_id, role: newUser.role.role_name },
//             process.env.JWT_SECRET!,
//             { expiresIn: "1h" }
//         );
//
//         res.cookie("token", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
//             maxAge: 3600000,
//             path: "/",
//         });
//
//         const { password: _, ...userWithoutPassword } = newUser;
//         return res.status(201).json(userWithoutPassword);
//         //return res.status(201).json({ message: 'User registered successfully', user: userWithoutPassword });
//
//         // return res.status(201).json({ message: 'User registered successfully', user: newUser });
//     }
//
//     // /**
//     //  * Retrieves all users
//     //  * @param req - Express request object
//     //  * @param res - Express response object
//     //  * @returns JSON response containing an array of all users
//     //  */
//     // async getAllUsers(req: Request, res: Response) {
//     //     const users = await this.userRepository.find();
//     //     return res.status(200).json(users);
//     // }
//
//     /**
//      * Handles deleting a user by ID
//      * @param req - Express request object containing user ID in params
//      * @param res - Express response object
//      * @returns JSON response with success message or error message
//      */
//     async deleteUser(req: Request, res: Response) {
//         const userId = parseInt(req.params.id);
//
//         const user = await this.userRepository.findOne({ where: { user_id: userId } });
//
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//
//         await this.userRepository.remove(user);
//         return res.status(200).json({ message: 'User deleted successfully' });
//     }
//
//     /**
//      * Retrieves the current authenticated user
//      * @param req - Express request object
//      * @param res - Express response object
//      * @returns JSON response containing the current user data or error message
//      */
//     async getCurrentUser(req: Request, res: Response) {
//         const token = req.cookies.token;
//         if (!token) return res.status(401).json({ message: "Not authenticated" });
//
//         try {
//             const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
//             const user = await this.userRepository.findOne({
//                 where: { user_id: payload.userId },
//                 relations: [
//                     'role',
//                     'skills',
//                     'applications',
//                     'academicCredentials',
//                     'courses',
//                     'previousRoles',
//                     'reviews',
//                 ],
//             });
//
//             if (!user) return res.status(404).json({ message: "User not found" });
//
//             const { password, ...userWithoutPassword } = user;
//             return res.status(200).json(userWithoutPassword);
//             //return res.status(200).json({ user: userWithoutPassword });
//         } catch (err) {
//             return res.status(401).json({ message: "Invalid token" });
//         }
//     }
//
//     /**
//      * Handles user logout
//      * @param req - Express request object
//      * @param res - Express response object
//      * @returns JSON response with success message
//      */
//     async logout(req: Request, res: Response) {
//         res.clearCookie("token", { path: "/" });
//         res.status(200).json({ message: "Logged out" });
//     }
//
//     // /**
//     //  * Updates a user's details by ID
//     //  * @param req - Express request object containing user ID in params and updated fields in body
//     //  * @param res - Express response object
//     //  * @returns JSON response with success message and updated user data or error message
//     //  */
//     // async updateUser(req: Request, res: Response) {
//     //     const userId = parseInt(req.params.id);
//     //     const updates = req.body;
//
//     //     try {
//     //         const user = await this.userRepository.findOne({ where: { user_id: userId } });
//
//     //         if (!user) {
//     //             return res.status(404).json({ message: 'User not found' });
//     //         }
//
//     //         if (updates.password) {
//     //             updates.password = await argon2.hash(updates.password);
//     //         }
//
//     //         Object.assign(user, updates); // Merge updates into the user object
//     //         const updatedUser = await this.userRepository.save(user);
//
//     //         return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
//     //     } catch (error) {
//     //         return res.status(500).json({ message: 'Failed to update user', error });
//     //     }
//     // }
//
//     // /**
//     //  * Retrieves a user by ID
//     //  * @param req - Express request object containing user ID in params
//     //  * @param res - Express response object
//     //  * @returns JSON response containing the user data or error message
//     //  */
//     // async getUserById(req: Request, res: Response) {
//     //     const userId = parseInt(req.params.id);
//
//     //     try {
//     //         const user = await this.userRepository.findOne({
//     //         where: { user_id: userId },
//     //         relations: ["role"],
//     //         });
//
//     //         if (!user) {
//     //         return res.status(404).json({ message: "User not found" });
//     //         }
//
//     //         const { password, ...userWithoutPassword } = user;
//
//     //         return res.status(200).json(userWithoutPassword);
//     //     } catch (error) {
//     //         return res.status(500).json({ message: "Failed to fetch user", error });
//     //     }
//     // }
//
// }


import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import jwt from "jsonwebtoken";
import * as argon2 from "argon2";
import { LoginDto } from "../dto/auth.dto";
import { CreateUserDto } from "../dto/user.dto";

export class AuthController {
    private userRepository = AppDataSource.getRepository(User);

    /**
     * POST /auth/login
     * Request body: { email, password }
     * Response (200): { message: "Login successful", user: { … } }
     *   where user is the User entity minus its password field.
     */
    async login(req: Request, res: Response) {
        const { email, password } = req.body as LoginDto;

        // 1) Find user by email, including relations
        const user = await this.userRepository.findOne({
            where: { email },
            relations: [
                "role",
                "skills",
                "applications",
                "academicCredentials",
                "courses",
                "previousRoles",
                "reviews",
            ],
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Verify password
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Sign JWT token
        const token = jwt.sign(
            { userId: user.user_id, role: user.role.role_name },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        // Set cookie on response
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
        //     maxAge: 3600000,
        //     path: "/",
        // });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 3600000,
            path: "/",
        });

        // Remove password from user object
        const { password: _, ...userWithoutPassword } = user;

        // Return JSON with wrapper
        return res.status(200).json({
            message: "Login successful",
            user: userWithoutPassword,
        });
    }

    /**
     * POST /auth/signUp
     * Request body: { first_name, last_name, username, email, password }
     * Response (201): { message: "User registered successfully", user: { … } }
     */
    async signUp(req: Request, res: Response) {
        const { first_name, last_name, username, email, password } =
            req.body as CreateUserDto;

        // Check if email or username already exists
        const existingEmail = await this.userRepository.findOne({
            where: { email },
        });
        const existingUsername = await this.userRepository.findOne({
            where: { username },
        });
        if (existingEmail || existingUsername) {
            return res
                .status(400)
                .json({ message: "Email or username already in use" });
        }

        // Hash the password
        const hashedPassword = await argon2.hash(password);

        // Create & save new user
        const newUser = this.userRepository.create({
            first_name,
            last_name,
            username,
            email,
            role: { role_name: "candidate" }, // default role
            password: hashedPassword,
        });
        await this.userRepository.save(newUser);

        // Sign JWT
        const token = jwt.sign(
            { userId: newUser.user_id, role: newUser.role.role_name },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        // Set cookie on response
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
            maxAge: 3600000,
            path: "/",
        });

        // Remove password before returning
        const { password: _, ...userWithoutPassword } = newUser;

        return res.status(201).json({
            message: "User registered successfully",
            user: userWithoutPassword,
        });
    }

    /**
     * GET /auth/me
     *  • Reads the token from req.cookies.token
     *  • If valid, finds the user in the DB
     *  • Returns { user: { … } }
     */
    async getCurrentUser(req: Request, res: Response) {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        try {
            const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
            const user = await this.userRepository.findOne({
                where: { user_id: payload.userId },
                relations: [
                    "role",
                    "skills",
                    "applications",
                    "academicCredentials",
                    "courses",
                    "previousRoles",
                    "reviews",
                ],
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const { password, ...userWithoutPassword } = user;
            return res.status(200).json({
                user: userWithoutPassword,
            });
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
    }

    /**
     * POST /auth/logout
     *  • Clears the “token” cookie by setting its expiration in the past
     *  • Returns { message: "Logged out" }
     */
    async logout(req: Request, res: Response) {
        res.clearCookie("token", { path: "/" });
        return res.status(200).json({ message: "Logged out" });
    }

    /**
     * DELETE /auth/users/:id
     *  • Deletes a user by ID
     *    – This is not a “login” endpoint, but your routes file includes it,
     *      so we leave it here. No change needed.
     */
    async deleteUser(req: Request, res: Response) {
        const userId = parseInt(req.params.id);
        const user = await this.userRepository.findOne({
            where: { user_id: userId },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await this.userRepository.remove(user);
        return res
            .status(200)
            .json({ message: "User deleted successfully" });
    }
}
