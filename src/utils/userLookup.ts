import { useState, useEffect } from "react";
import { DEFAULT_USERS } from "@/types/testData"; // adjust the path as needed
import { User } from "@/types/types";

export const useUserLookup = (): Record<string, User> => {
    // Initialise with fallback data from DEFAULT_USERS
    const [lookup, setLookup] = useState<Record<string, User>>(() =>
        DEFAULT_USERS.reduce<Record<string, User>>((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {})
    );

    useEffect(() => {
        // This effect runs only on the client side after hydration.
        const usersStr = localStorage.getItem("users");
        if (usersStr) {
            try {
                const users: User[] = JSON.parse(usersStr);
                const newLookup = users.reduce<Record<string, User>>((acc, user) => {
                    acc[user.id] = user;
                    return acc;
                }, {});
                setLookup(newLookup);
            } catch (error) {
                console.error("Error parsing user data from localStorage", error);
            }
        }
    }, []);

    return lookup;
};

export const useUserName = (applicantId: string): string => {
    const lookup = useUserLookup();
    if (lookup[applicantId]) {
        const { firstName, lastName } = lookup[applicantId];
        return `${firstName} ${lastName}`;
    }
    return applicantId; // Fallback if not found
};
