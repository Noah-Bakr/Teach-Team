import {
    IsOptional,
    IsString,
    MaxLength,
    MinLength
} from 'class-validator';

export class CreateSkillDto {
    @IsString({ message: 'skill_name must be a string' })
    @MinLength(1, { message: 'skill_name cannot be empty' })
    @MaxLength(100, { message: 'skill_name must not exceed 100 characters' })
    skill_name: string;
}

export class UpdateSkillDto {
    @IsOptional()
    @IsString({ message: 'skill_name must be a string' })
    @MinLength(1, { message: 'skill_name cannot be empty' })
    @MaxLength(100, { message: 'skill_name must not exceed 100 characters' })
    skill_name?: string;
}