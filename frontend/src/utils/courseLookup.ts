import { useState, useEffect } from "react";
import { CourseUI } from "@/types/courseTypes";
import { fetchAllCourses } from "@/services/courseService";
/**
 * A hook that fetches ALL courses from the backend once, then
 * returns a lookup map keyed by courseId → CourseUI.
 *
 * Usage:
 *   const lookup = useCourseLookup();
 *   // lookup[42] is the CourseUI for ID=42 (or undefined if not loaded/found)
 */
export function useCourseLookup(): Record<number, CourseUI> {
    const [lookup, setLookup] = useState<Record<number, CourseUI>>({});

    useEffect(() => {
        fetchAllCourses()
            .then((courses: CourseUI[]) => {
                // Build a numeric‐keyed map: course.id → CourseUI
                const newMap: Record<number, CourseUI> = {};
                courses.forEach((course) => {
                    newMap[course.id] = course;
                });
                setLookup(newMap);
            })
            .catch((err) => {
                console.error("Error fetching courses for lookup:", err);
            });
    }, []);

    return lookup;
}

/**
 * Usage:
 *   const courseName = useCourseName(42);
 */
export function useCourseName(courseId: number): string {
    const lookup = useCourseLookup();
    const course = lookup[courseId];
    return course ? course.name : String(courseId);
}
