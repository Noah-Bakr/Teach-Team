// import { Router } from 'express';
// import { ApplicationRankingController } from '../controller/ApplicationRankingController';
// import { validateDto } from '../middleware/validate';
// import { CreateApplicationRankingDto, UpdateApplicationRankingDto } from '../dto/applicationRanking.dto';
//
// const router = Router();
// const applicationRankingController = new ApplicationRankingController();
//
// router.get("/", async (req, res) => {
//     await applicationRankingController.getAllApplicationRankings(req, res);
// });
//
// router.get("/:lecturer_id/:application_id", async (req, res) => {
//     await applicationRankingController.getApplicationRankingByIds(req, res);
// });
//
// router.post("/", validateDto(CreateApplicationRankingDto), async (req, res) => {
//     await applicationRankingController.createApplicationRanking(req, res);
// });
//
// router.put("/:lecturer_id/:application_id", validateDto(UpdateApplicationRankingDto), async (req, res) => {
//     await applicationRankingController.updateApplicationRanking(req, res);
// });
//
// router.delete("/:lecturer_id/:application_id", async (req, res) => {
//     await applicationRankingController.deleteApplicationRanking(req, res);
// });
//
// export default router;
