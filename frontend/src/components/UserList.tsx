import React, { useEffect, useState } from 'react';
import { fetchAllUsers } from '../services/userService';
import { UserUI } from '../types/userTypes';

export function UserList() {
    const [users, setUsers] = useState<UserUI[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAllUsers()
            .then(uiUsers => setUsers(uiUsers))
            .catch(err => {
                console.error(err);
                setError('Failed to load users');
            });
    }, []);

    if (error) return <div>{error}</div>;
    if (!users.length) return <div>Loading users…</div>;

    return (
        <div>
            <h2>All Users</h2>
            <ul>
                {users.map(u => (
                    <li key={u.id}>
                        {u.username} ({u.role})
                        <br />
                        {u.firstName} {u.lastName} - {u.email}
                        {u.avatar && <img src={u.avatar} alt="avatar" width={24} />}
                        <br />
                        {u.skills && u.skills.length > 0 && (
                            <em>Skills:</em> {u.skills.join(', ')}
                            )}
                        {u.courses && u.courses.length > 0 && (
                            <em> &nbsp;Courses:</em> {u.courses.join(', ')}
                            )}
                        {u.previousRoles && u.previousRoles.length > 0 && (
                            <em> &nbsp;Prev Roles:</em> {u.previousRoles.join(', ')}
                            )}
                        {u.academicCredentials && u.academicCredentials.length > 0 && (
                            <em> &nbsp;Degrees:</em> {u.academicCredentials.join(', ')}
                            )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
