import { Router } from 'express';
import { RoleController } from '../controller/RoleController';
import { validateDto } from '../middleware/validate';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';

const router = Router();
const roleController = new RoleController();

router.get("/", async (req, res) => {
    await roleController.getAllRoles(req, res);
});

router.get("/:id", async (req, res) => {
    await roleController.getRoleById(req, res);
});

router.post("/", validateDto(CreateRoleDto), async (req, res) => {
    await roleController.createRole(req, res);
});

router.put("/:id", validateDto(UpdateRoleDto), async (req, res) => {
    await roleController.updateRole(req, res);
});

router.delete("/:id", async (req, res) => {
    await roleController.deleteRole(req, res);
});

export default router;
