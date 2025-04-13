import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '@/utils/testUtils';
import SelectedApplicantCard from '@/components/SelectedApplicantCard';

// Mock the hooks used by the component //
jest.mock('@/utils/userLookup', () => ({
    useUserLookup: () => ({
        user1: { firstName: 'John', lastName: 'Doe' }
    }),
}));

jest.mock('@/utils/courseLookup', () => ({
    useCourseLookup: () => ({
        course1: { name: 'Intro to Testing' }
    }),
}));

// Mock CustomFormControl to render its children and any error //
jest.mock('@/components/CustomFormControl', () => {
    return ({ error, children }: { error?: string; children: React.ReactNode }) => (
        <div>
            {children}
            {error && <span data-testid="error">{error}</span>}
        </div>
    );
});

// Sample applicant and event handler mocks //
const sampleApplicant = {
    id: 'app1',
    userId: 'user1',
    courseId: 'course1',
    rank: 1,
    comment: 'Good applicant',
};

const handleRankChange = jest.fn();
const handleCommentChange = jest.fn();

describe('SelectedApplicantCard', () => {
    test('renders correctly with heading and inputs', () => {
        render(
            <SelectedApplicantCard
                applicant={sampleApplicant}
                error={{}}
                handleRankChange={handleRankChange}
                handleCommentChange={handleCommentChange}
            />
        );

        // Verify that the heading displays the expected text,
        // which uses the mocked lookups: "John Doe - course1 Intro to Testing".
        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
            'John Doe - course1 Intro to Testing'
        );

        // Verify that the rank input (a Chakra Input with type "number" renders as a spinbutton)
        // shows the applicant's rank (1).
        const rankInput = screen.getByRole('spinbutton');
        expect(rankInput).toHaveValue(1);

        // Verify that the comment textarea displays the applicant's comment.
        const textarea = screen.getByPlaceholderText(/enter applicant comments/i);
        expect(textarea).toHaveValue('Good applicant');
    });
});
