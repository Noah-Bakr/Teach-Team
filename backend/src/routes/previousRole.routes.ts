import { Router } from 'express';
import { PreviousRoleController } from '../controller/PreviousRoleController';
import { validateDto } from '../middleware/validate';
import { CreatePreviousRoleDto, UpdatePreviousRoleDto } from '../dto/previousRole.dto';

const router = Router();
const previousRolesController = new PreviousRoleController();

router.get("/", async (req, res) => {
    await previousRolesController.getAllPreviousRoles(req, res);
});

router.get("/:id", async (req, res) => {
    await previousRolesController.getPreviousRoleById(req, res);
});

router.post("/", validateDto(CreatePreviousRoleDto, 'body'), async (req, res) => {
    await previousRolesController.createPreviousRole(req, res);
});

router.put("/:id", validateDto(UpdatePreviousRoleDto, 'body'), async (req, res) => {
    await previousRolesController.updatePreviousRole(req, res);
});

router.delete("/:id", async (req, res) => {
    await previousRolesController.deletePreviousRole(req, res);
});

export default router;
