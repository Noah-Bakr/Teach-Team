import { CreateApplicationDto } from '../src/dto/application.dto';
import { ApplicationController  } from '../src/controller/ApplicationController';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

// Mock the data source
jest.mock('../src/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

// Mock the response object (what the backend would return)
const mockResponse = (): Response => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
}

// Test suite for ApplicationController with DTO validation
// Tests the ApplicationController's createApplication method with DTO validation
describe('ApplicationController with DTO', () => {
    let controller: ApplicationController;

    // Reset the controller and clear Jest mocks before each test
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

        // Mock the CreateApplicationDto validation
        const dto = plainToInstance(CreateApplicationDto, data);
        const errors = await validate(dto);
        expect(errors.length).toBe(0); // Ensure no validation errors

        // Mock user, course, and application data
        const mockUser = { user_id: 1};
        const mockCourse = { course_id: 1 };
        const mockApplication = {
            id: 1,
            ...data,
            user: mockUser,
            course: mockCourse,
        };

        // Mock repositories
        const mockApplicationRepository = {
            findOne: jest.fn().mockResolvedValue(null), // Ensure no existing application
            create: jest.fn().mockReturnValue(mockApplication), // Create a new application
            save: jest.fn().mockResolvedValue(mockApplication), // Save the application
        };
        const mockUserRepository = {
            findOneBy: jest.fn().mockResolvedValue(mockUser), // Find user by ID
        };
        const mockCourseRepository = {
            findOneBy: jest.fn().mockResolvedValue(mockCourse), // Find course by ID
        };

        // Assign the mocked repositories to the controller
        (controller as any).applicationRepository = mockApplicationRepository;
        (controller as any).userRepository = mockUserRepository;
        (controller as any).courseRepository = mockCourseRepository;

        // Create a mock request with the data
        const req = { body: data } as Request;
        // Assign the mock response object created earlier
        const res = mockResponse();
        
        await controller.createApplication(req, res);

        // Assertions
        // Expects the create method to be called with the correct data
        expect(mockApplicationRepository.create).toHaveBeenCalledWith({
                position_type: 'lab_assistant',
                status: 'pending',
                selected: false,
                availability: 'Part-Time',
                user: mockUser,
                course: mockCourse,
        });
        // Expects a successful creation response
        expect(res.status).toHaveBeenCalledWith(201);
        // Expects the response to contain the created application
        // (When the application is created, it should return the full application object)
        expect(res.json).toHaveBeenCalledWith(mockApplication);
    });

    it('should return error string if DTO validation fails', async () => {
        // Mock request data
        const data = {
            position_type: 'invalid_type', // Invalid position type
            status: "pending",
            selected: false,
            availability: 'Part-Time',
            user_id: 1,
            course_id: 1,
        };

        // Mock the CreateApplicationDto validation
        const dto = plainToInstance(CreateApplicationDto, data);
        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0); // Ensure validation errors

        // Check that the position_type field has validation errors
        // Get the specific error for position_type
        const positionTypeErrors = errors.find(err => err.property === 'position_type');
        expect(positionTypeErrors).toBeDefined(); // Ensure positionTypeErrors contasins an error
        // Ensure the error is related to the position_type enum validation
        expect(positionTypeErrors?.constraints).toHaveProperty('isEnum');
        
        // Expects the response to contain an error message
        expect(positionTypeErrors?.constraints?.isEnum)
            .toContain('position_type must be tutor or lab_assistant');
    });

    it('should return 404 if user is not found', async () => {
        // Mock request data
        const data = {
            position_type: 'lab_assistant',
            status: "pending",
            selected: false,
            availability: 'Part-Time',
            user_id: 999, // Non-existent user ID
            course_id: 1,
        };

        // Mock repositories
        const mockUserRepository = {
            findOneBy: jest.fn().mockResolvedValue(null), // User not found
        };
        const mockCourseRepository = {
            findOneBy: jest.fn().mockResolvedValue({ course_id: 1 }),
        };
        const mockApplicationRepository = {
            findOne: jest.fn(),
        };

        // Assign the mocked repositories to the controller
        (controller as any).userRepository = mockUserRepository;
        (controller as any).courseRepository = mockCourseRepository;
        (controller as any).applicationRepository = mockApplicationRepository;

        // Create a mock request with the data
        const req = { body: data } as Request;
        // Assign the mock response object created earlier
        const res = mockResponse();

        await controller.createApplication(req, res);

        // Assertions
        // Expects a 404 status code (not found)
        expect(res.status).toHaveBeenCalledWith(404);
        // Expects the response to contain an error message
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
});