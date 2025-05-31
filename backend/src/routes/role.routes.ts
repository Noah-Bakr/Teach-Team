import { Router } from 'express';
import { RoleController } from '../controller/RoleController';

const router = Router();
const roleController = new RoleController();

// Base path for all roles routes:
//   e.g. GET    /roles
//         GET    /roles/:id
//         POST   /roles
//         PUT    /roles/:id
//         DELETE /roles/:id

router.get("/roles", async (req, res) => {
    await roleController.getAllRoles(req, res);
});

router.get("/roles/:id", async (req, res) => {
    await roleController.getRoleById(req, res);
});

router.post("/roles", async (req, res) => {
    await roleController.createRole(req, res);
});

router.put("/roles/:id", async (req, res) => {
    await roleController.updateRole(req, res);
});

router.delete("/roles/:id", async (req, res) => {
    await roleController.deleteRole(req, res);
});

export default router;
