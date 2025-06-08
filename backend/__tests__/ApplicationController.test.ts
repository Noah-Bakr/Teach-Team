import { CreateApplicationDto } from '../src/dto/application.dto';
import { ApplicationController  } from '../src/controller/ApplicationController';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

jest.mock('../src/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

const mockResponse = (): Response => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
}

describe('ApplicationController with DTO', () => {
    let controller: ApplicationController;

    beforeEach(() => {
        controller = new ApplicationController();
    });

    it('should validate the input and create a new application', async () => {
        // Mock request data
        const data = {
            position_type: 'lab_assistant',
            status: "pending",
            selected: false,
            availability: 'Part-Time',
            user_id: 1,
            course_id: 1,
        };

        // Convert the data to a CreateApplicationDto instance
        const dto = plainToInstance(CreateApplicationDto, data);
        const errors = await validate(dto);
        expect(errors.length).toBe(0); // Ensure no validation errors

        const mockUser = { user_id: 1};
        const mockCourse = { course_id: 1 };
        const mockApplication = {
            id: 1,
            ...data,
            user: mockUser,
            course: mockCourse,
        };

        const mockApplicationRepository = {
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockReturnValue(mockApplication),
            save: jest.fn().mockResolvedValue(mockApplication),
        };

        const mockUserRepository = {
            findOneBy: jest.fn().mockResolvedValue(mockUser),
        };

        const mockCourseRepository = {
            findOneBy: jest.fn().mockResolvedValue(mockCourse),
        };

        (controller as any).applicationRepository = mockApplicationRepository;
        (controller as any).userRepository = mockUserRepository;
        (controller as any).courseRepository = mockCourseRepository;

        const req = { body: data } as Request;
        const res = mockResponse();
        await controller.createApplication(req, res);

        expect(mockApplicationRepository.create).toHaveBeenCalledWith({
                position_type: 'lab_assistant',
                status: 'pending',
                selected: false,
                availability: 'Part-Time',
                user: mockUser,
                course: mockCourse,
        });

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockApplication);
    });

    it('should return 500 if validation fails', async () => {
        const data = {
            position_type: 'invalid_type', // Invalid position type
            status: "pending",
            selected: false,
            availability: 'Part-Time',
            user_id: 1,
            course_id: 1,
        };

        const dto = plainToInstance(CreateApplicationDto, data);
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0); // Ensure validation errors

        const mockUserRepository = {
            findOneBy: jest.fn(),
        };

        const mockCourseRepository = {
            findOneBy: jest.fn(),
        };

        const mockApplicationRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        (controller as any).applicationRepository = mockApplicationRepository;
        (controller as any).userRepository = mockUserRepository;
        (controller as any).courseRepository = mockCourseRepository;

        jest.spyOn(controller as any, 'createApplication').mockImplementation((...args: any[]) => {
            const [req, res] = args as [Request, Response];
            return res.status(500).json({ 
                message: 'Validation failed',
                errors: errors.map(e => ({
                    property: e.property,
                    constraints: e.constraints
                }))
            });
        });
        
        const req = { body: data } as Request;
        const res = mockResponse();
        await controller.createApplication(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Validation failed',
            errors: errors.map(e => ({
                property: e.property,
                constraints: e.constraints
            }))
        });
    });
});


