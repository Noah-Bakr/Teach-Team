import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { useUserLookup, useUserName } from '@/utils/userLookup'; // Adjust the import path as needed
import { DEFAULT_USERS } from '@/types/testData'; // Make sure this path is correct

// test component that uses the hooks.
const TestComponent: React.FC<{ userId: string }> = ({ userId }) => {
    // useUserLookup returns a lookup object keyed by user id.
    const lookup = useUserLookup();
    // useUserName uses that lookup to return a full name or fallback.
    const userName = useUserName(userId);
    return (
        <div>
            <div data-testid="lookup">{JSON.stringify(lookup)}</div>
            <div data-testid="username">{userName}</div>
        </div>
    );
};

describe('useUserLookup and useUserName', () => {
    beforeEach(() => {
        // Clear any "users" in localStorage before each test.
        localStorage.removeItem('users');
    });

    test('returns default users when localStorage is empty', () => {
        // Use the id of the first user in DEFAULT_USERS.
        const defaultUserId = DEFAULT_USERS[0].id;
        render(<TestComponent userId={defaultUserId} />);

        // Parse the lookup object rendered.
        const lookupJSON = screen.getByTestId('lookup').textContent;
        expect(lookupJSON).toBeTruthy();
        const lookupObj = JSON.parse(lookupJSON!);

        // Verify that the lookup object contains the default user.
        expect(lookupObj[defaultUserId]).toBeDefined();

        // Check that useUserName returns a full name instead of just the id.
        const usernameText = screen.getByTestId('username').textContent;
        expect(usernameText).not.toBe(defaultUserId); // if not found, hook returns the id
    });

    test('returns users from localStorage if present', () => {
        // Create a fake user array.
        const fakeUsers = [{
            id: '2',
            firstName: 'Alice',
            lastName: 'Smith',
            username: 'asmith',
            avatar: '',
            email: '',
            password: '',
            role: ['user'],
            academicCredentials: '',
            skills: [],
            availability: [],
            previousRoles: [],
        }];

        // Set the fake user data into localStorage.
        localStorage.setItem('users', JSON.stringify(fakeUsers));

        // Because useEffect runs after initial render, wrap render in act to ensure updates are processed.
        act(() => {
            render(<TestComponent userId="2" />);
        });

        // Parse the lookup object rendered.
        const lookupJSON = screen.getByTestId('lookup').textContent;
        expect(lookupJSON).toBeTruthy();
        const lookupObj = JSON.parse(lookupJSON!);
        expect(lookupObj['2']).toBeDefined();

        // The username should now be "Alice Smith" as computed by useUserName.
        const usernameText = screen.getByTestId('username').textContent;
        expect(usernameText).toBe('Alice Smith');
    });
});
