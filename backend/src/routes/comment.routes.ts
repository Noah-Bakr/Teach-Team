import { Router } from "express";
import { CommentController } from "../controller/CommentController";

const router = Router();
const commentController = new CommentController();

router.get("/comments", async (req, res) => {
    await commentController.all(req, res);
});

router.get("/comments/:id", async (req, res) => {
    await commentController.one(req, res);
});

router.post("/comments", async (req, res) => {
    await commentController.save(req, res);
});

router.put("/comments/:id", async (req, res) => {
    await commentController.update(req, res);
});

router.delete("/comments/:id", async (req, res) => {
    await commentController.remove(req, res);
});

export default router;