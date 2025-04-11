import React, { useEffect } from "react";
import { DEFAULT_USERS, DEFAULT_APPLICANTS, DEFAULT_COURSES } from "@/types/testData";

const DataInitialiser: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Check and initialise dummy data for users
            if (!localStorage.getItem("users")) {
                localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
            }
            // Check and initialise dummy data for applicants
            if (!localStorage.getItem("applicants")) {
                localStorage.setItem("applicants", JSON.stringify(DEFAULT_APPLICANTS));
            }
            // Check and initialise dummy data for courses
            if (!localStorage.getItem("courses")) {
                localStorage.setItem("courses", JSON.stringify(DEFAULT_COURSES));
            }
        }
    }, []);

    return <>{children}</>;
};

export default DataInitialiser;
