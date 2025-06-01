import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Comment } from '../entity/Comment';
import { Application } from '../entity/Application';
import { User } from '../entity/User';
import { CreateCommentDto, UpdateCommentDto } from '../dto/comment.dto';

export class CommentController {
    private commentRepository = AppDataSource.getRepository(Comment);
    private applicationRepository = AppDataSource.getRepository(Application);
    private userRepository = AppDataSource.getRepository(User);

    /**
     * GET /comments
     * Fetch all comments, including related Application and lecturer (User).
     * @param req  - Express request object
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON array of Comment, or HTTP 500 + error
     */
    async getAllComments(req: Request, res: Response) {
        try {
            const comments = await this.commentRepository.find({
                relations: ['application', 'lecturer'],
                order: { created_at: 'DESC' },
            });
            return res.status(200).json(comments);
        } catch (error) {
            console.error('Error fetching all comments:', error);
            return res.status(500).json({ message: 'Error fetching comments', error });
        }
    }

    /**
     * GET /comments/:id
     * Fetch one comment by its ID.
     * @param req  - Express request object (expects `:id` in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON object, HTTP 404 if not found, or HTTP 400/500 + error
     */
    async getCommentById(req: Request, res: Response) {
        const commentId = parseInt(req.params.id, 10);
        if (isNaN(commentId)) {
            return res.status(400).json({ message: 'Invalid comment ID' });
        }

        try {
            const comment = await this.commentRepository.findOne({
                where: { comment_id: commentId },
                relations: ['application', 'lecturer'],
            });

            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            return res.status(200).json(comment);
        } catch (error) {
            console.error(`Error fetching comment id=${commentId}:`, error);
            return res.status(500).json({ message: 'Error fetching comment', error });
        }
    }

    /**
     * POST /comments
     * Create a new comment linked to an application and lecturer.
     * @param req  - Express request object (expects JSON body)
     * @param res  - Express response object
     * @returns    HTTP 201 + JSON of created Comment, HTTP 400 if missing/invalid fields,
     *             HTTP 404 if referenced Application or User not found, or HTTP 500 + error
     *
     * Body should include:
     *   - comment        (string, required)
     *   - application_id (number, required)
     *   - lecturer_id    (number, required)
     */
    async createComment(req: Request, res: Response) {
        const { comment, application_id, lecturer_id } = req.body as CreateCommentDto;

        // // Basic validation
        // if (
        //     typeof comment !== 'string' ||
        //     typeof application_id !== 'number' ||
        //     typeof lecturer_id !== 'number'
        // ) {
        //     return res.status(400).json({
        //         message: 'comment (string), application_id (number), and lecturer_id (number) are required',
        //     });
        // }

        try {
            // Verify that the referenced Application exists
            const application = await this.applicationRepository.findOneBy({ application_id });
            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }

            // Verify that the referenced User (lecturer) exists
            const lecturer = await this.userRepository.findOneBy({ user_id: lecturer_id });
            if (!lecturer) {
                return res.status(404).json({ message: 'Lecturer (User) not found' });
            }

            // Create new Comment
            const newComment = this.commentRepository.create({
                comment,
                created_at: new Date(),
                updated_at: new Date(),
                application,
                lecturer,
            });

            const saved = await this.commentRepository.save(newComment);
            return res.status(201).json(saved);
        } catch (error) {
            console.error('Error creating comment:', error);
            return res.status(500).json({ message: 'Error creating comment', error });
        }
    }

    /**
     * PUT /comments/:id
     * Update an existing comment by its ID.
     * @param req  - Express request object (expects `:id` in params and JSON body)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON of updated Comment, HTTP 404 if not found,
     *             HTTP 400 if invalid input, or HTTP 500 + error
     *
     * Body may include:
     *   - comment (string)
     *
     * Note: We do not allow changing application_id or lecturer_id via this endpoint.
     */
    async updateComment(req: Request, res: Response) {
        const commentId = parseInt(req.params.id, 10);
        if (isNaN(commentId)) {
            return res.status(400).json({ message: 'Invalid comment ID' });
        }

        try {
            const existing = await this.commentRepository.findOne({
                where: { comment_id: commentId },
            });
            if (!existing) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            const { comment: newText } = req.body as UpdateCommentDto;
            // if (newText !== undefined) {
            //     if (typeof newText !== 'string') {
            //         return res.status(400).json({ message: 'comment must be a string' });
            //     }
            //     existing.comment = newText;
            //     existing.updated_at = new Date();
            // }

            const updated = await this.commentRepository.save(existing);
            return res.status(200).json(updated);
        } catch (error) {
            console.error(`Error updating comment id=${commentId}:`, error);
            return res.status(500).json({ message: 'Error updating comment', error });
        }
    }

    /**
     * DELETE /comments/:id
     * Delete a comment by its ID.
     * @param req  - Express request object (expects `:id` in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + success message, HTTP 404 if not found, or HTTP 500 + error
     */
    async deleteComment(req: Request, res: Response) {
        const commentId = parseInt(req.params.id, 10);
        if (isNaN(commentId)) {
            return res.status(400).json({ message: 'Invalid comment ID' });
        }

        try {
            const existing = await this.commentRepository.findOne({
                where: { comment_id: commentId },
            });
            if (!existing) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            await this.commentRepository.remove(existing);
            return res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error(`Error deleting comment id=${commentId}:`, error);
            return res.status(500).json({ message: 'Error deleting comment', error });
        }
    }
}
