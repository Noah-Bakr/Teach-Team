import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { validateDto } from '../middleware/validate';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

const router = Router();
const userController = new UserController();

router.get("/", async (req, res) => {
    await userController.getAllUsers(req, res);
});

router.get("/:id", async (req, res) => {
    await userController.getUserById(req, res);
});

router.post("/", validateDto(CreateUserDto), async (req, res) => {
    await userController.createUser(req, res);
});

router.put("/:id", validateDto(UpdateUserDto), async (req, res) => {
    await userController.updateUser(req, res);
});

router.delete("/:id", async (req, res) => {
    await userController.deleteUser(req, res);
});

// Attach / detach SKILLS:
router.post('/user/:id/skills', async (req, res) => {
    userController.addSkillsToUser(req, res);
});

router.delete('/:id/skills/:skillId', async (req, res) => {
    userController.removeSkillFromUser(req, res);
    });

// Attach / detach ACADEMIC CREDENTIALS:
router.post('/:id/academic-credentials', async (req, res) => {
    userController.addCredentialsToUser(req, res);
});

router.delete('/:id/academic-credentials/:credentialId', async (req, res) => {
    userController.removeCredentialFromUser(req, res);
});

// Attach / detach COURSES (lecturer):
router.post('/:id/courses', async (req, res) => {
    userController.addCoursesToUser(req, res)
});

router.delete('/:id/courses/:courseId', async (req, res) => {
    userController.removeCourseFromUser(req, res);
});

export default router;
