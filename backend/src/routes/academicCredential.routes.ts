import { Router } from 'express';
import { AcademicCredentialController } from '../controller/AcademicCredentialController';

const router = Router();
const academicCredentialController = new AcademicCredentialController();

// Base path for all academic‐credential routes:
//   e.g. GET    /academic-credentials
//         GET    /academic-credentials/:id
//         POST   /academic-credentials
//         PUT    /academic-credentials/:id
//         DELETE /academic-credentials/:id

router.get("/academic-credentials", async (req, res) => {
    await academicCredentialController.getAllAcademicCredentials(req, res);
});

router.get("/academic-credentials/:id", async (req, res) => {
    await academicCredentialController.getAcademicCredentialById(req, res);
});

router.post("/academic-credentials", async (req, res) => {
    await academicCredentialController.createAcademicCredential(req, res);
});

router.put("/academic-credentials/:id", async (req, res) => {
    await academicCredentialController.updateAcademicCredential(req, res);
});

router.delete("/academic-credentials/:id", async (req, res) => {
    await academicCredentialController.deleteAcademicCredential(req, res);
});

export default router;
