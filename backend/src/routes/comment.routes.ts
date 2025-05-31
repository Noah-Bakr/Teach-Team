import { Router } from "express";
import { CommentController } from "../controller/CommentController";

const router = Router();
const commentController = new CommentController();

router.get("/comments", async (req, res) => {
    await commentController.getAllComments(req, res);
});

router.get("/comments/:id", async (req, res) => {
    await commentController.getCommentById(req, res);
});

router.post("/comments", async (req, res) => {
    await commentController.createComment(req, res);
});

router.put("/comments/:id", async (req, res) => {
    await commentController.updateComment(req, res);
});

router.delete("/comments/:id", async (req, res) => {
    await commentController.deleteComment(req, res);
});

export default router;