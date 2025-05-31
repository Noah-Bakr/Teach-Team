import { Router } from 'express';
import { AcademicCredentialUserController } from '../controller/AcademicCredentialUserController';

const router = Router();
const academicCredentialUserController = new AcademicCredentialUserController();

// Base path for all academic-credential-users routes:
//   e.g. GET    /academic-credential-users
//         GET    /academic-credential-users/:user_id/:academic_id
//         POST   /academic-credential-users
//         PUT    /academic-credential-users/:user_id/:academic_id
//         DELETE /academic-credential-users/:user_id/:academic_id

router.get("/academic-credential-users", async (req, res) => {
    await academicCredentialUserController.getAllAcademicCredentialUserLinks(req, res);
});

router.get("/academic-credentials-users/:user_id/:academic_id", async (req, res) => {
    await academicCredentialUserController.getAcademicCredentialUserByIds(req, res);
});

router.post("/academic-credentials-users", async (req, res) => {
    await academicCredentialUserController.createAcademicCredentialUser(req, res);
});

router.put("/academic-credentials-users/:user_id/:academic_id", async (req, res) => {
    await academicCredentialUserController.updateAcademicCredentialUser(req, res);
});

router.delete("/academic-credentials-users/:user_id/:academic_id", async (req, res) => {
    await academicCredentialUserController.deleteAcademicCredentialUser(req, res);
});

export default router;
