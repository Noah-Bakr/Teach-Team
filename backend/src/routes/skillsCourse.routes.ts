import { Router } from 'express';
import { SkillsCourseController } from '../controller/SkillsCourseController';

const router = Router();
const skillsCourseController = new SkillsCourseController();

// Base path for all skills-course routes:
//   e.g. GET    /skills-course
//         GET    /skills-course/:course_id/:skill_id
//         POST   /skills-course
//         PUT    /skills-course/:course_id/:skill_id
//         DELETE /skills-course/:course_id/:skill_id

router.get("/skills-course", async (req, res) => {
    await skillsCourseController.getAllSkillsCourses(req, res);
});

router.get("/skills-course/:course_id/:skill_id", async (req, res) => {
    await skillsCourseController.getSkillsCourseByIds(req, res);
});

router.post("/skills-course", async (req, res) => {
    await skillsCourseController.createSkillsCourse(req, res);
});

router.put("/skills-course/:course_id/:skill_id", async (req, res) => {
    await skillsCourseController.updateSkillsCourse(req, res);
});

router.delete("/skills-course/:course_id/:skill_id", async (req, res) => {
    await skillsCourseController.deleteSkillsCourse(req, res);
});

export default router;
