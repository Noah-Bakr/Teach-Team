import { Router } from 'express';
import { CourseController } from '../controller/CourseController';

const router = Router();
const courseController = new CourseController();

router.get("/courses", async (req, res) => {
    await courseController.getAllCourses(req, res);
});

router.get("/courses/:id", async (req, res) => {
    await courseController.getCourseById(req, res);
});

router.post("/courses", async (req, res) => {
    await courseController.createCourse(req, res);
});

router.put("/courses/:id", async (req, res) => {
    await courseController.updateCourse(req, res);
});

router.delete("/courses/:id", async (req, res) => {
    await courseController.deleteCourse(req, res);
});

export default router;