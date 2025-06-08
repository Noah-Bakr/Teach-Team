import { Router } from 'express';
import { ApplicationController } from '../controller/ApplicationController';
import { validateDto } from '../middleware/validate';
import { CreateApplicationDto, UpdateApplicationDto } from '../dto/application.dto';

const router = Router();
const applicationController = new ApplicationController();

router.get("/", async (req, res) => {
    await applicationController.getAllApplications(req, res);
});

router.get("/user/:userId", async (req, res) => {
    await applicationController.getApplicationsByUserId(req, res);
});

router.get("/visual-insights", async (req, res) => {
    await applicationController.getVisualInsights(req, res);
});

router.get("/:id", async (req, res) => {
    await applicationController.getApplicationById(req, res);
});

router.post("/", validateDto(CreateApplicationDto), async (req, res) => {
    await applicationController.createApplication(req, res);
});

router.put("/:id", validateDto(UpdateApplicationDto), async (req, res) => {
    await applicationController.updateApplication(req, res);
});

router.delete("/:id", async (req, res) => {
    await applicationController.deleteApplication(req, res);
});

export default router;
