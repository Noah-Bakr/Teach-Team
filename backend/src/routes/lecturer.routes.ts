import { Router } from "express";
import { LecturerController } from "../controller/LecturerController";
import { isLecturer } from "../middleware/isLecturer";

const router = Router();
const lecturerController = new LecturerController();

router.get("/:id/courses", isLecturer, async (req, res) => {
    await lecturerController.getCourses(req, res);
});

router.get("/:id/applications", isLecturer, async (req, res) => {
    await lecturerController.getApplications(req, res);
});

router.get("/:id/applications/all", isLecturer, async (req, res) => {
    await lecturerController.getAllApplicationsByLecturer(req, res);
});

router.post(
    '/:lecturerId/applications/:applicationId/review',  async (req, res) => {
        await lecturerController.saveReview(req, res);
    });

router.patch('/:lecturerId/applications/:applicationId', async (req, res) => {
    await lecturerController.updateApplicationStatus(req, res);
});


router.get("/applications/:id/review", isLecturer, async (req, res) => {
    await lecturerController.getReviewByApplication(req, res);
});

export default router;