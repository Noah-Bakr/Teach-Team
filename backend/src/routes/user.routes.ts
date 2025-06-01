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

// Attach / detach SKILLS:
router.post('/user/:id/skills', async (req, res) => {
    userController.addSkillsToUser(req, res);
});

router.delete('/user/:id/skills/:skillId', async (req, res) => {
    userController.removeSkillFromUser(req, res);
    });

// Attach / detach ACADEMIC CREDENTIALS:
router.post('/user/:id/academic-credentials', async (req, res) => {
    userController.addCredentialsToUser(req, res);
});

router.delete('/user/:id/academic-credentials/:credentialId', async (req, res) => {
    userController.removeCredentialFromUser(req, res);
});

// Attach / detach COURSES (lecturer):
router.post('/user/:id/courses', async (req, res) => {
    userController.addCoursesToUser(req, res)
});

router.delete('/user/:id/courses/:courseId', async (req, res) => {
    userController.removeCourseFromUser(req, res);
});

export default router;
