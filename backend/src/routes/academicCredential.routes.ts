import { Router } from 'express';
import { AcademicCredentialController } from '../controller/AcademicCredentialController';
import { validateDto } from '../middleware/validate';
import { CreateAcademicCredentialDto, UpdateAcademicCredentialDto } from '../dto/academicCredential.dto';

const router = Router();
const academicCredentialController = new AcademicCredentialController();

router.get("/", async (req, res) => {
    await academicCredentialController.getAllAcademicCredentials(req, res);
});

router.get("/:id", async (req, res) => {
    await academicCredentialController.getAcademicCredentialById(req, res);
});

router.post("/", validateDto(CreateAcademicCredentialDto), async (req, res) => {
    await academicCredentialController.createAcademicCredential(req, res);
});

router.put("/:id", validateDto(UpdateAcademicCredentialDto), async (req, res) => {
    await academicCredentialController.updateAcademicCredential(req, res);
});

router.delete("/:id", async (req, res) => {
    await academicCredentialController.deleteAcademicCredential(req, res);
});

export default router;
