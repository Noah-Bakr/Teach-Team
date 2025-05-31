import { Router } from 'express';
import { LecturerCourseController } from '../controller/LecturerCourseController';

const router = Router();
const lecturerCourseController = new LecturerCourseController();

// Base path for all lecturer-course routes:
//   e.g. GET    /lecturer-course
//         GET    /lecturer-course/:user_id/:course_id
//         POST   /lecturer-course
//         PUT    /lecturer-course/:user_id/:course_id
//         DELETE /lecturer-course/:user_id/:course_id

router.get("/lecturer-course", async (req, res) => {
    await lecturerCourseController.getAllLecturerCourses(req, res);
});

router.get("/lecturer-course/:user_id/:course_id", async (req, res) => {
    await lecturerCourseController.getLecturerCourseByIds(req, res);
});

router.post("/lecturer-course", async (req, res) => {
    await lecturerCourseController.createLecturerCourse(req, res);
});

router.put("/lecturer-course/:user_id/:course_id", async (req, res) => {
    await lecturerCourseController.updateLecturerCourse(req, res);
});

router.delete("/lecturer-course/:user_id/:course_id", async (req, res) => {
    await lecturerCourseController.deleteLecturerCourse(req, res);
});

export default router;
