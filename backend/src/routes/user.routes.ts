import { Router } from 'express';
import { UserController } from '../controller/UserController';

const router = Router();
const userController = new UserController();

// Base path for all User routes:
//   e.g. GET    /user
//         GET    /user/:id
//         POST   /user
//         PUT    /user/:id
//         DELETE /user/:id

router.get("/user", async (req, res) => {
    await userController.getAllUsers(req, res);
});

router.get("/user/:id", async (req, res) => {
    await userController.getUserById(req, res);
});

router.post("/user", async (req, res) => {
    await userController.createUser(req, res);
});

router.put("/user/:id", async (req, res) => {
    await userController.updateUser(req, res);
});

router.delete("/user/:id", async (req, res) => {
    await userController.deleteUser(req, res);
});

export default router;
