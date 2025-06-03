import { PreviousRole as BackendPrevRole } from '../previousRoleApi';
import { PreviousRoleUI } from '../../types/previousRoleTypes';

/**
 * Convert a raw backend PreviousRole
 * into the frontend needs.
 */
export function mapRawPreviousRoleToUI(
    raw: BackendPrevRole
): PreviousRoleUI {
    return {
        id: raw.previous_role_id,
        role: raw.previous_role,
        company: raw.company,
        startDate: raw.start_date,
        endDate: raw.end_date,
        description: raw.description,
    };
}
