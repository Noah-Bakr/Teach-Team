import { useState, useEffect } from "react";
import { DEFAULT_COURSES } from "@/types/testData";
import { Course } from "@/types/types";

export const useCourseLookup = (): Record<string, Course> => {
    // Initialise with fallback data from DEFAULT_COURSES
    const [lookup, setLookup] = useState<Record<string, Course>>(() =>
        DEFAULT_COURSES.reduce<Record<string, Course>>((acc, course) => {
            acc[course.id] = course;
            return acc;
        }, {})
    );

    useEffect(() => {
        // This effect runs only on the client side after hydration.
        const coursesStr = localStorage.getItem("courses");
        if (coursesStr) {
            try {
                const courses: Course[] = JSON.parse(coursesStr);
                const newLookup = courses.reduce<Record<string, Course>>((acc, course) => {
                    acc[course.id] = course;
                    return acc;
                }, {});
                setLookup(newLookup);
            } catch (error) {
                console.error("Error parsing course data from localStorage", error);
            }
        }
    }, []);

    return lookup;
};

export const useCourseName = (courseId: string): string => {
    const lookup = useCourseLookup();
    return lookup[courseId]?.name || courseId;
};
