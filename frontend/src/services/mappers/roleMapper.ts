import { Role as BackendRole } from '../api/roleApi';
import { RoleUI } from '../../types/roleTypes';

export function mapRawRoleToUI(raw: BackendRole): RoleUI {
    return raw.role_name;
}
