import { Router } from 'express';
import { RoleController } from '../controller/RoleController';
import { validateDto } from '../middleware/validate';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';

const router = Router();
const roleController = new RoleController();

router.get("/roles", async (req, res) => {
    await roleController.getAllRoles(req, res);
});

router.get("/roles/:id", async (req, res) => {
    await roleController.getRoleById(req, res);
});

router.post("/roles", validateDto(CreateRoleDto), async (req, res) => {
    await roleController.createRole(req, res);
});

router.put("/roles/:id", validateDto(UpdateRoleDto), async (req, res) => {
    await roleController.updateRole(req, res);
});

router.delete("/roles/:id", async (req, res) => {
    await roleController.deleteRole(req, res);
});

export default router;
