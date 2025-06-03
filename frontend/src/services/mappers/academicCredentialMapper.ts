import {
    AcademicCredential as BackendCred,
} from '../api/academicCredentialApi';

import { AcademicCredentialUI } from '../../types/academicCredentialTypes';

/**
 * Given an array of backend User objects, return just their usernames.
 */
function extractUsernames(
    users: Array<{ user_id: number; username: string }> | undefined
): string[] {
    if (!Array.isArray(users)) return [];
    return users.map(u => u.username);
}

/**
 * Map a raw BackendCred → AcademicCredentialUI
 */
export function mapRawAcademicCredToUI(
    raw: BackendCred
): AcademicCredentialUI {
    return {
        id: raw.academic_id,
        degreeName: raw.degree_name,
        institution: raw.institution,
        startDate: raw.start_date,
        endDate: raw.end_date,
        description: raw.description,

        // Only include users if the backend provided them
        ...(Array.isArray(raw.users) && raw.users.length > 0
            ? { users: extractUsernames(raw.users) }
            : {}),
    };
}
