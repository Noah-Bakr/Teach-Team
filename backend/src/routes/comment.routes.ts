import { Router } from "express";
import { CommentController } from "../controller/CommentController";
import { validateDto } from "../middleware/validate";
import { CreateCommentDto, UpdateCommentDto } from "../dto/comment.dto";

const router = Router();
const commentController = new CommentController();

router.get("/comments", async (req, res) => {
    await commentController.getAllComments(req, res);
});

router.get("/comments/:id", async (req, res) => {
    await commentController.getCommentById(req, res);
});

router.post("/comments", validateDto(CommentController), async (req, res) => {
    await commentController.createComment(req, res);
});

router.put("/comments/:id", validateDto(UpdateCommentDto), async (req, res) => {
    await commentController.updateComment(req, res);
});

router.delete("/comments/:id", async (req, res) => {
    await commentController.deleteComment(req, res);
});

export default router;