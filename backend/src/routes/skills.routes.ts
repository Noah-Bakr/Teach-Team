import { Router } from 'express';
import { SkillsController } from '../controller/SkillsController';
import { validateDto } from '../middleware/validate';
import { CreateSkillDto, UpdateSkillDto } from '../dto/skills.dto';

const router = Router();
const skillsController = new SkillsController();

router.get("/", async (req, res) => {
    await skillsController.getAllSkills(req, res);
});

router.get("/:id", async (req, res) => {
    await skillsController.getSkillById(req, res);
});

router.post("/", validateDto(CreateSkillDto), async (req, res) => {
    await skillsController.createSkill(req, res);
});

router.put("/:id", validateDto(UpdateSkillDto), async (req, res) => {
    await skillsController.updateSkill(req, res);
});

router.delete("/:id", async (req, res) => {
    await skillsController.deleteSkill(req, res);
});

export default router;
