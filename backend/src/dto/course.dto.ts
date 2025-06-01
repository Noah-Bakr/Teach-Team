import {
    IsArray,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    ArrayNotEmpty,
    ArrayUnique,
    IsInt,
    Min
} from 'class-validator';

export class CourseIdParamDto {
    @IsInt()
    @Min(1)
    id: number;
}

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    course_code: string;

    @IsString()
    @IsNotEmpty()
    course_name: string;

    @IsString()
    @IsIn(['1', '2'], { message: 'Semester must be "1" or "2"' })
    semester: string;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsInt({ each: true })
    skillIds?: number[];
}

export class UpdateCourseDto {
    @IsOptional()
    @IsString()
    course_code?: string;

    @IsOptional()
    @IsString()
    course_name?: string;

    @IsOptional()
    @IsString()
    @IsIn(['1', '2'], { message: 'Semester must be "1" or "2"' })
    semester?: string;

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    skillIds?: number[];
}
