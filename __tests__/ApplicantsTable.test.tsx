import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/utils/testUtils';
import ApplicantsTable from '@/components/ApplicantsTable';

// Mock the lookup hooks
jest.mock('@/utils/userLookup', () => ({
    useUserLookup: () => ({
        user1: { firstName: 'John', lastName: 'Doe' },
    }),
}));

jest.mock('@/utils/courseLookup', () => ({
    useCourseLookup: () => ({
        course1: { name: 'Intro to Testing' },
    }),
}));

describe('ApplicantsTable', () => {
    const sampleApplicant = {
        id: 'app1',
        userId: 'user1',
        courseId: 'course1',
        availability: 'Part-Time',
        skills: ['React', 'Node.js'],
        academicCredentials: 'BSc in Testing',
        selected: false,
    };

    const toggleSelectMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders applicant information and triggers toggleSelect on button click', async () => {
        render(
            <ApplicantsTable
                applicants={[sampleApplicant]}
                toggleSelect={toggleSelectMock}
            />
        );

        // Verify that the applicant's full name, course code, and course name are rendered.
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/course1/i)).toBeInTheDocument();
        expect(screen.getByText(/Intro to Testing/i)).toBeInTheDocument();

        // Verify that availability, skills, and credentials are rendered.
        expect(screen.getByText(/Part-Time/i)).toBeInTheDocument();
        expect(screen.getByText(/React, Node\.js/i)).toBeInTheDocument();
        expect(screen.getByText(/BSc in Testing/i)).toBeInTheDocument();

        // Find the action button. It should display "Select" because applicant.selected is false.
        const toggleButton = screen.getByRole('button', { name: /Select/i });

        // Use await to ensure state updates are processed.
        await userEvent.click(toggleButton);

        // Verify that the toggleSelect callback was called with the applicant id.
        expect(toggleSelectMock).toHaveBeenCalledWith('app1');
    });
});
