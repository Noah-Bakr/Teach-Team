import React, { useEffect, useState } from 'react';
import { fetchAllPreviousRoles } from '../services/previousRoleApi';
import { PreviousRoleUI } from '../types/previousRoleTypes';

export function PreviousRoleList() {
    const [roles, setRoles] = useState<PreviousRoleUI[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAllPreviousRoles()
            .then(uiRoles => setRoles(uiRoles))
            .catch(err => {
                console.error(err);
                setError('Failed to load previous roles');
            });
    }, []);

    if (error) return <div>{error}</div>;
    if (!roles.length) return <div>Loading previous roles…</div>;

    return (
        <div>
            <h2>Previous Roles</h2>
            <ul>
                {roles.map(role => (
                    <li key={role.id}>
                        <strong>{role.role}</strong> at {role.company}
                        <br />
                        <em>From:</em> {new Date(role.startDate).toLocaleDateString()}—
                        <em>To:</em>{' '}
                        {role.endDate ? new Date(role.endDate).toLocaleDateString() : 'Present'}
                        <br />
                        <em>Description:</em> {role.description || 'N/A'}
                    </li>
                ))}
            </ul>
        </div>
    );
}
