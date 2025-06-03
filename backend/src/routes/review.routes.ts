import { Router } from 'express';
import { ReviewController } from '../controller/ReviewController';
import { validateDto } from '../middleware/validate';
import { CreateReviewDto, UpdateReviewDto } from '../dto/review.dto';

const router = Router();
const reviewController = new ReviewController();

// GET /reviews
router.get('/', async (req, res) => {
    await reviewController.getAllReviews(req, res);
});

// GET /reviews/:id
router.get('/:id', async (req, res) => {
    await reviewController.getReviewById(req, res);
});

// POST /reviews
// Expects CreateReviewDto to validate { lecturer_id, application_id, rank?, comment? }
router.post(
    '/',
    validateDto(CreateReviewDto),
    async (req, res) => {
        await reviewController.createReview(req, res);
    }
);

// PUT /reviews/:id
// Expects UpdateReviewDto to validate { rank?, comment? }
router.put(
    '/:id',
    validateDto(UpdateReviewDto),
    async (req, res) => {
        await reviewController.updateReview(req, res);
    }
);

// DELETE /reviews/:id
router.delete('/:id', async (req, res) => {
    await reviewController.deleteReview(req, res);
});

export default router;
