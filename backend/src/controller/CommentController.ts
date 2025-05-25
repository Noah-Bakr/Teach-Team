import { Request, Response} from 'express';
import { AppDataSource } from '../data-source';
import { Comment } from '../entity/Comment';
import { Application } from '../entity/Application';
import { User } from '../entity/User';

export class CommentController {
    private commentRepository = AppDataSource.getRepository(Comment);
    private applicationRepository = AppDataSource.getRepository(Application);
    private userRepository        = AppDataSource.getRepository(User);

    /**
     * Retrieves all comments from the database
     * @param request - Express request object
     * @param response - Express response object
     * @returns JSON response containing an array of all comments
     */
    async all(request: Request, response: Response) {
        try {
            const comments = await this.commentRepository.find({
                relations: ['application', 'lecturer'],
            });

            return response.json(comments);
        } catch (err) {
            console.error(err);
            return response.status(500).json({ message: 'Failed to fetch comments' });
        }
    }

    /**
     * Retrieves a single comment by ID
     * @param request - Express request object containing the comment ID in params
     * @param response - Express response object
     * @returns JSON response containing the user if found, or 404 error if not found
     */
    async one(request: Request, response: Response) {
        const id = parseInt(request.params.id);
        try {
            const comment = await this.commentRepository.findOne({
                where: { comment_id: id },
                relations: ['application', 'lecturer'],
            });

            if (!comment) {
                return response.status(404).json({ message: "Comment not found" });
            }
            return response.json(comment);

        } catch (err) {
            console.error(err);
            return response.status(500).json({ message: 'Error fetching comment' });
        }
    }

    /**
     * Creates a new comment in the database
     * @param request - Express request object containing comment details in body
     * @param response - Express response object
     * @returns JSON response containing the created comment or error message
     */
    async save(request: Request, response: Response) {
        const { comment, application_id, lecturer_id } = request.body;

        if (!comment || !application_id || !lecturer_id) {
            return response.status(400).json({ message: 'Missing required fields' });
        }

        try {
            const application    = await this.applicationRepository.findOneBy({ application_id });
            const lecturer = await this.userRepository.findOneBy({ user_id: lecturer_id });
            if (!application || !lecturer) {
                return response.status(404).json({ message: 'Application or lecturer not found' });
            }

            const c = new Comment();
            c.comment    = comment;
            c.created_at = new Date();
            c.updated_at = new Date();
            c.application = application;
            c.lecturer    = lecturer;


            const savedComment = await this.commentRepository.save(comment);
            return response.status(201).json(savedComment);
        } catch (error) {
            return response
                .status(400)
                .json({message: "Error creating user", error});
        }
    }

    /**
     * Deletes a comment from the database by their ID
     * @param request - Express request object containing the comment ID in params
     * @param response - Express response object
     * @returns JSON response with success message or 404 error if comment not found
     */
    async remove(request: Request, response: Response) {
        const comment_id = parseInt(request.params.id);

        try {
            const commentToRemove = await this.commentRepository.findOne({
                where: { comment_id },
            });

            if (!commentToRemove) {
                return response.status(404).json({ message: "Comment not found" });
            }

            await this.commentRepository.remove(commentToRemove);
            return response.json({ message: "Comment removed successfully" });

        } catch (err) {
            console.error(err);
            return response.status(500).json({ message: 'Error deleting comment' });
        }
    }

    /**
     * Updates an existing comments information
     * @param request - Express request object containing comment ID in params and updated details in body
     * @param response - Express response object
     * @returns JSON response containing the updated comment or error message
     */
    async update(request: Request, response: Response) {
        const comment_id = parseInt(request.params.id);
        const { comment } = request.body;

        try {
            let commentToUpdate = await this.commentRepository.findOne({ where: { comment_id } });

            if (!commentToUpdate) return response.status(404).json({message: 'Comment not found'});

            commentToUpdate.comment = comment ?? commentToUpdate.comment;
            commentToUpdate.updated_at = new Date();

            const updated = await this.commentRepository.save(commentToUpdate);
            return response.json(updated);
        } catch (err) {
            console.error(err);
            response.status(500).json({ message: 'Error updating comment.' });
        }
    }
}
