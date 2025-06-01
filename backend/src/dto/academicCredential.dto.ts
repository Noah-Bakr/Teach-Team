import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateAcademicCredentialDto {
    @IsString()
    @IsNotEmpty()
    degree_name!: string;

    @IsString()
    @IsNotEmpty()
    institution!: string;

    @IsDateString({}, { message: 'start_date must be a valid ISO date string' })
    start_date!: string;

    @IsOptional()
    @IsDateString({}, { message: 'end_date must be a valid ISO date string or null' })
    end_date?: string | undefined;

    @IsOptional()
    @IsString()
    description?: string | undefined;
}

export class UpdateAcademicCredentialDto {
    @IsOptional()
    @IsString()
    degree_name?: string;

    @IsOptional()
    @IsString()
    institution?: string;

    @IsOptional()
    @IsDateString({}, { message: 'start_date must be a valid ISO date string' })
    start_date?: string;

    @IsOptional()
    @IsDateString({}, { message: 'end_date must be a valid ISO date string or null' })
    end_date?: string | undefined;

    @IsOptional()
    @IsString()
    description?: string | undefined;
}
