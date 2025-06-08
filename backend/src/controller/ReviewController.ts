import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Review } from '../entity/Review';
import { User } from '../entity/User';
import { Application } from '../entity/Application';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';

export class ReviewController {
    private reviewRepository = AppDataSource.getRepository(Review);
    private userRepository = AppDataSource.getRepository(User);
    private applicationRepository = AppDataSource.getRepository(Application);

    /**
     * GET /reviews
     * Fetch all reviews, including related lecturer (User) and application.
     */
    async getAllReviews(req: Request, res: Response) {
        try {
            const reviews = await this.reviewRepository.find({
                relations: ['lecturer', 'application'],
                order: { reviewed_at: 'DESC' },
            });
            return res.status(200).json(reviews);
        } catch (error) {
            console.error('Error fetching all reviews:', error);
            return res
                .status(500)
                .json({ message: 'Error fetching reviews', error });
        }
    }

    /**
     * GET /reviews/:id
     * Fetch one review by its ID.
     */
    async getReviewById(req: Request, res: Response) {
        const reviewId = parseInt(req.params.id, 10);
        if (isNaN(reviewId)) {
            return res.status(400).json({ message: 'Invalid review ID' });
        }

        try {
            const review = await this.reviewRepository.findOne({
                where: { review_id: reviewId },
                relations: ['lecturer', 'application'],
            });

            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }
            return res.status(200).json(review);
        } catch (error) {
            console.error(`Error fetching review id=${reviewId}:`, error);
            return res
                .status(500)
                .json({ message: 'Error fetching review', error });
        }
    }

    /**
     * POST /reviews
     * Create a new review.
     *
     * Body may include:
     *   - lecturer_id    (number, required)
     *   - application_id (number, required)
     *   - rank           (number, optional)
     *   - comment        (string, optional)
     */
    async createReview(req: Request, res: Response) {
        // At this point, req.body has already been validated against CreateReviewDto
        const { lecturer_id, application_id, rank, comment } =
            req.body as CreateReviewDto;
        try {
        // Verify that the lecturer (User) exists
        const lecturer = await this.userRepository.findOneBy({
            user_id: lecturer_id,
        });
        if (!lecturer) {
        return res
    .status(404)
    .json({ message: 'Lecturer (User) not found' });
    }

    // Verify that the application exists
    const application = await this.applicationRepository.findOneBy({
        application_id,
    });
    if (!application) {
        return res.status(404).json({ message: 'Application not found' });
    }

    // Check for existing review by this lecturer on this application
    const existing = await this.reviewRepository.findOne({
        where: { lecturer_id, application_id },
    });
    if (existing) {
        return res.status(409).json({
            message:
                'A review by this lecturer for that application already exists',
        });
    }

    // Create new review
    const newReview = this.reviewRepository.create({
        lecturer_id,
        application_id,
        // DTO ensures rank is number (if provided), comment is string (if provided)
        rank: rank ?? null,
        comment: comment ?? null,
    });

    const saved = await this.reviewRepository.save(newReview);

    // Fetch with relations to return the full object
    const fullReview = await this.reviewRepository.findOne({
        where: { review_id: saved.review_id },
        relations: ['lecturer', 'application'],
    });

    return res.status(201).json(fullReview);
    } catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).json({ message: 'Error creating review', error });
    }
    }

    /**
     * PUT /reviews/:id
     * Update an existing review by its ID.
     *
     * Body is validated by validateDto(UpdateReviewDto).
     */
    async updateReview(req: Request, res: Response) {
        const reviewId = parseInt(req.params.id, 10);
        if (isNaN(reviewId)) {
            return res.status(400).json({ message: 'Invalid review ID' });
        }

        try {
            const existing = await this.reviewRepository.findOne({
                where: { review_id: reviewId },
            });
            if (!existing) {
                return res.status(404).json({ message: 'Review not found' });
            }

            // DTO ensures only rank and/or comment (both optional) are present
            const { rank, comment } = req.body as UpdateReviewDto;

            if (rank !== undefined) {
                existing.rank = rank;
            }
            if (comment !== undefined) {
                existing.comment = comment;
            }

            const updated = await this.reviewRepository.save(existing);

            // Reload with relations
            const fullReview = await this.reviewRepository.findOne({
                where: { review_id: updated.review_id },
                relations: ['lecturer', 'application'],
            });

            return res.status(200).json(fullReview);
        } catch (error) {
            console.error(`Error updating review id=${reviewId}:`, error);
            return res.status(500).json({ message: 'Error updating review', error });
        }
    }

    /**
     * DELETE /reviews/:id
     * Delete a review by its ID.
     */
    async deleteReview(req: Request, res: Response) {
        const reviewId = parseInt(req.params.id, 10);
        if (isNaN(reviewId)) {
            return res.status(400).json({ message: 'Invalid review ID' });
        }

        try {
            const existing = await this.reviewRepository.findOne({
                where: { review_id: reviewId },
            });
            if (!existing) {
                return res.status(404).json({ message: 'Review not found' });
            }

            await this.reviewRepository.remove(existing);
            return res.status(200).json({ message: 'Review deleted successfully' });
        } catch (error) {
            console.error(`Error deleting review id=${reviewId}:`, error);
            return res.status(500).json({ message: 'Error deleting review', error });
        }
    }

    /**
     * GET /applications/:appId/reviews
     * Fetch all reviews for a specific application.
     */
    async getReviewsByApplication(req: Request, res: Response) {
        const applicationId = parseInt(req.params.appId, 10);
        if (isNaN(applicationId)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }

        try {
            const reviews = await this.reviewRepository.find({
                where: { application_id: applicationId },
                relations: ['lecturer', 'application'],
                order: { reviewed_at: 'DESC' },
            });
            return res.status(200).json(reviews);
        } catch (error) {
            console.error(`Error fetching reviews for application ${applicationId}:`, error);
            return res
                .status(500)
                .json({ message: 'Error fetching reviews for application', error });
        }
    }

    /**
     * GET /users/:lecturerId/reviews
     * Fetch all reviews written by a specific lecturer.
     */
    async getReviewsByLecturer(req: Request, res: Response) {
        const lecturerId = parseInt(req.params.lecturerId, 10);
        if (isNaN(lecturerId)) {
            return res.status(400).json({ message: 'Invalid lecturer ID' });
        }

        try {
            const reviews = await this.reviewRepository.find({
                where: { lecturer_id: lecturerId },
                relations: ['lecturer', 'application'],
                order: { reviewed_at: 'DESC' },
            });
            return res.status(200).json(reviews);
        } catch (error) {
            console.error(`Error fetching reviews for lecturer ${lecturerId}:`, error);
            return res
                .status(500)
                .json({ message: 'Error fetching reviews for lecturer', error });
        }
    }
}
