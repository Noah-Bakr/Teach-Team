import React, { useEffect, useState } from 'react';
import { fetchUserById } from '../services/userService';
import { UserUI } from '../types/userTypes';

interface Props {
    id: number;
}

export function UserDetail({ id }: Props) {
    const [user, setUser] = useState<UserUI | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUserById(id)
            .then(uiUser => setUser(uiUser))
            .catch(err => {
                console.error(err);
                setError(`Failed to load user #${id}`);
            });
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!user) return <div>Loading…</div>;

    return (
        <div>
            <h2>
                {user.username} ({user.role})
            </h2>
            <p>
                Name: {user.firstName} {user.lastName}
            </p>
            <p>Email: {user.email}</p>
            {user.avatar && <img src={user.avatar} alt="avatar" width={48} />}
            {user.skills && user.skills.length > 0 && (
                <p>
                    <strong>Skills:</strong> {user.skills.join(', ')}
                </p>
            )}
            {user.courses && user.courses.length > 0 && (
                <p>
                    <strong>Courses:</strong> {user.courses.join(', ')}
                </p>
            )}
            {user.previousRoles && user.previousRoles.length > 0 && (
                <p>
                    <strong>Previous Roles:</strong> {user.previousRoles.join(', ')}
                </p>
            )}
            {user.academicCredentials && user.academicCredentials.length > 0 && (
                <p>
                    <strong>Degrees:</strong> {user.academicCredentials.join(', ')}
                </p>
            )}
        </div>
    );
}
