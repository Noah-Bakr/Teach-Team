import {
    IsString,
    IsNotEmpty,
    IsDateString,
    IsOptional,
    IsNumber,
    IsInt,
    Min,
} from 'class-validator';

export class CreatePreviousRoleDto {
    @IsString()
    @IsNotEmpty()
    previous_role!: string;

    @IsString()
    @IsNotEmpty()
    company!: string;

    @IsDateString()
    start_date!: string;

    @IsOptional()
    @IsDateString()
    end_date?: string | undefined;

    @IsOptional()
    @IsString()
    description?: string | undefined;

    @IsNumber()
    @IsInt()
    @Min(1)
    user_id!: number;
    }

    export class UpdatePreviousRoleDto {
    @IsOptional()
    @IsString()
    previous_role?: string;

    @IsOptional()
    @IsString()
    company?: string;

    @IsOptional()
    @IsDateString()
    start_date?: string;

    @IsOptional()
    @IsDateString()
    end_date?: string | undefined;

    @IsOptional()
    @IsString()
    description?: string | undefined;
}
