import { Router } from 'express';
import { ApplicationController } from '../controller/ApplicationController';

const router = Router();
const applicationController = new ApplicationController();

// Base path for all application routes:
//   e.g. GET    /application
//         GET    /application/:id
//         POST   /application
//         PUT    /application/:id
//         DELETE /application/:id

router.get("/application", async (req, res) => {
    await applicationController.getAllApplications(req, res);
});

router.get("/application/:id", async (req, res) => {
    await applicationController.getApplicationById(req, res);
});

router.post("/application", async (req, res) => {
    await applicationController.createApplication(req, res);
});

router.put("/application/:id", async (req, res) => {
    await applicationController.updateApplication(req, res);
});

router.delete("/application/:id", async (req, res) => {
    await applicationController.deleteApplication(req, res);
});

export default router;
