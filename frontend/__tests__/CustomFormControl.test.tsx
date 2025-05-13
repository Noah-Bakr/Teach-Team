import React from 'react';
import { screen } from '@testing-library/react';
import { render } from '@/utils/testUtils';
import CustomFormControl from '@/components/CustomFormControl';

describe('CustomFormControl', () => {
    test('renders its children without an error message when no error is provided', () => {
        render(
            <CustomFormControl>
                <div>Test Child</div>
            </CustomFormControl>
        );

        // Verify the child is rendered.
        expect(screen.getByText(/Test Child/i)).toBeInTheDocument();
        // Verify that no error message is rendered.
        expect(screen.queryByText(/This field is required/i)).not.toBeInTheDocument();
    });

    test('renders its children and an error message when an error is provided', () => {
        const errorMessage = "This field is required";
        render(
            <CustomFormControl error={errorMessage}>
                <div>Test Child</div>
            </CustomFormControl>
        );

        // Verify the child is rendered.
        expect(screen.getByText(/Test Child/i)).toBeInTheDocument();
        // Verify the error message is rendered.
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
});
