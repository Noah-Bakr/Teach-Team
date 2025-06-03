import React, { useEffect, useState } from 'react';
import { CourseUI } from '../types/courseTypes';
import { fetchCourseById } from '../services/courseApi';

interface Props {
    id: number;
}

export function CourseDetail({ id }: Props) {
    const [course, setCourse] = useState<CourseUI | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCourseById(id)
            .then(CourseUI => setCourse(CourseUI))
            .catch(err => {
                console.error(err);
                setError(`Failed to load course #${id}`);
            });
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!course) return <div>Loading course…</div>;

    return (
        <div>
            <h2>{course.name}</h2>
            <p><strong>ID:</strong> {course.id}</p>
            <p><strong>Code:</strong> {course.code}</p>
            <p><strong>Semester:</strong> {course.semester}</p>
            <p><strong>Skills:</strong> {course.skills?.join(', ') || 'None'}</p>
            <p><strong>Lecturers:</strong> {course.lecturers?.join(', ') || 'None'}</p>
        </div>
    );
}
