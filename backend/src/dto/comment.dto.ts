import {
    IsInt,
    IsString,
    Min
} from 'class-validator';

export class CreateCommentDto {
    @IsString()
    comment: string;

    @IsInt()
    @Min(1)
    application_id: number;

    @IsInt()
    @Min(1)
    lecturer_id: number;
}

export class UpdateCommentDto {
    @IsString()
    comment?: string;
}
