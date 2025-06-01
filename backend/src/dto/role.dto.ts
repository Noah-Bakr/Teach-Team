import {
    IsIn,
    IsOptional
} from 'class-validator';

const validRoles = ['admin', 'lecturer', 'candidate'] as const;

export class CreateRoleDto {
    @IsIn(validRoles, { message: `role_name must be one of: ${validRoles.join(', ')}` })
    role_name: typeof validRoles[number];
}

export class UpdateRoleDto {
    @IsOptional()
    @IsIn(validRoles, { message: `role_name must be one of: ${validRoles.join(', ')}` })
    role_name?: typeof validRoles[number];
}