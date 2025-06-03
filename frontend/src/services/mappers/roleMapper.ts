import { Role as BackendRole } from '../roleApi';
import { RoleUI } from '../../types/roleTypes';

/**
 * Convert a raw backend role object
 *   { role_id: number; role_name: string; ... }
 * into the frontend’s simple RoleUI.
 */
export function mapRawRoleToUI(raw: BackendRole): RoleUI {
    return raw.role_name;
}