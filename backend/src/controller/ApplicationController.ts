import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Application } from '../entity/Application';
import { User } from '../entity/User';
import { Course } from '../entity/Course';
import { CreateApplicationDto, UpdateApplicationDto } from '../dto/application.dto';

export class ApplicationController {
    private applicationRepository = AppDataSource.getRepository(Application);
    private userRepository = AppDataSource.getRepository(User);
    private courseRepository = AppDataSource.getRepository(Course);

    /**
     * GET /applications
     * Fetch all applications, including related User, Course, and comments.
     * @param req  - Express request object
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON array of Application, or HTTP 500 + error
     */
    async getAllApplications(req: Request, res: Response) {
        try {
            const applications = await this.applicationRepository.find({
                relations: ['user', 'course', 'reviews'],
                order: { applied_at: 'DESC' },
            });
            return res.status(200).json(applications);
        } catch (error) {
            console.error('Error fetching all applications:', error);
            return res
                .status(500)
                .json({ message: 'Error fetching applications', error });
        }
    }

    /**
     * GET /applications/:id
     * Fetch one application by its ID.
     * @param req  - Express request object (expects `:id` in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON object, HTTP 404 if not found, or HTTP 400/500 + error
     */
    async getApplicationById(req: Request, res: Response) {
        const applicationId = parseInt(req.params.id, 10);
        if (isNaN(applicationId)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }

        try {
            const application = await this.applicationRepository.findOne({
                where: { application_id: applicationId },
                relations: ['user', 'course', 'reviews'],
            });

            if (!application) {
                return res.status(404).json({ message: 'Application not found' });
            }
            return res.status(200).json(application);
        } catch (error) {
            console.error(`Error fetching application id=${applicationId}:`, error);
            return res
                .status(500)
                .json({ message: 'Error fetching application', error });
        }
    }

    /**
     * POST /applications
     * Create a new application.
     * @param req  - Express request object (expects JSON body)
     * @param res  - Express response object
     * @returns    HTTP 201 + JSON of created Application, HTTP 400 if missing/invalid fields,
     *             HTTP 404 if referenced User or Course not found, or HTTP 500 + error
     *
     * Body should include:
     *   - position_type  ('tutor' | 'lab_assistant', required)
     *   - status         ('pending' | 'accepted' | 'rejected', required)
     *   - selected       (boolean, required)
     *   - availability   ('Full-Time' | 'Part-Time' | 'Not Available', required)
     *   - user_id        (number, required)
     *   - course_id      (number, required)
     *   - rank           (number, optional)
     */
    async createApplication(req: Request, res: Response) {
        const {
            position_type,
            status,
            selected,
            availability,
            user_id,
            course_id,
        } = req.body as CreateApplicationDto;

        // // Basic validation of required fields
        // if (
        //     !position_type ||
        //     !status ||
        //     typeof selected !== 'boolean' ||
        //     !availability ||
        //     typeof user_id !== 'number' ||
        //     typeof course_id !== 'number'
        // ) {
        //     return res.status(400).json({
        //         message:
        //             'position_type, status, selected (boolean), availability, user_id (number), and course_id (number) are required',
        //     });
        // }

        try {
            // Verify that the referenced user exists
            const user = await this.userRepository.findOneBy({ user_id });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verify that the referenced course exists
            const course = await this.courseRepository.findOneBy({ course_id });
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            // Create new Application
            const newApplication = this.applicationRepository.create({
                position_type,
                status,
                selected,
                availability,
                user,
                course,
            });

            const saved = await this.applicationRepository.save(newApplication);
            return res.status(201).json(saved);
        } catch (error) {
            console.error('Error creating application:', error);
            return res.status(500).json({ message: 'Error creating application', error });
        }
    }

    /**
     * PUT /applications/:id
     * Update an existing application by its ID.
     * @param req  - Express request object (expects `:id` in params and JSON body)
     * @param res  - Express response object
     * @returns    HTTP 200 + JSON of updated Application, HTTP 404 if not found,
     *             HTTP 400 if invalid input, or HTTP 500 + error
     *
     * Body may include any of:
     *   - position_type  ('tutor' | 'lab_assistant')
     *   - status         ('pending' | 'accepted' | 'rejected')
     *   - selected       (boolean)
     *   - availability   ('Full-Time' | 'Part-Time' | 'Not Available')
     *   - rank           (number or null)
     *
     * Note: We do not allow changing `user` or `course` via this endpoint. To reassign,
     *       client must delete and re-create the record.
     */
    async updateApplication(req: Request, res: Response) {
        const applicationId = parseInt(req.params.id, 10);
        if (isNaN(applicationId)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }

        try {
            const existing = await this.applicationRepository.findOne({
                where: { application_id: applicationId },
            });
            if (!existing) {
                return res.status(404).json({ message: 'Application not found' });
            }

            const {
                position_type,
                status,
                selected,
                availability,
            } = req.body as UpdateApplicationDto;

            // Only update fields if they are provided in the request
            if (position_type !== undefined) existing.position_type = position_type;
            if (status !== undefined) existing.status = status;
            if (selected !== undefined) existing.selected = selected;
            if (availability !== undefined) existing.availability = availability;

            const updated = await this.applicationRepository.save(existing);
            return res.status(200).json(updated);
        } catch (error) {
            console.error(`Error updating application id=${applicationId}:`, error);
            return res.status(500).json({ message: 'Error updating application', error });
        }
    }

    /**
     * DELETE /applications/:id
     * Delete an application by its ID.
     * @param req  - Express request object (expects `:id` in params)
     * @param res  - Express response object
     * @returns    HTTP 200 + success message, HTTP 404 if not found, or HTTP 500 + error
     */
    async deleteApplication(req: Request, res: Response) {
        const applicationId = parseInt(req.params.id, 10);
        if (isNaN(applicationId)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }

        try {
            const existing = await this.applicationRepository.findOne({
                where: { application_id: applicationId },
            });
            if (!existing) {
                return res.status(404).json({ message: 'Application not found' });
            }

            await this.applicationRepository.remove(existing);
            return res
                .status(200)
                .json({ message: 'Application deleted successfully' });
        } catch (error) {
            console.error(`Error deleting application id=${applicationId}:`, error);
            return res.status(500).json({ message: 'Error deleting application', error });
        }
    }
}
