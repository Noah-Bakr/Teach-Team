import { Router } from 'express';
import { AuthController } from '../controller/AuthController';
import { validateDto } from '../middleware/validate';
import { CreateUserDto } from '../dto/user.dto';
import { LoginDto } from '../dto/auth.dto';

const router = Router();
const authController = new AuthController();

router.post("/login", validateDto(LoginDto, 'body'), async (req, res) => {
    await authController.login(req, res);
});

router.post("/signUp", validateDto(CreateUserDto, 'body'), async (req, res) => {
    await authController.signUp(req, res);
});

router.post("/logout", async (req, res) => {
    await authController.logout(req, res);
});

router.get("/me", async (req, res) => {
    await authController.getCurrentUser(req, res);
});

router.delete("/users/:id", async (req, res) => {
    await authController.deleteUser(req, res);
});

export default router;