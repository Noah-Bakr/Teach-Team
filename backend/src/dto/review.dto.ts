import {
    IsInt,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class CreateReviewDto {
    @IsInt({ message: 'lecturer_id must be an integer' })
    lecturer_id: number;

    @IsInt({ message: 'application_id must be an integer' })
    application_id: number;

    @IsOptional()
    @IsNumber({}, { message: 'rank must be a number' })
    rank?: number;

    @IsOptional()
    @IsString({ message: 'comment must be a string' })
    comment?: string;
}

export class UpdateReviewDto {
    @IsOptional()
    @IsNumber({}, { message: 'rank must be a number or null' })
    rank?: number | null;

    @IsOptional()
    @IsString({ message: 'comment must be a string or null' })
    comment?: string | null;
}
