import { Router } from 'express';
import { SkillsController } from '../controller/SkillsController';

const router = Router();
const skillsController = new SkillsController();

// Base path for all skills routes:
//   e.g. GET    /skills
//         GET    /skills/:id
//         POST   /skills
//         PUT    /skills/:id
//         DELETE /skills/:id

router.get("/skills", async (req, res) => {
    await skillsController.getAllSkills(req, res);
});

router.get("/skills/:id", async (req, res) => {
    await skillsController.getSkillById(req, res);
});

router.post("/skills", async (req, res) => {
    await skillsController.createSkill(req, res);
});

router.put("/skills/:id", async (req, res) => {
    await skillsController.updateSkill(req, res);
});

router.delete("/skills/:id", async (req, res) => {
    await skillsController.deleteSkill(req, res);
});

export default router;
