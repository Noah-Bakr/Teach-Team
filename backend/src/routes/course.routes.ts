import { Router } from 'express';
import { CourseController } from '../controller/CourseController';
import { validateDto } from '../middleware/validate';
import { CourseIdParamDto, CreateCourseDto, UpdateCourseDto } from '../dto/course.dto';

const router = Router();
const courseController = new CourseController();

router.get("/", async (req, res) => {
    await courseController.getAllCourses(req, res);
});

router.get("/:id", validateDto(CourseIdParamDto, 'params'), async (req, res) => {
    await courseController.getCourseById(req, res);
});

router.post("/", validateDto(CreateCourseDto, 'body'), async (req, res) => {
    await courseController.createCourse(req, res);
});

router.put("/:id", validateDto(CourseIdParamDto, 'params'), validateDto(UpdateCourseDto), async (req, res) => {
    await courseController.updateCourse(req, res);
});

router.delete("/:id", validateDto(CourseIdParamDto, 'params'), async (req, res) => {
    await courseController.deleteCourse(req, res);
});

export default router;