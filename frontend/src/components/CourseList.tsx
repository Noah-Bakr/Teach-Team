import React, { useEffect, useState } from 'react';
import { CourseUI } from '../types/courseTypes';
import { fetchAllCourses } from '../services/courseApi';

export function CourseList() {
    const [courses, setCourses] = useState<CourseUI[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAllCourses()
            .then(CoursesUI => setCourses(CoursesUI))
            .catch(err => {
                console.error(err);
                setError('Failed to load courses');
            });
    }, []);

    if (error) return <div>{error}</div>;
    if (!courses.length) return <div>Loading courses…</div>;

    return (
        <div>
            <h2>All Courses</h2>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>
                        <strong>{course.name}</strong> (Code: {course.code}, Semester: {course.semester})
                        <br />
                        <em>Skills:</em> {course.skills?.join(', ') || 'None'}
                        <br />
                        <em>Lecturers:</em> {course.lecturers?.join(', ') || 'None'}
                    </li>
                ))}
            </ul>
        </div>
    );
}
