import { Router } from 'express';
import { AuthController } from '../controller/AuthController';

const router = Router();
const authController = new AuthController();

router.post("/login", async (req, res) => {
    await authController.login(req, res);
});

router.post("/signUp", async (req, res) => {
    await authController.signUp(req, res);
});

router.get("/users", async (req, res) => {
    await authController.getAllUsers(req, res);
});

router.get("/users/:id", async (req, res) => {
    await authController.updateUser(req, res);
});

router.delete("/users/:id", async (req, res) => {
    await authController.deleteUser(req, res);
});

export default router;