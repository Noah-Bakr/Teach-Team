import React, { useEffect, useState } from 'react';
import { fetchPreviousRoleById } from '../services/previousRoleService';
import { PreviousRoleUI } from '../types/previousRoleTypes';

interface Props {
    id: number;
}

export function PreviousRoleDetail({ id }: Props) {
    const [role, setRole] = useState<PreviousRoleUI | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPreviousRoleById(id)
            .then(uiRole => setRole(uiRole))
            .catch(err => {
                console.error(err);
                setError(`Failed to load previous role #${id}`);
            });
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!role) return <div>Loading…</div>;

    return (
        <div>
            <h2>{role.role}</h2>
            <p><strong>Company:</strong> {role.company}</p>
            <p>
                <strong>Tenure:</strong>{' '}
                {new Date(role.startDate).toLocaleDateString()} –{' '}
                {role.endDate ? new Date(role.endDate).toLocaleDateString() : 'Present'}
            </p>
            <p><strong>Description:</strong> {role.description || 'N/A'}</p>
        </div>
    );
}
