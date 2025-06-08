import { Request, Response } from 'express';
import { AuthController } from '../src/controller/AuthController';
import { CreateUserDto, UpdateUserDto } from '../src/dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';

// Mock the data source
jest.mock('../src/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

// Mock the jsonwebtoken library for signing tokens
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mock_token')
}));

// Mock the argon2 library for hashing and verifying passwords
jest.mock('argon2', () => {
    const originalModule = jest.requireActual('argon2'); // Get the original module
    return {
        __esModule: true, // Consistent imports
        ...originalModule,
        hash: jest.fn().mockImplementation((password) => originalModule.hash(password)), // Use the original hash implementation
        verify: jest.fn().mockImplementation((hash, password) => originalModule.verify(hash, password)), // Use the original verify implementation
    };
});

// Mock the response object (what the backend would return)
const mockResponse = (): Response => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);
    return res as Response;
}

// Test suite for AuthController with DTO validation
// Tests the AuthController's signUp and login methods with DTO validation
describe('AuthController with DTO', () => {
    let controller: AuthController;
    let hashedPassword: string;

    // Reset the controller and clear Jest mocks before each test
    beforeEach(async () => {
        controller = new AuthController();
        jest.clearAllMocks();

        // Set JWT_SECRET for testing
        process.env.JWT_SECRET = 'test-secret-key';

        // Mock passowrd is hashed using argon2
        hashedPassword = await jest.requireActual('argon2').hash('test_password');

    });

    it('should validate the input and sign up a new user', async () => {
        // Mock request data
        const data = {
            first_name: 'test_firstName',
            last_name: 'test_lastName',
            username: 'test_username',
            password: 'test_password',
            email: 'test_email@example.com',
            role_id: 1,
        };

        // Mock the CreateUserDto validation
        const dto = plainToInstance(CreateUserDto, data);
        const errors = await validate(dto);
        expect(errors.length).toBe(0); // Ensure no validation errors

        // Mock role data
        const mockRole = { role_id: 1, role_name: 'candidate' };

        // Spy on argon2.hash to capture what was passed
        const hashSpy = jest.spyOn(argon2, 'hash');

        // Mock the hash function to return the pre-hashed password (intercepts the call to argon2.hash)
        hashSpy.mockImplementation(async () => hashedPassword);
        
        // Mock user repository
        const mockUserRepository = {
            findOne: jest.fn().mockResolvedValue(null), // Ensure no existing user
            create: jest.fn().mockImplementation((userData) => { // Create a new user object
                return {
                    user_id: 1,
                    ...userData
                };
            }),
            save: jest.fn().mockImplementation((user) => Promise.resolve(user)), // Save the user
        };

        // Mock role repository
        const mockRoleRepository = {
            findOneBy: jest.fn().mockResolvedValue(mockRole), // Find role by ID
        };

        // Assign the mocked repositories to the controller
        (controller as any).userRepository = mockUserRepository;
        (controller as any).roleRepository = mockRoleRepository;

        // Create a mock request with the data
        const req = { body: data } as Request;
        // Assign the mock response object created earlier
        const res = mockResponse();

        // Call the signup method
        await controller.signUp(req, res);

        // Assertions
        // Check if findOne was called twice (once for email, once for username)
        expect(mockUserRepository.findOne).toHaveBeenCalledTimes(2);
        // Check if password was hashed (argon2.hash was called with the password)
        expect(hashSpy).toHaveBeenCalledWith('test_password');
        // Check if create was called with the correct user data
        expect(mockUserRepository.create).toHaveBeenCalledWith({
            first_name: data.first_name,
            last_name: data.last_name,
            username: data.username,
            email: data.email,
            password: hashedPassword,
            role: { role_name: "candidate" }
        });
        // Check if the user was saved
        expect(mockUserRepository.save).toHaveBeenCalled();
        // Cecks if a cookie was set
        expect(res.cookie).toHaveBeenCalled();
        // Expects a successful response
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it ('should validate the input and log in a user', async () => {
        // Mock login data
        const data = {
            email: 'test_email@example.com',
            password: 'test_password',
        };

        // Mock the CreateUserDto validation
        const mockUser = {
            user_id: 1,
            first_name: 'test_firstName',
            last_name: 'test_lastName',
            username: 'test_username',
            email: 'test_email@example.com',
            password: hashedPassword,
            role: { role_id: 1, role_name: 'candidate' },
            skills: [],
            applications: [],
            academicCredentials: [],
            courses: [],
            previousRoles: [],
            reviews: []
        };

        // Intercepts argon2.verify to capture the result
        const verifySpy = jest.spyOn(argon2, 'verify');
        
        // Mock user repository
        const mockUserRepository = {
            // Simulate finding a user by email
            findOne: jest.fn().mockImplementation(({ where, relations }) => {
                if (where.email === data.email) {
                    return Promise.resolve(mockUser);
                }
                return Promise.resolve(null);
            })
        };

        // Assign the mocked user repository to the controller
        (controller as any).userRepository = mockUserRepository;
        
        // Create a mock request with the data
        const req = { body: data } as Request;
        // Assign the mock response object created earlier
        const res = mockResponse();

        await controller.login(req, res);

        // Assertions
        // Check if findOne was called with the correct parameters
        expect(mockUserRepository.findOne).toHaveBeenCalledWith({
            where: { email: data.email },
            relations: expect.arrayContaining([
                "role", "skills", "applications", "academicCredentials", 
                "courses", "previousRoles", "reviews"
            ])
        });
        // Check if the password was verified
        expect(verifySpy).toHaveBeenCalledWith(hashedPassword, data.password);
        // Check if jwt.sign was called with the correct parameters
        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: mockUser.user_id, role: mockUser.role.role_name },
            'test-secret-key',
            { expiresIn: expect.any(String) }
        );
        // Check if a cookie was configured with the jwt token
        expect(res.cookie).toHaveBeenCalledWith(
            'token',
            'mock_token',
            expect.objectContaining({
                httpOnly: true,
            })
        );
        // Ensure a successful response was sent
        expect(res.status).toHaveBeenCalledWith(200);
        // Check if the response contains the expected user data
        expect(res.json).toHaveBeenCalledWith({
            message: "Login successful",
            user: expect.objectContaining({
                user_id: mockUser.user_id,
                username: mockUser.username,
                email: mockUser.email
            })
        });
    });

    it('should reject the login with wrong password', async () => {
        // Mock data
        const data = {
            email: 'test_email@example.com',
            password: 'wrong_password', // Wrong password
        };

        // Mock the CreateUserDto validation
        const mockUser = {
            user_id: 1,
            email: 'test_email@example.com',
            password: hashedPassword,
            role: { role_name: 'candidate' }
        };

        // Mock user repository
        const mockUserRepository = {
            findOne: jest.fn().mockResolvedValue(mockUser)
        };

        // Assign the mocked user repository to the controller
        (controller as any).userRepository = mockUserRepository;

        // Create a mock request with the data
        const req = { body: data } as Request;
        // Assign the mock response object created earlier
        const res = mockResponse();

        await controller.login(req, res);

        // Assertions
        // Expect a 401 Unauthorised status (User unauthorised to log in)
        expect(res.status).toHaveBeenCalledWith(401);
        // Expect the response to contain an error message
        expect(res.json).toHaveBeenCalledWith({
            message: expect.stringContaining('Invalid email or password') 
        });
    });
});
