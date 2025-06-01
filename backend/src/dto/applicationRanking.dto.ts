import {
    IsInt,
} from 'class-validator';

export class CreateApplicationRankingDto {
    @IsInt({ message: 'lecturer_id must be an integer' })
    lecturer_id: number;

    @IsInt({ message: 'application_id must be an integer' })
    application_id: number;

    @IsInt({ message: 'rank must be an integer' })
    rank: number;
}

export class UpdateApplicationRankingDto {
    @IsInt({ message: 'rank must be an integer' })
    rank?: number;
}
