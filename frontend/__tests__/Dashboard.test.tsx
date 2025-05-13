import React from "react";
import { screen } from "@testing-library/react";
import { render } from "@/utils/testUtils";
import DashboardPage from "@/pages/dashboard";

// Mock the Auth Context
jest.mock('@/context/AuthContext', () => ({
    useAuth: jest.fn(),
}));

// Mock the LecturerPage and TutorPage components
jest.mock('@/pages/lecturer', () => () => <div data-testid="lecturer-page">Lecturer Page</div>);
jest.mock('@/pages/tutor', () => () => <div data-testid="tutor-page">Tutor Page</div>);

import { useAuth } from "@/context/AuthContext"; // now a mocked function
const mockedUseAuth = useAuth as jest.Mock;

describe("DashboardPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear(); // Clear localStorage so no applicants data interferes with the test.
    });

    test("renders login prompt when no currentUser is present", () => {
        // Set up the mock to simulate no user is logged in.
        mockedUseAuth.mockReturnValue({
            currentUser: null,
        });

        render(<DashboardPage />);

        // Expect the login prompt to be visible.
        expect(screen.getByText(/please log in to view this page/i)).toBeInTheDocument();
    });

    test("renders LecturerPage when currentUser role includes lecturer", () => {
        // Simulate an authenticated user with the lecturer role.
        mockedUseAuth.mockReturnValue({
            currentUser: { role: ["lecturer"] },
        });

        render(<DashboardPage />);

        // The component should render LecturerPage.
        expect(screen.getByTestId("lecturer-page")).toBeInTheDocument();
    });

    test("renders TutorPage when currentUser role includes tutor", () => {
        // Simulate an authenticated user with the tutor role.
        mockedUseAuth.mockReturnValue({
            currentUser: { role: ["tutor"] },
        });

        render(<DashboardPage />);

        // The component should render TutorPage.
        expect(screen.getByTestId("tutor-page")).toBeInTheDocument();
    });
});
