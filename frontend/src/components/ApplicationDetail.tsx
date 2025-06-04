// src/components/ApplicationDetail.tsx
import React, { useEffect, useState } from 'react';
import { fetchApplicationById } from '../services/applicationService';
import { ApplicationUI, ReviewUI } from '../types/applicationTypes';


interface Props {
    id: number;
}

export function ApplicationDetail({ id }: Props) {
    const [application, setApplication] = useState<ApplicationUI | null>(null);
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
            <h2>Application #{application.id}</h2>
            <p>
                <strong>Position Type:</strong> {application.positionType}
            </p>
            <p>
                <strong>Status:</strong> {application.status}
            </p>
            <p>
                <strong>Applied At:</strong> {new Date(application.appliedAt).toLocaleDateString()}
            </p>
            <p>
                <strong>Candidate:</strong> {application.user.username} (
                {application.user.skills.join(', ')})
            </p>
            <p>
                <strong>Course:</strong> {application.course.name} &mdash;{' '}
                {application.course.code}
            </p>
                <>
                    <h3>Reviews</h3>
                    <ul>
                        {application.reviews?.map((c: ReviewUI) => (
                            <li key={c.id}>
                                <strong>
                                    {c.rank}:
                                </strong>{' '}
                                {c.comment} <em>({new Date(c.reviewedAt).toLocaleString()})</em>
                            </li>
                        ))}
                    </ul>
                </>
            )
        </div>
    );
}
