import { Router } from 'express';
import { PreviousRoleController } from '../controller/PreviousRoleController';

const router = Router();
const previousRolesController = new PreviousRoleController();

// Base path for all previous-roles routes:
//   e.g. GET    /previous-roles
//         GET    /previous-roles/:id
//         POST   /previous-roles
//         PUT    /previous-roles/:id
//         DELETE /previous-roles/:id

router.get("/previous-roles", async (req, res) => {
    await previousRolesController.getAllPreviousRoles(req, res);
});

router.get("/previous-roles/:id", async (req, res) => {
    await previousRolesController.getPreviousRoleById(req, res);
});

router.post("/previous-roles", async (req, res) => {
    await previousRolesController.createPreviousRole(req, res);
});

router.put("/previous-roles/:id", async (req, res) => {
    await previousRolesController.updatePreviousRole(req, res);
});

router.delete("/previous-roles/:id", async (req, res) => {
    await previousRolesController.deletePreviousRole(req, res);
});

export default router;
