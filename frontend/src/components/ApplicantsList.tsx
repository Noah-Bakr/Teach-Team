// src/components/ApplicationList.tsx
import React, { useEffect, useState } from 'react';
import { fetchAllApplications } from '../services/applicationApi';
import { Application } from '../types/applicationTypes';

export function ApplicationList() {
    const [applications, setApplications] = useState<Application[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAllApplications()
            .then((apps) => setApplications(apps))
            .catch((err) => {
                console.error(err);
                setError('Failed to load applications');
            });
    }, []);

    if (error) return <div>{error}</div>;
    if (!applications) return <div>Loading…</div>;

    return (
        <div>
            <h2>All Applications</h2>
            <ul>
                {applications.map((app) => (
                    <li key={app.application_id}>
                        #{app.application_id} – {app.course.course_name} by {app.user.username} (
                        {app.status})
                    </li>
                ))}
            </ul>
        </div>
    );
}
