// src/components/ApplicationDetail.tsx
import React, { useEffect, useState } from 'react';
import { fetchApplicationById } from '../services/applicationApi';
import { Application } from '../types/applicationTypes';

interface Props {
    id: number;
}

export function ApplicationDetail({ id }: Props) {
    const [application, setApplication] = useState<Application | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchApplicationById(id)
            .then((app) => setApplication(app))
            .catch((err) => {
                console.error(err);
                setError(`Failed to load application #${id}`);
            });
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!application) return <div>Loading…</div>;

    return (
        <div>
            <h2>Application #{application.application_id}</h2>
            <p>
                <strong>Position Type:</strong> {application.position_type}
            </p>
            <p>
                <strong>Status:</strong> {application.status}
            </p>
            <p>
                <strong>Applied At:</strong> {new Date(application.applied_at).toLocaleDateString()}
            </p>
            <p>
                <strong>Candidate:</strong> {application.user.username} (
                {application.user.skills.join(', ')})
            </p>
            <p>
                <strong>Course:</strong> {application.course.course_name} &mdash;{' '}
                {application.course.course_code}
            </p>
            {application.comments && application.comments.length > 0 && (
                <>
                    <h3>Comments</h3>
                    <ul>
                        {application.comments.map((c) => (
                            <li key={c.comment_id}>
                                <strong>
                                    {c.lecturer.first_name} {c.lecturer.last_name}:
                                </strong>{' '}
                                {c.comment} <em>({new Date(c.created_at).toLocaleString()})</em>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
