import { Router } from 'express';
import { ApplicationRankingController } from '../controller/ApplicationRankingController';

const router = Router();
const applicationRankingController = new ApplicationRankingController();

// Base path for all application routes:
//   e.g. GET    /application-ranking
//         GET    /application-ranking/:lecturer_id/:application_id
//         POST   /application-ranking
//         PUT    /application-ranking/:lecturer_id/:application_id
//         DELETE /application-ranking/:lecturer_id/:application_id

router.get("/application-ranking", async (req, res) => {
    await applicationRankingController.getAllApplicationRankings(req, res);
});

router.get("/application-ranking/:lecturer_id/:application_id", async (req, res) => {
    await applicationRankingController.getApplicationRankingByIds(req, res);
});

router.post("/application-ranking", async (req, res) => {
    await applicationRankingController.createApplicationRanking(req, res);
});

router.put("/application-ranking/:lecturer_id/:application_id", async (req, res) => {
    await applicationRankingController.updateApplicationRanking(req, res);
});

router.delete("/application-ranking/:lecturer_id/:application_id", async (req, res) => {
    await applicationRankingController.deleteApplicationRanking(req, res);
});

export default router;
