import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { ApplicationRanking } from '../entity/ApplicationRanking';
import { User } from '../entity/User';
import { Application } from '../entity/Application';
import { CreateApplicationRankingDto, UpdateApplicationRankingDto } from '../dto/applicationRanking.dto';

export class ApplicationRankingController {
    private rankingRepository = AppDataSource.getRepository(ApplicationRanking);
    private userRepository = AppDataSource.getRepository(User);
    private applicationRepository = AppDataSource.getRepository(Application);

    /**
     * GET /application-rankings
     * Fetch all application rankings, including related lecturer (User) and application.
     * @param req  - Express request object
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON array of ApplicationRanking, or HTTP 500 + error
     */
    async getAllApplicationRankings(req: Request, res: Response) {
        try {
            const rankings = await this.rankingRepository.find({
                relations: ['lecturer', 'application'],
                order: { reviewed_at: 'DESC' },
            });
            return res.status(200).json(rankings);
        } catch (error) {
            console.error('Error fetching all application rankings:', error);
            return res
                .status(500)
                .json({ message: 'Error fetching application rankings', error });
        }
    }

    /**
     * GET /application-rankings/:lecturer_id/:application_id
     * Fetch one application ranking by its composite key (lecturer_id + application_id).
     * @param req  - Express request object (expects :lecturer_id and :application_id in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON object, HTTP 404 if not found, or HTTP 400/500 + error
     */
    async getApplicationRankingByIds(req: Request, res: Response) {
        const lecturerId = parseInt(req.params.lecturer_id, 10);
        const applicationId = parseInt(req.params.application_id, 10);

        if (isNaN(lecturerId) || isNaN(applicationId)) {
            return res
                .status(400)
                .json({ message: 'Invalid lecturer_id or application_id parameter' });
        }

        try {
            const ranking = await this.rankingRepository.findOne({
                where: { lecturer_id: lecturerId, application_id: applicationId },
                relations: ['lecturer', 'application'],
            });

            if (!ranking) {
                return res
                    .status(404)
                    .json({ message: 'Application ranking not found' });
            }
            return res.status(200).json(ranking);
        } catch (error) {
            console.error(
                `Error fetching application ranking lecturer_id=${lecturerId}, application_id=${applicationId}:`,
                error
            );
            return res
                .status(500)
                .json({ message: 'Error fetching application ranking', error });
        }
    }

    /**
     * POST /application-rankings
     * Create a new application ranking.
     * @param req  - Express request object (expects JSON body)
     * @param res  - Express response object
     * @returns    HTTP 201 + JSON of created ranking, HTTP 400 if missing/invalid fields,
     *             HTTP 404 if referenced User or Application not found,
     *             HTTP 409 if ranking already exists, or HTTP 500 + error
     *
     * Body should include:
     *   - lecturer_id    (number, required, must reference a user with role='lecturer')
     *   - application_id (number, required)
     *   - rank           (number, required)
     */
    async createApplicationRanking(req: Request, res: Response) {
        const { lecturer_id, application_id, rank } = req.body as CreateApplicationRankingDto;

        // if (
        //     typeof lecturer_id !== 'number' ||
        //     typeof application_id !== 'number' ||
        //     typeof rank !== 'number'
        // ) {
        //     return res.status(400).json({
        //         message:
        //             'lecturer_id (number), application_id (number), and rank (number) are required',
        //     });
        // }

        try {
            // Verify that the referenced User (lecturer) exists and has role='lecturer'
            const user = await this.userRepository.findOne({
                where: { user_id: lecturer_id },
                relations: ['role'],
            });
            if (!user || user.role.role_name !== 'lecturer') {
                return res.status(404).json({ message: 'Lecturer not found or not a lecturer' });
            }

            // Verify that the referenced Application exists
            const application = await this.applicationRepository.findOneBy({
                application_id,
            });
            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }

            // Check if ranking already exists
            const existingRanking = await this.rankingRepository.findOneBy({
                lecturer_id,
                application_id,
            });
            if (existingRanking) {
                return res
                    .status(409)
                    .json({ message: 'This lecturer has already rated this application' });
            }

            // Create the new ranking
            const newRanking = this.rankingRepository.create({
                lecturer_id,
                application_id,
                rank,
            });
            const savedRanking = await this.rankingRepository.save(newRanking);
            return res.status(201).json(savedRanking);
        } catch (error) {
            console.error('Error creanking application ranking:', error);
            return res
                .status(500)
                .json({ message: 'Error creanking application ranking', error });
        }
    }

    /**
     * PUT /application-rankings/:lecturer_id/:application_id
     * Update an existing application ranking by composite key.
     * @param req  - Express request object (expects :lecturer_id and :application_id in params and JSON body)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON of updated ranking, HTTP 404 if not found,
     *             HTTP 400 if invalid input, or HTTP 500 + error
     *
     * Body may include:
     *   - rank (number)
     */
    async updateApplicationRanking(req: Request, res: Response) {
        const lecturerId = parseInt(req.params.lecturer_id, 10);
        const applicationId = parseInt(req.params.application_id, 10);

        if (isNaN(lecturerId) || isNaN(applicationId)) {
            return res
                .status(400)
                .json({ message: 'Invalid lecturer_id or application_id parameter' });
        }

        try {
            const existingRanking = await this.rankingRepository.findOneBy({
                lecturer_id: lecturerId,
                application_id: applicationId,
            });
            if (!existingRanking) {
                return res
                    .status(404)
                    .json({ message: 'Application ranking not found' });
            }

            const { rank: newRank } = req.body as UpdateApplicationRankingDto;
            if (newRank !== undefined) {
                // if (typeof newRank !== 'number') {
                //     return res.status(400).json({ message: 'rank must be a number' });
                // }
                existingRanking.rank = newRank;
            }

            existingRanking.reviewed_at = new Date();
            const updatedRanking = await this.rankingRepository.save(existingRanking);
            return res.status(200).json(updatedRanking);
        } catch (error) {
            console.error(
                `Error updanking application ranking lecturer_id=${lecturerId}, application_id=${applicationId}:`,
                error
            );
            return res
                .status(500)
                .json({ message: 'Error updanking application ranking', error });
        }
    }

    /**
     * DELETE /application-rankings/:lecturer_id/:application_id
     * Delete an application ranking by composite key (lecturer_id + application_id).
     * @param req  - Express request object (expects :lecturer_id and :application_id in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + success message, HTTP 404 if not found, or HTTP 400/500 + error
     */
    async deleteApplicationRanking(req: Request, res: Response) {
        const lecturerId = parseInt(req.params.lecturer_id, 10);
        const applicationId = parseInt(req.params.application_id, 10);

        if (isNaN(lecturerId) || isNaN(applicationId)) {
            return res
                .status(400)
                .json({ message: 'Invalid lecturer_id or application_id parameter' });
        }

        try {
            const existingRanking = await this.rankingRepository.findOneBy({
                lecturer_id: lecturerId,
                application_id: applicationId,
            });
            if (!existingRanking) {
                return res
                    .status(404)
                    .json({ message: 'Application ranking not found' });
            }

            await this.rankingRepository.remove(existingRanking);
            return res
                .status(200)
                .json({ message: 'Application ranking deleted successfully' });
        } catch (error) {
            console.error(
                `Error deleting application ranking lecturer_id=${lecturerId}, application_id=${applicationId}:`,
                error
            );
            return res
                .status(500)
                .json({ message: 'Error deleting application ranking', error });
        }
    }
}
